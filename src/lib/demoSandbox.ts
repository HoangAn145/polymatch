export type SandboxRole = "buyer" | "seller" | "admin";
const KEY = "polymatch_public_demo_role_v1";
function role(value: string | null): SandboxRole | null {
  return value === "buyer" || value === "seller" || value === "admin"
    ? value
    : null;
}
function initialRole(): SandboxRole | null {
  if (typeof window === "undefined") return null;
  try {
    const requested = role(
      new URL(window.location.href).searchParams.get("demo"),
    );
    if (requested) sessionStorage.setItem(KEY, requested);
    return requested || role(sessionStorage.getItem(KEY));
  } catch {
    return null;
  }
}
export const sandboxRole = initialRole();
export const sandboxMode = sandboxRole !== null;
export function setSandboxRole(value: SandboxRole) {
  sessionStorage.setItem(KEY, value);
}
export function exitSandbox() {
  sessionStorage.removeItem(KEY);
  window.location.assign("/login");
}
