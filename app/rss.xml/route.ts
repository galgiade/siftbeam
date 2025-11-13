import { getAllPosts } from '@/app/lib/blog';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://siftbeam.com';
  
  // 日本語と英語の記事を取得
  const jaPosts = getAllPosts('ja');
  const enPosts = getAllPosts('en-US');
  
  // 全記事を統合してソート
  const allPosts = [
    ...jaPosts.map(post => ({ ...post, locale: 'ja' })),
    ...enPosts.map(post => ({ ...post, locale: 'en-US' }))
  ].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>siftbeam Blog</title>
    <link>${baseUrl}/blog</link>
    <description>エンタープライズデータ処理の最新情報 | Enterprise Data Processing Insights</description>
    <language>ja</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${baseUrl}/icon.svg</url>
      <title>siftbeam</title>
      <link>${baseUrl}</link>
    </image>
    ${allPosts.map(post => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${baseUrl}/${post.locale}/blog/${post.slug}</link>
      <guid isPermaLink="true">${baseUrl}/${post.locale}/blog/${post.slug}</guid>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
      <description><![CDATA[${post.description}]]></description>
      <content:encoded><![CDATA[${post.content.substring(0, 500)}...]]></content:encoded>
      <author>connectechceomatsui@gmail.com (${post.author})</author>
      <category>${post.category}</category>
      ${post.tags.map(tag => `<category>${tag}</category>`).join('\n      ')}
    </item>
    `).join('')}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}

