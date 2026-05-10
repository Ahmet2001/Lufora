"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Sprout, ArrowRight } from "lucide-react";

export function HeaderAuthLinks() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="w-20 h-8 bg-surface-200 animate-pulse rounded-full"></div>;
  }

  if (session) {
    return (
      <Link
        href="/home"
        className="text-sm font-semibold text-white bg-brand-primary px-4 py-2 rounded-full hover:bg-brand-dark transition-colors shadow-md shadow-brand-primary/20"
      >
        Dashboard
      </Link>
    );
  }

  return (
    <div className="flex gap-3">
      <Link
        href="/login"
        className="text-sm font-semibold text-brand-dark hover:text-brand-primary px-3 py-2 transition-colors"
      >
        Log in
      </Link>
      <Link
        href="/register"
        className="text-sm font-semibold text-white bg-brand-primary px-4 py-2 rounded-full hover:bg-brand-dark transition-colors shadow-md shadow-brand-primary/20"
      >
        Get Started
      </Link>
    </div>
  );
}

export function HeroAuthLinks() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="w-48 h-14 bg-surface-200 animate-pulse rounded-2xl"></div>;
  }

  if (session) {
    return (
      <Link
        href="/home"
        className="flex items-center justify-center gap-2 bg-brand-primary text-white font-bold text-lg py-4 px-8 rounded-2xl hover:bg-brand-dark transition-all shadow-xl shadow-brand-primary/20 hover:-translate-y-0.5"
      >
        Go to Dashboard <ArrowRight size={20} />
      </Link>
    );
  }

  return (
    <>
      <Link
        href="/register"
        className="flex items-center justify-center gap-2 bg-brand-primary text-white font-bold text-lg py-4 px-8 rounded-2xl hover:bg-brand-dark transition-all shadow-xl shadow-brand-primary/20 hover:-translate-y-0.5"
      >
        Start Growing <Sprout size={20} />
      </Link>
      <Link
        href="/community"
        className="flex items-center justify-center gap-2 bg-white text-brand-dark border-2 border-surface-200 font-bold text-lg py-4 px-8 rounded-2xl hover:border-brand-primary hover:text-brand-primary transition-all"
      >
        Explore Community
      </Link>
    </>
  );
}
