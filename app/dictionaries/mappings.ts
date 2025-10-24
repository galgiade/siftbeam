// 辞書の集約マッピング
// 各機能ごとのロケール→辞書の対応を一本化し、
// 'en' と 'en-US'、'zh' と 'zh-CN' などのエイリアスも吸収します。

// newOrder
import type { NewOrderLocale } from '@/app/dictionaries/newOrder/newOrder.d.ts';
import jaNewOrder from '@/app/dictionaries/newOrder/ja';
import enUSNewOrder from '@/app/dictionaries/newOrder/en-US';
import frNewOrder from '@/app/dictionaries/newOrder/fr';
import deNewOrder from '@/app/dictionaries/newOrder/de';
import koNewOrder from '@/app/dictionaries/newOrder/ko';
import idNewOrder from '@/app/dictionaries/newOrder/id';
import zhCNNewOrder from '@/app/dictionaries/newOrder/zh-CN';
import ptNewOrder from '@/app/dictionaries/newOrder/pt';

// limitUsage
import type { LimitUsageLocale } from '@/app/dictionaries/limitUsage/limitUsage.d.ts';
import jaLimitUsage from '@/app/dictionaries/limitUsage/ja';
import enUSLimitUsage from '@/app/dictionaries/limitUsage/en-US';
import frLimitUsage from '@/app/dictionaries/limitUsage/fr';
import deLimitUsage from '@/app/dictionaries/limitUsage/de';
import koLimitUsage from '@/app/dictionaries/limitUsage/ko';
import idLimitUsage from '@/app/dictionaries/limitUsage/id';
import zhCNLimitUsage from '@/app/dictionaries/limitUsage/zh-CN';
import ptLimitUsage from '@/app/dictionaries/limitUsage/pt';

// storage
import type { StorageLocale } from '@/app/dictionaries/storage/AccountLocale.d.ts';
import jaStorage from '@/app/dictionaries/storage/ja';
import enUSStorage from '@/app/dictionaries/storage/en-US';
import frStorage from '@/app/dictionaries/storage/fr';
import deStorage from '@/app/dictionaries/storage/de';
import koStorage from '@/app/dictionaries/storage/ko';
import idStorage from '@/app/dictionaries/storage/id';
import zhCNStorage from '@/app/dictionaries/storage/zh-CN';
import ptStorage from '@/app/dictionaries/storage/pt';

// createSupportCenter
import type { SupportCenterLocale } from '@/app/dictionaries/createSupportCenter/createSupportCenter.d.ts';
import jaSupport from '@/app/dictionaries/createSupportCenter/ja';
import enUSSupport from '@/app/dictionaries/createSupportCenter/en-US';
import frSupport from '@/app/dictionaries/createSupportCenter/fr';
import deSupport from '@/app/dictionaries/createSupportCenter/de';
import koSupport from '@/app/dictionaries/createSupportCenter/ko';
import idSupport from '@/app/dictionaries/createSupportCenter/id';
import zhCNSupport from '@/app/dictionaries/createSupportCenter/zh-CN';
import ptSupport from '@/app/dictionaries/createSupportCenter/pt';

// group-management
import type { GroupManagementLocale } from '@/app/dictionaries/group-management/group-management.d.ts';
import jaGroup from '@/app/dictionaries/group-management/ja';
import enUSGroup from '@/app/dictionaries/group-management/en-US';
import frGroup from '@/app/dictionaries/group-management/fr';
import deGroup from '@/app/dictionaries/group-management/de';
import koGroup from '@/app/dictionaries/group-management/ko';
import idGroup from '@/app/dictionaries/group-management/id';
import zhCNGroup from '@/app/dictionaries/group-management/zh-CN';
import ptGroup from '@/app/dictionaries/group-management/pt';

// auditLog
import type { AuditLogLocale } from '@/app/dictionaries/auditLog/auditLog.d.ts';
import jaAudit from '@/app/dictionaries/auditLog/ja';
import enUSAudit from '@/app/dictionaries/auditLog/en-US';
import frAudit from '@/app/dictionaries/auditLog/fr';
import deAudit from '@/app/dictionaries/auditLog/de';
import koAudit from '@/app/dictionaries/auditLog/ko';
import idAudit from '@/app/dictionaries/auditLog/id';
import zhCNAudit from '@/app/dictionaries/auditLog/zh-CN';
import ptAudit from '@/app/dictionaries/auditLog/pt';

// 各機能のマッピング（エイリアス含む）
export const newOrderDictionaries = {
  ja: jaNewOrder,
  en: enUSNewOrder,
  'en-US': enUSNewOrder,
  es: enUSNewOrder,
  fr: frNewOrder,
  de: deNewOrder,
  ko: koNewOrder,
  id: idNewOrder,
  pt: ptNewOrder,
  zh: zhCNNewOrder,
  'zh-CN': zhCNNewOrder,
};

export const limitUsageDictionaries = {
  ja: jaLimitUsage,
  en: enUSLimitUsage,
  'en-US': enUSLimitUsage,
  es: enUSLimitUsage,
  fr: frLimitUsage,
  de: deLimitUsage,
  ko: koLimitUsage,
  id: idLimitUsage,
  pt: ptLimitUsage,
  zh: zhCNLimitUsage,
  'zh-CN': zhCNLimitUsage,
};

export const storageDictionaries = {
  ja: jaStorage,
  en: enUSStorage,
  'en-US': enUSStorage,
  es: enUSStorage,
  fr: frStorage,
  de: deStorage,
  ko: koStorage,
  id: idStorage,
  pt: ptStorage,
  zh: zhCNStorage,
  'zh-CN': zhCNStorage,
};

export const supportCenterDictionaries = {
  ja: jaSupport,
  en: enUSSupport,
  'en-US': enUSSupport,
  es: enUSSupport,
  fr: frSupport,
  de: deSupport,
  ko: koSupport,
  id: idSupport,
  pt: ptSupport,
  zh: zhCNSupport,
  'zh-CN': zhCNSupport,
};

export const groupManagementDictionaries = {
  ja: jaGroup,
  en: enUSGroup,
  'en-US': enUSGroup,
  es: enUSGroup,
  fr: frGroup,
  de: deGroup,
  ko: koGroup,
  id: idGroup,
  pt: ptGroup,
  zh: zhCNGroup,
  'zh-CN': zhCNGroup,
};

export const auditLogDictionaries = {
  ja: jaAudit,
  en: enUSAudit,
  'en-US': enUSAudit,
  es: enUSAudit,
  fr: frAudit,
  de: deAudit,
  ko: koAudit,
  pt: ptAudit,
  id: idAudit,
  zh: zhCNAudit,
  'zh-CN': zhCNAudit,
};

// 共通の辞書取得ユーティリティ
export function pickDictionary<K extends string, T>(
  map: Record<K, T>,
  locale: string | undefined,
  fallback: K,
): T {
  if (locale && (locale as K) in map) {
    return map[locale as K];
  }
  return map[fallback];
}

// ===============================
// 追加の辞書マッピング（他コンテナ対応）
// ===============================

// apiKey (API Key Management)
import type { APIKeyLocale } from '@/app/dictionaries/apiKey/apiKey.d.ts';
import jaApiKey from '@/app/dictionaries/apiKey/ja';
import enUSApiKey from '@/app/dictionaries/apiKey/en-US';
import frApiKey from '@/app/dictionaries/apiKey/fr';
import deApiKey from '@/app/dictionaries/apiKey/de';
import koApiKey from '@/app/dictionaries/apiKey/ko';
import esApiKey from '@/app/dictionaries/apiKey/es';
import ptApiKey from '@/app/dictionaries/apiKey/pt';
import idApiKey from '@/app/dictionaries/apiKey/id';
import zhCNApiKey from '@/app/dictionaries/apiKey/zh-CN';

export const apiKeyDictionaries = {
  ja: jaApiKey,
  en: enUSApiKey,
  'en-US': enUSApiKey,
  fr: frApiKey,
  de: deApiKey,
  ko: koApiKey,
  es: esApiKey,
  pt: ptApiKey,
  id: idApiKey,
  zh: zhCNApiKey,
  'zh-CN': zhCNApiKey,
};

// account (Account layout / SideNavigation)
import jaAccount from '@/app/dictionaries/account/ja';
import enUSAccount from '@/app/dictionaries/account/en-US';
import frAccount from '@/app/dictionaries/account/fr';
import deAccount from '@/app/dictionaries/account/de';
import koAccount from '@/app/dictionaries/account/ko';
import esAccount from '@/app/dictionaries/account/es';
import ptAccount from '@/app/dictionaries/account/pt';
import idAccount from '@/app/dictionaries/account/id';
import zhCNAccount from '@/app/dictionaries/account/zh-CN';

export const accountDictionaries = {
  ja: jaAccount,
  en: enUSAccount,
  'en-US': enUSAccount,
  fr: frAccount,
  de: deAccount,
  ko: koAccount,
  es: esAccount,
  pt: ptAccount,
  id: idAccount,
  zh: zhCNAccount,
  'zh-CN': zhCNAccount,
};

// company (Invoices, UpdateCompanyInfo など)
import type { CompanyProfileLocale } from '@/app/dictionaries/company/company.d.ts';
import jaCompany from '@/app/dictionaries/company/ja';
import enUSCompany from '@/app/dictionaries/company/en-US';
import frCompany from '@/app/dictionaries/company/fr';
import deCompany from '@/app/dictionaries/company/de';
import koCompany from '@/app/dictionaries/company/ko';
import esCompany from '@/app/dictionaries/company/es';
import ptCompany from '@/app/dictionaries/company/pt';
import idCompany from '@/app/dictionaries/company/id';
import zhCNCompany from '@/app/dictionaries/company/zh-CN';

export const companyDictionaries = {
  ja: jaCompany,
  en: enUSCompany,
  'en-US': enUSCompany,
  fr: frCompany,
  de: deCompany,
  ko: koCompany,
  es: esCompany,
  pt: ptCompany,
  id: idCompany,
  zh: zhCNCompany,
  'zh-CN': zhCNCompany,
};

// deleteAccount
import type { DeleteAccountLocale } from '@/app/dictionaries/deleteAccount/deleteAccount.d.ts';
import jaDelete from '@/app/dictionaries/deleteAccount/ja';
import enUSDelete from '@/app/dictionaries/deleteAccount/en-US';
import frDelete from '@/app/dictionaries/deleteAccount/fr';
import deDelete from '@/app/dictionaries/deleteAccount/de';
import idDelete from '@/app/dictionaries/deleteAccount/id';
import zhCNDelete from '@/app/dictionaries/deleteAccount/zh-CN';

export const deleteAccountDictionaries = {
  ja: jaDelete,
  en: enUSDelete,
  'en-US': enUSDelete,
  fr: frDelete,
  de: deDelete,
  id: idDelete,
  zh: zhCNDelete,
  'zh-CN': zhCNDelete,
};

// cancelDeleteAccount
import type { CancelDeleteAccountLocale } from '@/app/dictionaries/cancelDeleteAccount/cancelDeleteAccount.d.ts';
import jaCancelDelete from '@/app/dictionaries/cancelDeleteAccount/ja';
import enUSCancelDelete from '@/app/dictionaries/cancelDeleteAccount/en-US';
import frCancelDelete from '@/app/dictionaries/cancelDeleteAccount/fr';
import deCancelDelete from '@/app/dictionaries/cancelDeleteAccount/de';
import idCancelDelete from '@/app/dictionaries/cancelDeleteAccount/id';
import zhCNCancelDelete from '@/app/dictionaries/cancelDeleteAccount/zh-CN';

export const cancelDeleteAccountDictionaries = {
  ja: jaCancelDelete,
  en: enUSCancelDelete,
  'en-US': enUSCancelDelete,
  fr: frCancelDelete,
  de: deCancelDelete,
  id: idCancelDelete,
  zh: zhCNCancelDelete,
  'zh-CN': zhCNCancelDelete,
};

// policy-management (PolicyManagement, Staff)
import type { PolicyManagementLocale } from '@/app/dictionaries/policy-management/policy-management.d.ts';
import jaPolicy from '@/app/dictionaries/policy-management/ja';
import enUSPolicy from '@/app/dictionaries/policy-management/en-US';
import frPolicy from '@/app/dictionaries/policy-management/fr';
import dePolicy from '@/app/dictionaries/policy-management/de';
import koPolicy from '@/app/dictionaries/policy-management/ko';
import idPolicy from '@/app/dictionaries/policy-management/id';
import zhCNPolicy from '@/app/dictionaries/policy-management/zh-CN';

export const policyManagementDictionaries = {
  ja: jaPolicy,
  en: enUSPolicy,
  'en-US': enUSPolicy,
  fr: frPolicy,
  de: dePolicy,
  ko: koPolicy,
  id: idPolicy,
  zh: zhCNPolicy,
  'zh-CN': zhCNPolicy,
};

// user-management
import type { UserManagementLocale } from '@/app/dictionaries/user-management/user-management.d.ts';
import jaUserMgmt from '@/app/dictionaries/user-management/ja';
import enUSUserMgmt from '@/app/dictionaries/user-management/en-US';
import frUserMgmt from '@/app/dictionaries/user-management/fr';
import deUserMgmt from '@/app/dictionaries/user-management/de';
import koUserMgmt from '@/app/dictionaries/user-management/ko';
import idUserMgmt from '@/app/dictionaries/user-management/id';
import esUserMgmt from '@/app/dictionaries/user-management/es';
import ptUserMgmt from '@/app/dictionaries/user-management/pt';
import zhCNUserMgmt from '@/app/dictionaries/user-management/zh-CN';

export const userManagementDictionaries = {
  ja: jaUserMgmt,
  en: enUSUserMgmt,
  'en-US': enUSUserMgmt,
  fr: frUserMgmt,
  de: deUserMgmt,
  ko: koUserMgmt,
  id: idUserMgmt,
  es: esUserMgmt,
  pt: ptUserMgmt,
  zh: zhCNUserMgmt,
  'zh-CN': zhCNUserMgmt,
};

// user (User Profile)
import type { UserProfileLocale } from '@/app/dictionaries/user/user.d.ts';
import jaUser from '@/app/dictionaries/user/ja';
import enUser from '@/app/dictionaries/user/en';
import frUser from '@/app/dictionaries/user/fr';
import deUser from '@/app/dictionaries/user/de';
import koUser from '@/app/dictionaries/user/ko';
import idUser from '@/app/dictionaries/user/id';
import esUser from '@/app/dictionaries/user/es';
import ptUser from '@/app/dictionaries/user/pt';
import zhCNUser from '@/app/dictionaries/user/zh-CN';

export const userDictionaries = {
  ja: jaUser,
  en: enUser,
  'en-US': enUser,
  fr: frUser,
  de: deUser,
  ko: koUser,
  id: idUser,
  es: esUser,
  pt: ptUser,
  zh: zhCNUser,
  'zh-CN': zhCNUser,
};

// usageHistory
import type { UsageHistoryLocale } from '@/app/dictionaries/usageHistory/usageHistory.d.ts';
import jaUsage from '@/app/dictionaries/usageHistory/ja';
import enUSUsage from '@/app/dictionaries/usageHistory/en-US';
import frUsage from '@/app/dictionaries/usageHistory/fr';
import deUsage from '@/app/dictionaries/usageHistory/de';
import idUsage from '@/app/dictionaries/usageHistory/id';
import koUsage from '@/app/dictionaries/usageHistory/ko';
import zhCNUsage from '@/app/dictionaries/usageHistory/zh-CN';
import ptUsage from '@/app/dictionaries/usageHistory/pt';

export const usageHistoryDictionaries = {
  ja: jaUsage,
  en: enUSUsage,
  'en-US': enUSUsage,
  es: enUSUsage,
  fr: frUsage,
  de: deUsage,
  id: idUsage,
  ko: koUsage,
  pt: ptUsage,
  zh: zhCNUsage,
  'zh-CN': zhCNUsage,
};

// paymentMethods
import type { PaymentMethodsLocale } from '@/app/dictionaries/paymentMethods/paymentMethods.d.ts';
import jaPayMethods from '@/app/dictionaries/paymentMethods/ja';
import enUSPayMethods from '@/app/dictionaries/paymentMethods/en-US';
import frPayMethods from '@/app/dictionaries/paymentMethods/fr';
import dePayMethods from '@/app/dictionaries/paymentMethods/de';
import koPayMethods from '@/app/dictionaries/paymentMethods/ko';
import esPayMethods from '@/app/dictionaries/paymentMethods/es';
import ptPayMethods from '@/app/dictionaries/paymentMethods/pt';
import idPayMethods from '@/app/dictionaries/paymentMethods/id';
import zhCNPayMethods from '@/app/dictionaries/paymentMethods/zh-CN';

export const paymentMethodsDictionaries = {
  ja: jaPayMethods,
  en: enUSPayMethods,
  'en-US': enUSPayMethods,
  fr: frPayMethods,
  de: dePayMethods,
  ko: koPayMethods,
  es: esPayMethods,
  pt: ptPayMethods,
  id: idPayMethods,
  zh: zhCNPayMethods,
  'zh-CN': zhCNPayMethods,
};

// createPayment
import type { CreatePaymentLocale } from '@/app/dictionaries/createPayment/createPayment.d.ts';
import jaCreatePayment from '@/app/dictionaries/createPayment/ja';
import enUSCreatePayment from '@/app/dictionaries/createPayment/en-US';
import frCreatePayment from '@/app/dictionaries/createPayment/fr';
import deCreatePayment from '@/app/dictionaries/createPayment/de';
import koCreatePayment from '@/app/dictionaries/createPayment/ko';
import esCreatePayment from '@/app/dictionaries/createPayment/es';
import ptCreatePayment from '@/app/dictionaries/createPayment/pt';
import idCreatePayment from '@/app/dictionaries/createPayment/id';
import zhCNCreatePayment from '@/app/dictionaries/createPayment/zh-CN';

export const createPaymentDictionaries = {
  ja: jaCreatePayment,
  en: enUSCreatePayment,
  'en-US': enUSCreatePayment,
  fr: frCreatePayment,
  de: deCreatePayment,
  ko: koCreatePayment,
  es: esCreatePayment,
  pt: ptCreatePayment,
  id: idCreatePayment,
  zh: zhCNCreatePayment,
  'zh-CN': zhCNCreatePayment,
};

// createAdmin
import type { CreateAdminLocale } from '@/app/dictionaries/createAdmin/createAdmin.d.ts';
import jaCreateAdmin from '@/app/dictionaries/createAdmin/ja';
import enUSCreateAdmin from '@/app/dictionaries/createAdmin/en-US';
import frCreateAdmin from '@/app/dictionaries/createAdmin/fr';
import deCreateAdmin from '@/app/dictionaries/createAdmin/de';
import koCreateAdmin from '@/app/dictionaries/createAdmin/ko';
import esCreateAdmin from '@/app/dictionaries/createAdmin/es';
import ptCreateAdmin from '@/app/dictionaries/createAdmin/pt';
import idCreateAdmin from '@/app/dictionaries/createAdmin/id';
import zhCNCreateAdmin from '@/app/dictionaries/createAdmin/zh-CN';

export const createAdminDictionaries = {
  ja: jaCreateAdmin,
  en: enUSCreateAdmin,
  'en-US': enUSCreateAdmin,
  fr: frCreateAdmin,
  de: deCreateAdmin,
  ko: koCreateAdmin,
  es: esCreateAdmin,
  pt: ptCreateAdmin,
  id: idCreateAdmin,
  zh: zhCNCreateAdmin,
  'zh-CN': zhCNCreateAdmin,
};

// signUpAuth
import jaSignUpAuth from '@/app/dictionaries/signUpAuth/ja';
import enUSSignUpAuth from '@/app/dictionaries/signUpAuth/en-US';
import frSignUpAuth from '@/app/dictionaries/signUpAuth/fr';
import deSignUpAuth from '@/app/dictionaries/signUpAuth/de';
import koSignUpAuth from '@/app/dictionaries/signUpAuth/ko';
import esSignUpAuth from '@/app/dictionaries/signUpAuth/es';
import ptSignUpAuth from '@/app/dictionaries/signUpAuth/pt';
import idSignUpAuth from '@/app/dictionaries/signUpAuth/id';
import zhCNSignUpAuth from '@/app/dictionaries/signUpAuth/zh-CN';

export const signUpAuthDictionaries = {
  ja: jaSignUpAuth,
  en: enUSSignUpAuth,
  'en-US': enUSSignUpAuth,
  fr: frSignUpAuth,
  de: deSignUpAuth,
  ko: koSignUpAuth,
  es: esSignUpAuth,
  pt: ptSignUpAuth,
  id: idSignUpAuth,
  zh: zhCNSignUpAuth,
  'zh-CN': zhCNSignUpAuth,
};

// createCompanyInfo
import jaCompanyInfo from '@/app/dictionaries/createCompanyInfo/ja';
import enUSCompanyInfo from '@/app/dictionaries/createCompanyInfo/en-US';
import frCompanyInfo from '@/app/dictionaries/createCompanyInfo/fr';
import deCompanyInfo from '@/app/dictionaries/createCompanyInfo/de';
import koCompanyInfo from '@/app/dictionaries/createCompanyInfo/ko';
import esCompanyInfo from '@/app/dictionaries/createCompanyInfo/es';
import ptCompanyInfo from '@/app/dictionaries/createCompanyInfo/pt';
import idCompanyInfo from '@/app/dictionaries/createCompanyInfo/id';
import zhCNCompanyInfo from '@/app/dictionaries/createCompanyInfo/zh-CN';

export const createCompanyInfoDictionaries = {
  ja: jaCompanyInfo,
  en: enUSCompanyInfo,
  'en-US': enUSCompanyInfo,
  fr: frCompanyInfo,
  de: deCompanyInfo,
  ko: koCompanyInfo,
  es: esCompanyInfo,
  pt: ptCompanyInfo,
  id: idCompanyInfo,
  zh: zhCNCompanyInfo,
  'zh-CN': zhCNCompanyInfo,
};

// forgotPassword
import type { ForgotPasswordLocale } from '@/app/dictionaries/forgotPassword/forgotPassword.d.ts';
import jaForgot from '@/app/dictionaries/forgotPassword/ja';
import enUSForgot from '@/app/dictionaries/forgotPassword/en-US';
import frForgot from '@/app/dictionaries/forgotPassword/fr';
import deForgot from '@/app/dictionaries/forgotPassword/de';
import koForgot from '@/app/dictionaries/forgotPassword/ko';
import esForgot from '@/app/dictionaries/forgotPassword/es';
import ptForgot from '@/app/dictionaries/forgotPassword/pt';
import idForgot from '@/app/dictionaries/forgotPassword/id';
import zhCNForgot from '@/app/dictionaries/forgotPassword/zh-CN';

export const forgotPasswordDictionaries = {
  ja: jaForgot,
  en: enUSForgot,
  'en-US': enUSForgot,
  fr: frForgot,
  de: deForgot,
  ko: koForgot,
  es: esForgot,
  pt: ptForgot,
  id: idForgot,
  zh: zhCNForgot,
  'zh-CN': zhCNForgot,
};

// home
import type HomeLocale from '@/app/dictionaries/home/Homelocale';
import jaHome from '@/app/dictionaries/home/ja';
import enUSHome from '@/app/dictionaries/home/en-US';
import frHome from '@/app/dictionaries/home/fr';
import deHome from '@/app/dictionaries/home/de';
import koHome from '@/app/dictionaries/home/ko';
import esHome from '@/app/dictionaries/home/es';
import ptHome from '@/app/dictionaries/home/pt';
import idHome from '@/app/dictionaries/home/id';
import zhCNHome from '@/app/dictionaries/home/zh-CN';

export const homeDictionaries = {
  ja: jaHome,
  en: enUSHome,
  'en-US': enUSHome,
  fr: frHome,
  de: deHome,
  ko: koHome,
  es: esHome,
  pt: ptHome,
  id: idHome,
  zh: zhCNHome,
  'zh-CN': zhCNHome,
};

// signIn
import type { SignInLocale } from '@/app/dictionaries/signIn/signIn.d.ts';
import jaSignIn from '@/app/dictionaries/signIn/ja';
import enUSSignIn from '@/app/dictionaries/signIn/en-US';
import frSignIn from '@/app/dictionaries/signIn/fr';
import deSignIn from '@/app/dictionaries/signIn/de';
import koSignIn from '@/app/dictionaries/signIn/ko';
import esSignIn from '@/app/dictionaries/signIn/es';
import ptSignIn from '@/app/dictionaries/signIn/pt';
import idSignIn from '@/app/dictionaries/signIn/id';
import zhCNSignIn from '@/app/dictionaries/signIn/zh-CN';

export const signInDictionaries = {
  ja: jaSignIn,
  en: enUSSignIn,
  'en-US': enUSSignIn,
  fr: frSignIn,
  de: deSignIn,
  ko: koSignIn,
  es: esSignIn,
  pt: ptSignIn,
  id: idSignIn,
  zh: zhCNSignIn,
  'zh-CN': zhCNSignIn,
};

// SupportCenterDetail
import type { SupportCenterDetailLocale } from '@/app/dictionaries/SupportCenterDetail/supportCenterDetail.d.ts';
import jaSCD from '@/app/dictionaries/SupportCenterDetail/ja';
import enUSSCD from '@/app/dictionaries/SupportCenterDetail/en-US';
import frSCD from '@/app/dictionaries/SupportCenterDetail/fr';
import deSCD from '@/app/dictionaries/SupportCenterDetail/de';
import koSCD from '@/app/dictionaries/SupportCenterDetail/ko';
import idSCD from '@/app/dictionaries/SupportCenterDetail/id';
import ptSCD from '@/app/dictionaries/SupportCenterDetail/pt';
import zhCNSCD from '@/app/dictionaries/SupportCenterDetail/zh-CN';

export const supportCenterDetailDictionaries = {
  ja: jaSCD,
  en: enUSSCD,
  'en-US': enUSSCD,
  es: enUSSCD,
  fr: frSCD,
  de: deSCD,
  ko: koSCD,
  id: idSCD,
  pt: ptSCD,
  zh: zhCNSCD,
  'zh-CN': zhCNSCD,
};


// pricing
import type { PricingLocale } from '@/app/dictionaries/pricing/pricing.d.ts';
import jaPricing from '@/app/dictionaries/pricing/ja';
import enUSPricing from '@/app/dictionaries/pricing/en-US';
import frPricing from '@/app/dictionaries/pricing/fr';
import dePricing from '@/app/dictionaries/pricing/de';
import koPricing from '@/app/dictionaries/pricing/ko';
import esPricing from '@/app/dictionaries/pricing/es';
import ptPricing from '@/app/dictionaries/pricing/pt';
import idPricing from '@/app/dictionaries/pricing/id';
import zhCNPricing from '@/app/dictionaries/pricing/zh-CN';

export const pricingDictionaries = {
  ja: jaPricing,
  en: enUSPricing,
  'en-US': enUSPricing,
  fr: frPricing,
  de: dePricing,
  ko: koPricing,
  es: esPricing,
  pt: ptPricing,
  id: idPricing,
  zh: zhCNPricing,
  'zh-CN': zhCNPricing,
};


// flow
import type { FlowLocale } from '@/app/dictionaries/flow/flow.d.ts';
import jaFlow from '@/app/dictionaries/flow/ja';
import enUSFlow from '@/app/dictionaries/flow/en-US';
import frFlow from '@/app/dictionaries/flow/fr';
import deFlow from '@/app/dictionaries/flow/de';
import esFlow from '@/app/dictionaries/flow/es';
import ptFlow from '@/app/dictionaries/flow/pt';
import idFlow from '@/app/dictionaries/flow/id';
import koFlow from '@/app/dictionaries/flow/ko';
import zhCNFlow from '@/app/dictionaries/flow/zh-CN';

export const flowDictionaries = {
  ja: jaFlow,
  en: enUSFlow,
  'en-US': enUSFlow,
  fr: frFlow,
  de: deFlow,
  es: esFlow,
  pt: ptFlow,
  id: idFlow,
  ko: koFlow,
  zh: zhCNFlow,
  'zh-CN': zhCNFlow,
};


// common (NavigationBar, Footer)
import type { CommonLocale } from '@/app/dictionaries/common/common.d.ts';
import jaCommon from '@/app/dictionaries/common/ja';
import enUSCommon from '@/app/dictionaries/common/en-US';
import frCommon from '@/app/dictionaries/common/fr';
import deCommon from '@/app/dictionaries/common/de';
import koCommon from '@/app/dictionaries/common/ko';
import esCommon from '@/app/dictionaries/common/es';
import ptCommon from '@/app/dictionaries/common/pt';
import idCommon from '@/app/dictionaries/common/id';
import zhCNCommon from '@/app/dictionaries/common/zh-CN';

export const commonDictionaries = {
  ja: jaCommon,
  en: enUSCommon,
  'en-US': enUSCommon,
  fr: frCommon,
  de: deCommon,
  ko: koCommon,
  es: esCommon,
  pt: ptCommon,
  id: idCommon,
  zh: zhCNCommon,
  'zh-CN': zhCNCommon,
};


// ===============================
// Terms of Service / Privacy Policy
// ===============================

// Terms (利用規約)
import type TermsLocale from '@/app/dictionaries/terms/TermsLocale.d.ts';
import jaTerms from '@/app/dictionaries/terms/ja';
import enTerms from '@/app/dictionaries/terms/en';
import esTerms from '@/app/dictionaries/terms/es';
import frTerms from '@/app/dictionaries/terms/fr';
import deTerms from '@/app/dictionaries/terms/de';
import koTerms from '@/app/dictionaries/terms/ko';
import idTerms from '@/app/dictionaries/terms/id';
import ptTerms from '@/app/dictionaries/terms/pt';
import zhCNTerms from '@/app/dictionaries/terms/zh-CN';

export const termsDictionaries = {
  ja: jaTerms,
  en: enTerms,
  'en-US': enTerms,
  es: esTerms,
  fr: frTerms,
  de: deTerms,
  ko: koTerms,
  id: idTerms,
  pt: ptTerms,
  zh: zhCNTerms,
  'zh-CN': zhCNTerms,
};

// Privacy (プライバシーポリシー)
import type PrivacyLocale from '@/app/dictionaries/privacy/PrivacyLocale.d.ts';
import jaPrivacy from '@/app/dictionaries/privacy/ja';
import enPrivacy from '@/app/dictionaries/privacy/en';
import esPrivacy from '@/app/dictionaries/privacy/es';
import frPrivacy from '@/app/dictionaries/privacy/fr';
import dePrivacy from '@/app/dictionaries/privacy/de';
import koPrivacy from '@/app/dictionaries/privacy/ko';
import idPrivacy from '@/app/dictionaries/privacy/id';
import ptPrivacy from '@/app/dictionaries/privacy/pt';
import zhCNPrivacy from '@/app/dictionaries/privacy/zh-CN';

export const privacyDictionaries = {
  ja: jaPrivacy,
  en: enPrivacy,
  'en-US': enPrivacy,
  es: esPrivacy,
  fr: frPrivacy,
  de: dePrivacy,
  ko: koPrivacy,
  id: idPrivacy,
  pt: ptPrivacy,
  zh: zhCNPrivacy,
  'zh-CN': zhCNPrivacy,
};

// Announcement (お知らせ)
import type { AnnouncementLocale } from '@/app/dictionaries/announcement/announcement';
import jaAnnouncement from '@/app/dictionaries/announcement/ja';
import enAnnouncement from '@/app/dictionaries/announcement/en';
import esAnnouncement from '@/app/dictionaries/announcement/es';
import frAnnouncement from '@/app/dictionaries/announcement/fr';
import deAnnouncement from '@/app/dictionaries/announcement/de';
import koAnnouncement from '@/app/dictionaries/announcement/ko';
import idAnnouncement from '@/app/dictionaries/announcement/id';
import ptAnnouncement from '@/app/dictionaries/announcement/pt';
import zhAnnouncement from '@/app/dictionaries/announcement/zh';

export const announcementDictionaries = {
  ja: jaAnnouncement,
  en: enAnnouncement,
  'en-US': enAnnouncement,
  es: esAnnouncement,
  fr: frAnnouncement,
  de: deAnnouncement,
  ko: koAnnouncement,
  id: idAnnouncement,
  pt: ptAnnouncement,
  zh: zhAnnouncement,
  'zh-CN': zhAnnouncement,
};

// Legal Disclosures (特定商取引法に基づく表記)
import type LegalDisclosuresLocale from '@/app/dictionaries/legalDisclosures/legalDisclosures.d.ts';
import jaLegalDisclosures from '@/app/dictionaries/legalDisclosures/ja';
import enUSLegalDisclosures from '@/app/dictionaries/legalDisclosures/en-US';
import deLegalDisclosures from '@/app/dictionaries/legalDisclosures/de';
import frLegalDisclosures from '@/app/dictionaries/legalDisclosures/fr';
import koLegalDisclosures from '@/app/dictionaries/legalDisclosures/ko';
import esLegalDisclosures from '@/app/dictionaries/legalDisclosures/es';
import ptLegalDisclosures from '@/app/dictionaries/legalDisclosures/pt';
import idLegalDisclosures from '@/app/dictionaries/legalDisclosures/id';
import zhCNLegalDisclosures from '@/app/dictionaries/legalDisclosures/zh-CN';

export const legalDisclosuresDictionaries = {
  ja: jaLegalDisclosures,
  en: enUSLegalDisclosures,
  'en-US': enUSLegalDisclosures,
  es: esLegalDisclosures,
  fr: frLegalDisclosures,
  de: deLegalDisclosures,
  ko: koLegalDisclosures,
  id: idLegalDisclosures,
  pt: ptLegalDisclosures,
  zh: zhCNLegalDisclosures,
  'zh-CN': zhCNLegalDisclosures,
};