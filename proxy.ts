import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // URLパスからロケールを抽出
  const localeMatch = pathname.match(/^\/(ja|en|en-US|zh-CN|ko|fr|de|es|pt|id)(\/|$)/);
  const locale = localeMatch ? localeMatch[1] : 'en';
  
  // レスポンスヘッダーにロケールを追加
  const response = NextResponse.next();
  response.headers.set('x-locale', locale);
  
  return response;
}

// プロキシを適用するパス
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|icon.svg|og-default.png|robots.txt|sitemap.xml).*)',
  ],
};

