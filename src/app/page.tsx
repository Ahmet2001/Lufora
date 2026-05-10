import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Leaf, Sparkles, Sprout, ArrowRight } from "lucide-react";

export default async function RootPage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen bg-brand-soft/20 flex flex-col">
      {/* Navbar */}
      <header className="px-6 py-4 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-50 border-b border-surface-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-primary rounded-xl flex items-center justify-center">
            <Leaf size={18} className="text-white" />
          </div>
          <span className="font-display font-bold text-xl text-brand-dark">Lufora</span>
        </div>
        <div>
          {session ? (
            <Link
              href="/home"
              className="text-sm font-semibold text-white bg-brand-primary px-4 py-2 rounded-full hover:bg-brand-dark transition-colors shadow-md shadow-brand-primary/20"
            >
              Dashboard
            </Link>
          ) : (
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
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20 animate-fade-in">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-soft text-brand-primary text-xs font-bold mb-6 border border-brand-primary/20">
          <Sparkles size={14} />
          <span>Your AI Plant Companion</span>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-display font-bold text-brand-dark mb-6 leading-tight max-w-3xl">
          Grow smarter, <span className="text-brand-primary">together.</span>
        </h1>
        
        <p className="text-lg text-brand-muted mb-10 max-w-xl leading-relaxed">
          Track your plants, get AI-powered care advice, and join a thriving community of plant lovers. Lufora makes plant care effortless and social.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center max-w-md">
          {session ? (
            <Link
              href="/home"
              className="flex items-center justify-center gap-2 bg-brand-primary text-white font-bold text-lg py-4 px-8 rounded-2xl hover:bg-brand-dark transition-all shadow-xl shadow-brand-primary/20 hover:-translate-y-0.5"
            >
              Go to Dashboard <ArrowRight size={20} />
            </Link>
          ) : (
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
          )}
        </div>

        {/* Feature Highlights */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl text-left w-full">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-surface-100">
            <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-4">
              <Sparkles size={24} />
            </div>
            <h3 className="font-display font-bold text-xl text-brand-dark mb-2">AI Plant Matchmaker</h3>
            <p className="text-brand-muted text-sm leading-relaxed">Find the perfect plant for your lifestyle and space with our intelligent recommendation engine.</p>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-surface-100">
            <div className="w-12 h-12 bg-green-50 text-brand-primary rounded-2xl flex items-center justify-center mb-4">
              <Leaf size={24} />
            </div>
            <h3 className="font-display font-bold text-xl text-brand-dark mb-2">Smart Care Tracking</h3>
            <p className="text-brand-muted text-sm leading-relaxed">Never forget to water again. Get personalized tasks and reminders for all your green friends.</p>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-surface-100">
            <div className="w-12 h-12 bg-amber-50 text-brand-earth rounded-2xl flex items-center justify-center mb-4">
              <Sprout size={24} />
            </div>
            <h3 className="font-display font-bold text-xl text-brand-dark mb-2">Grow Journeys</h3>
            <p className="text-brand-muted text-sm leading-relaxed">Document your plant's growth from seed to maturity and share milestones with the community.</p>
          </div>
        </div>
      </main>

      <footer className="bg-white py-8 border-t border-surface-200 text-center text-sm text-brand-muted mt-auto">
        <p>&copy; {new Date().getFullYear()} Lufora. All rights reserved.</p>
      </footer>
    </div>
  );
}
