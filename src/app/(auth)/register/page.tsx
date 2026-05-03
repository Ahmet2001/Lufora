"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Leaf, AlertCircle } from "lucide-react";
import Button from "@/components/ui/Button";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, confirmPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to register");
        setLoading(false);
        return;
      }

      // Auto login after register
      const loginRes = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (loginRes?.error) {
        setError("Account created, but failed to log in automatically. Please go to login.");
      } else {
        router.push("/home");
        router.refresh();
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      if (!error) setLoading(false);
    }
  };

  return (
    <div className="page-container min-h-screen flex flex-col justify-center py-10">
      <div className="flex flex-col items-center mb-6 animate-fade-in">
        <div className="w-14 h-14 bg-brand-primary rounded-2xl flex items-center justify-center shadow-lg shadow-brand-primary/30 mb-4">
          <Leaf size={28} className="text-white" />
        </div>
        <h1 className="font-display text-2xl font-bold text-brand-dark mb-1">Create Account</h1>
        <p className="text-brand-muted text-center text-sm max-w-xs">
          Join Lufora to track your plants and connect with the community.
        </p>
      </div>

      <div className="lufora-card p-6 animate-slide-up">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2">
            <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-800 font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-brand-dark mb-1.5 uppercase tracking-wider">Name</label>
            <input
              type="text"
              required
              className="input-field"
              placeholder="E.g., Ada Green"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-brand-dark mb-1.5 uppercase tracking-wider">Email</label>
            <input
              type="email"
              required
              className="input-field"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-brand-dark mb-1.5 uppercase tracking-wider">Password</label>
            <input
              type="password"
              required
              minLength={8}
              className="input-field"
              placeholder="Minimum 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-brand-dark mb-1.5 uppercase tracking-wider">Confirm Password</label>
            <input
              type="password"
              required
              className="input-field"
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <Button type="submit" variant="primary" className="w-full mt-2" isLoading={loading}>
            Create Account
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-brand-muted">Already have an account? </span>
          <Link href="/login" className="font-semibold text-brand-primary hover:underline">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
