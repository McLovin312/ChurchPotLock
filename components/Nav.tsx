"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { SITE_CONFIG } from "@/lib/config";

const NAV_LINKS = [
  { label: "Home",   href: "/" },
  { label: "Events", href: "/events" },
  { label: "Contact",href: "/#contact" },
];

export default function Nav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => setMenuOpen(false), [pathname]);

  const isHeroPage = pathname === "/";

  return (
    <header
      className="fixed top-0 inset-x-0 z-50 transition-all duration-300"
      style={{
        background: scrolled || !isHeroPage || menuOpen
          ? "rgba(255,255,255,0.97)"
          : "transparent",
        backdropFilter: scrolled || !isHeroPage ? "blur(12px)" : "none",
        borderBottom: scrolled || !isHeroPage
          ? "1px solid rgba(0,0,0,0.07)"
          : "1px solid transparent",
        boxShadow: scrolled ? "0 1px 12px rgba(0,0,0,0.06)" : "none",
      }}
    >
      <div className="max-w-6xl mx-auto px-5 flex items-center justify-between h-16">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
            style={{ background: "linear-gradient(135deg,#1E3A2F,#2D5C46)" }}
          >
            LA
          </div>
          <div className="leading-none">
            <span
              className="font-playfair font-bold block"
              style={{
                fontSize: "1rem",
                color: scrolled || !isHeroPage ? "#1E3A2F" : "white",
                transition: "color 0.3s",
              }}
            >
              Lakeside
            </span>
            <span
              className="text-xs font-medium block -mt-0.5"
              style={{
                color: scrolled || !isHeroPage ? "#7A6A5E" : "rgba(255,255,255,0.7)",
                transition: "color 0.3s",
              }}
            >
              Young Adults
            </span>
          </div>
        </Link>

        {/* Desktop links */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ label, href }) => {
            const active = href !== "/" && pathname.startsWith(href.split("#")[0]) && href !== "/#contact";
            return (
              <Link
                key={href}
                href={href}
                className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
                style={{
                  color: active
                    ? "#1E3A2F"
                    : scrolled || !isHeroPage
                    ? "#4B3F35"
                    : "rgba(255,255,255,0.85)",
                  background: active ? "#1E3A2F1A" : "transparent",
                }}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTA */}
        <a
          href={SITE_CONFIG.churchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl transition-all hover:opacity-85"
          style={{ background: "#1E3A2F", color: "white" }}
        >
          Lakeside Church
          <svg className="w-3.5 h-3.5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
          </svg>
        </a>

        {/* Hamburger */}
        <button
          onClick={() => setMenuOpen(o => !o)}
          className="md:hidden p-2 rounded-xl transition-colors"
          style={{ color: scrolled || !isHeroPage ? "#1E3A2F" : "white" }}
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="md:hidden animate-slideDown border-t px-4 py-4 space-y-1"
          style={{ background: "white", borderColor: "#EDE5D8" }}
        >
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="block px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {label}
            </Link>
          ))}
          <a
            href={SITE_CONFIG.churchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold mt-2"
            style={{ background: "#1E3A2F15", color: "#1E3A2F" }}
          >
            Lakeside Church
            <svg className="w-3.5 h-3.5 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
            </svg>
          </a>
        </div>
      )}
    </header>
  );
}
