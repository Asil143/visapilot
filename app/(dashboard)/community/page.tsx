"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Search, Plus, MessageSquare, ThumbsUp, Pin, CheckCircle2,
  TrendingUp, Clock, Flame, ChevronRight, Loader2, AlertCircle,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const CATEGORIES = [
  { id: "all", label: "All Posts", icon: "💬" },
  { id: "f1-students", label: "F-1 Students", icon: "🎓" },
  { id: "opt-stem-opt", label: "OPT / STEM OPT", icon: "💼" },
  { id: "h1b-work-visa", label: "H-1B Work Visa", icon: "🏢" },
  { id: "green-card", label: "Green Card", icon: "🌿" },
  { id: "success-stories", label: "Success Stories", icon: "🎉" },
  { id: "lawyer-ama", label: "Attorney AMAs", icon: "⚖️" },
];

type Post = {
  id: string; category: string; title: string; body: string;
  author_name: string; author_visa: string; author_initials: string;
  upvotes: number; replies: number; is_answered: boolean; is_pinned: boolean;
  tags: string[]; created_at: string;
};

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [sort, setSort] = useState("hot");
  const [newPostOpen, setNewPostOpen] = useState(false);
  const [newPost, setNewPost] = useState({ title: "", body: "", category: "", tags: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [upvoting, setUpvoting] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const res = await fetch(`/api/community/posts?category=${activeCategory}&sort=${sort}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load posts");
      setPosts(data);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Failed to load posts");
    } finally {
      setLoading(false);
    }
  }, [activeCategory, sort]);

  useEffect(() => { Promise.resolve().then(fetchPosts); }, [fetchPosts]);

  const filtered = posts.filter(
    (p) =>
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase()))
  );

  async function handleSubmitPost() {
    if (!newPost.title || !newPost.body || !newPost.category) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/community/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPost),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create post");
      setPosts((prev) => [data, ...prev]);
      setNewPostOpen(false);
      setNewPost({ title: "", body: "", category: "", tags: "" });
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleUpvote(postId: string) {
    setUpvoting(postId);
    try {
      const res = await fetch(`/api/community/posts/${postId}/upvote`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error();
      setPosts((prev) => prev.map((p) => p.id === postId ? { ...p, upvotes: data.upvotes } : p));
    } catch {
      // silent fail for upvote
    } finally {
      setUpvoting(null);
    }
  }

  return (
    <div className="p-4 md:p-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Community</h1>
          <p className="mt-1 text-muted-foreground">Ask questions, share experiences, find support</p>
        </div>
        <Button onClick={() => setNewPostOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> New Post
        </Button>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="hidden lg:block w-52 shrink-0">
          <p className="text-xs font-semibold uppercase text-muted-foreground tracking-wide mb-3">Categories</p>
          <div className="space-y-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`w-full flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors text-left ${
                  activeCategory === cat.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent"
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="font-semibold text-sm text-slate-800">Attorney AMAs</p>
            <p className="text-xs mt-1 text-slate-500 leading-relaxed">Live attorney sessions are not scheduled yet. Join the waitlist and we&apos;ll email you when the first one is booked.</p>
            <Button asChild variant="outline" size="sm" className="mt-3 w-full text-xs h-7">
              <Link href="/events">Get notified</Link>
            </Button>
          </div>
        </div>

        {/* Main feed */}
        <div className="flex-1 min-w-0">
          <div className="flex gap-3 mb-5">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search posts..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Select value={sort} onValueChange={(v) => setSort(v)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hot"><span className="flex items-center gap-2"><Flame className="h-4 w-4" />Hot</span></SelectItem>
                <SelectItem value="new"><span className="flex items-center gap-2"><Clock className="h-4 w-4" />New</span></SelectItem>
                <SelectItem value="top"><span className="flex items-center gap-2"><TrendingUp className="h-4 w-4" />Top</span></SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Load error */}
          {loadError && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3 mb-4">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {loadError}
              <button onClick={fetchPosts} className="ml-auto underline text-xs">Retry</button>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-16 text-muted-foreground gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="text-sm">Loading posts…</span>
            </div>
          )}

          {/* Posts */}
          {!loading && (
            <div className="space-y-3">
              {filtered.map((post) => (
                <Card key={post.id} className="hover:shadow-md transition-shadow cursor-pointer group">
                  <CardContent className="p-5">
                    <div className="flex gap-4">
                      {/* Vote */}
                      <div className="flex flex-col items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleUpvote(post.id)}
                          disabled={upvoting === post.id}
                          className="rounded p-1 hover:bg-accent disabled:opacity-50"
                        >
                          {upvoting === post.id
                            ? <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                            : <ThumbsUp className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />}
                        </button>
                        <span className="text-sm font-semibold">{post.upvotes}</span>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-2 flex-wrap">
                          {post.is_pinned && <Badge variant="secondary" className="text-xs"><Pin className="mr-1 h-3 w-3" />Pinned</Badge>}
                          {post.is_answered && <Badge variant="success" className="text-xs"><CheckCircle2 className="mr-1 h-3 w-3" />Answered</Badge>}
                          <Badge variant="outline" className="text-xs capitalize">{post.category.replace(/-/g, " ")}</Badge>
                        </div>
                        <Link href={`/community/${post.id}`}>
                          <h3 className="font-semibold mt-1.5 group-hover:text-primary transition-colors line-clamp-2">
                            {post.title}
                          </h3>
                        </Link>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{post.body}</p>

                        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <Avatar className="h-5 w-5">
                              <AvatarFallback className="text-[10px]">{post.author_initials}</AvatarFallback>
                            </Avatar>
                            <span>{post.author_name}</span>
                            {post.author_visa && (
                              <Badge variant="info" className="text-[10px] px-1.5 py-0">{post.author_visa}</Badge>
                            )}
                          </div>
                          <span>·</span>
                          <span>{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</span>
                          <span>·</span>
                          <span className="flex items-center gap-1"><MessageSquare className="h-3 w-3" />{post.replies} replies</span>
                        </div>

                        {post.tags?.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {post.tags.map((t) => (
                              <span key={t} className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">#{t}</span>
                            ))}
                          </div>
                        )}
                      </div>

                      <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0 self-center opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filtered.length === 0 && !loadError && (
                <div className="text-center py-16 rounded-xl border border-dashed">
                  <MessageSquare className="h-10 w-10 mx-auto mb-3 text-slate-300" />
                  <p className="font-medium text-muted-foreground">No posts yet</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {search ? "No posts match your search." : "Be the first to start a conversation!"}
                  </p>
                  {!search && (
                    <Button variant="outline" size="sm" className="mt-4" onClick={() => setNewPostOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" /> Create the first post
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* New Post Dialog */}
      <Dialog open={newPostOpen} onOpenChange={setNewPostOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Create New Post</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select value={newPost.category} onValueChange={(v) => setNewPost((p) => ({ ...p, category: v }))}>
                <SelectTrigger><SelectValue placeholder="Select a category..." /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.filter((c) => c.id !== "all").map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.icon} {c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Title</Label>
              <Input
                placeholder="Write a clear, specific title..."
                value={newPost.title}
                onChange={(e) => setNewPost((p) => ({ ...p, title: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Body</Label>
              <Textarea
                placeholder="Share your question or experience in detail..."
                value={newPost.body}
                onChange={(e) => setNewPost((p) => ({ ...p, body: e.target.value }))}
                rows={5}
                className="resize-none"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Tags (comma separated)</Label>
              <Input
                placeholder="e.g. OPT, EAD, USCIS"
                value={newPost.tags}
                onChange={(e) => setNewPost((p) => ({ ...p, tags: e.target.value }))}
              />
            </div>
            <div className="rounded-lg bg-orange-50 border border-orange-200 p-3 text-xs text-orange-800">
              ⚠️ Do not share personal identifiers (passport numbers, SEVIS IDs, etc.) in public posts.
            </div>
            {submitError && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                {submitError}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewPostOpen(false)}>Cancel</Button>
            <Button
              disabled={!newPost.title || !newPost.body || !newPost.category || submitting}
              onClick={handleSubmitPost}
            >
              {submitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Posting…</> : "Post"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
