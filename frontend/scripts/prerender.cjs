/**
 * Post-build prerender for public marketing routes.
 * Serves the CRA build, lets the production bundle render each URL in Chromium,
 * and saves the first committed HTML so crawlers can read it without JavaScript.
 * Private routes stay on spa.html and are not prerendered.
 */
const fs = require('fs');
const http = require('http');
const path = require('path');
const { execSync } = require('child_process');

const FRONTEND = path.join(__dirname, '..');
const BUILD = path.join(FRONTEND, 'build');
const SITE = 'https://adcommedia.in';
const API = (process.env.PRERENDER_API_URL || 'https://api.adcommedia.in/api').replace(/\/$/, '');

const STATIC_ROUTES = [
  '/',
  '/about',
  '/process',
  '/careers',
  '/contact',
  '/services/performance-marketing',
  '/services/growth-marketing',
  '/services/brand-strategy',
  '/services/ai-seo',
  '/services/google-ads',
  '/services/meta-ads',
  '/services/seo',
  '/services/social-media-marketing',
  '/services/website-development',
  '/services/linkedin-marketing',
  '/services/b2b-marketing',
  '/services/industrial-3d',
  '/industries/furniture',
  '/industries/pharma',
  '/industries/manufacturing',
  '/industries/b2b',
  '/industries/ecommerce',
  '/locations/pune',
  '/case-studies',
  '/case-studies/sharma-furniture',
  '/case-studies/prochem',
  '/case-studies/profotech',
  '/case-studies/aus-tyre',
  '/case-studies/skylarr',
  '/blog',
];

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml',
  '.webmanifest': 'application/manifest+json',
  '.map': 'application/json',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

function normalizePost(post) {
  if (!post) return post;
  const next = { ...post, readTime: post.read_time || post.readTime };
  delete next.views;
  return next;
}

function cardPost(post) {
  const next = normalizePost(post);
  delete next.body;
  return next;
}

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json();
}

async function loadBlogs() {
  let lastError;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const list = await fetchJson(`${API}/blogs`);
      if (!Array.isArray(list)) throw new Error('Blog API did not return an array');
      const published = list.filter((post) => post && post.slug && post.published !== false && post.status !== 'draft');
      const posts = [];
      for (const item of published) {
        if (Array.isArray(item.body) && item.body.length) {
          posts.push(normalizePost(item));
          continue;
        }
        const detail = await fetchJson(`${API}/blogs/${encodeURIComponent(item.slug)}`);
        posts.push(normalizePost({ ...item, ...detail }));
      }
      return posts;
    } catch (error) {
      lastError = error;
      await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
    }
  }
  throw lastError;
}

function routesFromSitemap(xml) {
  return [...xml.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/g)].map((match) => {
    const pathname = new URL(match[1].trim()).pathname.replace(/\/+$/, '');
    return pathname || '/';
  });
}

function writeSpaShell() {
  const indexPath = path.join(BUILD, 'index.html');
  const shellPath = path.join(BUILD, '.cra-shell.html');
  if (!fs.existsSync(indexPath) && !fs.existsSync(shellPath)) {
    throw new Error('frontend/build/index.html is missing. Run the CRA build first.');
  }
  if (fs.existsSync(indexPath)) {
    const indexHtml = fs.readFileSync(indexPath, 'utf8');
    if (!indexHtml.includes('data-prerendered=')) fs.writeFileSync(shellPath, indexHtml);
  }
  if (!fs.existsSync(shellPath)) {
    throw new Error('The CRA HTML shell was overwritten. Run the production build again before prerender.');
  }
  let shell = fs.readFileSync(shellPath, 'utf8');
  shell = shell.replace(/<noscript>\s*You need to enable JavaScript to run this app\.\s*<\/noscript>/gi, '');
  shell = shell.replace(/<meta\b[^>]*name=["']robots["'][^>]*>/gi, '');
  shell = shell.replace(/<head[^>]*>/i, (head) => `${head}\n        <meta name="robots" content="noindex, nofollow" />`);
  shell = shell.replace(/<title>[^<]*<\/title>/i, '<title>Adcom Media</title>');
  fs.writeFileSync(path.join(BUILD, 'spa.html'), shell);
}

function insideBuild(filePath) {
  const root = path.resolve(BUILD);
  const abs = path.resolve(filePath);
  return abs === root || abs.startsWith(root + path.sep);
}

function resolveFile(pathname) {
  const rel = decodeURIComponent(pathname).replace(/^\/+/, '');
  const candidates = [];
  if (!rel) candidates.push(path.join(BUILD, 'index.html'));
  else if (rel.endsWith('/')) candidates.push(path.join(BUILD, rel, 'index.html'));
  else {
    candidates.push(path.join(BUILD, rel));
    candidates.push(path.join(BUILD, rel, 'index.html'));
  }
  for (const candidate of candidates) {
    if (insideBuild(candidate) && fs.existsSync(candidate) && fs.statSync(candidate).isFile()) return candidate;
  }
  return path.join(BUILD, 'spa.html');
}

function startServer(bootstrapByPath) {
  const server = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://127.0.0.1');
    const filePath = resolveFile(url.pathname);
    if (!insideBuild(filePath) || !fs.existsSync(filePath)) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    if (ext === '.html' && url.searchParams.get('prerender') === '1') {
      let html = fs.readFileSync(filePath, 'utf8');
      const pathname = url.pathname.replace(/\/+$/, '') || '/';
      const injection = `<script>window.__ADCOM_PRERENDERED=1;window.__ADCOM_CAPTURE=1;</script>${bootstrapTag(bootstrapByPath.get(pathname))}`;
      if (!html.includes('window.__ADCOM_PRERENDERED')) {
        html = html.replace(/<head[^>]*>/i, (head) => `${head}${injection}`);
      }
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
      res.end(html);
      return;
    }
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    fs.createReadStream(filePath).pipe(res);
  });
  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => resolve(server));
  });
}

function outputFile(route) {
  if (route === '/') return path.join(BUILD, 'index.html');
  return path.join(BUILD, route.replace(/^\//, ''), 'index.html');
}

function bootstrapTag(data) {
  if (!data) return '';
  const json = JSON.stringify(data).replace(/</g, '\\u003c');
  return `<script id="adcom-bootstrap" type="application/json">${json}</script>`;
}

function isLocal(url) {
  try {
    const host = new URL(url).hostname;
    return host === '127.0.0.1' || host === 'localhost';
  } catch {
    return false;
  }
}

async function launchBrowser() {
  let playwright;
  try {
    playwright = require('playwright');
  } catch {
    console.error('playwright is not installed. Add it with npm install --save-dev playwright in frontend/.');
    process.exit(1);
  }
  const args = ['--no-sandbox', '--disable-dev-shm-usage'];
  const attempts = [
    () => playwright.chromium.launch({ channel: 'chrome', headless: true, args }),
    () => playwright.chromium.launch({ channel: 'msedge', headless: true, args }),
    () => playwright.chromium.launch({ headless: true, args }),
  ];
  let lastError;
  for (const attempt of attempts) {
    try {
      return await attempt();
    } catch (error) {
      lastError = error;
    }
  }
  console.log(`Bundled Chromium is not available (${lastError.message}). Installing it...`);
  execSync('npx playwright install chromium', { cwd: FRONTEND, stdio: 'inherit' });
  return playwright.chromium.launch({ headless: true, args });
}

async function prerenderRoute(browser, origin, route) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const logs = [];
  page.on('pageerror', (error) => logs.push(String(error)));
  page.on('console', (msg) => {
    if (msg.type() === 'error') logs.push(msg.text());
  });
  await page.route('**/*', async (requestRoute) => {
    if (!isLocal(requestRoute.request().url())) {
      await requestRoute.abort();
      return;
    }
    await requestRoute.continue();
  });

  const pathPart = route === '/' ? '/' : route;
  const target = `${origin}${pathPart}?prerender=1`;
  await page.goto(target, { waitUntil: 'domcontentloaded', timeout: 60000 });
  try {
    await page.waitForFunction(() => document.querySelector('#root h1'), { timeout: 20000 });
  } catch (error) {
    const state = await page.evaluate(() => ({
      flag: window.__ADCOM_PRERENDERED || null,
      h1: Boolean(document.querySelector('h1')),
      root: (document.getElementById('root')?.innerText || '').slice(0, 240),
      title: document.title,
    })).catch((evalError) => ({ evalError: String(evalError) }));
    await page.close();
    throw new Error(`${route} did not render a heading. state=${JSON.stringify(state)} logs=${logs.slice(0, 4).join(' | ')}`);
  }
  let html = await page.evaluate(() => {
    const root = document.getElementById('root');
    const separate = (node) => {
      if (!node) return 0;
      const texts = [];
      const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) texts.push(walker.currentNode);
      let gaps = 0;
      texts.forEach((textNode) => {
        const parent = textNode.parentElement;
        if (!parent || /^(script|style|textarea|title)$/i.test(parent.tagName)) return;
        if (textNode.previousSibling && textNode.previousSibling.nodeType === Node.TEXT_NODE) {
          parent.insertBefore(document.createComment(''), textNode);
          gaps += 1;
        }
      });
      return gaps;
    };
    if (typeof window.__ADCOM_SNAPSHOT__ === 'string' && window.__ADCOM_SNAPSHOT__.includes('<h1')) {
      return window.__ADCOM_SNAPSHOT__;
    }
    if (root) {
      root.dataset.prerendered = 'true';
      separate(root);
    }
    return `<!DOCTYPE html>\n${document.documentElement.outerHTML}`;
  });
  html = prepareNoJs(cleanupHead(html.split(origin).join('').split('?prerender=1').join('').replace('window.__ADCOM_CAPTURE=1;', '')));
  const file = outputFile(route);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
  await page.close();
}

function cleanupHead(html) {
  const headMatch = html.match(/<head[^>]*>[\s\S]*?<\/head>/i);
  if (!headMatch) return html;
  let head = headMatch[0];

  const titles = [...head.matchAll(/<title>[\s\S]*?<\/title>/gi)].map((match) => match[0]);
  if (titles.length > 1) {
    const preferred = [...titles].reverse().find((tag) => !/^<title>\s*Adcom Media\s*<\/title>$/i.test(tag)) || titles[titles.length - 1];
    titles.forEach((tag) => {
      if (tag !== preferred) head = head.replace(tag, '');
    });
  }

  const hasIndex = /<meta\b[^>]*name=["']robots["'][^>]*content=["']index,\s*follow["'][^>]*>/i.test(head)
    || /<meta\b[^>]*content=["']index,\s*follow["'][^>]*name=["']robots["'][^>]*>/i.test(head);
  if (hasIndex) {
    head = head.replace(/<meta\b[^>]*name=["']robots["'][^>]*content=["']noindex,\s*nofollow["'][^>]*>/gi, '');
    head = head.replace(/<meta\b[^>]*content=["']noindex,\s*nofollow["'][^>]*name=["']robots["'][^>]*>/gi, '');
  }

  const dropEarlier = (pattern) => {
    const tags = [...head.matchAll(pattern)].map((match) => match[0]);
    const groups = new Map();
    tags.forEach((tag) => {
      const key = (tag.match(/(?:name|property)=["']([^"']+)["']/i) || [])[1];
      if (!key) return;
      const id = key.toLowerCase();
      if (!groups.has(id)) groups.set(id, []);
      groups.get(id).push(tag);
    });
    groups.forEach((list) => {
      list.slice(0, -1).forEach((tag) => {
        head = head.replace(tag, '');
      });
    });
  };
  dropEarlier(/<meta\b[^>]*\bname=["'][^"']+["'][^>]*>/gi);
  dropEarlier(/<meta\b[^>]*\bproperty=["'][^"']+["'][^>]*>/gi);

  const canonicals = [...head.matchAll(/<link\b[^>]*rel=["']canonical["'][^>]*>/gi)].map((match) => match[0]);
  canonicals.slice(0, -1).forEach((tag) => {
    head = head.replace(tag, '');
  });

  return html.replace(headMatch[0], head);
}

function prepareNoJs(html) {
  let next = html;
  if (!next.includes('id="adcom-nojs"')) {
    const boot = '<style id="adcom-nojs">html.no-js [style*="opacity: 0;"]{opacity:1 !important;transform:none !important}</style><script>document.documentElement.classList.remove("no-js")</script>';
    next = next.replace(/<head[^>]*>/i, (head) => `${head}${boot}`);
  }
  if (!/<html\b[^>]*\bno-js\b/i.test(next)) {
    next = next.replace(/<html\b([^>]*)>/i, (full, rest) => {
      if (/class="/i.test(rest)) return `<html${rest.replace(/class="/i, 'class="no-js ')}>`;
      return `<html class="no-js"${rest}>`;
    });
  }
  return next;
}

function isHydrationMessage(text) {
  return /ADCOM_HYDRATION|Minified React error #418|Minified React error #419|Minified React error #422|Minified React error #423|Minified React error #425|Hydration failed|did not match/i.test(text);
}

async function checkHydration(browser, origin, route) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const notes = [];
  page.on('console', (msg) => {
    const text = msg.text();
    if (isHydrationMessage(text)) notes.push(text);
  });
  page.on('pageerror', (error) => {
    const text = String(error);
    if (isHydrationMessage(text)) notes.push(text);
  });
  await page.route('**/*', async (requestRoute) => {
    if (!isLocal(requestRoute.request().url())) {
      await requestRoute.abort();
      return;
    }
    await requestRoute.continue();
  });
  const target = route === '/' ? `${origin}/` : `${origin}${route}`;
  await page.goto(target, { waitUntil: 'load', timeout: 60000 });
  await page.evaluate(() => new Promise((resolve) => setTimeout(resolve, 1200)));
  await page.close();
  return notes;
}

function textOf(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

function attr(html, pattern) {
  const match = html.match(pattern);
  return match ? match[1].trim() : '';
}

function validateHtml(route, html) {
  const errors = [];
  const canonicalPath = route === '/' ? `${SITE}/` : `${SITE}${route}`;
  const title = attr(html, /<title>([^<]*)<\/title>/i);
  const description = attr(html, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i)
    || attr(html, /<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["']/i);
  const canonical = attr(html, /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i)
    || attr(html, /<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i);
  const robots = attr(html, /<meta[^>]+name=["']robots["'][^>]+content=["']([^"']+)["']/i)
    || attr(html, /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']robots["']/i);
  const ogTitle = attr(html, /<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']*)["']/i)
    || attr(html, /<meta[^>]+content=["']([^"']*)["'][^>]+property=["']og:title["']/i);
  const twitter = attr(html, /<meta[^>]+name=["']twitter:card["'][^>]+content=["']([^"']+)["']/i)
    || attr(html, /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:card["']/i);
  const text = textOf(html);
  const ldBlocks = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].map((m) => m[1]);

  if (!/<h1[\s>]/i.test(html)) errors.push('missing h1');
  if (!title) errors.push('missing title');
  if (!description) errors.push('missing meta description');
  if (canonical !== canonicalPath) errors.push(`canonical ${canonical || '(none)'} != ${canonicalPath}`);
  if (!/index,\s*follow/i.test(robots)) errors.push(`robots ${robots || '(none)'}`);
  if (!ogTitle) errors.push('missing og:title');
  if (!twitter) errors.push('missing twitter:card');
  if (/You need to enable JavaScript/i.test(html)) errors.push('javascript-required message');
  if (/assets\.emergent\.sh|emergent-main\.js/i.test(html)) errors.push('emergent script');
  if (/Loading essays|Loading essay/i.test(text)) errors.push('blog still in loading state');
  if (!/Adcom/i.test(text) || text.length < 400) errors.push('not enough readable text');
  if (!ldBlocks.length) errors.push('missing JSON-LD');
  ldBlocks.forEach((block, index) => {
    try {
      const data = JSON.parse(block.replace(/\\u003c/g, '<'));
      if (data['@context'] !== 'https://schema.org' || !Array.isArray(data['@graph'])) {
        errors.push(`JSON-LD ${index} is not a schema.org graph`);
      }
    } catch (error) {
      errors.push(`JSON-LD ${index} parse error`);
    }
  });

  return {
    route,
    title,
    description,
    canonical,
    robots,
    ogTitle,
    twitter,
    textLength: text.length,
    errors,
  };
}

function ensureSitemap(routes) {
  const sitemapPath = path.join(FRONTEND, 'public', 'sitemap.xml');
  const current = fs.readFileSync(sitemapPath, 'utf8');
  const existing = new Set(routesFromSitemap(current));
  const missing = routes.filter((route) => !existing.has(route));
  if (!missing.length) return [];
  const additions = missing.map((route) => `  <url><loc>${route === '/' ? `${SITE}/` : `${SITE}${route}`}</loc></url>`).join('\n');
  const next = current.replace('</urlset>', `${additions}\n</urlset>`);
  fs.writeFileSync(sitemapPath, next);
  fs.writeFileSync(path.join(BUILD, 'sitemap.xml'), next);
  return missing;
}

async function mapPool(items, limit, worker) {
  const results = new Array(items.length);
  let cursor = 0;
  async function run() {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      results[index] = await worker(items[index], index);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, run));
  return results;
}

async function main() {
  writeSpaShell();
  const posts = await loadBlogs();
  const blogRoutes = posts.map((post) => `/blog/${post.slug}`);
  const sitemapRoutes = routesFromSitemap(fs.readFileSync(path.join(BUILD, 'sitemap.xml'), 'utf8'));
  const only = (process.env.PRERENDER_ONLY || '').split(',').map((item) => item.trim()).filter(Boolean);
  const routes = [...new Set([...STATIC_ROUTES, ...blogRoutes, ...sitemapRoutes])].filter((route) => !only.length || only.includes(route));
  const addedToSitemap = ensureSitemap(routes);
  const bootstrapByPath = new Map();

  const server = await startServer(bootstrapByPath);
  const port = server.address().port;
  const origin = `http://127.0.0.1:${port}`;
  const browser = await launchBrowser();
  const renderNotes = {};

  try {
    await mapPool(routes, 2, async (route) => {
      let bootstrap = null;
      if (route === '/blog') bootstrap = { blogPosts: posts.map(cardPost) };
      if (route.startsWith('/blog/')) {
        const slug = route.slice('/blog/'.length);
        const post = posts.find((item) => item.slug === slug);
        if (!post) throw new Error(`No published post for ${route}`);
        bootstrap = {
          blogPosts: posts.map(cardPost),
          blogPost: {
            slug,
            post,
            related: posts.filter((item) => item.slug !== slug).slice(0, 2).map(cardPost),
          },
        };
      }
      process.stdout.write(`prerender ${route}\n`);
      bootstrapByPath.set(route, bootstrap);
      await prerenderRoute(browser, origin, route);
    });
    await mapPool(routes, 2, async (route) => {
      process.stdout.write(`hydrate ${route}\n`);
      renderNotes[route] = await checkHydration(browser, origin, route);
    });
  } finally {
    await browser.close();
  }

  const reports = [];
  for (const route of routes) {
    const html = fs.readFileSync(outputFile(route), 'utf8');
    const report = validateHtml(route, html);
    if (renderNotes[route]?.length) report.errors.push(...renderNotes[route].map((note) => `render: ${note}`));
    reports.push(report);
  }

  const byTitle = new Map();
  reports.forEach((report) => {
    if (!report.title) return;
    const list = byTitle.get(report.title) || [];
    list.push(report.route);
    byTitle.set(report.title, list);
  });
  byTitle.forEach((list, title) => {
    if (list.length < 2) return;
    list.forEach((route) => {
      const report = reports.find((item) => item.route === route);
      report.errors.push(`duplicate title "${title}"`);
    });
  });

  const privateChecks = ['/login', '/adcom-admin', '/auth/google/done'].map((route) => {
    const file = resolveFile(route);
    const html = fs.readFileSync(file, 'utf8');
    const robots = attr(html, /<meta[^>]+name=["']robots["'][^>]+content=["']([^"']+)["']/i);
    const errors = [];
    if (path.basename(file) !== 'spa.html') errors.push('private route was prerendered');
    if (!/noindex/i.test(robots)) errors.push('private shell is indexable');
    const root = html.match(/<div id="root"[^>]*>([\s\S]*?)<\/div>/i);
    if (root && /<h1[\s>]/i.test(root[1])) errors.push('private shell contains marketing content');
    return { route, robots, errors };
  });

  const report = {
    generatedAt: new Date().toISOString(),
    routes: reports,
    private: privateChecks,
    sitemapAdditions: addedToSitemap,
  };
  fs.writeFileSync(path.join(BUILD, 'seo-report.json'), JSON.stringify(report, null, 2));

  const failed = [...reports, ...privateChecks].filter((item) => item.errors.length);
  console.log(`\nPrerendered ${reports.length} public routes.`);
  if (addedToSitemap.length) console.log(`Sitemap additions: ${addedToSitemap.join(', ')}`);
  if (failed.length) {
    failed.forEach((item) => console.error(`${item.route}: ${item.errors.join('; ')}`));
    server.close();
    process.exit(1);
  }
  console.log('SEO HTML validation passed.');
  server.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
