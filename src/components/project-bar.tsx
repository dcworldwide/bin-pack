import { Plus, Trash2 } from "lucide-react";
import { usePackStore } from "@/lib/store";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export function ProjectBar() {
  const projects = usePackStore((s) => s.projects);
  const activeId = usePackStore((s) => s.activeId);
  const selectProject = usePackStore((s) => s.selectProject);
  const createProject = usePackStore((s) => s.createProject);
  const deleteProject = usePackStore((s) => s.deleteProject);
  const renameProject = usePackStore((s) => s.renameProject);
  const active = projects.find((p) => p.id === activeId);

  return (
    <div className="flex min-w-0 flex-1 items-center gap-2 sm:max-w-xl">
      <select
        aria-label="Project"
        value={activeId}
        onChange={(e) => selectProject(e.target.value)}
        className="h-9 max-w-[42%] min-w-0 flex-1 rounded-md bg-muted px-2 text-sm text-foreground shadow-[0_0_0_1px_rgba(255,255,255,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70"
      >
        {projects.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name || "Untitled"}
          </option>
        ))}
      </select>
      <Input
        aria-label="Project name"
        value={active?.name ?? ""}
        onChange={(e) => renameProject(e.target.value)}
        className="h-9 min-w-0 flex-1"
        placeholder="Project name"
      />
      <Button variant="secondary" size="sm" onClick={createProject} aria-label="New project">
        <Plus />
        <span className="hidden sm:inline">New</span>
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={deleteProject}
        disabled={projects.length < 2}
        aria-label="Delete project"
      >
        <Trash2 />
      </Button>
    </div>
  );
}
