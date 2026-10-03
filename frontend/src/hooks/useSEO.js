import { useEffect, useInsertionEffect, useState } from 'react';
import { apiGet } from '@/lib/api';
import { PAGE_SEO_DEFAULTS } from '@/lib/seoPages';
import {
  DEFAULT_OG_IMAGE,
  absoluteUrl,
  buildStructuredData,
  canonicalUrl,
  currentPath,
} from '@/lib/seoHead';

function pick(...values) {
  for (const value of values) {
    if (typeof value === 'string' && value.trim()) return value.trim();
  }
  return '';
}

/** Renders page metadata during the React render so prerendered HTML contains it.
 *  CMS values, when present, replace the defaults after load. */
export default function Seo({ pageKey, fallback = {}, article = null, robots, title, description }) {
  const defaults = (pageKey && PAGE_SEO_DEFAULTS[pageKey]) || {};
  const [cms, setCms] = useState(null);

  useEffect(() => {
    if (!pageKey || robots === 'noindex, nofollow') return undefined;
    let alive = true;
    apiGet(`/page-seo/${encodeURIComponent(pageKey)}`)
      .then((data) => { if (alive) setCms(data || {}); })
      .catch(() => {});
    return () => { alive = false; };
  }, [pageKey, robots]);

  const resolvedTitle = pick(cms?.seo_title, defaults.title, fallback.title, title) || 'Adcom Media';
  const resolvedDescription = pick(cms?.meta_description, defaults.description, fallback.description, description);
  const image = absoluteUrl(pick(cms?.og_image, fallback.ogImage, article?.image, DEFAULT_OG_IMAGE));
  const canonical = pick(cms?.canonical, fallback.canonical) || canonicalUrl();
  const robotsContent = robots || (cms?.no_index ? 'noindex, nofollow' : 'index, follow');
  const noindex = robotsContent.startsWith('noindex');

  useInsertionEffect(() => {
    if (typeof document !== 'undefined' && resolvedTitle) document.title = resolvedTitle;
  }, [resolvedTitle]);

  const jsonLd = noindex ? '' : JSON.stringify(buildStructuredData({
    path: currentPath(),
    title: resolvedTitle,
    description: resolvedDescription,
    canonical,
    image,
    article,
  })).replace(/</g, '\\u003c');

  return (
    <>
      <title>{resolvedTitle}</title>
      {resolvedDescription ? <meta name="description" content={resolvedDescription} /> : null}
      {noindex ? null : <link rel="canonical" href={canonical} />}
      <meta name="robots" content={robotsContent} />
      {noindex ? null : <meta property="og:site_name" content="Adcom Media" />}
      {noindex ? null : <meta property="og:type" content={article ? 'article' : 'website'} />}
      {noindex ? null : <meta property="og:title" content={resolvedTitle} />}
      {noindex || !resolvedDescription ? null : <meta property="og:description" content={resolvedDescription} />}
      {noindex ? null : <meta property="og:url" content={canonical} />}
      {noindex || !image ? null : <meta property="og:image" content={image} />}
      {noindex ? null : <meta name="twitter:card" content={image ? 'summary_large_image' : 'summary'} />}
      {noindex ? null : <meta name="twitter:title" content={resolvedTitle} />}
      {noindex || !resolvedDescription ? null : <meta name="twitter:description" content={resolvedDescription} />}
      {noindex || !image ? null : <meta name="twitter:image" content={image} />}
      {jsonLd ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} /> : null}
    </>
  );
}
