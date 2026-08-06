import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, Eye, LogOut, BarChart3, X, ArrowUpRight } from 'lucide-react';
import { apiGet, apiPost, apiPatch, apiDelete } from '@/lib/api';

function StatCard({ label, value, testid }) {
  return (
    <div data-testid={testid} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <div className="adam-mono text-[10px] uppercase tracking-[0.28em] text-white/40 mb-2">{label}</div>
      <div className="font-display text-4xl md:text-5xl tracking-tight text-white">{value}</div>
    </div>
  );
}

const EMPTY_POST = {
  title: '',
  excerpt: '',
  category: 'Growth',
  read_time: '5 min read',
  cover: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80',
  author: { name: 'Adcom Studio', role: 'Editorial', avatar: 'https://i.pravatar.cc/120?img=8' },
  body: [],
  published: true,
};

function BlogEditor({ initial, onCancel, onSaved }) {
  const [form, setForm] = useState(() => ({ ...EMPTY_POST, ...initial, body: (initial?.body || []).join('\n\n') }));
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');
  const isEdit = !!initial?.id;

  const submit = async () => {
    setSaving(true); setErr('');
    try {
      const payload = {
        title: form.title,
        excerpt: form.excerpt,
        category: form.category,
        read_time: form.read_time,
        cover: form.cover,
        author: form.author,
        body: form.body.split(/\n{2,}/).map((s) => s.trim()).filter(Boolean),
        published: !!form.published,
      };
      if (isEdit) {
        const updated = await apiPatch(`/admin/blogs/${initial.id}`, payload);
        onSaved(updated);
      } else {
        const created = await apiPost('/admin/blogs', payload);
        onSaved(created);
      }
    } catch (e) {
      setErr(e.message || 'Save failed');
    } finally { setSaving(false); }
  };

  const upd = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const updAuthor = (k, v) => setForm((f) => ({ ...f, author: { ...f.author, [k]: v } }));

  return (
    <div className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-xl flex items-start md:items-center justify-center overflow-y-auto p-4 md:p-8" data-testid="admin-editor">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-3xl bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 md:p-10 my-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="adam-mono text-[10px] uppercase tracking-[0.3em] text-[#F43F5E] mb-2">{isEdit ? 'Edit essay' : 'New essay'}</div>
            <div className="font-display text-2xl md:text-3xl tracking-tight">Compose</div>
          </div>
          <button onClick={onCancel} className="w-10 h-10 rounded-full border border-white/10 hover:bg-white/10 flex items-center justify-center" data-testid="admin-editor-close">
            <X size={16} />
          </button>
        </div>
        <div className="space-y-5">
          <Field label="Title">
            <input data-testid="admin-editor-title" value={form.title} onChange={(e) => upd('title', e.target.value)} className={inp} placeholder="Most growth plateaus…" />
          </Field>
          <Field label="Excerpt">
            <textarea value={form.excerpt} onChange={(e) => upd('excerpt', e.target.value)} rows={2} className={inp} placeholder="One sentence summary." />
          </Field>
          <div className="grid md:grid-cols-3 gap-4">
            <Field label="Category">
              <input value={form.category} onChange={(e) => upd('category', e.target.value)} className={inp} />
            </Field>
            <Field label="Read time">
              <input value={form.read_time} onChange={(e) => upd('read_time', e.target.value)} className={inp} />
            </Field>
            <Field label="Published">
              <select value={form.published ? 'true' : 'false'} onChange={(e) => upd('published', e.target.value === 'true')} className={inp}>
                <option value="true">Live</option>
                <option value="false">Draft</option>
              </select>
            </Field>
          </div>
          <Field label="Cover image URL">
            <input value={form.cover} onChange={(e) => upd('cover', e.target.value)} className={inp} />
          </Field>
          <div className="grid md:grid-cols-3 gap-4">
            <Field label="Author name">
              <input value={form.author.name} onChange={(e) => updAuthor('name', e.target.value)} className={inp} />
            </Field>
            <Field label="Author role">
              <input value={form.author.role} onChange={(e) => updAuthor('role', e.target.value)} className={inp} />
            </Field>
            <Field label="Author avatar URL">
              <input value={form.author.avatar} onChange={(e) => updAuthor('avatar', e.target.value)} className={inp} />
            </Field>
          </div>
          <Field label="Body (blank line separates paragraphs · `## H2` for section headings · `**text**` for bold)">
            <textarea data-testid="admin-editor-body" value={form.body} onChange={(e) => upd('body', e.target.value)} rows={14} className={`${inp} font-mono text-sm leading-relaxed`} />
          </Field>

          {err && <div className="text-sm text-[#F43F5E]">{err}</div>}

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button onClick={onCancel} className="px-5 py-2.5 rounded-full border border-white/15 text-sm hover:bg-white/5">Cancel</button>
            <button data-testid="admin-editor-save" onClick={submit} disabled={saving || !form.title.trim()} className="px-6 py-2.5 rounded-full bg-[#E11D2E] text-white text-sm font-semibold hover:bg-[#ff2f45] disabled:opacity-50 disabled:cursor-not-allowed">
              {saving ? 'Saving…' : (isEdit ? 'Save changes' : 'Publish essay')}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

const inp = "w-full px-4 py-3 rounded-xl bg-black border border-white/10 focus:border-[#F43F5E] outline-none text-white placeholder:text-white/30";
const Field = ({ label, children }) => (
  <label className="block">
    <div className="adam-mono text-[10px] uppercase tracking-[0.28em] text-white/40 mb-2">{label}</div>
    {children}
  </label>
);

export default function AdminDashboard({ user, onSignedOut }) {
  const [posts, setPosts] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    try {
      const [all, an] = await Promise.all([
        apiGet('/blogs?all=true'),
        apiGet('/admin/analytics'),
      ]);
      setPosts(all);
      setAnalytics(an);
    } finally { setLoading(false); }
  };

  useEffect(() => { refresh(); }, []);

  const remove = async (p) => {
    if (!window.confirm(`Delete "${p.title}"? This cannot be undone.`)) return;
    await apiDelete(`/admin/blogs/${p.id}`);
    refresh();
  };

  const logout = async () => {
    try { await apiPost('/auth/logout', {}); } catch {}
    onSignedOut();
  };

  const topPost = useMemo(() => (analytics?.top?.[0] || null), [analytics]);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Top bar */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/" className="font-display text-xl tracking-tight">Adcom<span className="text-[#F43F5E]">.</span></a>
            <span className="adam-mono text-[10px] uppercase tracking-[0.3em] text-white/40">Control</span>
          </div>
          <div className="flex items-center gap-4">
            {user?.picture && <img src={user.picture} alt="" className="w-8 h-8 rounded-full border border-white/20" />}
            <div className="hidden sm:block text-right leading-tight">
              <div className="text-sm">{user?.name}</div>
              <div className="adam-mono text-[10px] uppercase tracking-widest text-white/40">{user?.role}</div>
            </div>
            <button data-testid="admin-signout" onClick={logout} className="w-9 h-9 rounded-full border border-white/15 hover:bg-white/10 flex items-center justify-center" title="Sign out">
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10 md:py-14">
        {/* Hero row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="adam-mono text-[11px] uppercase tracking-[0.3em] text-[#F43F5E] mb-3">Journal · Control</div>
            <h1 className="font-display text-5xl md:text-6xl tracking-tighter leading-[0.95]">
              Studio<br />operating room.
            </h1>
          </div>
          <button
            data-testid="admin-new-post"
            onClick={() => setCreating(true)}
            className="group inline-flex items-center gap-3 px-6 py-3 rounded-full bg-[#E11D2E] text-white text-sm font-semibold hover:bg-[#ff2f45] transition-colors"
          >
            <Plus size={16} /> New essay
          </button>
        </div>

        {/* Analytics */}
        <div className="grid md:grid-cols-3 gap-4 md:gap-5 mb-10">
          <StatCard label="Total views" value={(analytics?.total_views ?? 0).toLocaleString()} testid="admin-stat-views" />
          <StatCard label="Live essays" value={analytics?.total_posts ?? 0} testid="admin-stat-posts" />
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 flex flex-col justify-between" data-testid="admin-top-post">
            <div>
              <div className="adam-mono text-[10px] uppercase tracking-[0.28em] text-white/40 mb-2 flex items-center gap-2">
                <BarChart3 size={12} /> Top essay
              </div>
              {topPost ? (
                <>
                  <div className="font-display text-lg leading-tight tracking-tight line-clamp-2">{topPost.title}</div>
                  <div className="mt-2 adam-mono text-[11px] text-white/50">{topPost.views} views</div>
                </>
              ) : (
                <div className="text-white/40 text-sm">No views yet.</div>
              )}
            </div>
          </div>
        </div>

        {/* Posts list */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.02] overflow-hidden">
          <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
            <div className="adam-mono text-[11px] uppercase tracking-[0.3em] text-white/50">All essays · {posts.length}</div>
            {loading && <div className="text-xs text-white/40">Refreshing…</div>}
          </div>
          <ul className="divide-y divide-white/[0.06]">
            {posts.map((p) => (
              <li key={p.id} data-testid={`admin-post-${p.slug}`} className="p-4 md:p-6 flex flex-col md:flex-row md:items-center gap-4 hover:bg-white/[0.02] transition-colors">
                <img src={p.cover} alt="" className="w-full md:w-24 h-24 md:h-16 rounded-xl object-cover border border-white/10" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 adam-mono text-[10px] uppercase tracking-[0.25em] text-white/45 mb-1">
                    <span className="text-[#F43F5E]">{p.category}</span>
                    <span className="w-1 h-1 rounded-full bg-white/30" />
                    <span>{p.date}</span>
                    {!p.published && <span className="ml-2 px-2 py-0.5 rounded-full border border-white/20 text-white/60">Draft</span>}
                  </div>
                  <div className="font-display text-lg md:text-xl tracking-tight truncate">{p.title}</div>
                </div>
                <div className="flex items-center gap-2 md:gap-3">
                  <a href={`/blog/${p.slug}`} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full border border-white/10 hover:bg-white/10 flex items-center justify-center" title="View">
                    <Eye size={15} />
                  </a>
                  <button onClick={() => setEditing(p)} className="w-9 h-9 rounded-full border border-white/10 hover:bg-white/10 flex items-center justify-center" title="Edit" data-testid={`admin-edit-${p.slug}`}>
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => remove(p)} className="w-9 h-9 rounded-full border border-white/10 hover:bg-[#E11D2E] hover:border-[#E11D2E] flex items-center justify-center" title="Delete" data-testid={`admin-delete-${p.slug}`}>
                    <Trash2 size={14} />
                  </button>
                  <div className="hidden md:flex items-center gap-1 adam-mono text-[11px] text-white/45 min-w-[70px] justify-end">
                    <ArrowUpRight size={12} /> {p.views || 0}
                  </div>
                </div>
              </li>
            ))}
            {!loading && !posts.length && (
              <li className="p-10 text-center text-white/50">No essays yet. Create the first one.</li>
            )}
          </ul>
        </div>
      </div>

      {creating && (
        <BlogEditor onCancel={() => setCreating(false)} onSaved={() => { setCreating(false); refresh(); }} />
      )}
      {editing && (
        <BlogEditor initial={editing} onCancel={() => setEditing(null)} onSaved={() => { setEditing(null); refresh(); }} />
      )}
    </div>
  );
}
