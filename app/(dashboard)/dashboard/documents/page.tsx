"use client";

import { useState, useEffect, useRef } from "react";
import { useUser, SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GuestPreviewBanner } from "@/components/ui/guest-preview-banner";
import { formatDateShort } from "@/lib/utils/date";
import {
  Upload, FileText, Trash2, Eye, Loader2, CheckCircle2,
  ChevronDown, ChevronRight, Shield, X,
} from "lucide-react";

// ─── Document types ───────────────────────────────────────────────────────────

const DOC_TYPES = [
  "Passport", "I-20", "EAD", "I-797", "I-485 Receipt",
  "I-140 Approval", "I-94", "Visa Stamp", "Other",
] as const;
type DocType = typeof DOC_TYPES[number];

const DOC_ICON: Record<string, string> = {
  "Passport": "🛂", "I-20": "🎓", "EAD": "💳", "I-797": "📜",
  "I-485 Receipt": "🌿", "I-140 Approval": "📋", "I-94": "📋",
  "Visa Stamp": "🏷️", "Other": "📁",
};

const DOC_COLOR: Record<string, string> = {
  "Passport": "#fee2e2", "I-20": "#dbeafe", "EAD": "#ccfbf1",
  "I-797": "#dcfce7", "I-485 Receipt": "#f0fdf4", "I-140 Approval": "#ecfdf5",
  "I-94": "#ede9fe", "Visa Stamp": "#fef9c3", "Other": "#f1f5f9",
};

// ─── Checklist ────────────────────────────────────────────────────────────────

const CHECKLIST = [
  {
    id: "identity", label: "Identity & Travel", icon: "🛂",
    items: [
      { name: "Passport (photo page)", hint: "Valid for 6+ months beyond stay", required: true },
      { name: "Passport (all entry stamps)", hint: "Scan all pages with stamps or visas" },
      { name: "Birth Certificate", hint: "Original or certified translation if non-English" },
      { name: "National ID Card", hint: "Home country government-issued ID" },
    ],
  },
  {
    id: "f1", label: "F-1 / Student Status", icon: "🎓",
    items: [
      { name: "I-20 (current, active)", hint: "Valid travel signature within 12 months", required: true },
      { name: "All prior I-20s", hint: "Keep all historical I-20s" },
      { name: "SEVIS Fee Receipt (I-901)", hint: "Proof of SEVIS fee payment" },
      { name: "DS-160 Confirmation Page", hint: "Visa application barcode page" },
    ],
  },
  {
    id: "entry", label: "Entry & Admission", icon: "✈️",
    items: [
      { name: "US Visa Stamp", hint: "Passport page showing visa label", required: true },
      { name: "I-94 Arrival/Departure Record", hint: "Download from i94.cbp.dhs.gov", required: true },
      { name: "CBP Admission Stamp", hint: "Port-of-entry stamp & admit-until date" },
    ],
  },
  {
    id: "work", label: "Work Authorization", icon: "💳",
    items: [
      { name: "EAD Card — OPT / STEM OPT", hint: "Front and back" },
      { name: "I-797 Approval Notice", hint: "For H-1B, L-1, O-1 — keep originals" },
      { name: "Advance Parole (I-131)", hint: "Travel doc while I-485 pending" },
    ],
  },
  {
    id: "gc", label: "Green Card Process", icon: "🌿",
    items: [
      { name: "PERM / ETA-9089", hint: "Approved labor cert for EB-2 / EB-3" },
      { name: "I-140 Approval Notice", hint: "Immigrant Petition — priority date proof" },
      { name: "I-485 Receipt Notice", hint: "USCIS confirmation of AOS application" },
      { name: "I-864 Affidavit of Support", hint: "Financial sponsor form" },
    ],
  },
  {
    id: "financial", label: "Tax & Financial", icon: "💰",
    items: [
      { name: "Federal Tax Returns (last 3 years)", hint: "Form 1040 — critical for AOS and more" },
      { name: "W-2 / 1099 Forms", hint: "All income forms matching tax returns" },
      { name: "Bank Statements (last 3 months)", hint: "Required for I-864 financial support" },
    ],
  },
];

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

interface Doc {
  id: string;
  name: string;
  document_type: string;
  file_size: number;
  signed_url: string | null;
  created_at: string;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DocumentsPage() {
  const { isSignedIn } = useUser();
  const [docs, setDocs] = useState<Doc[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(false);

  // Upload state
  const [showUpload, setShowUpload] = useState(false);
  const [docType, setDocType] = useState<DocType>("Passport");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadDone, setUploadDone] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Checklist expand
  const [expanded, setExpanded] = useState<string[]>(["identity", "entry", "work"]);

  useEffect(() => {
    if (!isSignedIn) return;
    Promise.resolve().then(() => setLoadingDocs(true));
    fetch("/api/documents")
      .then(r => r.ok ? r.json() : [])
      .then(data => setDocs(Array.isArray(data) ? data : []))
      .finally(() => setLoadingDocs(false));
  }, [isSignedIn]);

  function pickFile(f: File) {
    setFile(f);
    setUploadDone(false);
    setUploadError(null);
  }

  async function upload() {
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("docType", docType);
    const res = await fetch("/api/documents/upload", { method: "POST", body: fd });
    const json = await res.json();
    if (!res.ok) {
      setUploadError(json.error ?? "Upload failed");
    } else {
      setUploadDone(true);
      // Refresh the list
      const listRes = await fetch("/api/documents");
      if (listRes.ok) setDocs(await listRes.json());
      // Reset form after short delay
      setTimeout(() => {
        setFile(null);
        setUploadDone(false);
        setShowUpload(false);
      }, 1200);
    }
    setUploading(false);
  }

  async function deleteDoc(id: string, storagePath?: string) {
    setDocs(prev => prev.filter(d => d.id !== id));
    await fetch("/api/documents", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, storage_path: storagePath }),
    });
  }

  return (
    <div className="p-8 max-w-6xl">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold">Documents</h1>
          <p className="mt-1 text-muted-foreground text-sm">Store and manage your immigration documents</p>
        </div>
        {isSignedIn && (
          <Button onClick={() => setShowUpload(true)} className="gap-2">
            <Upload className="h-4 w-4" /> Upload Document
          </Button>
        )}
      </div>

      {!isSignedIn && (
        <GuestPreviewBanner
          title="Sign in to upload and store your documents"
          description="Securely upload and access your immigration documents from anywhere."
        />
      )}

      {/* Security note */}
      <div className="flex items-center gap-2 p-3 rounded-xl bg-green-50 border border-green-200 mb-6">
        <Shield className="h-4 w-4 text-green-600 shrink-0" />
        <p className="text-xs text-green-700">Documents are stored in your private vault and are only accessible when you are signed in. StatusClock is not a law firm.</p>
      </div>

      {/* Upload modal */}
      {showUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-lg">Upload Document</h2>
              <button onClick={() => { setShowUpload(false); setFile(null); setUploadError(null); }}
                className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
                <X className="h-4 w-4 text-slate-500" />
              </button>
            </div>

            {/* Doc type selector */}
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Document Type</label>
            <div className="grid grid-cols-3 gap-2 mb-5">
              {DOC_TYPES.map(t => (
                <button
                  key={t}
                  onClick={() => setDocType(t)}
                  className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border-2 text-xs font-semibold transition-all ${
                    docType === t
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-slate-200 hover:border-slate-300 text-slate-600"
                  }`}
                >
                  <span className="text-lg">{DOC_ICON[t]}</span>
                  <span className="text-center leading-tight">{t}</span>
                </button>
              ))}
            </div>

            {/* Drop zone */}
            <div
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) pickFile(f); }}
              onClick={() => fileInputRef.current?.click()}
              className={`rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition-colors mb-4 ${
                dragging ? "border-blue-400 bg-blue-50"
                : file ? "border-green-400 bg-green-50"
                : "border-slate-300 hover:border-blue-400 hover:bg-slate-50"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.webp"
                className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) pickFile(f); }}
              />
              {file ? (
                <div className="flex items-center justify-center gap-2">
                  <FileText className="h-5 w-5 text-green-600" />
                  <div className="text-left">
                    <p className="text-sm font-semibold text-green-700 truncate max-w-[220px]">{file.name}</p>
                    <p className="text-xs text-slate-500">{formatSize(file.size)}</p>
                  </div>
                </div>
              ) : (
                <div>
                  <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-slate-600">Drop file here or click to browse</p>
                  <p className="text-xs text-slate-400 mt-1">PDF, JPG, PNG, WebP — max 10 MB</p>
                </div>
              )}
            </div>

            {uploadError && (
              <p className="text-xs text-red-600 mb-3 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{uploadError}</p>
            )}

            <Button
              className="w-full gap-2"
              onClick={upload}
              disabled={!file || uploading || uploadDone}
            >
              {uploading ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Uploading…</>
              ) : uploadDone ? (
                <><CheckCircle2 className="h-4 w-4 text-green-500" /> Saved!</>
              ) : (
                <><Upload className="h-4 w-4" /> Upload {docType}</>
              )}
            </Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left — checklist */}
        <div className="space-y-2">
          <p className="text-sm font-semibold text-slate-700 mb-2">Document Checklist</p>
          {CHECKLIST.map(cat => {
            const isOpen = expanded.includes(cat.id);
            return (
              <Card key={cat.id} className="overflow-hidden">
                <button
                  onClick={() => setExpanded(prev => isOpen ? prev.filter(c => c !== cat.id) : [...prev, cat.id])}
                  className="w-full flex items-center justify-between px-3 py-2.5 text-left hover:bg-slate-50 transition-colors"
                >
                  <span className="flex items-center gap-2 text-xs font-medium">
                    <span>{cat.icon}</span><span>{cat.label}</span>
                    <span className="text-muted-foreground font-normal">({cat.items.length})</span>
                  </span>
                  {isOpen ? <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                           : <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />}
                </button>
                {isOpen && (
                  <CardContent className="pt-0 pb-3 px-3">
                    <div className="border-t pt-2.5 space-y-2">
                      {cat.items.map(item => (
                        <div key={item.name} className="flex items-start gap-2">
                          <div className="h-3.5 w-3.5 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                            <div className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-medium leading-snug">{item.name}</p>
                            <p className="text-[10px] text-muted-foreground leading-snug mt-0.5">{item.hint}</p>
                          </div>
                          {item.required && (
                            <span className="text-[9px] font-bold text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded-full shrink-0 mt-0.5">Key</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>

        {/* Right — uploaded documents */}
        <div className="lg:col-span-2">
          {!isSignedIn ? (
            <div className="rounded-xl border-2 border-dashed p-12 text-center">
              <Upload className="h-8 w-8 text-slate-300 mx-auto mb-3" />
              <p className="font-medium text-sm text-muted-foreground mb-3">Sign in to upload documents</p>
              <SignInButton mode="modal">
                <Button variant="outline" size="sm">Sign in</Button>
              </SignInButton>
            </div>
          ) : loadingDocs ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : docs.length === 0 ? (
            <div
              onClick={() => setShowUpload(true)}
              className="rounded-xl border-2 border-dashed border-slate-300 hover:border-blue-400 hover:bg-blue-50/30 p-12 text-center cursor-pointer transition-colors"
            >
              <Upload className="h-8 w-8 text-slate-300 mx-auto mb-3" />
              <p className="font-semibold text-sm text-slate-600">No documents uploaded yet</p>
              <p className="text-xs text-muted-foreground mt-1">Click to upload your first document</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {docs.map(doc => (
                <div key={doc.id} className="group rounded-2xl border border-slate-200 bg-white p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className="h-11 w-11 rounded-xl flex items-center justify-center text-xl shrink-0"
                      style={{ backgroundColor: DOC_COLOR[doc.document_type] ?? "#f1f5f9" }}
                    >
                      {DOC_ICON[doc.document_type] ?? "📁"}
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {doc.signed_url && (
                        <a
                          href={doc.signed_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                          title="View document"
                        >
                          <Eye className="h-4 w-4 text-slate-500" />
                        </a>
                      )}
                      <button
                        onClick={() => deleteDoc(doc.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4 text-red-400" />
                      </button>
                    </div>
                  </div>

                  <p className="text-sm font-semibold truncate">{doc.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: DOC_COLOR[doc.document_type] ?? "#f1f5f9", color: "#334155" }}>
                      {doc.document_type}
                    </span>
                    <span className="text-xs text-slate-400">{formatSize(doc.file_size)}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-2">
                    {formatDateShort(doc.created_at)}
                  </p>

                  {doc.signed_url && (
                    <a
                      href={doc.signed_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 flex items-center justify-center gap-1.5 w-full py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                      <Eye className="h-3.5 w-3.5" /> View Document
                    </a>
                  )}
                </div>
              ))}

              {/* Add more card */}
              <div
                onClick={() => setShowUpload(true)}
                className="rounded-2xl border-2 border-dashed border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors min-h-[160px]"
              >
                <Upload className="h-6 w-6 text-slate-300" />
                <p className="text-xs font-semibold text-slate-400">Upload another</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
