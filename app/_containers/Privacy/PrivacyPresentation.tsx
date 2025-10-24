"use client";

import type { StrictPrivacyLocale } from '@/app/dictionaries/privacy/PrivacyLocale.d.ts';
import React from 'react'

export default function PrivacyPresentation({ dictionary }: { dictionary: StrictPrivacyLocale }) {
  const { title, intro, sections, annexes, appendix } = dictionary
  const sectionsContent = sections
  const annexesContent = annexes

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="mt-2 text-sm text-foreground/80">{intro}</p>

      {/* Sections */}
      <section className="mt-8 space-y-8">
        {/* definitions */}
        <article>
          <h2 className="text-xl font-semibold">{sectionsContent.definitions.title}</h2>
          <ul className="mt-2 list-disc ps-6 space-y-1">
            {sectionsContent.definitions.items.map((definitionItem: string, definitionIndex: number) => (
              <li key={definitionIndex}>{definitionItem}</li>
            ))}
          </ul>
        </article>

        {/* company */}
        <article>
          <h2 className="text-xl font-semibold">{sectionsContent.company.title}</h2>
          <ul className="mt-2 list-disc ps-6 space-y-1">
            {sectionsContent.company.items.map((companyItem: string, companyItemIndex: number) => (
              <li key={companyItemIndex}>{companyItem}</li>
            ))}
          </ul>
        </article>

        {/* dataCollected */}
        <article>
          <h2 className="text-xl font-semibold">{sectionsContent.dataCollected.title}</h2>
          <ul className="mt-2 list-disc ps-6 space-y-1">
            {sectionsContent.dataCollected.items.map((dataCollectedItem: string, dataCollectedIndex: number) => (
              <li key={dataCollectedIndex}>{dataCollectedItem}</li>
            ))}
          </ul>
        </article>

        {/* purposes */}
        <article>
          <h2 className="text-xl font-semibold">{sectionsContent.purposes.title}</h2>
          <ul className="mt-2 list-disc ps-6 space-y-1">
            {sectionsContent.purposes.items.map((purposeItem: string, purposeIndex: number) => (
              <li key={purposeIndex}>{purposeItem}</li>
            ))}
          </ul>
        </article>

        {/* storageDeletion */}
        <article>
          <h2 className="text-xl font-semibold">{sectionsContent.storageDeletion.title}</h2>
          {sectionsContent.storageDeletion.paragraphs.map((paragraphText: string, paragraphIndex: number) => (
            <p key={paragraphIndex} className="mt-2">{paragraphText}</p>
          ))}
        </article>

        {/* thirdParties */}
        <article>
          <h2 className="text-xl font-semibold">{sectionsContent.thirdParties.title}</h2>
          <ul className="mt-2 list-disc ps-6 space-y-1">
            {sectionsContent.thirdParties.items.map((thirdPartyItem: string, thirdPartyIndex: number) => (
              <li key={thirdPartyIndex}>{thirdPartyItem}</li>
            ))}
          </ul>
          {(sectionsContent.thirdParties.paragraphs || []).map((paragraphText: string, paragraphIndex: number) => (
            <p key={paragraphIndex} className="mt-2">{paragraphText}</p>
          ))}
        </article>

        {/* learningOptOut */}
        <article>
          <h2 className="text-xl font-semibold">{sectionsContent.learningOptOut.title}</h2>
          <ul className="mt-2 list-disc ps-6 space-y-1">
            {sectionsContent.learningOptOut.items.map((learningOptOutItem: string, learningOptOutIndex: number) => (
              <li key={learningOptOutIndex}>{learningOptOutItem}</li>
            ))}
          </ul>
        </article>

        {/* security */}
        <article>
          <h2 className="text-xl font-semibold">{sectionsContent.security.title}</h2>
          <ul className="mt-2 list-disc ps-6 space-y-1">
            {sectionsContent.security.items.map((securityItem: string, securityIndex: number) => (
              <li key={securityIndex}>{securityItem}</li>
            ))}
          </ul>
        </article>

        {/* userRights */}
        <article>
          <h2 className="text-xl font-semibold">{sectionsContent.userRights.title}</h2>
          {sectionsContent.userRights.paragraphs.map((paragraphText: string, paragraphIndex: number) => (
            <p key={paragraphIndex} className="mt-2">{paragraphText}</p>
          ))}
        </article>

        {/* legalBasisAndRoles */}
        <article>
          <h2 className="text-xl font-semibold">{sectionsContent.legalBasisAndRoles.title}</h2>
          <ul className="mt-2 list-disc ps-6 space-y-1">
            {sectionsContent.legalBasisAndRoles.items.map((legalItem: string, legalItemIndex: number) => (
              <li key={legalItemIndex}>{legalItem}</li>
            ))}
          </ul>
        </article>

        {/* cookies */}
        <article>
          <h2 className="text-xl font-semibold">{sectionsContent.cookies.title}</h2>
          {sectionsContent.cookies.paragraphs.map((paragraphText: string, paragraphIndex: number) => (
            <p key={paragraphIndex} className="mt-2">{paragraphText}</p>
          ))}
        </article>

        {/* minors */}
        <article>
          <h2 className="text-xl font-semibold">{sectionsContent.minors.title}</h2>
          {sectionsContent.minors.paragraphs.map((paragraphText: string, paragraphIndex: number) => (
            <p key={paragraphIndex} className="mt-2">{paragraphText}</p>
          ))}
        </article>

        {/* policyChanges */}
        <article>
          <h2 className="text-xl font-semibold">{sectionsContent.policyChanges.title}</h2>
          {sectionsContent.policyChanges.paragraphs.map((paragraphText: string, paragraphIndex: number) => (
            <p key={paragraphIndex} className="mt-2">{paragraphText}</p>
          ))}
        </article>

        {/* contact */}
        <article>
          <h2 className="text-xl font-semibold">{sectionsContent.contact.title}</h2>
          {sectionsContent.contact.paragraphs.map((paragraphText: string, paragraphIndex: number) => (
            <p key={paragraphIndex} className="mt-2">{paragraphText}</p>
          ))}
        </article>
      </section>

      {/* Annexes */}
      <section className="mt-10 space-y-8">
        <h2 className="text-xl font-semibold">{annexesContent.annexA_DPA.title}</h2>
        {Object.values(annexesContent.annexA_DPA.subsections).map((subsection: { title: string; items?: string[]; paragraphs?: string[] }, subsectionIndex: number) => (
          <article key={subsectionIndex} className="mt-2">
            <h3 className="font-medium">{subsection.title}</h3>
            {(subsection.items || []).length > 0 && (
              <ul className="mt-1 list-disc ps-6 space-y-1">
                {(subsection.items || []).map((annexItemText: string, annexItemIndex: number) => (
                  <li key={annexItemIndex}>{annexItemText}</li>
                ))}
              </ul>
            )}
            {(subsection.paragraphs || []).map((annexParagraphText: string, annexParagraphIndex: number) => (
              <p key={annexParagraphIndex} className="mt-1">{annexParagraphText}</p>
            ))}
          </article>
        ))}

        <h2 className="text-xl font-semibold mt-8">{annexesContent.annexB_InternationalTransfer.title}</h2>
        {Object.values(annexesContent.annexB_InternationalTransfer.subsections).map((subsection: { title: string; items?: string[]; paragraphs?: string[] }, subsectionIndex: number) => (
          <article key={subsectionIndex} className="mt-2">
            <h3 className="font-medium">{subsection.title}</h3>
            {(subsection.items || []).length > 0 && (
              <ul className="mt-1 list-disc ps-6 space-y-1">
                {(subsection.items || []).map((annexItemText: string, annexItemIndex: number) => (
                  <li key={annexItemIndex}>{annexItemText}</li>
                ))}
              </ul>
            )}
            {(subsection.paragraphs || []).map((annexParagraphText: string, annexParagraphIndex: number) => (
              <p key={annexParagraphIndex} className="mt-1">{annexParagraphText}</p>
            ))}
          </article>
        ))}

        <h2 className="text-xl font-semibold mt-8">{annexesContent.annexC_USStateLaw.title}</h2>
        {Object.values(annexesContent.annexC_USStateLaw.subsections).map((subsection: { title: string; items?: string[]; paragraphs?: string[] }, subsectionIndex: number) => (
          <article key={subsectionIndex} className="mt-2">
            <h3 className="font-medium">{subsection.title}</h3>
            {(subsection.items || []).length > 0 && (
              <ul className="mt-1 list-disc ps-6 space-y-1">
                {(subsection.items || []).map((annexItemText: string, annexItemIndex: number) => (
                  <li key={annexItemIndex}>{annexItemText}</li>
                ))}
              </ul>
            )}
            {(subsection.paragraphs || []).map((annexParagraphText: string, annexParagraphIndex: number) => (
              <p key={annexParagraphIndex} className="mt-1">{annexParagraphText}</p>
            ))}
          </article>
        ))}
      </section>

      {/* Appendix */}
      <footer className="mt-10 border-t pt-6 text-sm text-foreground/80">
        <div className="mt-1">{appendix.lastUpdated}</div>
        <div className="mt-1">{appendix.company.name}</div>
        <div className="mt-1">{appendix.company.address}</div>
        <div className="mt-1">{appendix.company.representative}</div>
        <div className="mt-1">{appendix.company.contact}</div>
      </footer>
    </div>
  )
}
