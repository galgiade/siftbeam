"use client";

import React from 'react';
import Link from 'next/link';
import { Card, CardBody, CardHeader} from '@heroui/react';
import { Button } from '@heroui/react';
import { Chip } from '@heroui/react';
import { Divider } from '@heroui/react';
import { 
  CurrencyDollarIcon, 
  CloudArrowUpIcon, 
  CalculatorIcon,
  CheckCircleIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';
import type { PricingLocale } from '@/app/dictionaries/pricing/pricing.d.ts';

type PricingPresentationProps = {
  locale: string;
  dictionary: PricingLocale['pricing'];
}

export default function PricingPresentation({ locale, dictionary }: PricingPresentationProps) {
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* ヒーローセクション */}
      <section className="py-20 px-4 md:px-8">
          <div className="mx-auto max-w-6xl">
          <div className="text-center space-y-6 mb-16">
              <Chip 
                color="primary" 
                variant="flat"
                className="px-4 py-2 text-sm font-medium"
              >
                {dictionary.hero.badge}
              </Chip>
            
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {dictionary.hero.titleMain}
            </h1>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{dictionary.hero.titleSub}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {dictionary.hero.subtitle}
            </p>
          </div>

          {/* 料金カード */}
          <div className="flex justify-center mb-16">
            <Card className="w-full max-w-2xl border-2 border-blue-200 hover:border-blue-300 transition-all duration-300 hover:shadow-xl">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <CloudArrowUpIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{dictionary.cards.processing.title}</h3>
                    <p className="text-sm text-gray-600">{dictionary.cards.processing.subtitle}</p>
                  </div>
                </div>
              </CardHeader>
              <CardBody className="pt-0">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">料金</span>
                    <Chip 
                      color="primary" 
                      variant="flat"
                      startContent={<CurrencyDollarIcon className="w-4 h-4" />}
                    >
                      {dictionary.cards.processing.price}
                    </Chip>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      <InformationCircleIcon className="w-4 h-4 inline mr-1" />
                      {dictionary.cards.processing.info}
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* 計算例セクション */}
          <div className="space-y-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{dictionary.examples.title}</h3>
              <p className="text-gray-600">{dictionary.examples.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="w-full border border-gray-200 hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <CalculatorIcon className="w-5 h-5 text-blue-600" />
                    <h4 className="text-lg font-semibold text-gray-900">{dictionary.examples.small.title}</h4>
                  </div>
                </CardHeader>
                <CardBody className="pt-0">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircleIcon className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-600">{dictionary.examples.small.bullet}</span>
                    </div>
                    <Divider />
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">{dictionary.examples.labels.feeProcessing}</span>
                        <span className="font-medium">{dictionary.examples.small.processingFee}</span>
                      </div>
                      <Divider />
                      <div className="flex justify-between text-lg font-bold text-blue-600">
                        <span>{dictionary.examples.labels.total}</span>
                        <span>{dictionary.examples.small.total}</span>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>

              <Card className="w-full border border-gray-200 hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <CalculatorIcon className="w-5 h-5 text-green-600" />
                    <h4 className="text-lg font-semibold text-gray-900">{dictionary.examples.large.title}</h4>
                  </div>
                </CardHeader>
                <CardBody className="pt-0">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircleIcon className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-600">{dictionary.examples.large.bullet}</span>
                    </div>
                    <Divider />
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">{dictionary.examples.labels.totalData}</span>
                        <span className="font-medium">{dictionary.examples.large.totalDataSize}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">{dictionary.examples.labels.feeProcessing}</span>
                        <span className="font-medium">{dictionary.examples.large.processingFee}</span>
                      </div>
                      <Divider />
                      <div className="flex justify-between text-lg font-bold text-green-600">
                        <span>{dictionary.examples.labels.total}</span>
                        <span>{dictionary.examples.large.total}</span>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>

          {/* CTA セクション */}
          <div className="mt-16 text-center">
            <Card className="w-full max-w-2xl mx-auto bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
              <CardBody className="py-8">
                <h3 className="text-2xl font-bold mb-4 text-red-100">{dictionary.cta.title}</h3>
                <p className="text-red-100 mb-6">{dictionary.cta.description}</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      as={Link}
                      href={`/${locale}/account/user`}
                      color="primary" 
                      variant="solid"
                      size="lg"
                      className="bg-white text-blue-800 font-bold hover:bg-gray-100"
                    >
                      {dictionary.cta.button}
                    </Button>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* 注意事項 */}
          <div className="mt-12">
            <Card className="w-full max-w-4xl mx-auto border-orange-200 bg-orange-50">
              <CardBody className="py-4">
                <div className="flex items-start gap-3">
                  <InformationCircleIcon className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-orange-800">{dictionary.notice}</p>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
