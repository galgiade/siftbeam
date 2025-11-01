import boto3
import json
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)

REGION = "ap-northeast-1"
BASE_NAME = "SiftbeamSignupVerification"

TEMPLATES = {
    "ja": {
        "Subject": "Siftbeam - アカウント確認コード",
        "Text": """Siftbeamをご利用いただき、ありがとうございます。

アカウントの確認を完了するため、以下の認証コードを入力してください：

認証コード: {{verificationCode}}

このコードの有効期限は5分です。
お心当たりがない場合は、このメールを無視してください。

Siftbeam サポートチーム""",
        "Html": """
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #2563eb; margin: 0;">Siftbeam</h1>
  </div>
  
  <h2 style="color: #333; margin-bottom: 20px;">アカウント確認コード</h2>
  
  <p>Siftbeamをご利用いただき、ありがとうございます。</p>
  
  <p>アカウントの確認を完了するため、以下の認証コードを入力してください：</p>
  
  <div style="background: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
    <div style="font-size: 32px; font-weight: bold; color: #2563eb; letter-spacing: 4px;">{{verificationCode}}</div>
  </div>
  
  <p style="color: #64748b; font-size: 14px;">このコードの有効期限は5分です。</p>
  <p style="color: #64748b; font-size: 14px;">お心当たりがない場合は、このメールを無視してください。</p>
  
  <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 14px;">
    <p>Siftbeam サポートチーム</p>
  </div>
</div>
"""
    },
    "en": {
        "Subject": "Siftbeam - Account Verification Code",
        "Text": """Thank you for using Siftbeam.

Please enter the following verification code to complete your account confirmation:

Verification Code: {{verificationCode}}

This code is valid for 5 minutes.
If you did not request this, please ignore this email.

Best regards,
Siftbeam Support Team""",
        "Html": """
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #2563eb; margin: 0;">Siftbeam</h1>
  </div>
  
  <h2 style="color: #333; margin-bottom: 20px;">Account Verification Code</h2>
  
  <p>Thank you for using Siftbeam.</p>
  
  <p>Please enter the following verification code to complete your account confirmation:</p>
  
  <div style="background: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
    <div style="font-size: 32px; font-weight: bold; color: #2563eb; letter-spacing: 4px;">{{verificationCode}}</div>
  </div>
  
  <p style="color: #64748b; font-size: 14px;">This code is valid for 5 minutes.</p>
  <p style="color: #64748b; font-size: 14px;">If you did not request this, please ignore this email.</p>
  
  <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 14px;">
    <p>Best regards,<br>Siftbeam Support Team</p>
  </div>
</div>
"""
    },
    "fr": {
        "Subject": "Siftbeam - Code de vérification de compte",
        "Text": """Merci d'utiliser Siftbeam.

Veuillez saisir le code de vérification suivant pour terminer la confirmation de votre compte :

Code de vérification : {{verificationCode}}

Ce code est valide pendant 5 minutes.
Si vous n'avez pas demandé cela, veuillez ignorer cet e-mail.

Cordialement,
Équipe de support Siftbeam""",
        "Html": """
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #2563eb; margin: 0;">Siftbeam</h1>
  </div>
  
  <h2 style="color: #333; margin-bottom: 20px;">Code de vérification de compte</h2>
  
  <p>Merci d'utiliser Siftbeam.</p>
  
  <p>Veuillez saisir le code de vérification suivant pour terminer la confirmation de votre compte :</p>
  
  <div style="background: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
    <div style="font-size: 32px; font-weight: bold; color: #2563eb; letter-spacing: 4px;">{{verificationCode}}</div>
  </div>
  
  <p style="color: #64748b; font-size: 14px;">Ce code est valide pendant 5 minutes.</p>
  <p style="color: #64748b; font-size: 14px;">Si vous n'avez pas demandé cela, veuillez ignorer cet e-mail.</p>
  
  <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 14px;">
    <p>Cordialement,<br>Équipe de support Siftbeam</p>
  </div>
</div>
"""
    },
    "de": {
        "Subject": "Siftbeam - Konto-Bestätigungscode",
        "Text": """Vielen Dank, dass Sie Siftbeam nutzen.

Bitte geben Sie den folgenden Bestätigungscode ein, um Ihre Kontobestätigung abzuschließen:

Bestätigungscode: {{verificationCode}}

Dieser Code ist 5 Minuten gültig.
Falls Sie dies nicht angefordert haben, ignorieren Sie bitte diese E-Mail.

Mit freundlichen Grüßen,
Siftbeam Support-Team""",
        "Html": """
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #2563eb; margin: 0;">Siftbeam</h1>
  </div>
  
  <h2 style="color: #333; margin-bottom: 20px;">Konto-Bestätigungscode</h2>
  
  <p>Vielen Dank, dass Sie Siftbeam nutzen.</p>
  
  <p>Bitte geben Sie den folgenden Bestätigungscode ein, um Ihre Kontobestätigung abzuschließen:</p>
  
  <div style="background: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
    <div style="font-size: 32px; font-weight: bold; color: #2563eb; letter-spacing: 4px;">{{verificationCode}}</div>
  </div>
  
  <p style="color: #64748b; font-size: 14px;">Dieser Code ist 5 Minuten gültig.</p>
  <p style="color: #64748b; font-size: 14px;">Falls Sie dies nicht angefordert haben, ignorieren Sie bitte diese E-Mail.</p>
  
  <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 14px;">
    <p>Mit freundlichen Grüßen,<br>Siftbeam Support-Team</p>
  </div>
</div>
"""
    },
    "es": {
        "Subject": "Siftbeam - Código de verificación de cuenta",
        "Text": """Gracias por usar Siftbeam.

Por favor, ingresa el siguiente código de verificación para completar la confirmación de tu cuenta:

Código de verificación: {{verificationCode}}

Este código es válido por 5 minutos.
Si no solicitaste esto, por favor ignora este correo.

Saludos cordiales,
Equipo de soporte de Siftbeam""",
        "Html": """
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #2563eb; margin: 0;">Siftbeam</h1>
  </div>
  
  <h2 style="color: #333; margin-bottom: 20px;">Código de verificación de cuenta</h2>
  
  <p>Gracias por usar Siftbeam.</p>
  
  <p>Por favor, ingresa el siguiente código de verificación para completar la confirmación de tu cuenta:</p>
  
  <div style="background: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
    <div style="font-size: 32px; font-weight: bold; color: #2563eb; letter-spacing: 4px;">{{verificationCode}}</div>
  </div>
  
  <p style="color: #64748b; font-size: 14px;">Este código es válido por 5 minutos.</p>
  <p style="color: #64748b; font-size: 14px;">Si no solicitaste esto, por favor ignora este correo.</p>
  
  <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 14px;">
    <p>Saludos cordiales,<br>Equipo de soporte de Siftbeam</p>
  </div>
</div>
"""
    },
    "id": {
        "Subject": "Siftbeam - Kode Verifikasi Akun",
        "Text": """Terima kasih telah menggunakan Siftbeam.

Silakan masukkan kode verifikasi berikut untuk menyelesaikan konfirmasi akun Anda:

Kode Verifikasi: {{verificationCode}}

Kode ini berlaku selama 5 menit.
Jika Anda tidak meminta ini, silakan abaikan email ini.

Salam hormat,
Tim Dukungan Siftbeam""",
        "Html": """
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #2563eb; margin: 0;">Siftbeam</h1>
  </div>
  
  <h2 style="color: #333; margin-bottom: 20px;">Kode Verifikasi Akun</h2>
  
  <p>Terima kasih telah menggunakan Siftbeam.</p>
  
  <p>Silakan masukkan kode verifikasi berikut untuk menyelesaikan konfirmasi akun Anda:</p>
  
  <div style="background: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
    <div style="font-size: 32px; font-weight: bold; color: #2563eb; letter-spacing: 4px;">{{verificationCode}}</div>
  </div>
  
  <p style="color: #64748b; font-size: 14px;">Kode ini berlaku selama 5 menit.</p>
  <p style="color: #64748b; font-size: 14px;">Jika Anda tidak meminta ini, silakan abaikan email ini.</p>
  
  <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 14px;">
    <p>Salam hormat,<br>Tim Dukungan Siftbeam</p>
  </div>
</div>
"""
    },
    "ko": {
        "Subject": "Siftbeam - 계정 인증 코드",
        "Text": """Siftbeam을 이용해 주셔서 감사합니다.

계정 확인을 완료하기 위해 다음 인증 코드를 입력해 주세요:

인증 코드: {{verificationCode}}

이 코드는 5분 동안 유효합니다.
요청하지 않으셨다면 이 이메일을 무시해 주세요.

감사합니다,
Siftbeam 지원팀""",
        "Html": """
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #2563eb; margin: 0;">Siftbeam</h1>
  </div>
  
  <h2 style="color: #333; margin-bottom: 20px;">계정 인증 코드</h2>
  
  <p>Siftbeam을 이용해 주셔서 감사합니다.</p>
  
  <p>계정 확인을 완료하기 위해 다음 인증 코드를 입력해 주세요:</p>
  
  <div style="background: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
    <div style="font-size: 32px; font-weight: bold; color: #2563eb; letter-spacing: 4px;">{{verificationCode}}</div>
  </div>
  
  <p style="color: #64748b; font-size: 14px;">이 코드는 5분 동안 유효합니다.</p>
  <p style="color: #64748b; font-size: 14px;">요청하지 않으셨다면 이 이메일을 무시해 주세요.</p>
  
  <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 14px;">
    <p>감사합니다,<br>Siftbeam 지원팀</p>
  </div>
</div>
"""
    },
    "pt": {
        "Subject": "Siftbeam - Código de verificação de conta",
        "Text": """Obrigado por usar o Siftbeam.

Por favor, digite o seguinte código de verificação para completar a confirmação da sua conta:

Código de verificação: {{verificationCode}}

Este código é válido por 5 minutos.
Se você não solicitou isso, ignore este e-mail.

Atenciosamente,
Equipe de suporte Siftbeam""",
        "Html": """
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #2563eb; margin: 0;">Siftbeam</h1>
  </div>
  
  <h2 style="color: #333; margin-bottom: 20px;">Código de verificação de conta</h2>
  
  <p>Obrigado por usar o Siftbeam.</p>
  
  <p>Por favor, digite o seguinte código de verificação para completar a confirmação da sua conta:</p>
  
  <div style="background: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
    <div style="font-size: 32px; font-weight: bold; color: #2563eb; letter-spacing: 4px;">{{verificationCode}}</div>
  </div>
  
  <p style="color: #64748b; font-size: 14px;">Este código é válido por 5 minutos.</p>
  <p style="color: #64748b; font-size: 14px;">Se você não solicitou isso, ignore este e-mail.</p>
  
  <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 14px;">
    <p>Atenciosamente,<br>Equipe de suporte Siftbeam</p>
  </div>
</div>
"""
    },
    "zh-CN": {
        "Subject": "Siftbeam - 账户验证码",
        "Text": """感谢您使用 Siftbeam。

请输入以下验证码来完成账户确认：

验证码：{{verificationCode}}

此验证码有效期为5分钟。
如果您未请求此操作，请忽略此邮件。

此致敬礼，
Siftbeam 支持团队""",
        "Html": """
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #2563eb; margin: 0;">Siftbeam</h1>
  </div>
  
  <h2 style="color: #333; margin-bottom: 20px;">账户验证码</h2>
  
  <p>感谢您使用 Siftbeam。</p>
  
  <p>请输入以下验证码来完成账户确认：</p>
  
  <div style="background: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
    <div style="font-size: 32px; font-weight: bold; color: #2563eb; letter-spacing: 4px;">{{verificationCode}}</div>
  </div>
  
  <p style="color: #64748b; font-size: 14px;">此验证码有效期为5分钟。</p>
  <p style="color: #64748b; font-size: 14px;">如果您未请求此操作，请忽略此邮件。</p>
  
  <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 14px;">
    <p>此致敬礼，<br>Siftbeam 支持团队</p>
  </div>
</div>
"""
    }
}

def upsert_template(sesv2, name: str, content: dict):
    """テンプレートを作成または更新する"""
    payload = {
        "TemplateName": name,
        "TemplateContent": {
            "Subject": content["Subject"],
            "Text": content["Text"],
            "Html": content["Html"],
        },
    }
    
    try:
        sesv2.create_email_template(**payload)
        logger.info(f"テンプレート作成成功: {name}")
    except sesv2.exceptions.AlreadyExistsException:
        sesv2.update_email_template(**payload)
        logger.info(f"テンプレート更新成功: {name}")

def lambda_handler(event, context):
    """Lambda関数のメインハンドラー"""
    sesv2 = boto3.client("sesv2", region_name=REGION)
    
    # 処理する言語を取得（指定がなければ全言語）
    locales = event.get("locales") or list(TEMPLATES.keys())
    
    # 各言語のテンプレートを作成/更新
    for loc in locales:
        if loc not in TEMPLATES:
            logger.warning(f"未定義ロケール: {loc} をスキップ")
            continue
            
        name = f"{BASE_NAME}_{loc}"
        upsert_template(sesv2, name, TEMPLATES[loc])
    
    # テストメール送信（オプション）
    if event.get("test_email") and event.get("to_email"):
        loc = event.get("locale", "en")
        name = f"{BASE_NAME}_{loc if loc in TEMPLATES else 'en'}"
        
        # テンプレートデータを準備
        data = {
            "userName": event.get("userName", "test@example.com"),
            "verificationCode": event.get("verificationCode", "123456"),
        }
        
        try:
            resp = sesv2.send_email(
                FromEmailAddress="no-reply@siftbeam.com",
                Destination={"ToAddresses": [event["to_email"]]},
                Content={
                    "Template": {
                        "TemplateName": name,
                        "TemplateData": json.dumps(data, ensure_ascii=False)
                    }
                },
            )
            logger.info(f"テスト送信成功: {resp['MessageId']} -> {event['to_email']} ({name})")
        except Exception as e:
            logger.error(f"テスト送信失敗: {str(e)}")
            raise e
    
    return {
        "statusCode": 200,
        "body": json.dumps({
            "message": "サインアップ認証テンプレートの作成/更新完了（有効期限: 5分）",
            "locales": locales
        }),
    }
