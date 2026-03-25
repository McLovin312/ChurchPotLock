import Link from "next/link";
import { SITE_CONFIG } from "@/lib/config";

/* -- Upcoming events data - add more events here -- */
const PREVIEW_EVENTS = [
  {
    id: "cinco-de-mayo",
    emoji: "🌮",
    title: "Cinco de Mayo Potluck",
    date: "May 5, 2026",
    location: "Lakeside Church",
    description: "Sign up to bring a taco, nacho, or drink item and celebrate together! Everyone's welcome.",
    accent: "#E8632A",
    href: "/events/cinco-de-mayo",
    cta: "Sign Up",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ background: "#FAF4E8" }}>

      {/* ════════════ HERO ════════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">

        {/* Background photo */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1506869640319-fe1a24fd76dc?w=1920&q=80')",
            backgroundColor: "#1E3A2F",
          }}
        />
        {/* Layered overlays */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(160deg,rgba(10,25,18,0.82) 0%,rgba(30,58,47,0.68) 60%,rgba(10,20,14,0.88) 100%)" }} />
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: "radial-gradient(circle,#fff 1px,transparent 1px)",
          backgroundSize: "28px 28px",
        }} />

        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center pt-24 pb-16">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-6 animate-fadeIn"
            style={{ borderColor: "rgba(200,150,62,0.4)", background: "rgba(200,150,62,0.12)" }}
          >
            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#C8963E" }} />
            <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: "#C8963E" }}>Lakeside Church</span>
          </div>

          {/* Headline */}
          <h1
            className="font-playfair font-bold text-white leading-tight animate-fadeUp"
            style={{ fontSize: "clamp(2.8rem,7vw,5rem)", animationDelay: "0.1s", textShadow: "0 2px 32px rgba(0,0,0,0.4)" }}
          >
            Young Adults
            <br />
            <span style={{ color: "#C8963E" }}>Events</span>
          </h1>

          <p
            className="mt-5 text-lg leading-relaxed animate-fadeUp"
            style={{ color: "rgba(255,255,255,0.72)", maxWidth: 460, margin: "1.25rem auto 0", animationDelay: "0.18s" }}
          >
            Community, faith, and fun - come hang out, share a meal, and build real friendships.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3 animate-fadeUp" style={{ animationDelay: "0.26s" }}>
            <Link
              href="/events"
              className="px-7 py-3.5 rounded-2xl text-sm font-bold text-white shadow-lg hover:opacity-90 transition-opacity"
              style={{ background: "linear-gradient(135deg,#C8963E,#E8A84A)" }}
            >
              View Events →
            </Link>
            <a
              href="https://lakesidechurchfolsom.churchcenter.com/groups/community-groups/lakeside-young-adults-l-y-a"
              target="_blank"
              rel="noopener noreferrer"
              className="px-7 py-3.5 rounded-2xl text-sm font-semibold border hover:bg-white/10 transition-colors"
              style={{ color: "rgba(255,255,255,0.88)", borderColor: "rgba(255,255,255,0.25)" }}
            >
              Join Young Adults ↗
            </a>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 animate-fadeIn" style={{ animationDelay: "0.6s" }}>
          <span className="text-xs tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.4)" }}>Scroll</span>
          <div className="w-5 h-8 rounded-full border flex items-start justify-center pt-1.5" style={{ borderColor: "rgba(255,255,255,0.25)" }}>
            <div className="w-1 h-2 rounded-full animate-bounce" style={{ background: "rgba(255,255,255,0.5)" }} />
          </div>
        </div>
      </section>

      {/* ════════════ ABOUT ════════════ */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "#C8963E" }}>Who We Are</p>
            <h2 className="font-playfair font-bold text-3xl leading-snug" style={{ color: "#1E3A2F" }}>
              A community worth being part of
            </h2>
            <p className="mt-4 leading-relaxed" style={{ color: "#5A4A3E", fontSize: "0.975rem" }}>
              We're the Young Adults group at Lakeside Church - a welcoming crew of 20-somethings
              who gather weekly for friendship and faith. Whether you've been at Lakeside for years or you're
              walking through the door for the first time, you belong here.
            </p>
            <p className="mt-3 leading-relaxed" style={{ color: "#5A4A3E", fontSize: "0.975rem" }}>
              We do life together through snacks, community events, small groups, and occasional adventures.
              This site is where we coordinate all of it.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { num: "Weekly", label: "Gatherings",         icon: "🗓️" },
              { num: "Younger Crowd", label: "18-30 welcome", icon: "🙌" },
              { num: "Open",   label: "Everyone welcome",   icon: "❤️" },
              { num: "Real",   label: "Authentic community", icon: "✨" },
            ].map(({ num, label, icon }) => (
              <div key={label} className="rounded-2xl p-5 flex flex-col gap-1" style={{ background: "white", border: "1px solid #EDE5D8" }}>
                <span className="text-2xl">{icon}</span>
                <span className="font-bold text-lg leading-none" style={{ color: "#1E3A2F" }}>{num}</span>
                <span className="text-xs" style={{ color: "#9B8B7E" }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ EVENTS PREVIEW ════════════ */}
      <section className="max-w-4xl mx-auto px-6 pb-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-bold tracking-widest uppercase mb-1.5" style={{ color: "#C8963E" }}>What's Coming Up</p>
            <h2 className="font-playfair font-bold text-3xl" style={{ color: "#1E3A2F" }}>Upcoming Events</h2>
          </div>
          <Link href="/events" className="text-sm font-semibold underline underline-offset-4 hidden sm:block" style={{ color: "#1E3A2F" }}>
            See all →
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {PREVIEW_EVENTS.map((ev) => (
            <div key={ev.id} className="rounded-2xl overflow-hidden bg-white" style={{ border: "1px solid #EDE5D8", boxShadow: "0 2px 12px rgba(28,20,16,0.05)" }}>
              <div className="h-1.5" style={{ background: ev.accent }} />
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl" style={{ background: ev.accent + "18", border: `1px solid ${ev.accent}28` }}>
                    {ev.emoji}
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: "#F5EFE6", color: "#7A6A5E" }}>{ev.date}</span>
                </div>
                <h3 className="font-playfair font-bold text-lg leading-snug text-gray-900">{ev.title}</h3>
                <p className="text-xs mt-0.5 mb-3" style={{ color: "#9B8B7E" }}>📍 {ev.location}</p>
                <p className="text-sm leading-relaxed mb-4" style={{ color: "#5A4A3E" }}>{ev.description}</p>
                <Link
                  href={ev.href}
                  className="flex items-center justify-between text-sm font-bold px-4 py-2.5 rounded-xl transition-colors"
                  style={{ background: ev.accent + "15", color: ev.accent }}
                >
                  {ev.cta}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                  </svg>
                </Link>
              </div>
            </div>
          ))}
          <div className="rounded-2xl p-5 flex flex-col items-center justify-center text-center gap-3" style={{ background: "white", border: "1px dashed #D6C9B8", minHeight: 200 }}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "#F5EFE6" }}>
              <svg className="w-5 h-5" style={{ color: "#9B8B7E" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: "#5A4A3E" }}>More coming soon</p>
              <p className="text-xs mt-0.5" style={{ color: "#9B8B7E" }}>Check back for new events</p>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════ CONTACT ════════════ */}
      <section id="contact" className="py-20 px-6" style={{ background: "#1E3A2F" }}>
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "#C8963E" }}>Get in Touch</p>
          <h2 className="font-playfair font-bold text-3xl text-white mb-4">Have a question?</h2>
          <p className="text-base mb-10" style={{ color: "rgba(255,255,255,0.6)" }}>
            Reach out to {SITE_CONFIG.contactName} - happy to answer any questions about the group or upcoming events.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 max-w-lg mx-auto">
            {[
              { label: "Phone", value: SITE_CONFIG.contactPhone, href: `tel:${SITE_CONFIG.contactPhone.replace(/\D/g,"")}`,
                icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/> },
              { label: "Email", value: SITE_CONFIG.contactEmail, href: `mailto:${SITE_CONFIG.contactEmail}`,
                icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/> },
            ].map(({ label, value, href, icon }) => (
              <a key={label} href={href}
                className="flex items-center gap-3 px-6 py-4 rounded-2xl hover:opacity-85 transition-opacity"
                style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "#C8963E20", border: "1px solid #C8963E40" }}>
                  <svg className="w-5 h-5" style={{ color: "#C8963E" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>{icon}</svg>
                </div>
                <div className="text-left">
                  <p className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>{label}</p>
                  <p className="text-sm font-semibold text-white truncate" style={{ maxWidth: 180 }}>{value}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ FOOTER ════════════ */}
      <footer className="py-8 px-6 border-t" style={{ borderColor: "#EDE5D8" }}>
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs" style={{ color: "#9B8B7E" }}>
          <span>© 2026 Lakeside Young Adults · <a href={SITE_CONFIG.churchUrl} target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: "#1E3A2F" }}>Lakeside Church</a></span>
          <div className="flex items-center gap-4">
            <Link href="/events" className="hover:underline">Events</Link>
            <a href="/#contact" className="hover:underline">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
