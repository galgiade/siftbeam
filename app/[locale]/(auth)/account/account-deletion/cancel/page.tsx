import AccountDeletionCancelContainer from "@/app/_containers/AccountDeletion/cancel/AccountDeletionContainer";

interface PageProps {
  params: {
    locale: string;
  };
}

export default function AccountDeletionCancelPage({ params: { locale } }: PageProps) {
  return <AccountDeletionCancelContainer locale={locale} />;
}
