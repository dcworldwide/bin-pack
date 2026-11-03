import { ChevronDown, Download, Plus, Trash2, Upload } from "lucide-react";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { parseImport, stowFile } from "@/lib/projects";
import { usePackStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

export function ProjectBar() {
  const projects = usePackStore((s) => s.projects);
  const activeId = usePackStore((s) => s.activeId);
  const selectProject = usePackStore((s) => s.selectProject);
  const createProject = usePackStore((s) => s.createProject);
  const deleteProject = usePackStore((s) => s.deleteProject);
  const renameProject = usePackStore((s) => s.renameProject);
  const importProjects = usePackStore((s) => s.importProjects);
  const active = projects.find((p) => p.id === activeId);
  const [draft, setDraft] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const shown = draft ?? active?.name ?? "";

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(null), 4000);
    return () => window.clearTimeout(timer);
  }, [notice]);

  function commit(raw: string) {
    renameProject(raw);
    setDraft(null);
  }

  function exportProjects() {
    const { projects: all, activeId: current } = usePackStore.getState();
    const blob = new Blob([stowFile(all, current)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "stow.json";
    link.click();
    URL.revokeObjectURL(url);
  }

  async function onImport(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    const parsed = parseImport(await file.text());
    if (!parsed) {
      setNotice("That file isn't a Stow export.");
      return;
    }
    importProjects(parsed);
    setDraft(null);
    setNotice(parsed.projects.length === 1 ? "Imported 1 project." : `Imported ${parsed.projects.length} projects.`);
  }

  return (
    <div ref={rootRef} className="relative flex min-w-0 items-center gap-2">
      <div className="relative min-w-0">
        <input
          aria-label="Project"
          value={shown}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={(e) => commit(e.currentTarget.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              commit(shown);
              setOpen(false);
              (e.target as HTMLInputElement).blur();
            }
            if (e.key === "Escape") {
              setDraft(null);
              setOpen(false);
            }
            if (e.key === "ArrowDown") setOpen(true);
          }}
          className="h-9 w-36 min-w-0 rounded-md bg-muted pr-8 pl-3 text-sm text-foreground shadow-[0_0_0_1px_rgba(255,255,255,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70 sm:w-52"
        />
        <button
          type="button"
          aria-label="Choose project"
          aria-expanded={open}
          className="absolute top-0 right-0 flex h-9 w-8 items-center justify-center text-muted-foreground"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => setOpen((value) => !value)}
        >
          <ChevronDown className="size-4" />
        </button>
      </div>
      {open && (
        <ul className="absolute top-full left-0 z-30 mt-1 max-h-64 w-56 overflow-auto rounded-md bg-popover p-1 shadow-[0_8px_24px_rgba(0,0,0,0.35),0_0_0_1px_rgba(255,255,255,0.08)]">
          {projects.map((project) => (
            <li key={project.id}>
              <button
                type="button"
                className={cn(
                  "flex h-9 w-full items-center rounded-md px-2 text-left text-sm text-foreground hover:bg-muted",
                  project.id === activeId && "bg-muted",
                )}
                onMouseDown={(e) => {
                  e.preventDefault();
                  if (draft !== null) commit(draft);
                  selectProject(project.id);
                  setDraft(null);
                  setOpen(false);
                }}
              >
                <span className="truncate">{project.name}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
      <Button variant="outline" size="icon-sm" onClick={createProject} aria-label="New project">
        <Plus />
      </Button>
      <Button
        variant="outline"
        size="icon-sm"
        onClick={deleteProject}
        disabled={projects.length < 2}
        aria-label="Delete project"
      >
        <Trash2 />
      </Button>
      <Button variant="outline" size="icon-sm" onClick={exportProjects} aria-label="Export projects">
        <Download />
      </Button>
      <Button variant="outline" size="icon-sm" onClick={() => fileRef.current?.click()} aria-label="Import projects">
        <Upload />
      </Button>
      <input ref={fileRef} type="file" accept="application/json,.json" className="hidden" onChange={onImport} />
      {notice && (
        <p role="status" className="absolute top-full left-0 z-20 mt-1 text-xs text-muted-foreground">
          {notice}
        </p>
      )}
    </div>
  );
}
