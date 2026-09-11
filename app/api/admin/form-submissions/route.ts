import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/server";
import { isAdminUser } from "@/lib/auth/admin";

const updateSubmissionSchema = z.object({
  id: z.string().uuid("Invalid submission id"),
  status: z.string().trim().max(80).optional(),
  admin_notes: z.string().max(5000).optional(),
});

// GET /api/admin/form-submissions — all submissions
export async function GET() {
  if (!(await isAdminUser())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("form_submissions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

// PATCH /api/admin/form-submissions — update status or admin_notes
export async function PATCH(req: NextRequest) {
  if (!(await isAdminUser())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const parsed = updateSubmissionSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid update" }, { status: 400 });
  }
  const { id, status, admin_notes } = parsed.data;

  const supabase = createAdminClient();
  const update: Record<string, string> = { updated_at: new Date().toISOString() };
  if (status) update.status = status;
  if (admin_notes !== undefined) update.admin_notes = admin_notes;

  const { data, error } = await supabase
    .from("form_submissions")
    .update(update)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
