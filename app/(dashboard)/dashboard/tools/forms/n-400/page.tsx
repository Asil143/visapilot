"use client";

import { Flag } from "lucide-react";
import { FormWizard, type Fields } from "@/components/forms/form-wizard";
import { N400_QUESTIONS, N400_PARTS } from "@/lib/forms/n400";

function normalize(fieldId: string, raw: string): string {
  const v = raw.trim();
  if (!v || v.toLowerCase() === "n/a" || v.toLowerCase() === "none") return "N/A";

  if (fieldId.includes("date")) {
    const d = new Date(v);
    if (!isNaN(d.getTime())) {
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      return `${mm}/${dd}/${d.getFullYear()}`;
    }
    return v;
  }
  if (fieldId === "ssn") {
    const digits = v.replace(/\D/g, "");
    if (digits.length === 9) return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5)}`;
  }
  if (fieldId === "daytime_phone") {
    const digits = v.replace(/\D/g, "");
    if (digits.length === 10) return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  if (fieldId === "mailing_state") return v.toUpperCase().slice(0, 2);
  if ([
    "family_name", "given_name", "middle_name", "mailing_city",
    "current_employer_or_school", "occupation", "spouse_name",
  ].includes(fieldId)) {
    return v.replace(/\w\S*/g, (t) => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase());
  }
  if (fieldId === "place_of_birth") {
    return v.replace(/\w\S*/g, (t) => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase());
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
  return d.length === 9 ? `${d.slice(0, 3)}-${d.slice(3, 5)}-${d.slice(5)}` : raw;
}

function fmtPhone(raw: string): string {
  const d = raw.replace(/\D/g, "");
  return d.length === 10 ? `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}` : raw;
}

function titleCase(s: string): string {
  return s.replace(/\w\S*/g, (t) => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase());
}

function prefillFromProfile(p: Record<string, unknown>): Fields {
  const f: Fields = {};
  if (p.first_name) f.given_name = titleCase(String(p.first_name));
  if (p.last_name) f.family_name = titleCase(String(p.last_name));
  if (p.middle_name) f.middle_name = titleCase(String(p.middle_name));
  if (p.date_of_birth) f.date_of_birth = isoToMDY(String(p.date_of_birth));
  if (p.country_of_birth) f.place_of_birth = titleCase(String(p.country_of_birth));
  if (p.ssn) f.ssn = fmtSSN(String(p.ssn));
  if (p.a_number) f.a_number = String(p.a_number);
  if (p.mailing_street) f.mailing_street = String(p.mailing_street);
  if (p.mailing_city) f.mailing_city = titleCase(String(p.mailing_city));
  if (p.mailing_state) f.mailing_state = String(p.mailing_state).toUpperCase();
  if (p.mailing_zip) f.mailing_zip = String(p.mailing_zip);
  if (p.phone) f.daytime_phone = fmtPhone(String(p.phone));
  if (p.email) f.email = String(p.email);
  if (p.employer) f.current_employer_or_school = titleCase(String(p.employer));
  return f;
}

function prefillFromDocuments(docs: Array<Record<string, unknown>>): Fields {
  const f: Fields = {};
  for (const doc of docs) {
    const ef = (doc.extracted_data as { extracted_fields?: Record<string, string | null> } | undefined)?.extracted_fields;
    if (!ef) continue;
    if (ef.first_name && !f.given_name) f.given_name = titleCase(ef.first_name);
    if (ef.last_name && !f.family_name) f.family_name = titleCase(ef.last_name);
    if (ef.middle_name && !f.middle_name) f.middle_name = titleCase(ef.middle_name);
    if (ef.date_of_birth && !f.date_of_birth) f.date_of_birth = isoToMDY(ef.date_of_birth);
    if (ef.country_of_birth && !f.place_of_birth) f.place_of_birth = titleCase(ef.country_of_birth);
    if (ef.a_number && !f.a_number) f.a_number = ef.a_number;
    if (ef.employer_name && !f.current_employer_or_school) f.current_employer_or_school = titleCase(ef.employer_name);
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

export default function N400Page() {
  return (
    <FormWizard
      formNumber="N-400"
      subtitle="Application for Naturalization"
      formTypeForSubmission="N-400"
      icon={Flag}
      color="orange"
      questions={N400_QUESTIONS}
      parts={N400_PARTS}
      description="For lawful permanent residents applying to become U.S. citizens. Answer questions in plain English to build a worksheet you can copy onto the official USCIS Form N-400."
      subtext="Covers the core eligibility, biographic, address, family, and good-moral-character sections of the official USCIS Form N-400 — the most commonly needed parts. Any 'yes' answer on the eligibility questions should be reviewed with an immigration attorney before filing, since it can affect your case."
      notices={[
        { tone: "blue", text: <>General eligibility: at least 5 years as a permanent resident (3 years if married to and living with a U.S. citizen), continuous residence and physical presence in the U.S., and passing English and civics tests — unless you qualify for an age/residence-based exemption or a disability waiver.</> },
      ]}
      normalize={normalize}
      prefill={prefill}
    />
  );
}
