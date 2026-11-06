"use client";

import { Plane } from "lucide-react";
import { FormWizard, type Fields } from "@/components/forms/form-wizard";
import { I131_QUESTIONS, I131_PARTS } from "@/lib/forms/i131";

function normalize(fieldId: string, raw: string): string {
  const v = raw.trim();
  if (!v || v.toLowerCase() === "n/a" || v.toLowerCase() === "none") return "N/A";

  if (fieldId.includes("date") || fieldId === "departure_date" || fieldId === "return_date" || fieldId === "i485_filed_date") {
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
       "mailing_city", "countries_to_visit"].includes(fieldId)) {
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
  if (p.first_name)       f.given_name            = titleCase(String(p.first_name));
  if (p.last_name)        f.family_name           = titleCase(String(p.last_name));
  if (p.middle_name)      f.middle_name           = titleCase(String(p.middle_name));
  if (p.date_of_birth)    f.date_of_birth         = isoToMDY(String(p.date_of_birth));
  if (p.country_of_birth) f.country_of_birth      = titleCase(String(p.country_of_birth));
  if (p.ssn)              f.ssn                   = fmtSSN(String(p.ssn));
  if (p.a_number)         f.a_number              = String(p.a_number);
  if (p.mailing_street)   f.mailing_street        = String(p.mailing_street);
  if (p.mailing_city)     f.mailing_city          = titleCase(String(p.mailing_city));
  if (p.mailing_state)    f.mailing_state         = String(p.mailing_state).toUpperCase();
  if (p.mailing_zip)      f.mailing_zip           = String(p.mailing_zip);
  if (p.phone)            f.daytime_phone         = fmtPhone(String(p.phone));
  if (p.email)            f.email                 = String(p.email);
  if (p.visa_type)        f.current_status        = String(p.visa_type);
  return f;
}

export default function I131Page() {
  return (
    <FormWizard
      formNumber="I-131"
      subtitle="Application for Travel Document"
      formTypeForSubmission="I-131"
      icon={Plane}
      color="sky"
      questions={I131_QUESTIONS}
      parts={I131_PARTS}
      description="For Advance Parole, Refugee Travel Documents, and Re-entry Permits. Answer questions in plain English to build a worksheet you can copy onto the official USCIS Form I-131."
      subtext="Most commonly used by I-485 applicants who need to travel while their green card is pending."
      notices={[
        { tone: "amber", text: <><strong>Important:</strong> Do NOT travel outside the U.S. while your I-485 is pending without an approved Advance Parole. Doing so may abandon your green card application.</> },
      ]}
      normalize={normalize}
      prefill={prefill}
    />
  );
}
