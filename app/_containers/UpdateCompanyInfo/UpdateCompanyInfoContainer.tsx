import UpdateCompanyInfoPresentation from "./UpdateCompanyInfoPresentation";
import { UserAttributesDTO } from "@/app/lib/types/TypeAPIs";
import { requireUserProfile } from "@/app/lib/utils/require-auth";
import type { CompanyProfileLocale } from '@/app/dictionaries/company/company.d.ts';
import { companyDictionaries, pickDictionary } from '@/app/dictionaries/mappings';
import { getStripeCustomerAction } from "@/app/lib/actions/stripe-actions";

export interface customerDTOProps {
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: {
      city: string;
      country: string;
      line1: string;
      line2: string;
      postal_code: string;
      state: string;
    };
  };
  userAttributes: UserAttributesDTO;
  dictionary: CompanyProfileLocale;
};

// マッピングは共通ファイルに集約

export default async function UpdateCompanyInfoContainer() {
  try {
    // ユーザー認証情報を取得（ロケール指定なしでデフォルト動作）
    const userProfile = await requireUserProfile();
    
    // UserAttributesDTOに変換（roleを含む）
    const userAttributes: UserAttributesDTO = {
      sub: userProfile.sub,
      preferred_username: userProfile.preferred_username,
      customerId: userProfile.customerId,
      role: userProfile.role,
      locale: userProfile.locale,
      paymentMethodId: userProfile.paymentMethodId
    };
    
    // 辞書データを取得
    const dictionary: CompanyProfileLocale = pickDictionary(companyDictionaries, userAttributes.locale, 'en');
    
    // 新しいStripe APIを使用して顧客情報を取得
    const customerResult = await getStripeCustomerAction(userAttributes.customerId);
    
    if (!customerResult.success || !customerResult.data) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-bold text-red-600 mb-2">{dictionary.alert.errorTitle}</h2>
            <p>{customerResult.message || dictionary.alert.fetchCustomerFailed}</p>
          </div>
        </div>
      );
    }
    
    const customer = customerResult.data;
    
    const customerDTO = {
      id: customer.id,
      name: customer.name || '',
      email: customer.email || '',
      phone: customer.phone || '',
      address: {
        city: customer.address?.city || '',
        country: customer.address?.country || '',
        line1: customer.address?.line1 || '',
        line2: customer.address?.line2 || '',
        postal_code: customer.address?.postal_code || '',
        state: customer.address?.state || '',
      },
    };
    
    return (
      <div>
        <UpdateCompanyInfoPresentation 
          customer={customerDTO} 
          userAttributes={userAttributes} 
          dictionary={dictionary}
        />
      </div>
    );
  } catch (error: any) {
    console.error('Error in UpdateCompanyInfoContainer:', error);
    
    const dictionary: CompanyProfileLocale = pickDictionary(companyDictionaries, 'ja', 'en');
    
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-600 mb-2">{dictionary.alert.errorTitle}</h2>
          <p>{dictionary.alert.fetchError}</p>
          <p className="text-sm text-gray-600 mt-2">{error?.message}</p>
        </div>
      </div>
    );
  }
}