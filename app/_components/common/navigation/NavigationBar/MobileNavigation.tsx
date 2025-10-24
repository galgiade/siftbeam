"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavbarMenuToggle } from "@heroui/react";
import { NavbarMenu } from "@heroui/react";
import { NavbarMenuItem } from "@heroui/react";
import { NAVIGATION_ITEMS } from "../NavigationBar";
import LanguageSwitcher from "@/app/_components/common/LanguageSwitcher";

type MobileNavigationProps = {
  locale: string;
  dictionary: any;
};

export function MobileNavigation({ locale, dictionary }: MobileNavigationProps) {
  const pathname = usePathname();

  return (
    <>
      <NavbarMenuToggle />
      <NavbarMenu>
        {NAVIGATION_ITEMS.map((item) => (
          <NavbarMenuItem key={item.key}>
            <Link
              href={item.href}
              className={`w-full ${
                pathname === item.href ? "text-primary" : "text-foreground/60"
              }`}
              prefetch={true}
            >
              {dictionary.navigation[item.key]}
            </Link>
          </NavbarMenuItem>
        ))}
        <NavbarMenuItem>
          <LanguageSwitcher currentLocale={locale} />
        </NavbarMenuItem>
      </NavbarMenu>
    </>
  );
} 