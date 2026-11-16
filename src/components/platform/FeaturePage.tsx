import React from "react";
import { authService } from "../../services/authService";
import {
  Roadmap,
  Kpi,
  Tickets,
  Knowledge,
  Audit,
} from "../../pages/platform/PlatformPage";
export function FeaturePage({
  kind,
}: {
  kind: "roadmap" | "kpi" | "support" | "knowledge" | "audit";
}) {
  const user = authService.getCurrentUser();
  if (!user) return null;
  if ((kind === "knowledge" || kind === "audit") && user.role !== "ADMIN")
    return <p>Chỉ quản trị viên được truy cập.</p>;
  return (
    <div className="space-y-6">
      {kind === "roadmap" && <Roadmap userId={user.id} />}
      {kind === "kpi" && <Kpi userId={user.id} />}
      {kind === "support" && (
        <Tickets userId={user.id} admin={user.role === "ADMIN"} />
      )}
      {kind === "knowledge" && <Knowledge userId={user.id} />}
      {kind === "audit" && <Audit />}
    </div>
  );
}
