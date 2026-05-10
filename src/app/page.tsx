import { Leaf, Sparkles, Sprout } from "lucide-react";
import { HeaderAuthLinks, HeroAuthLinks } from "@/components/auth/AuthLinks";

export default function RootPage() {
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
          <HeaderAuthLinks />
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
          <HeroAuthLinks />
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
            <p className="text-brand-muted text-sm leading-relaxed">Document your plant&apos;s growth from seed to maturity and share milestones with the community.</p>
          </div>
        </div>
      </main>

      <footer className="bg-white py-8 border-t border-surface-200 text-center text-sm text-brand-muted mt-auto">
        <p>&copy; {new Date().getFullYear()} Lufora. All rights reserved.</p>
      </footer>
    </div>
  );
}
