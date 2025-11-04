import UsageLimitPresentation from "./UsageLimitPresentation";
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

    if (!userProfile.sub || !userProfile.customerId) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 p-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-danger-600 mb-4">
              {dictionary.label.errorOccurred}
            </h2>
            <p className="text-gray-700 mb-4">
              {dictionary.alert.loginRequired}
            </p>
            <p className="text-sm text-gray-500">
              {dictionary.label.contactSupport}
            </p>
          </div>
        </div>
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
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-danger-600 mb-4">
            {dictionary.label.errorOccurred}
          </h2>
          <p className="text-gray-700 mb-4">
            {error.message || dictionary.alert.unknownError}
          </p>
          <p className="text-sm text-gray-500">
            {dictionary.label.contactSupport}
          </p>
        </div>
      </div>
    );
  }
}