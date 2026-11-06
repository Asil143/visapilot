"use client";

import { Users } from "lucide-react";
import { FormWizard, type Fields } from "@/components/forms/form-wizard";
import { I864A_QUESTIONS, I864A_PARTS } from "@/lib/forms/i864a";

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
  if (fieldId === "current_annual_income") {
    const digits = v.replace(/[^0-9.]/g, "");
    if (digits) return `$${Number(digits).toLocaleString()}`;
  }
  if (["family_name", "given_name", "middle_name", "mailing_city", "employer_name",
       "employer_address", "occupation", "sponsor_full_name"].includes(fieldId)) {
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

async function prefill(): Promise<Fields> {
  const res = await fetch("/api/profile");
  if (!res.ok) return {};
  const p = await res.json();
  if (!p || p.error) return {};

  const f: Fields = {};
  if (p.first_name)     f.given_name             = titleCase(String(p.first_name));
  if (p.last_name)      f.family_name             = titleCase(String(p.last_name));
  if (p.middle_name)    f.middle_name             = titleCase(String(p.middle_name));
  if (p.date_of_birth)  f.date_of_birth           = isoToMDY(String(p.date_of_birth));
  if (p.ssn)            f.ssn                     = fmtSSN(String(p.ssn));
  if (p.mailing_street) f.mailing_street          = String(p.mailing_street);
  if (p.mailing_city)   f.mailing_city            = titleCase(String(p.mailing_city));
  if (p.mailing_state)  f.mailing_state           = String(p.mailing_state).toUpperCase();
  if (p.mailing_zip)    f.mailing_zip             = String(p.mailing_zip);
  if (p.phone)          f.daytime_phone           = fmtPhone(String(p.phone));
  if (p.email)          f.email                   = String(p.email);
  if (p.employer)       f.employer_name           = titleCase(String(p.employer));
  return f;
}

export default function I864APage() {
  return (
    <FormWizard
      formNumber="I-864A"
      subtitle="Contract Between Sponsor and Household Member"
      formTypeForSubmission="I-864A"
      icon={Users}
      color="violet"
      questions={I864A_QUESTIONS}
      parts={I864A_PARTS}
      description="For household members combining their income with the sponsor to meet the Form I-864 income requirement. Answer questions in plain English to build a worksheet you can copy onto the official USCIS Form I-864A."
      subtext="Used alongside Form I-864 when the sponsor's own income isn't enough to meet the requirement, and a spouse, relative, or dependent living with them agrees to add their income to the household total."
      normalize={normalize}
      prefill={prefill}
    />
  );
}
