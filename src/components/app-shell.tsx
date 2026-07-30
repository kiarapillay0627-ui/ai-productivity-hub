import { Link, useRouterState } from "@tanstack/react-router";
import {
  BookOpenCheck,
  LayoutDashboard,
  LifeBuoy,
  Mail,
  Menu,
  MessagesSquare,
  ScanSearch,
  Settings as SettingsIcon,
  Sparkle,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/email", label: "Smart Email Generator", icon: Mail },
  { to: "/research", label: "AI Research Assistant", icon: ScanSearch },
  { to: "/chat", label: "AI Workplace Chat", icon: MessagesSquare },
  { to: "/responsible-ai", label: "Responsible AI", icon: BookOpenCheck },
  { to: "/help", label: "Help & Support", icon: LifeBuoy },
  { to: "/settings", label: "Settings", icon: SettingsIcon },
] as const;

function BrandMark() {
  return (
    <div className="flex items-center gap-2.5">
      <span
        className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-primary-foreground"
        style={{ background: "var(--gradient-primary)" }}
      >
        <Sparkle className="h-4.5 w-4.5" />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-bold leading-tight text-foreground">
          Workplace AI
        </span>
        <span className="block truncate text-[11px] text-muted-foreground">
          Productivity Assistant
        </span>
      </span>
    </div>
  );
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="flex flex-col gap-1">
      {NAV.map((item) => {
        const active = pathname === item.to;
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={cn(
              "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
              active
                ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-xs"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground",
            )}
          >
            <item.icon
              className={cn(
                "h-4.5 w-4.5 shrink-0 transition-transform duration-200 group-hover:scale-110",
                active ? "text-primary" : "text-muted-foreground",
              )}
            />
            <span className="truncate">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="flex min-h-screen w-full bg-background">
      <aside className="sticky top-0 hidden h-screen w-[264px] shrink-0 flex-col border-r border-sidebar-border bg-sidebar px-4 py-5 lg:flex">
        <BrandMark />
        <div className="mt-7 flex-1 overflow-y-auto">
          <NavLinks />
        </div>
        <p className="mt-4 rounded-xl bg-secondary/70 px-3 py-2.5 text-[11px] leading-relaxed text-muted-foreground">
          Powered by Google Gemini. Always review AI output before professional use.
        </p>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur-md lg:px-8">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] bg-sidebar px-4 py-5">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <BrandMark />
              <div className="mt-7">
                <NavLinks onNavigate={() => setOpen(false)} />
              </div>
            </SheetContent>
          </Sheet>

          <div className="min-w-0 flex-1 lg:hidden">
            <BrandMark />
          </div>

          <p className="hidden min-w-0 flex-1 truncate text-sm text-muted-foreground lg:block">
            Your AI workspace for email, research and everyday work questions
          </p>

          <span className="hidden shrink-0 items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground sm:inline-flex">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            Gemini connected
          </span>
        </header>

        <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
