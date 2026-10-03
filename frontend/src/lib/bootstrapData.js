export function normalizePost(post) {
  if (!post) return post;
  return { ...post, readTime: post.read_time || post.readTime };
}

export function readBootstrap() {
  if (typeof document === 'undefined') return null;
  const el = document.getElementById('adcom-bootstrap');
  if (!el || !el.textContent) return null;
  try {
    return JSON.parse(el.textContent);
  } catch {
    return null;
  }
}

export function bootstrapBlogPosts() {
  const posts = readBootstrap()?.blogPosts;
  return Array.isArray(posts) ? posts.map(normalizePost) : null;
}

export function bootstrapBlogPost(slug) {
  const entry = readBootstrap()?.blogPost;
  if (!entry || entry.slug !== slug || !entry.post) return null;
  return {
    post: normalizePost(entry.post),
    related: (entry.related || []).map(normalizePost),
  };
}
