"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Mail, MessageSquare, Smartphone, Check, AlertCircle } from "lucide-react";

type Channel = "email" | "sms" | "push";
type ReminderSetting = { id: string; title: string; description: string; days: number[]; channels: Channel[]; enabled: boolean };

const DEFAULT_REMINDERS: ReminderSetting[] = [
  { id: "opt", title: "OPT Application Window", description: "Remind me when my 90-day OPT application window opens", days: [90, 60, 30], channels: ["email"], enabled: true },
  { id: "ead", title: "EAD Card Expiry", description: "Alert before my EAD card expires", days: [90, 30, 7], channels: ["email", "sms"], enabled: true },
  { id: "passport", title: "Passport Expiry", description: "Remind me to renew my passport", days: [180, 90, 30], channels: ["email"], enabled: true },
  { id: "i94", title: "I-94 Authorized Stay", description: "Alert when authorized stay period nears end", days: [30, 14, 7], channels: ["email", "sms"], enabled: true },
  { id: "h1b", title: "H-1B Lottery Season", description: "Notify me when H-1B cap registration opens (March)", days: [30, 14], channels: ["email"], enabled: false },
  { id: "visa_bulletin", title: "Visa Bulletin Updates", description: "Monthly alert when new visa bulletin is published", days: [0], channels: ["email"], enabled: true },
  { id: "custom", title: "Custom Deadlines", description: "Notify me for any deadlines I add manually", days: [30, 7, 1], channels: ["email"], enabled: true },
];

export default function RemindersPage() {
  const [reminders, setReminders] = useState(DEFAULT_REMINDERS);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/reminders")
      .then((r) => r.json())
      .then(({ prefs }) => {
        if (prefs && Array.isArray(prefs)) setReminders(prefs);
      })
      .catch(() => {});
  }, []);

  function toggle(id: string) {
    setReminders(prev => prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
  }

  function toggleChannel(id: string, ch: Channel) {
    setReminders(prev => prev.map(r => {
      if (r.id !== id) return r;
      const channels = r.channels.includes(ch)
        ? r.channels.filter(c => c !== ch)
        : [...r.channels, ch];
      return { ...r, channels };
    }));
  }

  async function save() {
    setSaving(true);
    try {
      await fetch("/api/reminders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prefs: reminders }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  }

  const channelIcon: Record<Channel, React.ElementType> = { email: Mail, sms: MessageSquare, push: Smartphone };
  const channelLabel: Record<Channel, string> = { email: "Email", sms: "SMS", push: "Push" };

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Reminders & Notifications</h1>
          <p className="mt-1 text-muted-foreground">Configure how and when StatusClock alerts you</p>
        </div>
        <Button onClick={save} disabled={saving} className="gap-2">
          {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</> : saved ? <><Check className="h-4 w-4" /> Saved!</> : "Save Preferences"}
        </Button>
      </div>

      {/* Delivery channels */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-base">Delivery Channels</CardTitle>
          <CardDescription>Email reminders are available on All-Access. SMS is not offered yet.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {([
              { id: "email" as Channel, label: "Email", icon: Mail, desc: "Sent to the email on your account", available: true },
              { id: "sms" as Channel, label: "SMS", icon: MessageSquare, desc: "Not available yet", available: false },
              { id: "push" as Channel, label: "Push Notifications", icon: Smartphone, desc: "Enable in browser settings", available: false },
            ]).map(ch => {
              const Icon = ch.icon;
              return (
                <div key={ch.id} className={`relative rounded-lg border p-4 ${ch.available ? "border-primary/40 bg-primary/5" : "opacity-60"}`}>
                  {!ch.available && <Badge variant="secondary" className="absolute top-3 right-3 text-[10px]">Pro</Badge>}
                  <Icon className="h-5 w-5 text-primary mb-2" />
                  <p className="font-medium text-sm">{ch.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{ch.desc}</p>
                  {ch.available && (
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-green-600">
                      <Check className="h-3.5 w-3.5" /> Active
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Individual reminders */}
      <div className="space-y-4">
        {reminders.map(r => (
          <Card key={r.id} className={!r.enabled ? "opacity-60" : ""}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-sm">{r.title}</p>
                    <Badge variant={r.enabled ? "success" : "secondary"} className="text-xs">
                      {r.enabled ? "On" : "Off"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{r.description}</p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="text-xs text-muted-foreground mr-1">Remind at:</span>
                    {r.days.map(d => (
                      <Badge key={d} variant="outline" className="text-xs">
                        {d === 0 ? "Day of" : `${d} days before`}
                      </Badge>
                    ))}
                  </div>

                  <div className="mt-3 flex gap-2">
                    {(["email", "sms", "push"] as Channel[]).map(ch => {
                      const Icon = channelIcon[ch];
                      const active = r.channels.includes(ch);
                      return (
                        <button
                          key={ch}
                          onClick={() => toggleChannel(r.id, ch)}
                          disabled={!r.enabled}
                          className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs transition-colors ${
                            active ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"
                          }`}
                        >
                          <Icon className="h-3 w-3" />
                          {channelLabel[ch]}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  onClick={() => toggle(r.id)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none ${
                    r.enabled ? "bg-primary" : "bg-muted"
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition-transform ${
                      r.enabled ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 rounded-lg border border-orange-200 bg-orange-50 p-4 flex gap-3">
        <AlertCircle className="h-5 w-5 text-orange-500 shrink-0" />
        <p className="text-sm text-orange-800">
          SMS and push notifications require a Pro or Premium plan. Upgrade to never miss a critical immigration deadline.
        </p>
      </div>
    </div>
  );
}
