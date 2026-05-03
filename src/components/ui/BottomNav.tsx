"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Leaf, Sprout, Users, User } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { key: "home", label: "Home", href: "/home", Icon: Home },
  { key: "plants", label: "My Plants", href: "/plants", Icon: Leaf },
  { key: "grow", label: "Grow", href: "/grow", Icon: Sprout },
  { key: "community", label: "Community", href: "/community", Icon: Users },
  { key: "profile", label: "Profile", href: "/profile", Icon: User },
] as const;

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-t border-surface-200/60 shadow-nav">
      <div className="max-w-lg mx-auto flex items-center justify-around h-[5rem] px-1">
        {NAV_ITEMS.map(({ key, label, href, Icon }) => {
          const isActive = pathname === href || (pathname?.startsWith(href + "/") ?? false);

          return (
            <Link
              key={key}
              href={href}
              id={`nav-${key}`}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 w-16 py-1.5",
                "transition-all duration-200 rounded-2xl",
                isActive ? "text-brand-primary" : "text-brand-muted active:text-brand-dark"
              )}
            >
              <div
                className={cn(
                  "relative flex items-center justify-center w-11 h-8 rounded-full transition-all duration-300",
                  isActive && "bg-brand-soft"
                )}
              >
                <Icon
                  size={21}
                  strokeWidth={isActive ? 2.5 : 1.8}
                  className="transition-all duration-200"
                />
              </div>
              <span
                className={cn(
                  "text-[10px] transition-all duration-200",
                  isActive ? "font-semibold" : "font-medium"
                )}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
      <div className="h-[env(safe-area-inset-bottom,0px)] bg-white/90" />
    </nav>
  );
}
