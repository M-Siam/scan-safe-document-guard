
import { ThemeToggle } from "./ThemeToggle";
import { Shield, ShieldCheck } from "lucide-react";

export function Header() {
  return (
    <header className="border-b bg-card">
      <div className="container flex items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-lg font-bold sm:text-xl">
              ScanShield
            </h1>
            <p className="text-xs text-muted-foreground">
              Smart Document Risk Checker
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
