import { auth, clerkClient } from "@clerk/nextjs/server";

const DEFAULT_ADMIN_EMAIL = "kamepalliasil143@gmail.com";

function getAdminEmails() {
  return (process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL)
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export async function isAdminUser(): Promise<boolean> {
  const { userId } = await auth();
  if (!userId) return false;

  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const adminEmails = new Set(getAdminEmails());

    return user.emailAddresses.some((email) => adminEmails.has(email.emailAddress.toLowerCase()));
  } catch {
    return false;
  }
}
