"use client";

import { FileClock } from "lucide-react";
import { FormWizard, type Fields } from "@/components/forms/form-wizard";
import { I539_QUESTIONS, I539_PARTS } from "@/lib/forms/i539";

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
  if (["family_name", "given_name", "middle_name", "country_of_birth", "country_of_citizenship",
       "passport_country", "mailing_city", "current_employer_school"].includes(fieldId)) {
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
  if (p.first_name)        f.given_name          = titleCase(String(p.first_name));
  if (p.last_name)         f.family_name         = titleCase(String(p.last_name));
  if (p.middle_name)       f.middle_name         = titleCase(String(p.middle_name));
  if (p.date_of_birth)     f.date_of_birth       = isoToMDY(String(p.date_of_birth));
  if (p.country_of_birth)  f.country_of_birth    = titleCase(String(p.country_of_birth));
  if (p.ssn)               f.ssn                 = fmtSSN(String(p.ssn));
  if (p.a_number)          f.a_number            = String(p.a_number);
  if (p.mailing_street)    f.mailing_street      = String(p.mailing_street);
  if (p.mailing_city)      f.mailing_city        = titleCase(String(p.mailing_city));
  if (p.mailing_state)     f.mailing_state       = String(p.mailing_state).toUpperCase();
  if (p.mailing_zip)       f.mailing_zip         = String(p.mailing_zip);
  if (p.phone)             f.daytime_phone       = fmtPhone(String(p.phone));
  if (p.email)             f.email               = String(p.email);
  if (p.visa_type)         f.current_status      = String(p.visa_type);
  if (p.i94_expiry)        f.status_expiry_date  = isoToMDY(String(p.i94_expiry));
  if (p.passport_expiry)   f.passport_expiry     = isoToMDY(String(p.passport_expiry));
  if (p.employer)          f.current_employer_school = titleCase(String(p.employer));
  return f;
}

function prefillFromDocuments(docs: Array<Record<string, unknown>>): Fields {
  const f: Fields = {};
  for (const doc of docs) {
    const ef = (doc.extracted_data as { extracted_fields?: Record<string, string | null> } | undefined)?.extracted_fields;
    if (!ef) continue;
    if (ef.first_name && !f.given_name)              f.given_name        = titleCase(ef.first_name);
    if (ef.last_name && !f.family_name)              f.family_name       = titleCase(ef.last_name);
    if (ef.middle_name && !f.middle_name)            f.middle_name       = titleCase(ef.middle_name);
    if (ef.date_of_birth && !f.date_of_birth)        f.date_of_birth     = isoToMDY(ef.date_of_birth);
    if (ef.country_of_birth && !f.country_of_birth)  f.country_of_birth  = titleCase(ef.country_of_birth);
    if (ef.a_number && !f.a_number)                  f.a_number          = ef.a_number;
    if (ef.passport_number && !f.passport_number)     f.passport_number   = ef.passport_number;
    if (ef.passport_country && !f.passport_country)   f.passport_country = titleCase(ef.passport_country);
    if (ef.passport_expiry && !f.passport_expiry)     f.passport_expiry   = isoToMDY(ef.passport_expiry);
    if (ef.i94_number && !f.i94_number)               f.i94_number        = ef.i94_number;
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

export default function I539Page() {
  return (
    <FormWizard
      formNumber="I-539"
      subtitle="Application to Extend/Change Nonimmigrant Status"
      formTypeForSubmission="I-539"
      icon={FileClock}
      color="amber"
      questions={I539_QUESTIONS}
      parts={I539_PARTS}
      description="For nonimmigrants already in the U.S. who want to extend their current status or change to a different nonimmigrant category — without leaving the country. Answer questions in plain English to build a worksheet you can copy onto the official USCIS Form I-539."
      subtext="Covers extensions of stay (e.g., B-2 tourist extension) and changes of status (e.g., F-1 to B-2, H-4 to F-1)."
      notices={[
        { tone: "amber", text: <>⏱ File this <strong>before your current authorized stay (I-94 date) expires</strong> — filing late can create a gap in status and affect future immigration benefits.</> },
      ]}
      normalize={normalize}
      prefill={prefill}
    />
  );
}
