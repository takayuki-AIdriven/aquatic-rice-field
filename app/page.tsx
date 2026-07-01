"use client";

import { Workspace } from "@/components/workspace/Workspace";
import initialCandidates from "@/data/candidates.json";
import initialDepartments from "@/data/positions.json";
import workspaceData from "@/data/workspace.json";

export default function Page() {
  return (
    <Workspace
      initialCandidates={initialCandidates as any}
      initialDepartments={initialDepartments as any}
      workspace={workspaceData}
    />
  );
}


