import Link from "next/link";

export const metadata = {
  title: "Events - Lakeside Young Adults",
  description: "Browse upcoming events for the Lakeside Young Adults group.",
};

const EVENTS = [
  {
    id: "cinco-de-mayo",
    emoji: "🌮",
    title: "Cinco de Mayo Potluck",
    date: "Monday, May 5, 2026",
    time: "6:30 PM",
    location: "Lakeside Church",
    description:
      "Our Cinco de Mayo celebration! Sign up to bring a dish - tacos, nacho toppings, or drinks. " +
      "The more people who bring something, the bigger the feast. Come hungry and ready to have fun.",
    accent: "#E8632A",
    href: "/events/cinco-de-mayo",
    tags: ["Food", "Community", "All welcome"],
    signupOpen: true,
  },
];

export default function EventsPage() {
  return (
    <div className="min-h-screen" style={{ background: "#FAF4E8" }}>

      {/* Header */}
      <div className="pt-28 pb-12 px-6" style={{ background: "#1E3A2F" }}>
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm mb-6 hover:opacity-80 transition-opacity" style={{ color: "rgba(255,255,255,0.55)" }}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
            </svg>
            Home
          </Link>
          <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "#C8963E" }}>Lakeside Young Adults</p>
          <h1 className="font-playfair font-bold text-white" style={{ fontSize: "clamp(2rem,5vw,3rem)" }}>
            Upcoming Events
          </h1>
          <p className="mt-2 text-base" style={{ color: "rgba(255,255,255,0.6)" }}>
            Everything we have going on - click any event to learn more or sign up. This page is for current Lakeside Young Adults members.
          </p>
        </div>
      </div>

      {/* Events list */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="space-y-5">
          {EVENTS.map((ev, i) => (
            <div
              key={ev.id}
              className="rounded-2xl bg-white overflow-hidden animate-fadeUp"
              style={{ border: "1px solid #EDE5D8", boxShadow: "0 2px 12px rgba(28,20,16,0.05)", animationDelay: `${i * 0.08}s` }}
            >
              <div className="h-1.5" style={{ background: ev.accent }} />
              <div className="p-6 sm:flex items-start gap-6">

                {/* Icon */}
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0 mb-4 sm:mb-0"
                  style={{ background: ev.accent + "18", border: `1px solid ${ev.accent}28` }}
                >
                  {ev.emoji}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                    <h2 className="font-playfair font-bold text-xl text-gray-900">{ev.title}</h2>
                    {ev.signupOpen && (
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: "#ECFDF5", color: "#166534" }}>
                        Sign-up open
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs mb-3" style={{ color: "#7A6A5E" }}>
                    <span>📅 {ev.date} · {ev.time}</span>
                    <span>📍 {ev.location}</span>
                  </div>

                  <p className="text-sm leading-relaxed mb-4" style={{ color: "#5A4A3E" }}>{ev.description}</p>

                  <div className="flex flex-wrap items-center gap-3">
                    <Link
                      href={ev.href}
                      className="inline-flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl text-white transition-opacity hover:opacity-90"
                      style={{ background: ev.accent }}
                    >
                      Sign Up
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                      </svg>
                    </Link>
                    {ev.tags.map(tag => (
                      <span key={tag} className="text-xs px-3 py-1 rounded-full font-medium" style={{ background: "#F5EFE6", color: "#7A6A5E" }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state placeholder */}
        {EVENTS.length === 0 && (
          <div className="text-center py-20">
            <span className="text-5xl mb-4 block">🗓️</span>
            <p className="text-lg font-semibold" style={{ color: "#5A4A3E" }}>No events scheduled yet</p>
            <p className="text-sm mt-1" style={{ color: "#9B8B7E" }}>Check back soon - something's always in the works!</p>
          </div>
        )}
      </main>
    </div>
  );
}
