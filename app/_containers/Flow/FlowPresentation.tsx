"use client";

import React from 'react';
import Link from 'next/link';
import { Card, CardBody, CardHeader } from '@heroui/react';
import { Button } from '@heroui/react';
import { Chip } from '@heroui/react';
import {
  CloudArrowUpIcon,
  InformationCircleIcon,
  UserPlusIcon,
  ClipboardDocumentListIcon,
  ArrowDownTrayIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline';
import type { FlowLocale } from '@/app/dictionaries/flow/flow.d.ts';

type FlowPresentationProps = {
  locale: string;
  dictionary: FlowLocale['flow'];
};

export default function FlowPresentation({ locale, dictionary }: FlowPresentationProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* ヒーローセクション */}
      <section className="py-20 px-4 md:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center space-y-6 mb-16">
            <Chip color="primary" variant="flat" className="px-4 py-2 text-sm font-medium">
              {dictionary.hero.badge}
            </Chip>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {dictionary.hero.title}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {dictionary.hero.subtitle}
            </p>
          </div>

          {/* ステップカード（縦並び） */}
          <div className="flex flex-col gap-6 mb-16">
            {/* STEP 1 */}
            <Card className="w-full border-2 border-blue-200 hover:border-blue-300 transition-all duration-300 hover:shadow-xl">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <UserPlusIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <Chip size="sm" variant="flat" color="primary">
                        {dictionary.steps.step1.badge}
                      </Chip>
                      <span className="text-xs text-gray-500">{dictionary.steps.step1.tag}</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">{dictionary.steps.step1.title}</h3>
                  </div>
                </div>
              </CardHeader>
              <CardBody className="pt-0">
                <p className="text-sm text-gray-700 leading-6">
                  {dictionary.steps.step1.description}
                </p>
              </CardBody>
            </Card>

            {/* STEP 2 */}
            <Card className="w-full border-2 border-indigo-200 hover:border-indigo-300 transition-all duration-300 hover:shadow-xl">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <ClipboardDocumentListIcon className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <Chip size="sm" variant="flat" color="secondary">
                        {dictionary.steps.step2.badge}
                      </Chip>
                      <span className="text-xs text-gray-500">{dictionary.steps.step2.tag}</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">{dictionary.steps.step2.title}</h3>
                  </div>
                </div>
              </CardHeader>
              <CardBody className="pt-0">
                <p className="text-sm text-gray-700 leading-6">
                  {dictionary.steps.step2.description}
                </p>
              </CardBody>
            </Card>

            {/* STEP 3 */}
            <Card className="w-full border-2 border-emerald-200 hover:border-emerald-300 transition-all duration-300 hover:shadow-xl">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <WrenchScrewdriverIcon className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <Chip size="sm" variant="flat" color="success">
                        {dictionary.steps.step3.badge}
                      </Chip>
                      <span className="text-xs text-gray-500">{dictionary.steps.step3.tag}</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">{dictionary.steps.step3.title}</h3>
                  </div>
                </div>
              </CardHeader>
              <CardBody className="pt-0">
                <p className="text-sm text-gray-700 leading-6">
                  {dictionary.steps.step3.description}
                </p>
              </CardBody>
            </Card>

            {/* STEP 4 */}
            <Card className="w-full border-2 border-orange-200 hover:border-orange-300 transition-all duration-300 hover:shadow-xl">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <CloudArrowUpIcon className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <Chip size="sm" variant="flat" color="warning">
                        {dictionary.steps.step4.badge}
                      </Chip>
                      <span className="text-xs text-gray-500">{dictionary.steps.step4.tag}</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">{dictionary.steps.step4.title}</h3>
                  </div>
                </div>
              </CardHeader>
              <CardBody className="pt-0">
                <p className="text-sm text-gray-700 leading-6">
                  {dictionary.steps.step4.description}
                </p>
              </CardBody>
            </Card>

            {/* STEP 5 */}
            <Card className="w-full border-2 border-green-200 hover:border-green-300 transition-all duration-300 hover:shadow-xl">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <ArrowDownTrayIcon className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <Chip size="sm" variant="flat" color="success">
                        {dictionary.steps.step5.badge}
                      </Chip>
                      <span className="text-xs text-gray-500">{dictionary.steps.step5.tag}</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">{dictionary.steps.step5.title}</h3>
                  </div>
                </div>
              </CardHeader>
              <CardBody className="pt-0">
                <p className="text-sm text-gray-700 leading-6">
                  {dictionary.steps.step5.description}
                </p>
              </CardBody>
            </Card>
          </div>

          {/* 注意事項 */}
          <div className="mt-8">
            <Card className="w-full max-w-4xl mx-auto border-orange-200 bg-orange-50">
              <CardBody className="py-4">
                <div className="flex items-start gap-3">
                  <InformationCircleIcon className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-orange-800">
                    {dictionary.notice}
                  </p>
                </div>
              </CardBody>
            </Card>
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
        </div>
      </section>
    </div>
  );
}
