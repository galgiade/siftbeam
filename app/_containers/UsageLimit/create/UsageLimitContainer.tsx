import UsageLimitPresentation from "./UsageLimitPresentation";
import UsageLimitErrorDisplay from "../UsageLimitErrorDisplay";
import { requireUserProfile } from "@/app/lib/utils/require-auth";
import { usageLimitDictionaries, pickDictionary } from '@/app/dictionaries/mappings';

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

    return (
      <UsageLimitPresentation
        userAttributes={userAttributesDTO}
        dictionary={dictionary}
        locale={locale}
      />
    );

  } catch (error: any) {
    console.error('Error in UsageLimitContainer:', error);
    const dictionary = pickDictionary(usageLimitDictionaries, locale, 'en');
    return (
      <UsageLimitErrorDisplay
        error={error.message || dictionary.alert.unknownError}
        dictionary={dictionary}
      />
    );
  }
}