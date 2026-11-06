"use client";

import { useState, useEffect } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Check, Crown, Shield, User, CreditCard, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import { PaymentModal, type PlanInfo } from "@/components/payments/PaymentModal";
import { SUPPORT_EMAIL } from "@/lib/site";

const PLAN_LABELS: Record<string, string> = {
  free: "Free",
  h1b: "H-1B Season Pack",
  opt: "OPT / STEM OPT Pack",
  rfe: "RFE Response Pack",
  greencard: "Green Card Prep Pack",
  "all-access": "All-Access",
};

const PACK_OFFERS: PlanInfo[] = [
  { id: "opt", name: "OPT / STEM OPT Pack", price: 19, period: "one-time" },
  { id: "h1b", name: "H-1B Season Pack", price: 29, period: "one-time" },
  { id: "rfe", name: "RFE Response Pack", price: 39, period: "one-time" },
  { id: "greencard", name: "Green Card Prep Pack", price: 49, period: "one-time" },
  { id: "all-access", name: "All-Access Plan", price: 99, period: "/ year" },
];

const COUNTRIES = ["India", "China", "Mexico", "Brazil", "Philippines", "Nigeria", "South Korea", "Pakistan", "Other"];
const VISA_TYPES = [
  "F-1 Student", "OPT", "STEM OPT", "H-1B", "H-4", "J-1", "J-2",
  "L-1A", "L-1B", "L-2", "O-1A", "O-1B", "TN", "E-3",
  "Green Card (Pending I-485)", "Green Card (LPR)", "Other",
];

export default function SettingsPage() {
  const { user } = useUser();
  const { openUserProfile } = useClerk();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [currentPlanKey, setCurrentPlanKey] = useState<string>("free");
  const [upgradeModal, setUpgradeModal] = useState<PlanInfo | null>(null);

  const [profile, setProfile] = useState({
    nationality: "",
    currentVisa: "",
    schoolOrEmployer: "",
    phone: "",
  });

  useEffect(() => {
    fetch("/api/profile")
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data) {
          setProfile({
            nationality: data.country_of_birth ?? "",
            currentVisa: data.visa_type ?? "",
            schoolOrEmployer: data.employer ?? "",
            phone: data.phone ?? "",
          });
          setCurrentPlanKey(data.subscription_plan ?? "free");
        }
      })
      .finally(() => setLoading(false));
  }, []);

  async function save() {
    setSaving(true);
    await fetch("/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        country_of_birth: profile.nationality || null,
        visa_type: profile.currentVisa || null,
        employer: profile.schoolOrEmployer || null,
        phone: profile.phone || null,
      }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const currentPlan = currentPlanKey || "free";
  const currentPlanName = PLAN_LABELS[currentPlan] ?? (currentPlan === "free" ? "Free" : "Paid plan");

  const userEmail = user?.emailAddresses?.[0]?.emailAddress ?? "";

  return (
    <div className="p-4 md:p-8 max-w-3xl">
      {upgradeModal && <PaymentModal plan={upgradeModal} onClose={() => setUpgradeModal(null)} userEmail={userEmail} />}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="mt-1 text-muted-foreground">Manage your account and preferences</p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="mb-8">
          <TabsTrigger value="profile" className="gap-2"><User className="h-4 w-4" /> Profile</TabsTrigger>
          <TabsTrigger value="subscription" className="gap-2"><Crown className="h-4 w-4" /> Subscription</TabsTrigger>
          <TabsTrigger value="security" className="gap-2"><Shield className="h-4 w-4" /> Security</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Personal Information</CardTitle>
              <CardDescription>Used to personalize your experience and reminders</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={user?.imageUrl} />
                  <AvatarFallback className="text-lg">{user?.firstName?.[0]}{user?.lastName?.[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{user?.fullName}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{user?.emailAddresses[0]?.emailAddress}</p>
                </div>
              </div>

              <Separator />

              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label>Full Name</Label>
                    <Input value={user?.fullName ?? ""} disabled className="bg-muted" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Email</Label>
                    <Input value={user?.emailAddresses[0]?.emailAddress ?? ""} disabled className="bg-muted" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Phone (optional)</Label>
                    <Input placeholder="+1 (555) 000-0000" value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Country of Birth / Nationality</Label>
                    <Select value={profile.nationality} onValueChange={v => setProfile(p => ({ ...p, nationality: v }))}>
                      <SelectTrigger><SelectValue placeholder="Select country..." /></SelectTrigger>
                      <SelectContent>
                        {COUNTRIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Current Visa Status</Label>
                    <Select value={profile.currentVisa} onValueChange={v => setProfile(p => ({ ...p, currentVisa: v }))}>
                      <SelectTrigger><SelectValue placeholder="Select visa type..." /></SelectTrigger>
                      <SelectContent>
                        {VISA_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>School / Employer</Label>
                    <Input value={profile.schoolOrEmployer} onChange={e => setProfile(p => ({ ...p, schoolOrEmployer: e.target.value }))} placeholder="e.g. University of Texas, Google LLC" />
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-2">
                <Button onClick={save} disabled={saving || loading} className="gap-2">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : saved ? <Check className="h-4 w-4" /> : null}
                  {saved ? "Saved!" : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Subscription Tab */}
        <TabsContent value="subscription" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Current Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold">{currentPlanName}</span>
                    <Badge variant={currentPlan === "free" ? "secondary" : "default"}>
                      {currentPlan === "free" ? "Free" : "Active"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {currentPlan === "free"
                      ? "Checklists, bulletin, and 10 AI questions per month."
                      : currentPlan === "all-access"
                        ? "All packs, unlimited AI, and email deadline alerts."
                        : "Event pack access. Buy another pack or All-Access anytime."}
                  </p>
                </div>
                {currentPlan === "free" && (
                  <Button size="sm" asChild>
                    <Link href="/pricing"><Crown className="mr-2 h-4 w-4" /> See pricing</Link>
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {PACK_OFFERS.map(pack => {
                  const isActive = currentPlan === pack.id;
                  return (
                    <div key={pack.id} className={`rounded-lg border p-4 ${isActive ? "border-primary bg-primary/5" : ""}`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-sm">{pack.name}</span>
                        {isActive && <Badge variant="info" className="text-xs">Current</Badge>}
                      </div>
                      <p className="text-lg font-bold">${pack.price} <span className="text-xs font-normal text-muted-foreground">{pack.period}</span></p>
                      {!isActive && (
                        <Button variant="outline" size="sm" className="w-full mt-3"
                          onClick={() => setUpgradeModal(pack)}>
                          Buy {pack.name}
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <CreditCard className="h-4 w-4" /> Billing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {currentPlan === "free"
                  ? "No paid pack yet. Buy a pack or All-Access on the pricing page. Payments are person-to-person and activated after we confirm your screenshot."
                  : `You are on ${currentPlanName}. To cancel or change, email ${SUPPORT_EMAIL}.`}
              </p>
              {currentPlan === "free" && (
                <Button size="sm" className="mt-3" onClick={() => setUpgradeModal({ id: "all-access", name: "All-Access Plan", price: 99, period: "/ year" })}>
                  <Crown className="mr-2 h-4 w-4" /> Upgrade
                </Button>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Account Security</CardTitle>
              <CardDescription>Manage your login and security settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium text-sm">Password</p>
                  <p className="text-xs text-muted-foreground">Managed via Clerk authentication</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => openUserProfile()}>Change Password</Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium text-sm">Two-Factor Authentication</p>
                  <p className="text-xs text-muted-foreground">Add an extra layer of security</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => openUserProfile()}>Enable 2FA</Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium text-sm">Connected Accounts</p>
                  <p className="text-xs text-muted-foreground">Google, GitHub OAuth</p>
                </div>
                <Button variant="outline" size="sm">Manage</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-base text-red-600 flex items-center gap-2">
                <Trash2 className="h-4 w-4" /> Danger Zone
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Deleting your account is irreversible. All your cases, documents, and chat history will be permanently deleted.
              </p>
              <Button variant="destructive" size="sm" onClick={() => { if (confirm("Are you sure? This permanently deletes your account and all data. This cannot be undone.")) window.open(`mailto:${SUPPORT_EMAIL}?subject=Account%20Deletion%20Request`, "_blank"); }}>Delete Account</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
