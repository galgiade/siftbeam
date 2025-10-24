"use client";

import type LegalDisclosuresLocale from '@/app/dictionaries/legalDisclosures/legalDisclosures.d.ts';
import React from 'react'

export default function LegalDisclosuresPresentation({ dictionary }: { dictionary: LegalDisclosuresLocale }) {
  const { title, intro, sections, appendix } = dictionary
  const sectionsContent = sections

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="mt-2 text-sm text-foreground/80">{intro}</p>

      <section className="mt-8 space-y-8">
        {/* company */}
        <article>
          <h2 className="text-xl font-semibold">{sectionsContent.company.title}</h2>
          <ul className="mt-2 list-disc ps-6 space-y-1">
            {sectionsContent.company.items.map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </article>

        {/* pricing */}
        <article>
          <h2 className="text-xl font-semibold">{sectionsContent.pricing.title}</h2>
          <ul className="mt-2 list-disc ps-6 space-y-1">
            {sectionsContent.pricing.items.map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </article>

        {/* payment */}
        <article>
          <h2 className="text-xl font-semibold">{sectionsContent.payment.title}</h2>
          <ul className="mt-2 list-disc ps-6 space-y-1">
            {sectionsContent.payment.items.map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </article>

        {/* service */}
        <article>
          <h2 className="text-xl font-semibold">{sectionsContent.service.title}</h2>
          <ul className="mt-2 list-disc ps-6 space-y-1">
            {sectionsContent.service.items.map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </article>

        {/* cancellation */}
        <article>
          <h2 className="text-xl font-semibold">{sectionsContent.cancellation.title}</h2>
          <ul className="mt-2 list-disc ps-6 space-y-1">
            {sectionsContent.cancellation.items.map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </article>

        {/* environment */}
        <article>
          <h2 className="text-xl font-semibold">{sectionsContent.environment.title}</h2>
          <ul className="mt-2 list-disc ps-6 space-y-1">
            {sectionsContent.environment.items.map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </article>

        {/* restrictions */}
        <article>
          <h2 className="text-xl font-semibold">{sectionsContent.restrictions.title}</h2>
          <ul className="mt-2 list-disc ps-6 space-y-1">
            {sectionsContent.restrictions.items.map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </article>

        {/* validity */}
        <article>
          <h2 className="text-xl font-semibold">{sectionsContent.validity.title}</h2>
          <ul className="mt-2 list-disc ps-6 space-y-1">
            {sectionsContent.validity.items.map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </article>

        {/* specialConditions */}
        <article>
          <h2 className="text-xl font-semibold">{sectionsContent.specialConditions.title}</h2>
          <ul className="mt-2 list-disc ps-6 space-y-1">
            {sectionsContent.specialConditions.items.map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </article>

        {/* businessHours */}
        <article>
          <h2 className="text-xl font-semibold">{sectionsContent.businessHours.title}</h2>
          <ul className="mt-2 list-disc ps-6 space-y-1">
            {sectionsContent.businessHours.items.map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </article>

        {/* governingLaw */}
        <article>
          <h2 className="text-xl font-semibold">{sectionsContent.governingLaw.title}</h2>
          <ul className="mt-2 list-disc ps-6 space-y-1">
            {sectionsContent.governingLaw.items.map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
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
