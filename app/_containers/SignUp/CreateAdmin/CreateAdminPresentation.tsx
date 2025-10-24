"use client"

import { useState, useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Input, SelectItem, Select } from "@heroui/react";
import type { CreateAdminLocale } from '@/app/dictionaries/createAdmin/createAdmin.d.ts';
import { createAdminAction } from '@/app/lib/actions/admin-actions';

interface CreateAdminPresentationProps {
  locale: string;
  dictionary: CreateAdminLocale;
}

export default function CreateAdminPresentation({ 
  locale, 
  dictionary
}: CreateAdminPresentationProps) {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [department, setDepartment] = useState("");
  const [position, setPosition] = useState("");
  const [localeValue, setLocaleValue] = useState(locale);
  
  const [state, formAction, isPending] = useActionState(createAdminAction, {
    success: false,
    message: '',
    errors: {}
  });

  // サーバーアクション成功時の処理をuseEffectで実行
  useEffect(() => {
    if (state.success && !isPending) {
      router.push(`/${locale}/signup/payment`);
    }
  }, [state.success, isPending, router, locale]);

  return (
    <div className="min-h-screen mx-auto flex flex-col items-center justify-center bg-gray-50">
      {/* 進行状況Breadcrumbs */}
      <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 text-gray-500 rounded-full flex items-center justify-center text-sm font-medium">
                1
              </div>
              <span className="ml-2 text-sm  text-gray-500">アカウント作成</span>
            </div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 text-gray-500 rounded-full flex items-center justify-center text-sm font-medium">
                2
              </div>
              <span className="ml-2 text-sm text-gray-500">会社情報</span>
            </div>
            <div className="flex items-center">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                3
              </div>
              <span className="ml-2 text-sm font-medium text-blue-600">管理者</span>
            </div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 text-gray-500 rounded-full flex items-center justify-center text-sm font-medium">
                4
              </div>
              <span className="ml-2 text-sm text-gray-500">支払い設定</span>
            </div>
              
            </div>
          </div>
      </div>

      <Card className="w-full max-w-md p-8 shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">{dictionary.label.createAdminTitle}</h2>
        <form action={formAction} className="flex flex-col gap-6">
          {/* ユーザー名フィールド */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              {dictionary.label.userNameLabel}
              <span className="text-red-500 ml-1">*</span>
            </label>
            <Input
              name="userName"
              type="text"
              placeholder={dictionary.label.userNamePlaceholder}
              value={userName}
              onValueChange={setUserName}
              isDisabled={isPending}
              variant="bordered"
              isInvalid={!!(state.errors?.userName)}
              errorMessage={state.errors?.userName}
            />
            <p className="text-xs text-gray-500">{dictionary.label.userNameDescription}</p>
          </div>

          {/* 部署フィールド */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              {dictionary.label.departmentLabel}
              <span className="text-red-500 ml-1">*</span>
            </label>
            <Input
              name="department"
              type="text"
              placeholder={dictionary.label.departmentPlaceholder}
              value={department}
              onValueChange={setDepartment}
              isDisabled={isPending}
              variant="bordered"
              isInvalid={!!(state.errors?.department)}
              errorMessage={state.errors?.department}
            />
          </div>

          {/* 役職フィールド */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              {dictionary.label.positionLabel}
              <span className="text-red-500 ml-1">*</span>
            </label>
            <Input
              name="position"
              type="text"
              placeholder={dictionary.label.positionPlaceholder}
              value={position}
              onValueChange={setPosition}
              isDisabled={isPending}
              variant="bordered"
              isInvalid={!!(state.errors?.position)}
              errorMessage={state.errors?.position}
            />
          </div>

          {/* 言語選択フィールド */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              {dictionary.label.languageLabel}
              <span className="text-red-500 ml-1">*</span>
            </label>
            <Select
              name="locale"
              placeholder="言語を選択してください"
              selectedKeys={new Set([localeValue])}
              onSelectionChange={keys => setLocaleValue(Array.from(keys)[0] as string)}
              isDisabled={isPending}
              variant="bordered"
              classNames={{
                listbox: "bg-white shadow-lg border border-gray-200",
                popoverContent: "bg-white shadow-lg border border-gray-200"
              }}
            >
              <SelectItem key="ja" className="bg-white hover:bg-gray-100">{dictionary.label.japanese}</SelectItem>
              <SelectItem key="en-US" className="bg-white hover:bg-gray-100">{dictionary.label.english}</SelectItem>
              <SelectItem key="es" className="bg-white hover:bg-gray-100">{dictionary.label.spanish}</SelectItem>
              <SelectItem key="fr" className="bg-white hover:bg-gray-100">{dictionary.label.french}</SelectItem>
              <SelectItem key="de" className="bg-white hover:bg-gray-100">{dictionary.label.german}</SelectItem>
              <SelectItem key="ko" className="bg-white hover:bg-gray-100">{dictionary.label.korean}</SelectItem>
              <SelectItem key="pt" className="bg-white hover:bg-gray-100">{dictionary.label.portuguese}</SelectItem>
              <SelectItem key="id" className="bg-white hover:bg-gray-100">{dictionary.label.indonesian}</SelectItem>
              <SelectItem key="zh-CN" className="bg-white hover:bg-gray-100">{dictionary.label.chinese}</SelectItem>
            </Select>
          </div>
          
          {/* サーバーアクションのメッセージ表示 */}
          {state.message && !state.success && (
            <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md border border-red-200">
              {state.message}
            </div>
          )}

          {state.success && (
            <div className="text-green-500 text-sm bg-green-50 p-3 rounded-md border border-green-200">
              {state.message}
            </div>
          )}

          <Button
            type="submit"
            isDisabled={isPending || !userName || !department || !position}
            isLoading={isPending}
            color="primary"
            size="lg"
            className="w-full"
          >
            {isPending ? dictionary.label.creating : dictionary.label.createAdmin}
          </Button>
        </form>
      </Card>
    </div>
  );
}