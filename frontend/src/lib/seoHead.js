export const SITE_ORIGIN = 'https://adcommedia.in';
export const ORG_ID = `${SITE_ORIGIN}/#organization`;
export const WEBSITE_ID = `${SITE_ORIGIN}/#website`;
export const DEFAULT_OG_IMAGE = `${SITE_ORIGIN}/android-chrome-512x512.png`;
export const CONTACT_EMAIL = 'hello.adcommedia@gmail.com';
export const CONTACT_PHONE = '+91-83086-06641';
export const LINKEDIN_URL = 'https://linkedin.com/company/adcom-media';

export function pageKeyFromPath(pathname) {
  const path = String(pathname || '/').split('?')[0].split('#')[0].replace(/\/+$/, '') || '/';
  if (path === '/') return 'home';
  return path.replace(/^\//, '').replace(/\//g, '-');
}

export function pageKeyFromLocation() {
  if (typeof window === 'undefined') return 'home';
  return pageKeyFromPath(window.location.pathname);
}

export function currentPath() {
  if (typeof window === 'undefined') return '/';
  return window.location.pathname.replace(/\/+$/, '') || '/';
}

export function canonicalUrl(explicit) {
  if (explicit) return explicit;
  const path = currentPath();
  return path === '/' ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}${path}`;
}

export function absoluteUrl(value) {
  if (!value) return '';
  if (/^https?:\/\//i.test(value)) return value;
  if (value.startsWith('//')) return `https:${value}`;
  if (value.startsWith('/')) return `${SITE_ORIGIN}${value}`;
  return value;
}

function stripBrand(title) {
  return String(title || 'Adcom Media').split('|')[0].replace(/\s+/g, ' ').trim() || 'Adcom Media';
}

function toIsoDate(value) {
  if (!value || typeof value !== 'string' || !/\d{4}/.test(value)) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toISOString().slice(0, 10);
}

function compact(obj) {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value !== undefined && value !== null && value !== '')
  );
}

function organization() {
  return {
    '@type': 'Organization',
    '@id': ORG_ID,
    name: 'Adcom Media',
    url: `${SITE_ORIGIN}/`,
    email: CONTACT_EMAIL,
    telephone: CONTACT_PHONE,
    logo: {
      '@type': 'ImageObject',
      url: DEFAULT_OG_IMAGE,
    },
    image: DEFAULT_OG_IMAGE,
    sameAs: [LINKEDIN_URL],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Pune',
      addressRegion: 'Maharashtra',
      addressCountry: 'IN',
    },
    areaServed: ['India', 'Middle East', 'United States'],
  };
}

function website() {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: 'Adcom Media',
    url: `${SITE_ORIGIN}/`,
    publisher: { '@id': ORG_ID },
    inLanguage: 'en',
  };
}

function breadcrumb(path, title) {
  if (!path || path === '/') return null;
  const parts = path.split('/').filter(Boolean);
  const items = [{ name: 'Home', item: `${SITE_ORIGIN}/` }];

  if (parts[0] === 'services' && parts.length === 2) {
    items.push({ name: 'Services', item: `${SITE_ORIGIN}/#services` });
  } else if (parts[0] === 'case-studies' && parts.length === 2) {
    items.push({ name: 'Case Studies', item: `${SITE_ORIGIN}/case-studies` });
  } else if (parts[0] === 'blog' && parts.length === 2) {
    items.push({ name: 'Journal', item: `${SITE_ORIGIN}/blog` });
  }

  items.push({
    name: stripBrand(title),
    item: `${SITE_ORIGIN}${path}`,
  });

  return {
    '@type': 'BreadcrumbList',
    '@id': `${SITE_ORIGIN}${path}#breadcrumb`,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.item,
    })),
  };
}

export function buildStructuredData({ path, title, description, canonical, image, article }) {
  const kind = pageKind(path);
  const graph = [organization(), website()];
  const crumb = breadcrumb(path, title);
  if (crumb) graph.push(crumb);

  const page = compact({
    '@type': 'WebPage',
    '@id': `${canonical}#webpage`,
    url: canonical,
    name: title,
    description,
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': ORG_ID },
    inLanguage: 'en',
    primaryImageOfPage: image,
  });

  if (kind === 'home' || kind === 'page' || kind === 'blog' || kind === 'service' || kind === 'local' || kind === 'case-study') {
    if (kind === 'blog') page['@type'] = 'Blog';
    graph.push(page);
  }

  if (kind === 'service') {
    graph.push(compact({
      '@type': 'Service',
      '@id': `${canonical}#service`,
      name: stripBrand(title),
      description,
      url: canonical,
      provider: { '@id': ORG_ID },
      areaServed: 'IN',
      image,
    }));
  }

  if (kind === 'local') {
    graph.push({
      '@type': 'ProfessionalService',
      '@id': `${canonical}#localbusiness`,
      name: 'Adcom Media',
      url: canonical,
      image,
      email: CONTACT_EMAIL,
      telephone: CONTACT_PHONE,
      parentOrganization: { '@id': ORG_ID },
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Pune',
        addressRegion: 'Maharashtra',
        addressCountry: 'IN',
      },
      areaServed: {
        '@type': 'City',
        name: 'Pune',
      },
      openingHoursSpecification: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '10:00',
        closes: '19:00',
      },
    });
  }

  if (kind === 'article') {
    graph.push(compact({
      '@type': 'BlogPosting',
      '@id': `${canonical}#article`,
      headline: article?.headline || stripBrand(title),
      description: article?.description || description,
      datePublished: toIsoDate(article?.datePublished),
      author: article?.authorName
        ? { '@type': 'Person', name: article.authorName }
        : { '@id': ORG_ID },
      publisher: { '@id': ORG_ID },
      image: absoluteUrl(article?.image) || image,
      mainEntityOfPage: canonical,
      articleSection: article?.section,
      inLanguage: 'en',
    }));
  }

  if (kind === 'case-study') {
    graph.push(compact({
      '@type': 'Article',
      '@id': `${canonical}#article`,
      headline: stripBrand(title),
      description,
      author: { '@id': ORG_ID },
      publisher: { '@id': ORG_ID },
      image,
      mainEntityOfPage: canonical,
      inLanguage: 'en',
    }));
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
}

export function pageKind(path) {
  if (path === '/') return 'home';
  if (path.startsWith('/services/') || path.startsWith('/industries/')) return 'service';
  if (path === '/locations/pune') return 'local';
  if (path === '/blog') return 'blog';
  if (path.startsWith('/blog/')) return 'article';
  if (path.startsWith('/case-studies/') && path !== '/case-studies') return 'case-study';
  return 'page';
}
