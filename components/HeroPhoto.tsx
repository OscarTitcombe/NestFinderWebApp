"use client";
import Image from "next/image";
import { useState } from "react";
import { normalizePostcode } from '@/lib/postcode';

export default function HeroPhoto({
  imageSrc = "/hero-photo.png",               // place licensed image here
  logoSrc = "/logo-v3.png",
  appName = "NestFinder",
  tagline = "A new way to find homes, before they're listed.",
}: {
  imageSrc?: string;
  logoSrc?: string;
  appName?: string;
  tagline?: string;
}) {
  const [postcode, setPostcode] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!postcode.trim()) {
      return;
    }

    const result = normalizePostcode(postcode);
    
    if (!result.ok) {
      setError(result.error || 'Invalid postcode');
      return;
    }

    // Navigate to quiz page with normalized postcode (matching existing flow)
    window.location.href = `/quiz?postcode=${encodeURIComponent(result.district!)}`;
  };

  return (
    <section className="relative min-h-[72svh] sm:min-h-[80svh] isolate">
      {/* BG photo */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={imageSrc}
          alt=""
          priority
          fill
          sizes="100vw"
          className="object-cover object-[25%_bottom] md:object-[center_bottom]"
        />
      </div>

      {/* Content integrated onto background */}
      <div className="nf-container relative z-10 flex min-h-[72svh] sm:min-h-[80svh] items-center justify-center py-10 sm:py-16">
        <div className="w-full max-w-2xl text-center">
          {/* Main heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold tracking-tighter text-[#101314] mb-2" style={{ letterSpacing: '-0.02em' }}>
            NestFinder
          </h1>
          {/* Subheading */}
          <h2 className="text-base sm:text-lg md:text-xl font-normal tracking-tight text-[#2B3135] mb-3">
            Explore your local housing network.
            <br />
            Discover active buyers and potential homes nearby.
          </h2>

          {/* Postcode form on island */}
          <div className="mt-8">
            <div className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white shadow-sm p-3 sm:p-4">
              <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-3"
                aria-label="Search pre-market interest by postcode"
              >
                <label htmlFor="hero-postcode-input" className="sr-only">
                  Enter postcode
                </label>
                <input
                  id="hero-postcode-input"
                  aria-label="Enter postcode"
                  inputMode="text"
                  placeholder="Enter postcode (e.g., SW1A)"
                  value={postcode}
                  onChange={(e) => {
                    setPostcode(e.target.value.toUpperCase());
                    if (error) setError("");
                  }}
                  className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-[#F97316]"
                  aria-invalid={error ? 'true' : 'false'}
                  aria-describedby={error ? "hero-postcode-error" : undefined}
                />
                <button
                  type="submit"
                  className="rounded-xl px-5 py-3 font-semibold text-white bg-[#acb54d] hover:bg-[#9aa045] shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316] sm:min-w-[190px] transition-colors"
                >
                  Explore your area
                </button>
              </form>
              {error && (
                <p id="hero-postcode-error" className="mt-2 text-sm text-red-600" role="alert">
                  {error}
                </p>
              )}
            </div>
          </div>
          <p className="mt-4 text-center text-[13px] text-slate-600">
            Free to browse. No sign-up required for sellers.
          </p>
        </div>
      </div>
    </section>
  );
}

