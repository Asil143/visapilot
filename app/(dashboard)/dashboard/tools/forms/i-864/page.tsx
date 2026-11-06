"use client";

import { FileText } from "lucide-react";
import { FormWizard, type Fields } from "@/components/forms/form-wizard";
import { I864_QUESTIONS, I864_PARTS } from "@/lib/forms/i864";

function normalize(fieldId: string, raw: string): string {
  const v = raw.trim();
  if (!v || v.toLowerCase() === "n/a" || v.toLowerCase() === "none") return "N/A";

  if (fieldId.includes("dob") || fieldId.includes("date")) {
    const d = new Date(v);
    if (!isNaN(d.getTime())) {
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      return `${mm}/${dd}/${d.getFullYear()}`;
    }
    return v;
  }
  if (fieldId === "sponsor_ssn") {
    const digits = v.replace(/\D/g, "");
    if (digits.length === 9) return `${digits.slice(0,3)}-${digits.slice(3,5)}-${digits.slice(5)}`;
  }
  if (fieldId.includes("phone")) {
    const digits = v.replace(/\D/g, "");
    if (digits.length === 10) return `(${digits.slice(0,3)}) ${digits.slice(3,6)}-${digits.slice(6)}`;
  }
  if (fieldId.includes("state") && v.length <= 3) return v.toUpperCase();
  if (fieldId.includes("zip")) return v;
  if (fieldId.includes("income") || fieldId.includes("annual")) {
    const digits = v.replace(/[^0-9.]/g, "");
    if (digits) return `$${Number(digits).toLocaleString()}`;
  }
  if (fieldId.includes("same_physical") || fieldId.includes("military") || fieldId.includes("sponsoring_principal")) {
    const lower = v.toLowerCase();
    if (lower.startsWith("y")) return "Yes";
    if (lower.startsWith("n")) return "No";
  }
  if (fieldId.includes("name") || fieldId.includes("city") || fieldId.includes("country") || fieldId.includes("employer") || fieldId.includes("occupation") || fieldId.includes("citizenship") || fieldId.includes("employment") || fieldId.includes("domicile")) {
    return v.replace(/\w\S*/g, t => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase());
  }
  return v;
}

function isoToMDY(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return `${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}/${d.getFullYear()}`;
}

function fmtSSN(raw: string): string {
  const d = raw.replace(/\D/g, "");
  return d.length === 9 ? `${d.slice(0,3)}-${d.slice(3,5)}-${d.slice(5)}` : raw;
}

function fmtPhone(raw: string): string {
  const d = raw.replace(/\D/g, "");
  return d.length === 10 ? `(${d.slice(0,3)}) ${d.slice(3,6)}-${d.slice(6)}` : raw;
}

function titleCase(s: string): string {
  return s.replace(/\w\S*/g, t => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase());
}

function prefillFromProfile(p: Record<string, unknown>): Fields {
  const f: Fields = {};
  if (p.first_name) f.sponsor_given_name = titleCase(String(p.first_name));
  if (p.last_name) f.sponsor_family_name = titleCase(String(p.last_name));
  if (p.middle_name) f.sponsor_middle_name = titleCase(String(p.middle_name));
  if (p.date_of_birth) f.sponsor_dob = isoToMDY(String(p.date_of_birth));
  if (p.country_of_birth) f.sponsor_country_of_birth = titleCase(String(p.country_of_birth));
  if (p.ssn) f.sponsor_ssn = fmtSSN(String(p.ssn));
  if (p.mailing_street) f.sponsor_mailing_street = String(p.mailing_street);
  if (p.mailing_city) f.sponsor_mailing_city = titleCase(String(p.mailing_city));
  if (p.mailing_state) f.sponsor_mailing_state = String(p.mailing_state).toUpperCase();
  if (p.mailing_zip) f.sponsor_mailing_zip = String(p.mailing_zip);
  if (p.phone) f.sponsor_daytime_phone = fmtPhone(String(p.phone));
  if (p.a_number) f.sponsor_a_number = String(p.a_number);
  if (p.employer) f.employer_name_1 = titleCase(String(p.employer));
  if (p.visa_type) {
    const vt = String(p.visa_type);
    if (vt.includes("LPR") || vt.toLowerCase().includes("green card") || vt.includes("Permanent Resident"))
      f.sponsor_citizenship = "Lawful Permanent Resident";
  }
  return f;
}

function prefillFromDocuments(docs: Array<Record<string, unknown>>): Fields {
  const f: Fields = {};
  for (const doc of docs) {
    const ef = (doc.extracted_data as { extracted_fields?: Record<string, string | null> } | undefined)?.extracted_fields;
    if (!ef) continue;
    if (ef.first_name && !f.sponsor_given_name) f.sponsor_given_name = titleCase(ef.first_name);
    if (ef.last_name && !f.sponsor_family_name) f.sponsor_family_name = titleCase(ef.last_name);
    if (ef.middle_name && !f.sponsor_middle_name) f.sponsor_middle_name = titleCase(ef.middle_name);
    if (ef.date_of_birth && !f.sponsor_dob) f.sponsor_dob = isoToMDY(ef.date_of_birth);
    if (ef.country_of_birth && !f.sponsor_country_of_birth) f.sponsor_country_of_birth = titleCase(ef.country_of_birth);
    if (ef.a_number && !f.sponsor_a_number) f.sponsor_a_number = ef.a_number;
    if (ef.employer_name && !f.employer_name_1) f.employer_name_1 = titleCase(ef.employer_name);
  }
  return f;
}

async function prefill(): Promise<Fields> {
  const [profileRes, docsRes] = await Promise.all([
    fetch("/api/profile"),
    fetch("/api/documents"),
  ]);
  let combined: Fields = {};
  if (docsRes.ok) {
    const docs = await docsRes.json();
    if (Array.isArray(docs)) combined = { ...combined, ...prefillFromDocuments(docs) };
  }
  if (profileRes.ok) {
    const profile = await profileRes.json();
    if (profile && !profile.error) combined = { ...combined, ...prefillFromProfile(profile) };
  }
  return combined;
}

export default function I864Page() {
  return (
    <FormWizard
      formNumber="I-864"
      subtitle="Affidavit of Support"
      formTypeForSubmission="I-864"
      icon={FileText}
      color="blue"
      questions={I864_QUESTIONS}
      parts={I864_PARTS}
      description="Answer questions in plain English to build a worksheet mapped to Form I-864. Copy your answers onto the official USCIS PDF — StatusClock does not file for you."
      subtext="Covers Parts 1–6 and Part 8 of the official USCIS Form I-864 (Edition 10/17/24)."
      normalize={normalize}
      prefill={prefill}
    />
  );
}
