import boto3
import json
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)

REGION = "ap-northeast-1"
BASE_NAME = "SiftbeamUsageNotice"

TEMPLATES = {
    "ja": {
        "Subject": "Siftbeam - 利用制限超過のお知らせ",
        "Text": """Siftbeamをご利用いただき、ありがとうございます。

お客様のデータ使用量が設定された制限を超過しました。

現在の使用量: {{currentUsage}}
制限値: {{limitValue}}

ダッシュボードから詳細をご確認いただけます。
制限の変更が必要な場合は、プランのアップグレードをご検討ください。

ご不明な点がございましたら、サポートチームまでお問い合わせください。

Siftbeam サポートチーム""",
        "Html": """
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #2563eb; margin: 0;">Siftbeam</h1>
  </div>
  
  <h2 style="color: #333; margin-bottom: 20px;">利用制限超過のお知らせ</h2>
  
  <p>Siftbeamをご利用いただき、ありがとうございます。</p>
  
  <p>お客様のデータ使用量が設定された制限を超過しました。</p>
  
  <div style="background: #fef2f2; border: 2px solid #fca5a5; border-radius: 8px; padding: 20px; margin: 20px 0;">
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">現在の使用量:</td>
        <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #dc2626; font-size: 16px;">{{currentUsage}}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">制限値:</td>
        <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #333; font-size: 16px;">{{limitValue}}</td>
      </tr>
    </table>
  </div>
  
  <p style="color: #64748b; font-size: 14px;">ダッシュボードから詳細をご確認いただけます。</p>
  <p style="color: #64748b; font-size: 14px;">制限の変更が必要な場合は、プランのアップグレードをご検討ください。</p>
  
  <div style="margin-top: 30px; text-align: center;">
    <a href="https://www.siftbeam.com/ja/service" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">確認する</a>
  </div>
  
  <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 14px;">
    <p>ご不明な点がございましたら、サポートチームまでお問い合わせください。</p>
    <p>Siftbeam サポートチーム</p>
  </div>
</div>
"""
    },
    "en": {
        "Subject": "Siftbeam - Usage Limit Exceeded",
        "Text": """Thank you for using Siftbeam.

Your data usage has exceeded the configured limit.

Current Usage: {{currentUsage}}
Limit Value: {{limitValue}}

You can view details from your dashboard.
If you need to change the limit, please consider upgrading your plan.

If you have any questions, please contact our support team.

Best regards,
Siftbeam Support Team""",
        "Html": """
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #2563eb; margin: 0;">Siftbeam</h1>
  </div>
  
  <h2 style="color: #333; margin-bottom: 20px;">Usage Limit Exceeded</h2>
  
  <p>Thank you for using Siftbeam.</p>
  
  <p>Your data usage has exceeded the configured limit.</p>
  
  <div style="background: #fef2f2; border: 2px solid #fca5a5; border-radius: 8px; padding: 20px; margin: 20px 0;">
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Current Usage:</td>
        <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #dc2626; font-size: 16px;">{{currentUsage}}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Limit Value:</td>
        <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #333; font-size: 16px;">{{limitValue}}</td>
      </tr>
    </table>
  </div>
  
  <p style="color: #64748b; font-size: 14px;">You can view details from your dashboard.</p>
  <p style="color: #64748b; font-size: 14px;">If you need to change the limit, please consider upgrading your plan.</p>
  
  <div style="margin-top: 30px; text-align: center;">
    <a href="https://www.siftbeam.com/en/service" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">View Details</a>
  </div>
  
  <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 14px;">
    <p>If you have any questions, please contact our support team.</p>
    <p>Best regards,<br>Siftbeam Support Team</p>
  </div>
</div>
"""
    },
    "fr": {
        "Subject": "Siftbeam - Limite d'utilisation dépassée",
        "Text": """Merci d'utiliser Siftbeam.

Votre utilisation de données a dépassé la limite configurée.

Utilisation actuelle : {{currentUsage}}
Valeur limite : {{limitValue}}

Vous pouvez consulter les détails depuis votre tableau de bord.
Si vous devez modifier la limite, veuillez envisager de mettre à niveau votre plan.

Si vous avez des questions, veuillez contacter notre équipe de support.

Cordialement,
Équipe de support Siftbeam""",
        "Html": """
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #2563eb; margin: 0;">Siftbeam</h1>
  </div>
  
  <h2 style="color: #333; margin-bottom: 20px;">Limite d'utilisation dépassée</h2>
  
  <p>Merci d'utiliser Siftbeam.</p>
  
  <p>Votre utilisation de données a dépassé la limite configurée.</p>
  
  <div style="background: #fef2f2; border: 2px solid #fca5a5; border-radius: 8px; padding: 20px; margin: 20px 0;">
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Utilisation actuelle :</td>
        <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #dc2626; font-size: 16px;">{{currentUsage}}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Valeur limite :</td>
        <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #333; font-size: 16px;">{{limitValue}}</td>
      </tr>
    </table>
  </div>
  
  <p style="color: #64748b; font-size: 14px;">Vous pouvez consulter les détails depuis votre tableau de bord.</p>
  <p style="color: #64748b; font-size: 14px;">Si vous devez modifier la limite, veuillez envisager de mettre à niveau votre plan.</p>
  
  <div style="margin-top: 30px; text-align: center;">
    <a href="https://www.siftbeam.com/fr/service" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Voir les détails</a>
  </div>
  
  <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 14px;">
    <p>Si vous avez des questions, veuillez contacter notre équipe de support.</p>
    <p>Cordialement,<br>Équipe de support Siftbeam</p>
  </div>
</div>
"""
    },
    "de": {
        "Subject": "Siftbeam - Nutzungslimit überschritten",
        "Text": """Vielen Dank, dass Sie Siftbeam nutzen.

Ihre Datennutzung hat das konfigurierte Limit überschritten.

Aktuelle Nutzung: {{currentUsage}}
Grenzwert: {{limitValue}}

Sie können Details in Ihrem Dashboard einsehen.
Wenn Sie das Limit ändern müssen, ziehen Sie bitte ein Upgrade Ihres Plans in Betracht.

Bei Fragen wenden Sie sich bitte an unser Support-Team.

Mit freundlichen Grüßen,
Siftbeam Support-Team""",
        "Html": """
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #2563eb; margin: 0;">Siftbeam</h1>
  </div>
  
  <h2 style="color: #333; margin-bottom: 20px;">Nutzungslimit überschritten</h2>
  
  <p>Vielen Dank, dass Sie Siftbeam nutzen.</p>
  
  <p>Ihre Datennutzung hat das konfigurierte Limit überschritten.</p>
  
  <div style="background: #fef2f2; border: 2px solid #fca5a5; border-radius: 8px; padding: 20px; margin: 20px 0;">
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Aktuelle Nutzung:</td>
        <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #dc2626; font-size: 16px;">{{currentUsage}}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Grenzwert:</td>
        <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #333; font-size: 16px;">{{limitValue}}</td>
      </tr>
    </table>
  </div>
  
  <p style="color: #64748b; font-size: 14px;">Sie können Details in Ihrem Dashboard einsehen.</p>
  <p style="color: #64748b; font-size: 14px;">Wenn Sie das Limit ändern müssen, ziehen Sie bitte ein Upgrade Ihres Plans in Betracht.</p>
  
  <div style="margin-top: 30px; text-align: center;">
    <a href="https://www.siftbeam.com/de/service" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Details anzeigen</a>
  </div>
  
  <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 14px;">
    <p>Bei Fragen wenden Sie sich bitte an unser Support-Team.</p>
    <p>Mit freundlichen Grüßen,<br>Siftbeam Support-Team</p>
  </div>
</div>
"""
    },
    "es": {
        "Subject": "Siftbeam - Límite de uso excedido",
        "Text": """Gracias por usar Siftbeam.

Su uso de datos ha excedido el límite configurado.

Uso actual: {{currentUsage}}
Valor límite: {{limitValue}}

Puede ver los detalles desde su panel de control.
Si necesita cambiar el límite, considere actualizar su plan.

Si tiene alguna pregunta, póngase en contacto con nuestro equipo de soporte.

Saludos cordiales,
Equipo de soporte de Siftbeam""",
        "Html": """
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #2563eb; margin: 0;">Siftbeam</h1>
  </div>
  
  <h2 style="color: #333; margin-bottom: 20px;">Límite de uso excedido</h2>
  
  <p>Gracias por usar Siftbeam.</p>
  
  <p>Su uso de datos ha excedido el límite configurado.</p>
  
  <div style="background: #fef2f2; border: 2px solid #fca5a5; border-radius: 8px; padding: 20px; margin: 20px 0;">
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Uso actual:</td>
        <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #dc2626; font-size: 16px;">{{currentUsage}}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Valor límite:</td>
        <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #333; font-size: 16px;">{{limitValue}}</td>
      </tr>
    </table>
  </div>
  
  <p style="color: #64748b; font-size: 14px;">Puede ver los detalles desde su panel de control.</p>
  <p style="color: #64748b; font-size: 14px;">Si necesita cambiar el límite, considere actualizar su plan.</p>
  
  <div style="margin-top: 30px; text-align: center;">
    <a href="https://www.siftbeam.com/es/service" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Ver detalles</a>
  </div>
  
  <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 14px;">
    <p>Si tiene alguna pregunta, póngase en contacto con nuestro equipo de soporte.</p>
    <p>Saludos cordiales,<br>Equipo de soporte de Siftbeam</p>
  </div>
</div>
"""
    },
    "id": {
        "Subject": "Siftbeam - Batas Penggunaan Terlampaui",
        "Text": """Terima kasih telah menggunakan Siftbeam.

Penggunaan data Anda telah melampaui batas yang dikonfigurasi.

Penggunaan Saat Ini: {{currentUsage}}
Nilai Batas: {{limitValue}}

Anda dapat melihat detail dari dashboard Anda.
Jika Anda perlu mengubah batas, silakan pertimbangkan untuk meningkatkan paket Anda.

Jika Anda memiliki pertanyaan, silakan hubungi tim dukungan kami.

Salam hormat,
Tim Dukungan Siftbeam""",
        "Html": """
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #2563eb; margin: 0;">Siftbeam</h1>
  </div>
  
  <h2 style="color: #333; margin-bottom: 20px;">Batas Penggunaan Terlampaui</h2>
  
  <p>Terima kasih telah menggunakan Siftbeam.</p>
  
  <p>Penggunaan data Anda telah melampaui batas yang dikonfigurasi.</p>
  
  <div style="background: #fef2f2; border: 2px solid #fca5a5; border-radius: 8px; padding: 20px; margin: 20px 0;">
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Penggunaan Saat Ini:</td>
        <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #dc2626; font-size: 16px;">{{currentUsage}}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Nilai Batas:</td>
        <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #333; font-size: 16px;">{{limitValue}}</td>
      </tr>
    </table>
  </div>
  
  <p style="color: #64748b; font-size: 14px;">Anda dapat melihat detail dari dashboard Anda.</p>
  <p style="color: #64748b; font-size: 14px;">Jika Anda perlu mengubah batas, silakan pertimbangkan untuk meningkatkan paket Anda.</p>
  
  <div style="margin-top: 30px; text-align: center;">
    <a href="https://www.siftbeam.com/id/service" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Lihat Detail</a>
  </div>
  
  <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 14px;">
    <p>Jika Anda memiliki pertanyaan, silakan hubungi tim dukungan kami.</p>
    <p>Salam hormat,<br>Tim Dukungan Siftbeam</p>
  </div>
</div>
"""
    },
    "ko": {
        "Subject": "Siftbeam - 사용 한도 초과",
        "Text": """Siftbeam을 이용해 주셔서 감사합니다.

데이터 사용량이 설정된 한도를 초과했습니다.

현재 사용량: {{currentUsage}}
한도 값: {{limitValue}}

대시보드에서 자세한 내용을 확인하실 수 있습니다.
한도를 변경해야 하는 경우 플랜 업그레이드를 고려해 주세요.

문의 사항이 있으시면 지원팀에 문의해 주세요.

감사합니다,
Siftbeam 지원팀""",
        "Html": """
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #2563eb; margin: 0;">Siftbeam</h1>
  </div>
  
  <h2 style="color: #333; margin-bottom: 20px;">사용 한도 초과</h2>
  
  <p>Siftbeam을 이용해 주셔서 감사합니다.</p>
  
  <p>데이터 사용량이 설정된 한도를 초과했습니다.</p>
  
  <div style="background: #fef2f2; border: 2px solid #fca5a5; border-radius: 8px; padding: 20px; margin: 20px 0;">
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">현재 사용량:</td>
        <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #dc2626; font-size: 16px;">{{currentUsage}}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">한도 값:</td>
        <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #333; font-size: 16px;">{{limitValue}}</td>
      </tr>
    </table>
  </div>
  
  <p style="color: #64748b; font-size: 14px;">대시보드에서 자세한 내용을 확인하실 수 있습니다.</p>
  <p style="color: #64748b; font-size: 14px;">한도를 변경해야 하는 경우 플랜 업그레이드를 고려해 주세요.</p>
  
  <div style="margin-top: 30px; text-align: center;">
    <a href="https://www.siftbeam.com/ko/service" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">상세 보기</a>
  </div>
  
  <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 14px;">
    <p>문의 사항이 있으시면 지원팀에 문의해 주세요.</p>
    <p>감사합니다,<br>Siftbeam 지원팀</p>
  </div>
</div>
"""
    },
    "pt": {
        "Subject": "Siftbeam - Limite de uso excedido",
        "Text": """Obrigado por usar o Siftbeam.

Seu uso de dados excedeu o limite configurado.

Uso atual: {{currentUsage}}
Valor limite: {{limitValue}}

Você pode visualizar os detalhes no seu painel.
Se você precisar alterar o limite, considere atualizar seu plano.

Se você tiver alguma dúvida, entre em contato com nossa equipe de suporte.

Atenciosamente,
Equipe de suporte Siftbeam""",
        "Html": """
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #2563eb; margin: 0;">Siftbeam</h1>
  </div>
  
  <h2 style="color: #333; margin-bottom: 20px;">Limite de uso excedido</h2>
  
  <p>Obrigado por usar o Siftbeam.</p>
  
  <p>Seu uso de dados excedeu o limite configurado.</p>
  
  <div style="background: #fef2f2; border: 2px solid #fca5a5; border-radius: 8px; padding: 20px; margin: 20px 0;">
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Uso atual:</td>
        <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #dc2626; font-size: 16px;">{{currentUsage}}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Valor limite:</td>
        <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #333; font-size: 16px;">{{limitValue}}</td>
      </tr>
    </table>
  </div>
  
  <p style="color: #64748b; font-size: 14px;">Você pode visualizar os detalhes no seu painel.</p>
  <p style="color: #64748b; font-size: 14px;">Se você precisar alterar o limite, considere atualizar seu plano.</p>
  
  <div style="margin-top: 30px; text-align: center;">
    <a href="https://www.siftbeam.com/pt/service" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Ver detalhes</a>
  </div>
  
  <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 14px;">
    <p>Se você tiver alguma dúvida, entre em contato com nossa equipe de suporte.</p>
    <p>Atenciosamente,<br>Equipe de suporte Siftbeam</p>
  </div>
</div>
"""
    },
    "zh-CN": {
        "Subject": "Siftbeam - 使用限制已超出",
        "Text": """感谢您使用 Siftbeam。

您的数据使用量已超出配置的限制。

当前使用量：{{currentUsage}}
限制值：{{limitValue}}

您可以从仪表板查看详细信息。
如果您需要更改限制，请考虑升级您的计划。

如有任何疑问，请联系我们的支持团队。

此致敬礼，
Siftbeam 支持团队""",
        "Html": """
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #2563eb; margin: 0;">Siftbeam</h1>
  </div>
  
  <h2 style="color: #333; margin-bottom: 20px;">使用限制已超出</h2>
  
  <p>感谢您使用 Siftbeam。</p>
  
  <p>您的数据使用量已超出配置的限制。</p>
  
  <div style="background: #fef2f2; border: 2px solid #fca5a5; border-radius: 8px; padding: 20px; margin: 20px 0;">
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">当前使用量：</td>
        <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #dc2626; font-size: 16px;">{{currentUsage}}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">限制值：</td>
        <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #333; font-size: 16px;">{{limitValue}}</td>
      </tr>
    </table>
  </div>
  
  <p style="color: #64748b; font-size: 14px;">您可以从仪表板查看详细信息。</p>
  <p style="color: #64748b; font-size: 14px;">如果您需要更改限制，请考虑升级您的计划。</p>
  
  <div style="margin-top: 30px; text-align: center;">
    <a href="https://www.siftbeam.com/zh-CN/service" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">查看详情</a>
  </div>
  
  <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 14px;">
    <p>如有任何疑问，请联系我们的支持团队。</p>
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
            "currentUsage": event.get("currentUsage", "10.5 MB"),
            "limitValue": event.get("limitValue", "10 MB"),
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
            "message": "利用制限超過通知テンプレートの更新完了",
            "locales": locales
        }),
    }

