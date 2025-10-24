import React from 'react';
import Link from 'next/link';
import HomeLocale from '@/app/dictionaries/home/Homelocale';


type HomePresentationProps = {
  locale: string;
  dictionary: HomeLocale;
}

export default function HomePresentation({ locale, dictionary }: HomePresentationProps) {
  const home = dictionary;
  
  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
      {/* ヒーローセクション */}
      <section className="relative h-screen flex items-center justify-center px-4 md:px-8">
        <div className="absolute inset-0 z-0 bg-blue-50 opacity-30" />
        
        <div className="max-w-7xl mx-auto text-center z-10">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            {home.hero.title}
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto">
            {home.hero.subtitle}
          </p>
          
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link href={`/${locale}/signup/auth`} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition duration-300">
              {home.hero.contact}
            </Link>
            <Link href={`/${locale}/flow`} className="bg-white border border-blue-200 text-blue-700 hover:bg-blue-50 font-semibold py-3 px-6 rounded-lg shadow-sm transition duration-300">
              {home.hero.buttons.howTo}
            </Link>
            <Link href={`/${locale}/pricing`} className="bg-white border border-gray-200 text-gray-800 hover:bg-gray-50 font-semibold py-3 px-6 rounded-lg shadow-sm transition duration-300">
              {home.hero.buttons.pricing}
            </Link>
          </div>
        </div>
        
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
      </section>

      {/* 特徴セクション */}
      <section className="py-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16">
            {home.features.title}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition duration-300">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-center mb-4 text-gray-900">{home.features.dataAnalysis.title}</h3>
              <p className="text-gray-600 text-center mb-4">
                {home.features.dataAnalysis.description}
              </p>
              <ul className="text-sm text-gray-600 space-y-2 text-left">
                {home.features.dataAnalysis.points.map((point: string, idx: number) => (
                  <li key={`dataAnalysis-${idx}`}>・{point}</li>
                ))}
              </ul>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition duration-300">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-center mb-4 text-gray-900">{home.features.anomalyDetection.title}</h3>
              <p className="text-gray-600 text-center mb-4">
                {home.features.anomalyDetection.description}
              </p>
              <ul className="text-sm text-gray-600 space-y-2 text-left">
                {home.features.anomalyDetection.points.map((point: string, idx: number) => (
                  <li key={`anomalyDetection-${idx}`}>・{point}</li>
                ))}
              </ul>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition duration-300">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-center mb-4 text-gray-900">{home.features.customAI.title}</h3>
              <p className="text-gray-600 text-center mb-4">
                {home.features.customAI.description}
              </p>
              <ul className="text-sm text-gray-600 space-y-2 text-left">
                {home.features.customAI.points.map((point: string, idx: number) => (
                  <li key={`customAI-${idx}`}>・{point}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 使い方セクション */}
      <section className="py-20 px-4 md:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16">
            {home.steps.title}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">1</div>
              <div className="bg-white p-8 rounded-xl shadow-md h-full">
                <h3 className="text-xl font-semibold mb-4 text-gray-900">{home.steps.step1.title}</h3>
                <p className="text-gray-600">
                  {home.steps.step1.description}
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">2</div>
              <div className="bg-white p-8 rounded-xl shadow-md h-full">
                <h3 className="text-xl font-semibold mb-4 text-gray-900">{home.steps.step2.title}</h3>
                <p className="text-gray-600">
                  {home.steps.step2.description}
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">3</div>
              <div className="bg-white p-8 rounded-xl shadow-md h-full">
                <h3 className="text-xl font-semibold mb-4 text-gray-900">{home.steps.step3.title}</h3>
                <p className="text-gray-600">
                  {home.steps.step3.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTAセクション */}
      <section className="py-20 px-4 md:px-8">
        <div className="max-w-5xl mx-auto bg-linear-to-r from-blue-600 to-blue-800 rounded-2xl p-12 text-center text-white shadow-xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {home.cta.title}
          </h2>
          <p className="text-xl mb-10 max-w-3xl mx-auto">
            {home.cta.description}
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link href={`/${locale}/signup/auth`} className="bg-white text-blue-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg shadow-lg transition duration-300 text-lg">
              {home.cta.button}
            </Link>
            <Link href={`/${locale}/flow`} className="bg-transparent border border-white/60 text-white hover:bg-white/10 font-bold py-3 px-8 rounded-lg transition duration-300 text-lg">
              {home.cta.secondaryButton}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
