import type { SupabaseClient } from "@supabase/supabase-js";
import { HttpError } from "../../api/_lib/http.js";
const EMAIL = "demo-buyer@polymatch.example";
/** This is the only identity this public endpoint can provision/sign into. */
export async function demoSession(
  admin: SupabaseClient,
  publicClient: SupabaseClient,
) {
  const find = () =>
    admin
      .from("profiles")
      .select("id,role,status")
      .eq("email", EMAIL)
      .maybeSingle();
  let { data: profile, error } = await find();
  if (error) throw error;
  if (!profile) {
    const created = await admin.auth.admin.createUser({
      email: EMAIL,
      email_confirm: true,
      app_metadata: { public_demo: true },
      user_metadata: {
        role: "BUYER",
        fullName: "Khách trải nghiệm Demo",
        companyName: "Doanh nghiệp Demo POLYMATCH",
      },
    });
    // A concurrent first visitor may already have created this exact identity.
    const found = await find();
    if (found.error || !found.data)
      throw (
        created.error ||
        found.error ||
        new HttpError(503, "Chưa tạo được tài khoản Demo.")
      );
    profile = found.data;
  }
  if (profile.role !== "BUYER" || profile.status !== "active")
    throw new HttpError(403, "Tài khoản Demo đang tạm dừng.");
  const identity = await admin.auth.admin.getUserById(profile.id);
  if (
    identity.error ||
    identity.data.user?.email !== EMAIL ||
    identity.data.user.app_metadata?.public_demo !== true
  )
    throw new HttpError(403, "Tài khoản chưa được cấu hình là Demo công khai.");
  // generateLink does not send email. No shared password is stored or published.
  const link = await admin.auth.admin.generateLink({
    type: "magiclink",
    email: EMAIL,
  });
  if (link.error || !link.data.properties?.hashed_token)
    throw link.error || new Error("No demo token");
  const result = await publicClient.auth.verifyOtp({
    type: "magiclink",
    token_hash: link.data.properties.hashed_token,
  });
  if (result.error || !result.data.session)
    throw result.error || new Error("No demo session");
  return {
    access_token: result.data.session.access_token,
    refresh_token: result.data.session.refresh_token,
  };
}
