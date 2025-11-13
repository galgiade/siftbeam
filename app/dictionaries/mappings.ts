// 辞書の集約マッピング
// 各機能ごとのロケール→辞書の対応を一本化し、
// 'en' と 'en-US'、'zh' と 'zh-CN' などのエイリアスも吸収します。

// newOrder
import jaNewOrder from '@/app/dictionaries/newOrder/ja';
import enNewOrder from '@/app/dictionaries/newOrder/en';
import frNewOrder from '@/app/dictionaries/newOrder/fr';
import deNewOrder from '@/app/dictionaries/newOrder/de';
import koNewOrder from '@/app/dictionaries/newOrder/ko';
import idNewOrder from '@/app/dictionaries/newOrder/id';
import zhNewOrder from '@/app/dictionaries/newOrder/zh';
import ptNewOrder from '@/app/dictionaries/newOrder/pt';
import esNewOrder from '@/app/dictionaries/newOrder/es';

// usageLimit
import jaUsageLimit from '@/app/dictionaries/usageLimit/ja';
import enUsageLimit from '@/app/dictionaries/usageLimit/en';
import frUsageLimit from '@/app/dictionaries/usageLimit/fr';
import deUsageLimit from '@/app/dictionaries/usageLimit/de';
import koUsageLimit from '@/app/dictionaries/usageLimit/ko';
import idUsageLimit from '@/app/dictionaries/usageLimit/id';
import zhUsageLimit from '@/app/dictionaries/usageLimit/zh';
import ptUsageLimit from '@/app/dictionaries/usageLimit/pt';
import esUsageLimit from '@/app/dictionaries/usageLimit/es';

// service (旧storage/usageHistoryを統合)
import jaService from '@/app/dictionaries/service/ja';
import enService from '@/app/dictionaries/service/en';
import frService from '@/app/dictionaries/service/fr';
import deService from '@/app/dictionaries/service/de';
import koService from '@/app/dictionaries/service/ko';
import idService from '@/app/dictionaries/service/id';
import zhService from '@/app/dictionaries/service/zh';
import ptService from '@/app/dictionaries/service/pt';
import esService from '@/app/dictionaries/service/es';

export const serviceDictionaries = {
  ja: jaService,
  en: enService,
  'en-US': enService,
  es: esService,
  fr: frService,
  de: deService,
  ko: koService,
  id: idService,
  pt: ptService,
  zh: zhService,
  'zh-CN': zhService,
};

// 旧storageとusageHistoryのエイリアス(後方互換性のため)
export const storageDictionaries = serviceDictionaries;
export const usageHistoryDictionaries = serviceDictionaries;

// createSupportCenter
import jaSupport from '@/app/dictionaries/createSupportCenter/ja';
import enSupport from '@/app/dictionaries/createSupportCenter/en';
import frSupport from '@/app/dictionaries/createSupportCenter/fr';
import deSupport from '@/app/dictionaries/createSupportCenter/de';
import koSupport from '@/app/dictionaries/createSupportCenter/ko';
import idSupport from '@/app/dictionaries/createSupportCenter/id';
import zhSupport from '@/app/dictionaries/createSupportCenter/zh';
import ptSupport from '@/app/dictionaries/createSupportCenter/pt';
import esSupport from '@/app/dictionaries/createSupportCenter/es';

// group-management
import jaGroup from '@/app/dictionaries/group-management/ja';
import enGroup from '@/app/dictionaries/group-management/en';
import frGroup from '@/app/dictionaries/group-management/fr';
import deGroup from '@/app/dictionaries/group-management/de';
import koGroup from '@/app/dictionaries/group-management/ko';
import idGroup from '@/app/dictionaries/group-management/id';
import zhGroup from '@/app/dictionaries/group-management/zh';
import ptGroup from '@/app/dictionaries/group-management/pt';
import esGroup from '@/app/dictionaries/group-management/es';

// auditLog
import jaAudit from '@/app/dictionaries/auditLog/ja';
import enAudit from '@/app/dictionaries/auditLog/en';
import frAudit from '@/app/dictionaries/auditLog/fr';
import deAudit from '@/app/dictionaries/auditLog/de';
import koAudit from '@/app/dictionaries/auditLog/ko';
import idAudit from '@/app/dictionaries/auditLog/id';
import zhAudit from '@/app/dictionaries/auditLog/zh';
import ptAudit from '@/app/dictionaries/auditLog/pt';
import esAudit from '@/app/dictionaries/auditLog/es';

// 各機能のマッピング（エイリアス含む）
export const newOrderDictionaries = {
  ja: jaNewOrder,
  en: enNewOrder,
  'en-US': enNewOrder,
  es: esNewOrder,
  fr: frNewOrder,
  de: deNewOrder,
  ko: koNewOrder,
  id: idNewOrder,
  pt: ptNewOrder,
  zh: zhNewOrder,
  'zh-CN': zhNewOrder,
};

export const usageLimitDictionaries = {
  ja: jaUsageLimit,
  en: enUsageLimit,
  'en-US': enUsageLimit,
  es: esUsageLimit,
  fr: frUsageLimit,
  de: deUsageLimit,
  ko: koUsageLimit,
  id: idUsageLimit,
  pt: ptUsageLimit,
  zh: zhUsageLimit,
  'zh-CN': zhUsageLimit,
};

export const createSupportCenterDictionaries = {
  ja: jaSupport,
  en: enSupport,
  'en-US': enSupport,
  es: esSupport,
  fr: frSupport,
  de: deSupport,
  ko: koSupport,
  id: idSupport,
  pt: ptSupport,
  zh: zhSupport,
  'zh-CN': zhSupport,
};

export const groupManagementDictionaries = {
  ja: jaGroup,
  en: enGroup,
  'en-US': enGroup,
  es: esGroup,
  fr: frGroup,
  de: deGroup,
  ko: koGroup,
  id: idGroup,
  pt: ptGroup,
  zh: zhGroup,
  'zh-CN': zhGroup,
};

export const auditLogDictionaries = {
  ja: jaAudit,
  en: enAudit,
  'en-US': enAudit,
  es: esAudit,
  fr: frAudit,
  de: deAudit,
  ko: koAudit,
  pt: ptAudit,
  id: idAudit,
  zh: zhAudit,
  'zh-CN': zhAudit,
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
import jaApiKey from '@/app/dictionaries/apiKey/ja';
import enApiKey from '@/app/dictionaries/apiKey/en';
import frApiKey from '@/app/dictionaries/apiKey/fr';
import deApiKey from '@/app/dictionaries/apiKey/de';
import koApiKey from '@/app/dictionaries/apiKey/ko';
import esApiKey from '@/app/dictionaries/apiKey/es';
import ptApiKey from '@/app/dictionaries/apiKey/pt';
import idApiKey from '@/app/dictionaries/apiKey/id';
import zhApiKey from '@/app/dictionaries/apiKey/zh';

export const apiKeyDictionaries = {
  ja: jaApiKey,
  en: enApiKey,
  'en-US': enApiKey,
  fr: frApiKey,
  de: deApiKey,
  ko: koApiKey,
  es: esApiKey,
  pt: ptApiKey,
  id: idApiKey,
  zh: zhApiKey,
  'zh-CN': zhApiKey,
};

// account (Account layout / SideNavigation)
import jaAccount from '@/app/dictionaries/account/ja';
import enAccount from '@/app/dictionaries/account/en';
import frAccount from '@/app/dictionaries/account/fr';
import deAccount from '@/app/dictionaries/account/de';
import koAccount from '@/app/dictionaries/account/ko';
import esAccount from '@/app/dictionaries/account/es';
import ptAccount from '@/app/dictionaries/account/pt';
import idAccount from '@/app/dictionaries/account/id';
import zhAccount from '@/app/dictionaries/account/zh';

export const accountDictionaries = {
  ja: jaAccount,
  en: enAccount,
  'en-US': enAccount,
  fr: frAccount,
  de: deAccount,
  ko: koAccount,
  es: esAccount,
  pt: ptAccount,
  id: idAccount,
  zh: zhAccount,
  'zh-CN': zhAccount,
};

// company (Invoices, UpdateCompanyInfo など)
import jaCompany from '@/app/dictionaries/company/ja';
import enCompany from '@/app/dictionaries/company/en';
import frCompany from '@/app/dictionaries/company/fr';
import deCompany from '@/app/dictionaries/company/de';
import koCompany from '@/app/dictionaries/company/ko';
import esCompany from '@/app/dictionaries/company/es';
import ptCompany from '@/app/dictionaries/company/pt';
import idCompany from '@/app/dictionaries/company/id';
import zhCompany from '@/app/dictionaries/company/zh';

export const companyDictionaries = {
  ja: jaCompany,
  en: enCompany,
  'en-US': enCompany,
  fr: frCompany,
  de: deCompany,
  ko: koCompany,
  es: esCompany,
  pt: ptCompany,
  id: idCompany,
  zh: zhCompany,
  'zh-CN': zhCompany,
};

// accountDeletion
import jaAccountDeletion from '@/app/dictionaries/account-deletion/ja';
import enAccountDeletion from '@/app/dictionaries/account-deletion/en';
import frAccountDeletion from '@/app/dictionaries/account-deletion/fr';
import deAccountDeletion from '@/app/dictionaries/account-deletion/de';
import idAccountDeletion from '@/app/dictionaries/account-deletion/id';
import zhAccountDeletion from '@/app/dictionaries/account-deletion/zh';
import esAccountDeletion from '@/app/dictionaries/account-deletion/es';
import ptAccountDeletion from '@/app/dictionaries/account-deletion/pt';
import koAccountDeletion from '@/app/dictionaries/account-deletion/ko';

export const accountDeletionDictionaries = {
  ja: jaAccountDeletion,
  en: enAccountDeletion,
  'en-US': enAccountDeletion,
  fr: frAccountDeletion,
  de: deAccountDeletion,
  id: idAccountDeletion,
  es: esAccountDeletion,
  pt: ptAccountDeletion,
  ko: koAccountDeletion,
  zh: zhAccountDeletion,
  'zh-CN': zhAccountDeletion,
};

// 後方互換性のためのエイリアス
export const deleteAccountDictionaries = accountDeletionDictionaries;

// cancelDeleteAccount
import jaCancelDelete from '@/app/dictionaries/cancelDeleteAccount/ja';
import enCancelDelete from '@/app/dictionaries/cancelDeleteAccount/en';
import frCancelDelete from '@/app/dictionaries/cancelDeleteAccount/fr';
import deCancelDelete from '@/app/dictionaries/cancelDeleteAccount/de';
import idCancelDelete from '@/app/dictionaries/cancelDeleteAccount/id';
import zhCancelDelete from '@/app/dictionaries/cancelDeleteAccount/zh';
import esCancelDelete from '@/app/dictionaries/cancelDeleteAccount/es';
import ptCancelDelete from '@/app/dictionaries/cancelDeleteAccount/pt';
import koCancelDelete from '@/app/dictionaries/cancelDeleteAccount/ko';

export const cancelDeleteAccountDictionaries = {
  ja: jaCancelDelete,
  en: enCancelDelete,
  'en-US': enCancelDelete,
  fr: frCancelDelete,
  de: deCancelDelete,
  id: idCancelDelete,
  es: esCancelDelete,
  pt: ptCancelDelete,
  ko: koCancelDelete,
  zh: zhCancelDelete,
  'zh-CN': zhCancelDelete,
};

// policy-management (PolicyManagement, Staff)
import jaPolicy from '@/app/dictionaries/policy-management/ja';
import enPolicy from '@/app/dictionaries/policy-management/en';
import frPolicy from '@/app/dictionaries/policy-management/fr';
import dePolicy from '@/app/dictionaries/policy-management/de';
import koPolicy from '@/app/dictionaries/policy-management/ko';
import idPolicy from '@/app/dictionaries/policy-management/id';
import zhPolicy from '@/app/dictionaries/policy-management/zh';
import esPolicy from '@/app/dictionaries/policy-management/es';
import ptPolicy from '@/app/dictionaries/policy-management/pt';

export const policyManagementDictionaries = {
  ja: jaPolicy,
  en: enPolicy,
  'en-US': enPolicy,
  fr: frPolicy,
  de: dePolicy,
  ko: koPolicy,
  id: idPolicy,
  es: esPolicy,
  pt: ptPolicy,
  zh: zhPolicy,
  'zh-CN': zhPolicy,
};

// user-management
import jaUserMgmt from '@/app/dictionaries/user-management/ja';
import enUserMgmt from '@/app/dictionaries/user-management/en';
import frUserMgmt from '@/app/dictionaries/user-management/fr';
import deUserMgmt from '@/app/dictionaries/user-management/de';
import koUserMgmt from '@/app/dictionaries/user-management/ko';
import idUserMgmt from '@/app/dictionaries/user-management/id';
import esUserMgmt from '@/app/dictionaries/user-management/es';
import ptUserMgmt from '@/app/dictionaries/user-management/pt';
import zhUserMgmt from '@/app/dictionaries/user-management/zh';

export const userManagementDictionaries = {
  ja: jaUserMgmt,
  en: enUserMgmt,
  'en-US': enUserMgmt,
  fr: frUserMgmt,
  de: deUserMgmt,
  ko: koUserMgmt,
  id: idUserMgmt,
  es: esUserMgmt,
  pt: ptUserMgmt,
  zh: zhUserMgmt,
  'zh-CN': zhUserMgmt,
};

// user (User Profile)
import jaUser from '@/app/dictionaries/user/ja';
import enUser from '@/app/dictionaries/user/en';
import frUser from '@/app/dictionaries/user/fr';
import deUser from '@/app/dictionaries/user/de';
import koUser from '@/app/dictionaries/user/ko';
import idUser from '@/app/dictionaries/user/id';
import esUser from '@/app/dictionaries/user/es';
import ptUser from '@/app/dictionaries/user/pt';
import zhUser from '@/app/dictionaries/user/zh';

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
  zh: zhUser,
  'zh-CN': zhUser,
};

// payment
import jaPayment from '@/app/dictionaries/payment/ja';
import enPayment from '@/app/dictionaries/payment/en';
import frPayment from '@/app/dictionaries/payment/fr';
import dePayment from '@/app/dictionaries/payment/de';
import koPayment from '@/app/dictionaries/payment/ko';
import esPayment from '@/app/dictionaries/payment/es';
import ptPayment from '@/app/dictionaries/payment/pt';
import idPayment from '@/app/dictionaries/payment/id';
import zhPayment from '@/app/dictionaries/payment/zh';

export const paymentDictionaries = {
  ja: jaPayment,
  en: enPayment,
  'en-US': enPayment,
  fr: frPayment,
  de: dePayment,
  ko: koPayment,
  es: esPayment,
  pt: ptPayment,
  id: idPayment,
  zh: zhPayment,
  'zh-CN': zhPayment,
};

// createPayment
import jaCreatePayment from '@/app/dictionaries/createPayment/ja';
import enCreatePayment from '@/app/dictionaries/createPayment/en';
import frCreatePayment from '@/app/dictionaries/createPayment/fr';
import deCreatePayment from '@/app/dictionaries/createPayment/de';
import koCreatePayment from '@/app/dictionaries/createPayment/ko';
import esCreatePayment from '@/app/dictionaries/createPayment/es';
import ptCreatePayment from '@/app/dictionaries/createPayment/pt';
import idCreatePayment from '@/app/dictionaries/createPayment/id';
import zhCreatePayment from '@/app/dictionaries/createPayment/zh';

export const createPaymentDictionaries = {
  ja: jaCreatePayment,
  en: enCreatePayment,
  'en-US': enCreatePayment,
  fr: frCreatePayment,
  de: deCreatePayment,
  ko: koCreatePayment,
  es: esCreatePayment,
  pt: ptCreatePayment,
  id: idCreatePayment,
  zh: zhCreatePayment,
  'zh-CN': zhCreatePayment,
};

// createAdmin
import type { CreateAdminLocale as CreateAdminLocale } from '@/app/dictionaries/createAdmin/createAdmin.d.ts';
import jaCreateAdmin from '@/app/dictionaries/createAdmin/ja';
import enCreateAdmin from '@/app/dictionaries/createAdmin/en';
import frCreateAdmin from '@/app/dictionaries/createAdmin/fr';
import deCreateAdmin from '@/app/dictionaries/createAdmin/de';
import koCreateAdmin from '@/app/dictionaries/createAdmin/ko';
import esCreateAdmin from '@/app/dictionaries/createAdmin/es';
import ptCreateAdmin from '@/app/dictionaries/createAdmin/pt';
import idCreateAdmin from '@/app/dictionaries/createAdmin/id';
import zhCreateAdmin from '@/app/dictionaries/createAdmin/zh';

export const createAdminDictionaries = {
  ja: jaCreateAdmin,
  en: enCreateAdmin,
  'en-US': enCreateAdmin,
  fr: frCreateAdmin,
  de: deCreateAdmin,
  ko: koCreateAdmin,
  es: esCreateAdmin,
  pt: ptCreateAdmin,
  id: idCreateAdmin,
  zh: zhCreateAdmin,
  'zh-CN': zhCreateAdmin,
};

// signUpAuth
import jaSignUpAuth from '@/app/dictionaries/signUpAuth/ja';
import enSignUpAuth from '@/app/dictionaries/signUpAuth/en';
import frSignUpAuth from '@/app/dictionaries/signUpAuth/fr';
import deSignUpAuth from '@/app/dictionaries/signUpAuth/de';
import koSignUpAuth from '@/app/dictionaries/signUpAuth/ko';
import esSignUpAuth from '@/app/dictionaries/signUpAuth/es';
import ptSignUpAuth from '@/app/dictionaries/signUpAuth/pt';
import idSignUpAuth from '@/app/dictionaries/signUpAuth/id';
import zhSignUpAuth from '@/app/dictionaries/signUpAuth/zh';

export const signUpAuthDictionaries = {
  ja: jaSignUpAuth,
  en: enSignUpAuth,
  'en-US': enSignUpAuth,
  fr: frSignUpAuth,
  de: deSignUpAuth,
  ko: koSignUpAuth,
  es: esSignUpAuth,
  pt: ptSignUpAuth,
  id: idSignUpAuth,
  zh: zhSignUpAuth,
  'zh-CN': zhSignUpAuth,
};

// createCompanyInfo
import jaCompanyInfo from '@/app/dictionaries/createCompanyInfo/ja';
import enCompanyInfo from '@/app/dictionaries/createCompanyInfo/en';
import frCompanyInfo from '@/app/dictionaries/createCompanyInfo/fr';
import deCompanyInfo from '@/app/dictionaries/createCompanyInfo/de';
import koCompanyInfo from '@/app/dictionaries/createCompanyInfo/ko';
import esCompanyInfo from '@/app/dictionaries/createCompanyInfo/es';
import ptCompanyInfo from '@/app/dictionaries/createCompanyInfo/pt';
import idCompanyInfo from '@/app/dictionaries/createCompanyInfo/id';
import zhCompanyInfo from '@/app/dictionaries/createCompanyInfo/zh';

export const createCompanyInfoDictionaries = {
  ja: jaCompanyInfo,
  en: enCompanyInfo,
  'en-US': enCompanyInfo,
  fr: frCompanyInfo,
  de: deCompanyInfo,
  ko: koCompanyInfo,
  es: esCompanyInfo,
  pt: ptCompanyInfo,
  id: idCompanyInfo,
  zh: zhCompanyInfo,
  'zh-CN': zhCompanyInfo,
};

// forgotPassword
import jaForgot from '@/app/dictionaries/forgotPassword/ja';
import enForgot from '@/app/dictionaries/forgotPassword/en';
import frForgot from '@/app/dictionaries/forgotPassword/fr';
import deForgot from '@/app/dictionaries/forgotPassword/de';
import koForgot from '@/app/dictionaries/forgotPassword/ko';
import esForgot from '@/app/dictionaries/forgotPassword/es';
import ptForgot from '@/app/dictionaries/forgotPassword/pt';
import idForgot from '@/app/dictionaries/forgotPassword/id';
import zhForgot from '@/app/dictionaries/forgotPassword/zh';

export const forgotPasswordDictionaries = {
  ja: jaForgot,
  en: enForgot,
  'en-US': enForgot,
  fr: frForgot,
  de: deForgot,
  ko: koForgot,
  es: esForgot,
  pt: ptForgot,
  id: idForgot,
  zh: zhForgot,
  'zh-CN': zhForgot,
};

// home
import jaHome from '@/app/dictionaries/home/ja';
import enHome from '@/app/dictionaries/home/en';
import frHome from '@/app/dictionaries/home/fr';
import deHome from '@/app/dictionaries/home/de';
import koHome from '@/app/dictionaries/home/ko';
import esHome from '@/app/dictionaries/home/es';
import ptHome from '@/app/dictionaries/home/pt';
import idHome from '@/app/dictionaries/home/id';
import zhHome from '@/app/dictionaries/home/zh';

export const homeDictionaries = {
  ja: jaHome,
  en: enHome,
  'en-US': enHome,
  fr: frHome,
  de: deHome,
  ko: koHome,
  es: esHome,
  pt: ptHome,
  id: idHome,
  zh: zhHome,
  'zh-CN': zhHome,
};

// signIn
import jaSignIn from '@/app/dictionaries/signIn/ja';
import enSignIn from '@/app/dictionaries/signIn/en';
import frSignIn from '@/app/dictionaries/signIn/fr';
import deSignIn from '@/app/dictionaries/signIn/de';
import koSignIn from '@/app/dictionaries/signIn/ko';
import esSignIn from '@/app/dictionaries/signIn/es';
import ptSignIn from '@/app/dictionaries/signIn/pt';
import idSignIn from '@/app/dictionaries/signIn/id';
import zhSignIn from '@/app/dictionaries/signIn/zh';

export const signInDictionaries = {
  ja: jaSignIn,
  en: enSignIn,
  'en-US': enSignIn,
  fr: frSignIn,
  de: deSignIn,
  ko: koSignIn,
  es: esSignIn,
  pt: ptSignIn,
  id: idSignIn,
  zh: zhSignIn,
  'zh-CN': zhSignIn,
};

// SupportCenter
import jaSupportCenter from '@/app/dictionaries/supportCenter/ja';
import enSupportCenter from '@/app/dictionaries/supportCenter/en';
import frSupportCenter from '@/app/dictionaries/supportCenter/fr';
import deSupportCenter from '@/app/dictionaries/supportCenter/de';
import koSupportCenter from '@/app/dictionaries/supportCenter/ko';
import idSupportCenter from '@/app/dictionaries/supportCenter/id';
import ptSupportCenter from '@/app/dictionaries/supportCenter/pt';
import esSupportCenter from '@/app/dictionaries/supportCenter/es';
import zhSupportCenter from '@/app/dictionaries/supportCenter/zh';

export const supportCenterDictionaries = {
  ja: jaSupportCenter,
  en: enSupportCenter,
  'en-US': enSupportCenter,
  es: esSupportCenter,
  fr: frSupportCenter,
  de: deSupportCenter,
  ko: koSupportCenter,
  id: idSupportCenter,
  pt: ptSupportCenter,
  zh: zhSupportCenter,
  'zh-CN': zhSupportCenter,
};


// pricing
import jaPricing from '@/app/dictionaries/pricing/ja';
import enPricing from '@/app/dictionaries/pricing/en';
import frPricing from '@/app/dictionaries/pricing/fr';
import dePricing from '@/app/dictionaries/pricing/de';
import koPricing from '@/app/dictionaries/pricing/ko';
import esPricing from '@/app/dictionaries/pricing/es';
import ptPricing from '@/app/dictionaries/pricing/pt';
import idPricing from '@/app/dictionaries/pricing/id';
import zhPricing from '@/app/dictionaries/pricing/zh';

export const pricingDictionaries = {
  ja: jaPricing,
  en: enPricing,
  'en-US': enPricing,
  fr: frPricing,
  de: dePricing,
  ko: koPricing,
  es: esPricing,
  pt: ptPricing,
  id: idPricing,
  zh: zhPricing,
  'zh-CN': zhPricing,
};


// flow
import jaFlow from '@/app/dictionaries/flow/ja';
import enFlow from '@/app/dictionaries/flow/en';
import frFlow from '@/app/dictionaries/flow/fr';
import deFlow from '@/app/dictionaries/flow/de';
import esFlow from '@/app/dictionaries/flow/es';
import ptFlow from '@/app/dictionaries/flow/pt';
import idFlow from '@/app/dictionaries/flow/id';
import koFlow from '@/app/dictionaries/flow/ko';
import zhFlow from '@/app/dictionaries/flow/zh';

export const flowDictionaries = {
  ja: jaFlow,
  en: enFlow,
  'en-US': enFlow,
  fr: frFlow,
  de: deFlow,
  es: esFlow,
  pt: ptFlow,
  id: idFlow,
  ko: koFlow,
  zh: zhFlow,
  'zh-CN': zhFlow,
};


// common (NavigationBar, Footer)
import jaCommon from '@/app/dictionaries/common/ja';
import enCommon from '@/app/dictionaries/common/en';
import frCommon from '@/app/dictionaries/common/fr';
import deCommon from '@/app/dictionaries/common/de';
import koCommon from '@/app/dictionaries/common/ko';
import esCommon from '@/app/dictionaries/common/es';
import ptCommon from '@/app/dictionaries/common/pt';
import idCommon from '@/app/dictionaries/common/id';
import zhCommon from '@/app/dictionaries/common/zh';

export const commonDictionaries = {
  ja: jaCommon,
  en: enCommon,
  'en-US': enCommon,
  fr: frCommon,
  de: deCommon,
  ko: koCommon,
  es: esCommon,
  pt: ptCommon,
  id: idCommon,
  zh: zhCommon,
  'zh-CN': zhCommon,
};


// ===============================
// Terms of Service / Privacy Policy
// ===============================

// Terms (利用規約)
import jaTerms from '@/app/dictionaries/terms/ja';
import enTerms from '@/app/dictionaries/terms/en';
import esTerms from '@/app/dictionaries/terms/es';
import frTerms from '@/app/dictionaries/terms/fr';
import deTerms from '@/app/dictionaries/terms/de';
import koTerms from '@/app/dictionaries/terms/ko';
import idTerms from '@/app/dictionaries/terms/id';
import ptTerms from '@/app/dictionaries/terms/pt';
import zhTerms from '@/app/dictionaries/terms/zh';

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
  zh: zhTerms,
  'zh-CN': zhTerms,
};

// Privacy (プライバシーポリシー)
import jaPrivacy from '@/app/dictionaries/privacy/ja';
import enPrivacy from '@/app/dictionaries/privacy/en';
import esPrivacy from '@/app/dictionaries/privacy/es';
import frPrivacy from '@/app/dictionaries/privacy/fr';
import dePrivacy from '@/app/dictionaries/privacy/de';
import koPrivacy from '@/app/dictionaries/privacy/ko';
import idPrivacy from '@/app/dictionaries/privacy/id';
import ptPrivacy from '@/app/dictionaries/privacy/pt';
import zhPrivacy from '@/app/dictionaries/privacy/zh';

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
  zh: zhPrivacy,
  'zh-CN': zhPrivacy,
};


// Legal Disclosures (特定商取引法に基づく表記)
import jaLegalDisclosures from '@/app/dictionaries/legalDisclosures/ja';
import enLegalDisclosures from '@/app/dictionaries/legalDisclosures/en';
import deLegalDisclosures from '@/app/dictionaries/legalDisclosures/de';
import frLegalDisclosures from '@/app/dictionaries/legalDisclosures/fr';
import koLegalDisclosures from '@/app/dictionaries/legalDisclosures/ko';
import esLegalDisclosures from '@/app/dictionaries/legalDisclosures/es';
import ptLegalDisclosures from '@/app/dictionaries/legalDisclosures/pt';
import idLegalDisclosures from '@/app/dictionaries/legalDisclosures/id';
import zhLegalDisclosures from '@/app/dictionaries/legalDisclosures/zh';

export const legalDisclosuresDictionaries = {
  ja: jaLegalDisclosures,
  en: enLegalDisclosures,
  'en-US': enLegalDisclosures,
  es: esLegalDisclosures,
  fr: frLegalDisclosures,
  de: deLegalDisclosures,
  ko: koLegalDisclosures,
  id: idLegalDisclosures,
  pt: ptLegalDisclosures,
  zh: zhLegalDisclosures,
  'zh-CN': zhLegalDisclosures,
};

// API (サーバーアクション用エラー・成功メッセージ)
import jaApi from '@/app/dictionaries/api/ja';
import enApi from '@/app/dictionaries/api/en';
import deApi from '@/app/dictionaries/api/de';
import frApi from '@/app/dictionaries/api/fr';
import koApi from '@/app/dictionaries/api/ko';
import esApi from '@/app/dictionaries/api/es';
import ptApi from '@/app/dictionaries/api/pt';
import idApi from '@/app/dictionaries/api/id';
import zhApi from '@/app/dictionaries/api/zh';

export const apiDictionaries = {
  ja: jaApi,
  en: enApi,
  'en-US': enApi,
  es: esApi,
  fr: frApi,
  de: deApi,
  ko: koApi,
  id: idApi,
  pt: ptApi,
  zh: zhApi,
  'zh-CN': zhApi,
};

// FAQ (よくある質問)
import jaFAQ from '@/app/dictionaries/faq/ja';
import enFAQ from '@/app/dictionaries/faq/en';
import zhFAQ from '@/app/dictionaries/faq/zh';
import koFAQ from '@/app/dictionaries/faq/ko';
import frFAQ from '@/app/dictionaries/faq/fr';
import deFAQ from '@/app/dictionaries/faq/de';
import esFAQ from '@/app/dictionaries/faq/es';
import ptFAQ from '@/app/dictionaries/faq/pt';
import idFAQ from '@/app/dictionaries/faq/id';

// Blog dictionaries
import blogJa from './blog/ja';
import blogEn from './blog/en';

export const faqDictionaries = {
  ja: jaFAQ,
  en: enFAQ,
  'en-US': enFAQ,
  es: esFAQ,
  fr: frFAQ,
  de: deFAQ,
  ko: koFAQ,
  id: idFAQ,
  pt: ptFAQ,
  zh: zhFAQ,
  'zh-CN': zhFAQ,
};

export const blogDictionaries = {
  ja: blogJa,
  'en-US': blogEn,
  'zh-CN': blogEn, // TODO: 中国語版を作成
  ko: blogEn, // TODO: 韓国語版を作成
  fr: blogEn, // TODO: フランス語版を作成
  de: blogEn, // TODO: ドイツ語版を作成
  es: blogEn, // TODO: スペイン語版を作成
  pt: blogEn, // TODO: ポルトガル語版を作成
  id: blogEn  // TODO: インドネシア語版を作成
};