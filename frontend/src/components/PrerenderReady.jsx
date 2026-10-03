import { useEffect, useInsertionEffect } from 'react';
import { finishPrerenderSnapshot } from '@/lib/prerenderPass';

function separateAdjacentText(root) {
  const texts = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) texts.push(walker.currentNode);
  let gaps = 0;
  texts.forEach((node) => {
    const parent = node.parentElement;
    if (!parent || /^(script|style|textarea|title)$/i.test(parent.tagName)) return;
    if (node.previousSibling && node.previousSibling.nodeType === Node.TEXT_NODE) {
      parent.insertBefore(document.createComment(''), node);
      gaps += 1;
    }
  });
  root.dataset.prerendered = 'true';
  return gaps;
}

function dedupeHead() {
  const titles = [...document.head.querySelectorAll('title')];
  const preferred = [...titles].reverse().find((el) => {
    const text = el.textContent.trim();
    return text && text !== 'Adcom Media';
  }) || titles[titles.length - 1];
  if (preferred && document.title !== preferred.textContent.trim()) {
    document.title = preferred.textContent.trim();
  }
  const keeper = document.head.querySelector('title');
  titles.forEach((el) => {
    if (el !== keeper) el.remove();
  });

  const metas = [...document.head.querySelectorAll('meta')];
  const lastByKey = new Map();
  metas.forEach((el) => {
    const name = el.getAttribute('name');
    const property = el.getAttribute('property');
    if (!name && !property) return;
    const key = `${name || ''}|${property || ''}`;
    if (name === 'robots' && lastByKey.has(key) && /index,\s*follow/i.test(lastByKey.get(key).getAttribute('content') || '')) return;
    lastByKey.set(key, el);
  });
  metas.forEach((el) => {
    const name = el.getAttribute('name');
    const property = el.getAttribute('property');
    if (!name && !property) return;
    const key = `${name || ''}|${property || ''}`;
    if (lastByKey.get(key) !== el) el.remove();
  });

  const canonicals = [...document.head.querySelectorAll('link[rel="canonical"]')];
  canonicals.slice(0, -1).forEach((el) => el.remove());

  const seenLd = new Set();
  [...document.querySelectorAll('script[type="application/ld+json"]')].forEach((el) => {
    const key = (el.textContent || '').trim();
    if (!key || seenLd.has(key)) el.remove();
    else seenLd.add(key);
  });
}

/** Captures prerender HTML during the build browser only. */
export default function PrerenderReady() {
  // Snapshot only after the page heading commits, and only in the build browser.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useInsertionEffect(() => {
    if (typeof window === 'undefined' || window.__ADCOM_CAPTURE !== 1 || window.__ADCOM_SNAPSHOT_DONE__) return undefined;
    const root = document.getElementById('root');
    if (!root || !root.querySelector('h1')) return undefined;
    root.dataset.prerendered = 'true';
    separateAdjacentText(root);
    dedupeHead();
    window.__ADCOM_SNAPSHOT__ = `<!DOCTYPE html>\n${document.documentElement.outerHTML}`;
    window.__ADCOM_SNAPSHOT_DONE__ = 1;
    return undefined;
  });

  useEffect(() => {
    finishPrerenderSnapshot();
  }, []);

  return null;
}
