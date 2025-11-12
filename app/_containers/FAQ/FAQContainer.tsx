import { faqDictionaries, pickDictionary } from '@/app/dictionaries/mappings'
import FAQPresentation from './FAQPresentation'

export default async function FAQContainer({
  params
}: {
  params: { locale: string }
}) {
  const locale = params.locale
  const dictionary = pickDictionary(faqDictionaries, locale, 'en-US')

  return <FAQPresentation locale={locale} dictionary={dictionary} />
}

