import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { LayoutDashboard, Sparkles, Receipt, Menu } from "lucide-react";
import { Separator } from "#/components/ui/separator";
import { Button } from "#/components/ui/button";
import ThemeToggle from "#/components/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu";
import { SignOutButton } from "#/features/authentication/presentations/components/SignOutButton";
import { SignOutConfirmationDialog } from "#/features/authentication/presentations/components/SignOutConfirmationDialog";
import { SignOutDropdownMenuItem } from "#/features/authentication/presentations/components/SignOutDropdownMenuItem";

const NAV_ITEMS = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Optimizer", to: "/optimizer", icon: Sparkles },
  { label: "Receipt", to: "/receipt", icon: Receipt },
] as const;

export default function AppSidebar() {
  const [isSignOutDialogOpen, setIsSignOutDialogOpen] = useState(false);

  return (
    <>
      <header className="glass-heavy sticky top-0 z-30 flex items-center justify-between gap-3 px-4 py-3 md:hidden">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="h-2.5 w-2.5 flex-shrink-0 rounded-full bg-brand" />
          <span className="truncate text-base font-bold tracking-tight text-foreground">
            clrk
          </span>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle compact />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon-sm"
                className="rounded-full text-muted-foreground hover:text-foreground"
                aria-label="Open workspace menu"
              >
                <Menu size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Workspace
              </DropdownMenuLabel>
              {NAV_ITEMS.map((item) => (
                <DropdownMenuItem key={item.to} asChild>
                  <Link to={item.to} className="font-medium no-underline">
                    <item.icon size={15} />
                    {item.label}
                  </Link>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <SignOutDropdownMenuItem
                onSelect={() => setIsSignOutDialogOpen(true)}
              />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <aside className="glass-sidebar hidden w-56 flex-shrink-0 flex-col md:flex">
        <div className="flex items-center gap-2.5 px-5 py-7">
          <span className="h-2.5 w-2.5 rounded-full bg-brand" />
          <span className="text-base font-bold tracking-tight text-foreground">
            clrk
          </span>
        </div>

        <Separator className="bg-border" />

        <nav className="flex-1 px-3 py-4">
          <div className="space-y-0.5">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 no-underline transition-colors hover:bg-accent"
              >
                {({ isActive }: { isActive: boolean }) => (
                  <>
                    <span
                      className={`h-1.5 w-1.5 flex-shrink-0 rounded-full transition-colors ${isActive ? "bg-brand" : "bg-transparent"}`}
                    />
                    <item.icon
                      size={15}
                      className={
                        isActive ? "text-foreground" : "text-muted-foreground"
                      }
                    />
                    <span
                      className={`text-sm font-medium ${isActive ? "text-foreground" : "text-muted-foreground"}`}
                    >
                      {item.label}
                    </span>
                  </>
                )}
              </Link>
            ))}
          </div>
        </nav>

        <Separator className="bg-border" />

        <div className="space-y-2 px-3 py-4">
          <div className="flex justify-center">
            <ThemeToggle />
          </div>
          <SignOutButton onClick={() => setIsSignOutDialogOpen(true)} />
        </div>
      </aside>

      <nav className="glass-heavy fixed inset-x-3 bottom-3 z-40 flex items-center justify-around rounded-2xl px-2 py-2 md:hidden">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="flex min-w-0 flex-1 justify-center no-underline"
          >
            {({ isActive }: { isActive: boolean }) => (
              <span
                className={`flex w-full flex-col items-center gap-1 rounded-xl px-2 py-2 text-[10px] font-medium uppercase tracking-widest transition-colors ${
                  isActive
                    ? "bg-brand text-brand-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                <item.icon size={16} />
                <span className="truncate">{item.label}</span>
              </span>
            )}
          </Link>
        ))}
      </nav>

      <SignOutConfirmationDialog
        open={isSignOutDialogOpen}
        onOpenChange={setIsSignOutDialogOpen}
      />
    </>
  );
}
