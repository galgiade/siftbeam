import boto3
import json
import logging
from typing import Optional, Union, List, Dict, Any

logger = logging.getLogger()
logger.setLevel(logging.INFO)

ALLOWED_LOCALES = {"ja","en","es","fr","de","ko","pt","id","zh-CN"}

def normalize_locale(value: Optional[str]) -> str:
    if not value:
        return "en"
    v = str(value).strip()
    lv = v.lower()
    if lv in ALLOWED_LOCALES:
        return lv
    if lv in {"zh", "zh-cn", "zh_cn", "zhcn"}:
        return "zh-CN"
    if lv in {"ja","en","es","fr","de","ko","pt","id"}:
        return lv
    return "en"

def _fmt_num(n: float) -> str:
    try:
        s = "{:.2f}".format(n).rstrip("0").rstrip(".")
        return s if s else "0"
    except Exception:
        return str(n)

def format_bytes(b: Union[int, float]) -> str:
    try:
        x = float(b)
    except Exception:
        return str(b)
    if x < 0:
        x = 0.0
    units = [("GB", 1024**3), ("MB", 1024**2), ("KB", 1024), ("B", 1)]
    for u, mul in units:
        if x >= mul or u == "B":
            val = x / mul if mul != 1 else x
            return f"{_fmt_num(val)} {u}"
    return f"{_fmt_num(x)} B"

def to_float(v: Union[str, int, float, None], default: float = 0.0) -> float:
    if v in (None, ""):
        return default
    try:
        return float(v)
    except Exception:
        return default

def normalize_notice_emails(input_data) -> List[str]:
    """
    様々な形式の入力を文字列のメールアドレス配列に正規化
    """
    if input_data is None:
        return []
    
    # 既に配列の場合
    if isinstance(input_data, list):
        notice_emails = []
        for notice_email in input_data:
            if isinstance(notice_email, str) and notice_email.strip():
                notice_emails.append(notice_email.strip())
            elif notice_email is not None:
                email_str = str(notice_email).strip()
                if email_str:
                    notice_emails.append(email_str)
        return notice_emails
    
    # 文字列の場合
    elif isinstance(input_data, str) and input_data.strip():
        return [input_data.strip()]
    
    # その他の型
    elif input_data is not None:
        email_str = str(input_data).strip()
        return [email_str] if email_str else []
    
    return []

def send_single_email(sesv2, notice_email: str, template_data: Dict[str, Any], locale: str, template_override: Optional[str] = None) -> Dict[str, Any]:
    """
    単一のメール送信を実行
    """
    try:
        if not notice_email or not notice_email.strip():
            raise ValueError("有効なメールアドレスが不足しています")

        # テンプレート名の決定
        template_name = template_override or f"SiftbeamUsageNotice_{locale}"

        # デバッグログ追加
        logger.info(f"テンプレートデータ: {json.dumps(template_data, ensure_ascii=False, indent=2)}")
        logger.info(f"テンプレート名: {template_name}")

        resp = sesv2.send_email(
            FromEmailAddress="no-reply@siftbeam.com",
            Destination={"ToAddresses": [notice_email.strip()]},
            Content={"Template": {"TemplateName": template_name, "TemplateData": json.dumps(template_data, ensure_ascii=False)}},
        )

        logger.info(f"送信成功: MessageId={resp['MessageId']}, To={notice_email}, Template={template_name}")
        return {
            "success": True,
            "messageId": resp["MessageId"],
            "recipient": notice_email,
            "template": template_name,
            "data": template_data,
        }

    except Exception as e:
        logger.error(f"メール送信エラー (to: {notice_email}): {str(e)}")
        return {
            "success": False,
            "recipient": notice_email,
            "error": str(e),
        }

def lambda_handler(event, context):
    """
    Siftbeam 制限超過通知メール送信（noticeEmails統一処理）
    
    対応する入力形式:
    {
      "noticeEmails": ["email1@example.com", "email2@example.com"],
      "afterUploadBytes": 475948,
      "limitValueBytes": 460800,
      "locale": "ja"
    }
    """
    sesv2 = boto3.client("sesv2", region_name="ap-northeast-1")

    try:
        logger.info(f"受信イベント: {json.dumps(event, ensure_ascii=False, indent=2)}")
        
        # noticeEmailsの取得と正規化
        notice_emails_list = normalize_notice_emails(event.get("noticeEmails"))
        
        # メールアドレスが見つからない場合
        if not notice_emails_list:
            return {
                "statusCode": 400,
                "body": json.dumps({"error": "送信対象のnoticeEmailsが見つかりません"}, ensure_ascii=False)
            }
        
        logger.info(f"noticeEmailsモード: {notice_emails_list}")
        
        # 必須パラメータチェック
        if event.get("limitValueBytes") in (None, ""):
            return {"statusCode": 400, "body": json.dumps({"error": "必須パラメータが不足: limitValueBytes"}, ensure_ascii=False)}

        # 共通のテンプレートデータを作成
        limit_bytes = to_float(event.get("limitValueBytes"))
        current_bytes = to_float(event.get("afterUploadBytes"), None)
        if current_bytes is None:
            current_bytes = to_float(event.get("currentUsageBytes"))

        # exceeded/percentage の計算
        exceeded_bytes = max(0.0, current_bytes - limit_bytes) if (current_bytes is not None and limit_bytes > 0) else 0.0
        pct = (current_bytes / limit_bytes * 100.0) if (limit_bytes > 0 and current_bytes is not None) else 0.0

        # 表示用整形（単位付与）
        current_str = format_bytes(current_bytes if current_bytes is not None else 0)
        limit_str = format_bytes(limit_bytes)
        exceeded_str = format_bytes(exceeded_bytes)
        percentage = f"{_fmt_num(pct)}%"

        # ロケール
        locale = normalize_locale(event.get("locale"))

        template_data = {
            "currentUsage": current_str,
            "limitValue": limit_str,
            "exceededAmount": exceeded_str,
            "percentage": percentage,
        }

        # 各noticeEmailにmapで送信
        results = []
        success_count = 0
        error_count = 0

        for notice_email in notice_emails_list:
            result = send_single_email(sesv2, notice_email, template_data, locale, event.get("templateOverride"))
            results.append(result)
            
            if result["success"]:
                success_count += 1
            else:
                error_count += 1

        return {
            "statusCode": 200 if error_count == 0 else 207,  # 207 Multi-Status
            "body": json.dumps({
                "message": f"noticeEmails送信完了: 成功{success_count}件, エラー{error_count}件",
                "summary": {
                    "total": len(notice_emails_list),
                    "success": success_count,
                    "error": error_count
                },
                "results": results
            }, ensure_ascii=False)
        }

    except Exception as e:
        logger.error(f"Lambda実行エラー: {str(e)}")
        return {"statusCode": 500, "body": json.dumps({"error": str(e)}, ensure_ascii=False)}