import type { CommonLocale } from '@/app/dictionaries/common/common.d.ts';
import Link from 'next/link';

type FooterProps = {
  dictionary: CommonLocale['common']['footer'];
  locale: string;
};

export default function Footer({ dictionary, locale }: FooterProps) {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto py-4 text-center">
        <h3 className="text-xl font-bold mb-4">{dictionary.title}</h3>
        <p>{dictionary.description}</p>
        <div className="mt-3 flex items-center justify-center gap-6 text-sm">
          <Link href={`/${locale}/terms`} className="hover:underline" aria-label={dictionary.links.terms}>
            {dictionary.links.terms}
          </Link>
          <span className="opacity-50">|</span>
          <Link href={`/${locale}/privacy`} className="hover:underline" aria-label={dictionary.links.privacy}>
            {dictionary.links.privacy}
          </Link>
          <span className="opacity-50">|</span>
          <Link href={`/${locale}/legal-disclosures`} className="hover:underline" aria-label={dictionary.links.legalDisclosures}>
            {dictionary.links.legalDisclosures}
          </Link>
        </div>
        <p>{dictionary.copyright}</p>
      </div>
    </footer>
  );
}