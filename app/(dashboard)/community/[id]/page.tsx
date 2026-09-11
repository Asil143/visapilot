"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, ArrowLeft, Bookmark, Flag, Loader2, MessageCircle, Share2, ThumbsUp } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { RichText } from "@/components/ui/rich-text";

type Post = {
  id: string;
  title: string;
  body: string;
  category: string;
  author_name: string;
  author_initials: string;
  author_visa: string;
  tags: string[] | null;
  upvotes: number;
  replies: number;
  created_at: string;
};

type LocalReply = {
  id: string;
  author_name: string;
  author_initials: string;
  body: string;
  upvotes: number;
  is_best_answer: boolean;
  created_at: string;
};

export default function CommunityPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reply, setReply] = useState("");
  const [upvoted, setUpvoted] = useState(false);
  const [saved, setSaved] = useState(false);
  const [localReplies, setLocalReplies] = useState<LocalReply[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [upvoting, setUpvoting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadPost() {
      setLoading(true);
      setError(null);
      try {
        const [postRes, repliesRes] = await Promise.all([
          fetch(`/api/community/posts/${id}`),
          fetch(`/api/community/posts/${id}/replies`),
        ]);
        const postData = await postRes.json();
        const repliesData = await repliesRes.json();
        if (!postRes.ok) throw new Error(postData.error || "Failed to load post");
        if (!repliesRes.ok) throw new Error(repliesData.error || "Failed to load replies");
        if (!cancelled) {
          setPost(postData);
          setLocalReplies(repliesData);
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load post");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadPost();
    return () => {
      cancelled = true;
    };
  }, [id]);

  async function handleUpvote() {
    if (!post || upvoted || upvoting) return;
    setUpvoting(true);
    try {
      const res = await fetch(`/api/community/posts/${post.id}/upvote`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to upvote");
      setPost({ ...post, upvotes: data.upvotes });
      setUpvoted(true);
    } catch {
      setUpvoted(false);
    } finally {
      setUpvoting(false);
    }
  }

  async function handleSubmitReply() {
    if (!reply.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/community/posts/${id}/replies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: reply }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to post reply");
      setLocalReplies((replies) => [...replies, data]);
      setPost((current) => current ? { ...current, replies: current.replies + 1 } : current);
      setReply("");
    } catch {
      // Keep the draft in place so the user can retry.
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-3xl p-8">
      <Link href="/community" className="mb-6 flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Community
      </Link>

      {loading && (
        <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading post...
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {post && (
        <>
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="text-xs capitalize">{post.category.replace(/-/g, " ")}</Badge>
                {(post.tags ?? []).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                ))}
              </div>

              <h1 className="mb-3 text-xl font-bold leading-snug">{post.title}</h1>

              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                  {post.author_initials || post.author_name[0]?.toUpperCase() || "?"}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-medium">{post.author_name}</span>
                    <Badge variant="secondary" className="px-1.5 text-[10px]">{post.author_visa}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                  </p>
                </div>
              </div>

              <RichText text={post.body} className="space-y-3 text-sm" />

              <Separator className="my-5" />

              <div className="flex flex-wrap items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className={upvoted ? "border-primary bg-primary/5 text-primary" : ""}
                  onClick={handleUpvote}
                  disabled={upvoting || upvoted}
                >
                  {upvoting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ThumbsUp className="mr-2 h-4 w-4" />}
                  {post.upvotes} Helpful
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className={saved ? "border-primary bg-primary/5 text-primary" : ""}
                  onClick={() => setSaved((value) => !value)}
                >
                  <Bookmark className="mr-2 h-4 w-4" />
                  {saved ? "Saved" : "Save"}
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="mr-2 h-4 w-4" /> Share
                </Button>
                <Button variant="ghost" size="sm" className="ml-auto text-muted-foreground">
                  <Flag className="mr-2 h-4 w-4" /> Report
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-base font-bold">
              <MessageCircle className="h-4 w-4" />
              {localReplies.length} Replies
            </h2>
          </div>

          <div className="mb-6 space-y-3">
            {localReplies.map((localReply) => (
              <Card key={localReply.id} className={localReply.is_best_answer ? "border-green-300 bg-green-50/30" : ""}>
                <CardContent className="p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      {localReply.author_initials || localReply.author_name[0]?.toUpperCase() || "?"}
                    </div>
                    <span className="text-sm font-medium">{localReply.author_name}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(localReply.created_at), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm leading-5 text-muted-foreground">{localReply.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardContent className="space-y-3 p-4">
              <p className="text-sm font-semibold">Add a Reply</p>
              <Textarea
                value={reply}
                onChange={(event) => setReply(event.target.value)}
                placeholder="Share your experience or ask a follow-up question..."
                rows={4}
              />
              <div className="flex justify-end">
                <Button onClick={handleSubmitReply} disabled={!reply.trim() || submitting}>
                  {submitting ? "Posting..." : "Post Reply"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
