import UsageLimitPresentation from "./UsageLimitPresentation";
import UsageLimitErrorDisplay from "./UsageLimitErrorDisplay";
import { requireUserProfile } from "@/app/lib/utils/require-auth";
import { usageLimitDictionaries, pickDictionary } from '@/app/dictionaries/mappings';
import { getCustomerUsageLimits } from "@/app/lib/actions/usage-limits-api";

interface UsageLimitContainerProps {
  locale: string;
}

export default async function UsageLimitContainer({ locale }: UsageLimitContainerProps) {
  try {
    const [userProfile, dictionary] = await Promise.all([
      requireUserProfile(locale),
      Promise.resolve(pickDictionary(usageLimitDictionaries, locale, 'en'))
    ]);

    // 管理者権限チェック
    if (userProfile.role !== 'admin') {
      return (
        <UsageLimitErrorDisplay 
          error={dictionary.alert.accessDenied}
          dictionary={dictionary} 
        />
      );
    }

    if (!userProfile.sub || !userProfile.customerId) {
      return (
        <UsageLimitErrorDisplay 
          error={dictionary.alert.loginRequired}
          dictionary={dictionary} 
        />
      );
    }

    const userAttributesDTO = {
      sub: userProfile.sub,
      preferred_username: userProfile.preferred_username,
      customerId: userProfile.customerId,
      role: userProfile.role,
      locale: userProfile.locale,
      paymentMethodId: userProfile.paymentMethodId
    };

    // 使用量制限データを取得
    const usageLimitsResult = await getCustomerUsageLimits(userAttributesDTO.customerId);

    if (!usageLimitsResult.success) {
      return (
        <UsageLimitErrorDisplay 
          error={usageLimitsResult.message || dictionary.alert.fetchFailed}
          dictionary={dictionary} 
        />
      );
    }

    return (
      <UsageLimitPresentation
        userAttributes={userAttributesDTO}
        usageLimits={usageLimitsResult.data || { notifyLimits: [], restrictLimits: [] }}
        dictionary={dictionary}
        locale={locale}
      />
    );

  } catch (error: any) {
    console.error('Error in UsageLimitContainer:', error);
    
    // エラー時にdictionaryを取得
    const dictionary = pickDictionary(usageLimitDictionaries, locale, 'en');
    
    return (
      <UsageLimitErrorDisplay 
        error={error.message || dictionary.alert.unknownError}
        dictionary={dictionary} 
      />
    );
  }
}