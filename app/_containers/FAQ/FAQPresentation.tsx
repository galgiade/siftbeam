'use client'

import { Card, CardBody, Accordion, AccordionItem } from '@heroui/react'
import type FAQLocale from '@/app/dictionaries/faq/faq.d'
import { FaQuestionCircle } from 'react-icons/fa'

interface FAQPresentationProps {
  locale: string
  dictionary: FAQLocale
}

export default function FAQPresentation({ locale, dictionary }: FAQPresentationProps) {
  const renderAnswer = (answer: string | string[]) => {
    if (typeof answer === 'string') {
      return <p className="text-gray-700 leading-relaxed">{answer}</p>
    }
    
    return (
      <div className="space-y-2">
        {answer.map((line, index) => (
          <p key={index} className="text-gray-700 leading-relaxed">
            {line}
          </p>
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-gray-50">
      {/* ヘッダー */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center justify-center mb-4">
            <FaQuestionCircle className="text-5xl mr-4" />
            <h1 className="text-4xl md:text-5xl font-bold">{dictionary.title}</h1>
          </div>
          <p className="text-center text-xl text-blue-100 mt-4">
            {dictionary.description}
          </p>
        </div>
      </div>

      {/* FAQコンテンツ */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="space-y-8">
          {/* サービス概要 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">
                1
              </span>
              {dictionary.categories.service.title}
            </h2>
            <Card className="shadow-lg">
              <CardBody className="p-0">
                <Accordion variant="splitted">
                  {dictionary.categories.service.items.map((item, index) => (
                    <AccordionItem
                      key={`service-${index}`}
                      aria-label={item.question}
                      title={
                        <span className="text-lg font-semibold text-gray-900">
                          {item.question}
                        </span>
                      }
                      className="px-6 py-2"
                    >
                      <div className="pb-4 pt-2">
                        {renderAnswer(item.answer)}
                      </div>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardBody>
            </Card>
          </section>

          {/* 機能・仕様 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">
                2
              </span>
              {dictionary.categories.features.title}
            </h2>
            <Card className="shadow-lg">
              <CardBody className="p-0">
                <Accordion variant="splitted">
                  {dictionary.categories.features.items.map((item, index) => (
                    <AccordionItem
                      key={`features-${index}`}
                      aria-label={item.question}
                      title={
                        <span className="text-lg font-semibold text-gray-900">
                          {item.question}
                        </span>
                      }
                      className="px-6 py-2"
                    >
                      <div className="pb-4 pt-2">
                        {renderAnswer(item.answer)}
                      </div>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardBody>
            </Card>
          </section>

          {/* 料金・支払い */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">
                3
              </span>
              {dictionary.categories.pricing.title}
            </h2>
            <Card className="shadow-lg">
              <CardBody className="p-0">
                <Accordion variant="splitted">
                  {dictionary.categories.pricing.items.map((item, index) => (
                    <AccordionItem
                      key={`pricing-${index}`}
                      aria-label={item.question}
                      title={
                        <span className="text-lg font-semibold text-gray-900">
                          {item.question}
                        </span>
                      }
                      className="px-6 py-2"
                    >
                      <div className="pb-4 pt-2">
                        {renderAnswer(item.answer)}
                      </div>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardBody>
            </Card>
          </section>

          {/* セキュリティ・コンプライアンス */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">
                4
              </span>
              {dictionary.categories.security.title}
            </h2>
            <Card className="shadow-lg">
              <CardBody className="p-0">
                <Accordion variant="splitted">
                  {dictionary.categories.security.items.map((item, index) => (
                    <AccordionItem
                      key={`security-${index}`}
                      aria-label={item.question}
                      title={
                        <span className="text-lg font-semibold text-gray-900">
                          {item.question}
                        </span>
                      }
                      className="px-6 py-2"
                    >
                      <div className="pb-4 pt-2">
                        {renderAnswer(item.answer)}
                      </div>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardBody>
            </Card>
          </section>

          {/* サポート・その他 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">
                5
              </span>
              {dictionary.categories.support.title}
            </h2>
            <Card className="shadow-lg">
              <CardBody className="p-0">
                <Accordion variant="splitted">
                  {dictionary.categories.support.items.map((item, index) => (
                    <AccordionItem
                      key={`support-${index}`}
                      aria-label={item.question}
                      title={
                        <span className="text-lg font-semibold text-gray-900">
                          {item.question}
                        </span>
                      }
                      className="px-6 py-2"
                    >
                      <div className="pb-4 pt-2">
                        {renderAnswer(item.answer)}
                      </div>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardBody>
            </Card>
          </section>
        </div>

        {/* お問い合わせCTA */}
        <div className="mt-12 text-center">
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200">
            <CardBody className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {locale === 'ja' ? 'その他のご質問がありますか?' : 'Have more questions?'}
              </h3>
              <p className="text-gray-700 mb-6">
                {locale === 'ja' 
                  ? 'サポートチームがお手伝いいたします。お気軽にお問い合わせください。'
                  : 'Our support team is here to help. Feel free to contact us.'}
              </p>
              <a
                href={`/${locale}/service`}
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
              >
                {locale === 'ja' ? 'お問い合わせ' : 'Contact Us'}
              </a>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
}

