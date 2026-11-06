"use client";

import { Lock, ArrowRight, Sparkles } from "lucide-react";
import { SignInButton, SignUpButton } from "@clerk/nextjs";

interface GuestPreviewBannerProps {
  title?: string;
  description?: string;
}

export function GuestPreviewBanner({
  title = "Sign in to save your data",
  description = "Create a free account to track your immigration journey. Guest pages stay empty until you sign in.",
}: GuestPreviewBannerProps) {
  return (
    <div className="sc-guest-banner mb-6 rounded-lg border border-border bg-secondary/50 p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <div className="flex items-center gap-3 flex-1">
        <div className="h-9 w-9 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
          <Sparkles className="h-4 w-4 text-blue-600" />
        </div>
        <div>
          <p className="font-semibold text-slate-800 text-sm">{title}</p>
          <p className="text-xs text-slate-500 mt-0.5">{description}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <SignInButton mode="modal">
          <button className="text-xs font-medium text-primary px-3 py-2.5 rounded border border-border hover:bg-secondary transition-colors">
            Sign in
          </button>
        </SignInButton>
        <SignUpButton mode="modal">
          <button className="flex items-center gap-1.5 text-xs font-medium bg-primary hover:bg-primary/90 text-primary-foreground px-3 py-2.5 rounded transition-colors">
            Get started free <ArrowRight className="h-3 w-3" />
          </button>
        </SignUpButton>
      </div>
    </div>
  );
}

export function GuestPreviewOverlay() {
  return (
    <div className="relative">
      <div className="absolute inset-0 z-10 bg-white/70 backdrop-blur-[2px] rounded-xl flex flex-col items-center justify-center gap-4 p-6 text-center">
        <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center">
          <Lock className="h-6 w-6 text-slate-500" />
        </div>
        <div>
          <p className="font-semibold text-slate-800 mb-1">Sign in to unlock</p>
          <p className="text-sm text-slate-500 max-w-xs">Create a free account to save your data and see real-time information.</p>
        </div>
        <div className="flex gap-2">
          <SignInButton mode="modal">
            <button className="text-sm font-semibold text-slate-700 px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
              Sign in
            </button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button className="text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
              Create free account
            </button>
          </SignUpButton>
        </div>
      </div>
    </div>
  );
}
