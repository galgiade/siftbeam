"use client";

import type TermsLocale from '@/app/dictionaries/terms/TermsLocale.d.ts';
import React from 'react'

export default function TermsPresentation({ dictionary }: { dictionary: TermsLocale }) {
  const { title, intro, sections, appendix } = dictionary
  const sectionsContent = sections

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="mt-2 text-sm text-foreground/80">{intro}</p>

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

        {/* scopeChanges */}
        <article>
          <h2 className="text-xl font-semibold">{sectionsContent.scopeChanges.title}</h2>
          {sectionsContent.scopeChanges.paragraphs.map((paragraphText: string, paragraphIndex: number) => (
            <p key={paragraphIndex} className="mt-2">{paragraphText}</p>
          ))}
        </article>

        {/* account */}
        <article>
          <h2 className="text-xl font-semibold">{sectionsContent.account.title}</h2>
          <ul className="mt-2 list-disc ps-6 space-y-1">
            {sectionsContent.account.items.map((accountItem: string, accountIndex: number) => (
              <li key={accountIndex}>{accountItem}</li>
            ))}
          </ul>
        </article>

        {/* services */}
        <article>
          <h2 className="text-xl font-semibold">{sectionsContent.services.title}</h2>
          {sectionsContent.services.paragraphs.map((paragraphText: string, paragraphIndex: number) => (
            <p key={paragraphIndex} className="mt-2">{paragraphText}</p>
          ))}
        </article>

        {/* dataHandling */}
        <article>
          <h2 className="text-xl font-semibold">{sectionsContent.dataHandling.title}</h2>
          {/* ownership */}
          <h3 className="mt-4 font-medium">{sectionsContent.dataHandling.subsections.ownership.title}</h3>
          <ul className="mt-2 list-disc ps-6 space-y-1">
            {sectionsContent.dataHandling.subsections.ownership.items.map((ownershipItem: string, ownershipIndex: number) => (
              <li key={ownershipIndex}>{ownershipItem}</li>
            ))}
          </ul>
          {/* license */}
          <h3 className="mt-4 font-medium">{sectionsContent.dataHandling.subsections.license.title}</h3>
          {sectionsContent.dataHandling.subsections.license.paragraphs.map((paragraphText: string, paragraphIndex: number) => (
            <p key={paragraphIndex} className="mt-2">{paragraphText}</p>
          ))}
          {/* storageDeletion */}
          <h3 className="mt-4 font-medium">{sectionsContent.dataHandling.subsections.storageDeletion.title}</h3>
          {sectionsContent.dataHandling.subsections.storageDeletion.paragraphs.map((paragraphText: string, paragraphIndex: number) => (
            <p key={paragraphIndex} className="mt-2">{paragraphText}</p>
          ))}
          {/* incidents */}
          <h3 className="mt-4 font-medium">{sectionsContent.dataHandling.subsections.incidents.title}</h3>
          {sectionsContent.dataHandling.subsections.incidents.paragraphs.map((paragraphText: string, paragraphIndex: number) => (
            <p key={paragraphIndex} className="mt-2">{paragraphText}</p>
          ))}
          {/* learningOptOut */}
          <h3 className="mt-4 font-medium">{sectionsContent.dataHandling.subsections.learningOptOut.title}</h3>
          {sectionsContent.dataHandling.subsections.learningOptOut.paragraphs.map((paragraphText: string, paragraphIndex: number) => (
            <p key={paragraphIndex} className="mt-2">{paragraphText}</p>
          ))}
        </article>

        {/* privacy */}
        <article>
          <h2 className="text-xl font-semibold">{sectionsContent.privacy.title}</h2>
          {sectionsContent.privacy.paragraphs.map((paragraphText: string, paragraphIndex: number) => (
            <p key={paragraphIndex} className="mt-2">{paragraphText}</p>
          ))}
          <ul className="mt-2 list-disc ps-6 space-y-1">
            {sectionsContent.privacy.items.map((privacyItem: string, privacyIndex: number) => (
              <li key={privacyIndex}>{privacyItem}</li>
            ))}
          </ul>
        </article>

        {/* prohibited */}
        <article>
          <h2 className="text-xl font-semibold">{sectionsContent.prohibited.title}</h2>
          <ul className="mt-2 list-disc ps-6 space-y-1">
            {sectionsContent.prohibited.items.map((prohibitedItem: string, prohibitedIndex: number) => (
              <li key={prohibitedIndex}>{prohibitedItem}</li>
            ))}
          </ul>
        </article>

        {/* serviceChange */}
        <article>
          <h2 className="text-xl font-semibold">{sectionsContent.serviceChange.title}</h2>
          {sectionsContent.serviceChange.paragraphs.map((paragraphText: string, paragraphIndex: number) => (
            <p key={paragraphIndex} className="mt-2">{paragraphText}</p>
          ))}
        </article>

        {/* fees */}
        <article>
          <h2 className="text-xl font-semibold">{sectionsContent.fees.title}</h2>
          {/* currencyUnit */}
          <h3 className="mt-4 font-medium">{sectionsContent.fees.subsections.currencyUnit.title}</h3>
          <ul className="mt-2 list-disc ps-6 space-y-1">
            {sectionsContent.fees.subsections.currencyUnit.items.map((currencyUnitItem: string, currencyUnitIndex: number) => (
              <li key={currencyUnitIndex}>{currencyUnitItem}</li>
            ))}
          </ul>
          {/* unitPrices */}
          <h3 className="mt-4 font-medium">{sectionsContent.fees.subsections.unitPrices.title}</h3>
          <ul className="mt-2 list-disc ps-6 space-y-1">
            {sectionsContent.fees.subsections.unitPrices.items.map((unitPriceItem: string, unitPriceIndex: number) => (
              <li key={unitPriceIndex}>{unitPriceItem}</li>
            ))}
          </ul>
          {/* measurementMethod */}
          <h3 className="mt-4 font-medium">{sectionsContent.fees.subsections.measurementMethod.title}</h3>
          <ul className="mt-2 list-disc ps-6 space-y-1">
            {sectionsContent.fees.subsections.measurementMethod.items.map((measurementMethodItem: string, measurementMethodIndex: number) => (
              <li key={measurementMethodIndex}>{measurementMethodItem}</li>
            ))}
          </ul>
          {/* billingPayment */}
          <h3 className="mt-4 font-medium">{sectionsContent.fees.subsections.billingPayment.title}</h3>
          <ul className="mt-2 list-disc ps-6 space-y-1">
            {sectionsContent.fees.subsections.billingPayment.items.map((billingPaymentItem: string, billingPaymentIndex: number) => (
              <li key={billingPaymentIndex}>{billingPaymentItem}</li>
            ))}
          </ul>
          {/* priceChange */}
          <h3 className="mt-4 font-medium">{sectionsContent.fees.subsections.priceChange.title}</h3>
          {sectionsContent.fees.subsections.priceChange.paragraphs.map((paragraphText: string, paragraphIndex: number) => (
            <p key={paragraphIndex} className="mt-2">{paragraphText}</p>
          ))}
        </article>

        {/* ipAndDeliverables */}
        <article>
          <h2 className="text-xl font-semibold">{sectionsContent.ipAndDeliverables.title}</h2>
          {sectionsContent.ipAndDeliverables.paragraphs.map((paragraphText: string, paragraphIndex: number) => (
            <p key={paragraphIndex} className="mt-2">{paragraphText}</p>
          ))}
        </article>

        {/* representations */}
        <article>
          <h2 className="text-xl font-semibold">{sectionsContent.representations.title}</h2>
          {sectionsContent.representations.paragraphs.map((paragraphText: string, paragraphIndex: number) => (
            <p key={paragraphIndex} className="mt-2">{paragraphText}</p>
          ))}
        </article>

        {/* disclaimer */}
        <article>
          <h2 className="text-xl font-semibold">{sectionsContent.disclaimer.title}</h2>
          {sectionsContent.disclaimer.paragraphs.map((paragraphText: string, paragraphIndex: number) => (
            <p key={paragraphIndex} className="mt-2">{paragraphText}</p>
          ))}
        </article>

        {/* liabilityLimit */}
        <article>
          <h2 className="text-xl font-semibold">{sectionsContent.liabilityLimit.title}</h2>
          {sectionsContent.liabilityLimit.paragraphs.map((paragraphText: string, paragraphIndex: number) => (
            <p key={paragraphIndex} className="mt-2">{paragraphText}</p>
          ))}
        </article>

        {/* thirdParty */}
        <article>
          <h2 className="text-xl font-semibold">{sectionsContent.thirdParty.title}</h2>
          {sectionsContent.thirdParty.paragraphs.map((paragraphText: string, paragraphIndex: number) => (
            <p key={paragraphIndex} className="mt-2">{paragraphText}</p>
          ))}
        </article>

        {/* confidentiality */}
        <article>
          <h2 className="text-xl font-semibold">{sectionsContent.confidentiality.title}</h2>
          {sectionsContent.confidentiality.paragraphs.map((paragraphText: string, paragraphIndex: number) => (
            <p key={paragraphIndex} className="mt-2">{paragraphText}</p>
          ))}
        </article>

        {/* support */}
        <article>
          <h2 className="text-xl font-semibold">{sectionsContent.support.title}</h2>
          <ul className="mt-2 list-disc ps-6 space-y-1">
            {sectionsContent.support.items.map((supportItem: string, supportIndex: number) => (
              <li key={supportIndex}>{supportItem}</li>
            ))}
          </ul>
        </article>

        {/* termTermination */}
        <article>
          <h2 className="text-xl font-semibold">{sectionsContent.termTermination.title}</h2>
          <ul className="mt-2 list-disc ps-6 space-y-1">
            {sectionsContent.termTermination.items.map((termTerminationItem: string, termTerminationIndex: number) => (
              <li key={termTerminationIndex}>{termTerminationItem}</li>
            ))}
          </ul>
        </article>

        {/* antisocialForces */}
        <article>
          <h2 className="text-xl font-semibold">{sectionsContent.antisocialForces.title}</h2>
          {sectionsContent.antisocialForces.paragraphs.map((paragraphText: string, paragraphIndex: number) => (
            <p key={paragraphIndex} className="mt-2">{paragraphText}</p>
          ))}
        </article>

        {/* assignment */}
        <article>
          <h2 className="text-xl font-semibold">{sectionsContent.assignment.title}</h2>
          {sectionsContent.assignment.paragraphs.map((paragraphText: string, paragraphIndex: number) => (
            <p key={paragraphIndex} className="mt-2">{paragraphText}</p>
          ))}
        </article>

        {/* severabilityEntire */}
        <article>
          <h2 className="text-xl font-semibold">{sectionsContent.severabilityEntire.title}</h2>
          {sectionsContent.severabilityEntire.paragraphs.map((paragraphText: string, paragraphIndex: number) => (
            <p key={paragraphIndex} className="mt-2">{paragraphText}</p>
          ))}
        </article>

        {/* governingLawJurisdiction */}
        <article>
          <h2 className="text-xl font-semibold">{sectionsContent.governingLawJurisdiction.title}</h2>
          {sectionsContent.governingLawJurisdiction.paragraphs.map((paragraphText: string, paragraphIndex: number) => (
            <p key={paragraphIndex} className="mt-2">{paragraphText}</p>
          ))}
        </article>

        {/* notices */}
        <article>
          <h2 className="text-xl font-semibold">{sectionsContent.notices.title}</h2>
          {sectionsContent.notices.paragraphs.map((paragraphText: string, paragraphIndex: number) => (
            <p key={paragraphIndex} className="mt-2">{paragraphText}</p>
          ))}
        </article>
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
