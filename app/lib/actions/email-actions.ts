'use server';

import { SendTemplatedEmailCommand } from '@aws-sdk/client-ses';
import { sesClient } from '@/app/lib/aws-clients';

// SESテンプレート送信用のインターface
interface SendTemplatedEmailParams {
  to: string;
  templateName: string;
  templateData: Record<string, any>;
  fromEmail?: string;
}

// SESテンプレートを使用してメールを送信
export async function sendTemplatedEmailAction({
  to,
  templateName,
  templateData,
  fromEmail = process.env.SES_FROM_EMAIL || 'noreply@siftbeam.com'
}: SendTemplatedEmailParams): Promise<{
  success: boolean;
  message: string;
  messageId?: string;
}> {
  try {
    const command = new SendTemplatedEmailCommand({
      Source: fromEmail,
      Destination: {
        ToAddresses: [to],
      },
      Template: templateName,
      TemplateData: JSON.stringify(templateData),
    });

    const response = await sesClient.send(command);

    console.log(`Email sent successfully to ${to} using template ${templateName}:`, response.MessageId);

    return {
      success: true,
      message: 'メールが正常に送信されました',
      messageId: response.MessageId,
    };
  } catch (error: any) {
    console.error('Error sending templated email:', error);

    let message = 'メールの送信に失敗しました';
    if (error.name === 'MessageRejected') {
      message = 'メールアドレスが無効です';
    } else if (error.name === 'TemplateDoesNotExist') {
      message = 'メールテンプレートが見つかりません';
    } else if (error.name === 'InvalidTemplate') {
      message = 'メールテンプレートが無効です';
    } else if (error.name === 'SendingPausedException') {
      message = 'メール送信が一時停止されています';
    }

    return {
      success: false,
      message,
    };
  }
}

// 認証コード送信用の専用関数
export async function sendVerificationCodeEmailAction(
  email: string,
  code: string,
  locale: string = 'ja'
): Promise<{
  success: boolean;
  message: string;
  messageId?: string;
}> {
  try {
    // ロケールに基づいてテンプレート名を決定
    const templateName = `SiftbeamVerificationCode_${locale}`;
    
    // テンプレートデータを準備
    const templateData = {
      verificationCode: code,
      email: email,
      // 必要に応じて他のデータも追加可能
      companyName: 'SiftBeam',
      supportEmail: process.env.SES_FROM_EMAIL || 'support@siftbeam.com',
    };

    console.log(`Sending verification code email to ${email} using template ${templateName}`);

    return await sendTemplatedEmailAction({
      to: email,
      templateName,
      templateData,
    });
  } catch (error: any) {
    console.error('Error sending verification code email:', error);
    return {
      success: false,
      message: '認証コードメールの送信に失敗しました',
    };
  }
}

// パスワードリセット用のメール送信（将来の拡張用）
export async function sendPasswordResetEmailAction(
  email: string,
  resetToken: string,
  locale: string = 'ja'
): Promise<{
  success: boolean;
  message: string;
  messageId?: string;
}> {
  try {
    const templateName = `SiftbeamPasswordReset_${locale}`;
    
    const templateData = {
      resetToken: resetToken,
      email: email,
      resetUrl: `${process.env.NEXT_PUBLIC_APP_URL}/${locale}/reset-password?token=${resetToken}`,
      companyName: 'SiftBeam',
      supportEmail: process.env.SES_FROM_EMAIL || 'support@siftbeam.com',
    };

    return await sendTemplatedEmailAction({
      to: email,
      templateName,
      templateData,
    });
  } catch (error: any) {
    console.error('Error sending password reset email:', error);
    return {
      success: false,
      message: 'パスワードリセットメールの送信に失敗しました',
    };
  }
}

// ウェルカムメール送信用（将来の拡張用）
export async function sendWelcomeEmailAction(
  email: string,
  userName: string,
  locale: string = 'ja'
): Promise<{
  success: boolean;
  message: string;
  messageId?: string;
}> {
  try {
    const templateName = `SiftbeamWelcome_${locale}`;
    
    const templateData = {
      userName: userName,
      email: email,
      loginUrl: `${process.env.NEXT_PUBLIC_APP_URL}/${locale}/signin`,
      companyName: 'SiftBeam',
      supportEmail: process.env.SES_FROM_EMAIL || 'support@siftbeam.com',
    };

    return await sendTemplatedEmailAction({
      to: email,
      templateName,
      templateData,
    });
  } catch (error: any) {
    console.error('Error sending welcome email:', error);
    return {
      success: false,
      message: 'ウェルカムメールの送信に失敗しました',
    };
  }
}

// 使用量通知メール送信用
export async function sendUsageLimitNotificationEmailAction(
  emails: string[],
  customerId: string,
  currentUsageBytes: number,
  exceedingLimitDescription: string,
  locale: string = 'ja'
): Promise<{
  success: boolean;
  message: string;
  sentCount: number;
  failedEmails: string[];
}> {
  try {
    console.log('Sending usage limit notification emails to:', emails);
    
    const templateName = `SiftbeamUsageNotice_${locale}`;
    
    // 使用量をMB/GB/TBに変換（Lambda形式に合わせる）
    const formatBytes = (bytes: number): string => {
      if (bytes >= 1024 * 1024 * 1024 * 1024) {
        return `${(bytes / (1024 * 1024 * 1024 * 1024)).toFixed(2).replace(/\.?0+$/, '')} TB`;
      } else if (bytes >= 1024 * 1024 * 1024) {
        return `${(bytes / (1024 * 1024 * 1024)).toFixed(2).replace(/\.?0+$/, '')} GB`;
      } else if (bytes >= 1024 * 1024) {
        return `${(bytes / (1024 * 1024)).toFixed(2).replace(/\.?0+$/, '')} MB`;
      } else if (bytes >= 1024) {
        return `${(bytes / 1024).toFixed(2).replace(/\.?0+$/, '')} KB`;
      } else {
        return `${bytes} B`;
      }
    };
    
    // 制限値を数値に変換（exceedingLimitDescriptionから抽出）
    // 例: "10 MB" → 10485760 bytes
    const parseLimitDescription = (description: string): number => {
      const match = description.match(/(\d+(?:\.\d+)?)\s*(KB|MB|GB|TB)/i);
      if (!match) return 0;
      
      const value = parseFloat(match[1]);
      const unit = match[2].toUpperCase();
      
      const multipliers: { [key: string]: number } = {
        'KB': 1024,
        'MB': 1024 * 1024,
        'GB': 1024 * 1024 * 1024,
        'TB': 1024 * 1024 * 1024 * 1024,
      };
      
      return value * (multipliers[unit] || 1);
    };
    
    const limitValueBytes = parseLimitDescription(exceedingLimitDescription);
    
    // Lambda形式のテンプレートデータ（使用率と超過量は削除）
    const templateData = {
      currentUsage: formatBytes(currentUsageBytes),
      limitValue: formatBytes(limitValueBytes),
    };

    let sentCount = 0;
    const failedEmails: string[] = [];

    // デバッグログ: テンプレートデータを出力
    console.log('Template data:', JSON.stringify(templateData, null, 2));
    console.log('Template name:', templateName);
    console.log('Recipients:', emails);

    // 各メールアドレスに送信
    for (const email of emails) {
      const result = await sendTemplatedEmailAction({
        to: email,
        templateName,
        templateData,
      });

      if (result.success) {
        sentCount++;
      } else {
        failedEmails.push(email);
      }
    }

    if (failedEmails.length === 0) {
      return {
        success: true,
        message: `${sentCount}件の通知メールを送信しました。`,
        sentCount,
        failedEmails: []
      };
    } else {
      return {
        success: false,
        message: `${sentCount}件送信成功、${failedEmails.length}件失敗しました。`,
        sentCount,
        failedEmails
      };
    }

  } catch (error: any) {
    console.error('Error sending usage limit notification emails:', error);
    return {
      success: false,
      message: '使用量通知メールの送信に失敗しました',
      sentCount: 0,
      failedEmails: emails
    };
  }
}