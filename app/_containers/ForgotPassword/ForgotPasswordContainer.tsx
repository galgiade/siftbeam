import ForgotPasswordPresentation from "./ForgotPasswordPresentation";
import { forgotPasswordDictionaries, pickDictionary } from '@/app/dictionaries/mappings';

interface ForgotPasswordContainerProps {
  locale: string;
}

export default function ForgotPasswordContainer({ locale }: ForgotPasswordContainerProps) {
  const dictionary = pickDictionary(forgotPasswordDictionaries, locale, 'en');
  
  return (
    <ForgotPasswordPresentation 
      locale={locale}
      dictionary={dictionary}
    />
  );
}
