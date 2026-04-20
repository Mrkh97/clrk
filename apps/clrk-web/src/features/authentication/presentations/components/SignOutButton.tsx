import { LogOut } from "lucide-react";
import { Button } from "#/components/ui/button";
import { cn } from "#/lib/utils";

interface SignOutButtonProps {
  className?: string;
  onClick: () => void;
}

export function SignOutButton({ className, onClick }: SignOutButtonProps) {
  return (
    <Button
      variant="ghost"
      type="button"
      className={cn(
        "flex w-full items-center justify-start gap-3 px-3 py-2.5 text-muted-foreground hover:text-foreground",
        className,
      )}
      onClick={onClick}
    >
      <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full" />
      <LogOut size={15} />
      <span className="text-sm font-medium">Sign Out</span>
    </Button>
  );
}
