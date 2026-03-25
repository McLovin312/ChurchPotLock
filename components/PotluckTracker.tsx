"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { sections, Item } from "@/lib/data";
import {
  PotluckState, Claim, CustomItem,
  addClaim, removeClaim, resetAllClaims,
  addCustomItem, editItem, removeItem, setItemImage,
} from "@/lib/actions";
import {
  isAdminAuthed, setAdminAuthed,
  getStoredAdminPw, storeAdminPw,
} from "@/lib/storage";
import { SITE_CONFIG } from "@/lib/config";
import SectionCard from "./SectionCard";
import ClaimModal from "./ClaimModal";
import AddItemModal from "./AddItemModal";

const HERO_IMG = "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=1600&q=80";

type Props = { initialState: PotluckState };

export default function PotluckTracker({ initialState }: Props) {
  "use no memo";

  /* ── State ── */
  const [state,          setState]          = useState<PotluckState>(initialState);
  const [isAdmin,        setIsAdmin]        = useState(false);
  const [adminPw,        setAdminPw]        = useState("");
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPwInput,   setAdminPwInput]   = useState("");
  const [adminError,     setAdminError]     = useState("");
  const [pendingItem,    setPendingItem]    = useState<Item | null>(null);
  const [addItemSection, setAddItemSection] = useState<string | null>(null);
  const [toast,          setToast]          = useState<{ msg: string; type: "success"|"info"|"error" } | null>(null);
  const [busy,           setBusy]           = useState(false);

  /* ── Bootstrap ── */
  useEffect(() => {
    setIsAdmin(isAdminAuthed());
    setAdminPw(getStoredAdminPw());
  }, []);

  /* ── Toast ── */
  const showToast = useCallback((msg: string, type: "success"|"info"|"error" = "success") => {
    setToast({ msg, type });
    const t = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(t);
  }, []);

  /* ── Refresh state from server ── */
  const refreshState = useCallback(async () => {
    try {
      const fresh = await fetch("/api/state", { cache: "no-store" }).then(r => r.json()) as PotluckState;
      setState(fresh);
    } catch { /* silent */ }
  }, []);

  /* ── Poll every 30s so changes from other users appear ── */
  useEffect(() => {
    const interval = setInterval(refreshState, 30_000);
    return () => clearInterval(interval);
  }, [refreshState]);

  /* ── Compute enriched sections ── */
  const hiddenIds = Array.isArray(state.hiddenItemIds) ? state.hiddenItemIds : [];
  const enrichedSections = sections.map(section => ({
    ...section,
    items: [
      ...section.items.filter(item => !hiddenIds.includes(item.id)),
      ...state.customItems
        .filter(ci => ci.sectionId === section.id)
        .map(ci => ({ id: ci.id, name: ci.name, description: ci.description, emoji: ci.emoji, quantity: ci.quantity })),
    ],
  }));

  /* ── Claim handlers ── */
  async function handleClaim(name: string, quantity: string) {
    if (!pendingItem) return;
    const itemId = pendingItem.id;
    setPendingItem(null);
    setBusy(true);
    try {
      await addClaim(itemId, name, quantity);
      await refreshState();
      showToast(`Signed up! You're bringing "${pendingItem.name}" 🎉`);
    } catch {
      showToast("Something went wrong - please try again.", "error");
    } finally { setBusy(false); }
  }

  async function handleRemoveClaim(itemId: string, claimId: string) {
    setBusy(true);
    try {
      await removeClaim(itemId, claimId, adminPw);
      await refreshState();
      showToast("Claim removed", "info");
    } catch {
      showToast("Failed to remove claim", "error");
    } finally { setBusy(false); }
  }

  async function handleResetAll() {
    if (!confirm("Reset ALL claims for everyone? This cannot be undone.")) return;
    setBusy(true);
    try {
      await resetAllClaims(adminPw);
      await refreshState();
      showToast("All claims cleared", "info");
    } catch {
      showToast("Failed to reset claims", "error");
    } finally { setBusy(false); }
  }

  /* ── Admin item handlers ── */
  async function handleAddItem(item: Omit<CustomItem, "id">, imageDataUrl?: string) {
    setBusy(true);
    try {
      await addCustomItem(item, imageDataUrl, adminPw);
      await refreshState();
      setAddItemSection(null);
      showToast(`"${item.name}" added!`, "info");
    } catch {
      showToast("Failed to add item", "error");
    } finally { setBusy(false); }
  }

  async function handleEditItem(itemId: string, updates: { name?: string; description?: string; emoji?: string; quantity?: string }) {
    setBusy(true);
    try {
      await editItem(itemId, updates, adminPw);
      await refreshState();
      showToast("Item updated", "info");
    } catch {
      showToast("Failed to update item", "error");
    } finally { setBusy(false); }
  }

  async function handleRemoveItem(itemId: string) {
    setBusy(true);
    try {
      await removeItem(itemId, adminPw);
      await refreshState();
      showToast("Item removed", "info");
    } catch {
      showToast("Failed to remove item", "error");
    } finally { setBusy(false); }
  }

  async function handleUploadImage(itemId: string, dataUrl: string) {
    setBusy(true);
    try {
      await setItemImage(itemId, dataUrl, adminPw);
      await refreshState();
      showToast("Image updated!", "info");
    } catch {
      showToast("Failed to upload image", "error");
    } finally { setBusy(false); }
  }

  /* ── Admin login / logout ── */
  async function handleAdminLogin(e: React.FormEvent) {
    e.preventDefault();
    // Verify by attempting a no-op server action
    if (adminPwInput === SITE_CONFIG.adminPassword) {
      setAdminAuthed(true);
      storeAdminPw(adminPwInput);
      setAdminPw(adminPwInput);
      setIsAdmin(true);
      setShowAdminLogin(false);
      setAdminPwInput("");
      setAdminError("");
      showToast("Admin mode on", "info");
    } else {
      setAdminError("Wrong password - try again.");
    }
  }

  function handleAdminLogout() {
    setAdminAuthed(false);
    storeAdminPw("");
    setAdminPw("");
    setIsAdmin(false);
    showToast("Signed out of admin mode", "info");
  }

  /* ── Progress ── */
  const totalItems   = enrichedSections.reduce((a, s) => a + s.items.length, 0);
  const totalClaimed = Object.values(state.claims).reduce((a, arr) => a + arr.length, 0);
  const remaining    = Math.max(0, totalItems - Object.keys(state.claims).length);
  const pct          = totalItems > 0 ? Math.round((Object.keys(state.claims).length / totalItems) * 100) : 0;

  return (
    <div className="min-h-screen" style={{ background: "#FAF4E8" }}>

      {/* ════════════ HERO BANNER ════════════ */}
      <header className="relative overflow-hidden" style={{ minHeight: 300 }}>
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${HERO_IMG}')`, backgroundColor: "#7C3B1A" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(160deg,rgba(25,8,0,0.78) 0%,rgba(80,25,5,0.62) 55%,rgba(18,6,0,0.82) 100%)" }} />
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "radial-gradient(circle,#fff 1.5px,transparent 1.5px)", backgroundSize: "26px 26px" }} />

        <div className="relative z-10 max-w-2xl mx-auto px-5 pt-24 pb-10 text-center">
          {/* Breadcrumb */}
          <Link href="/events" className="inline-flex items-center gap-1 text-xs mb-4 hover:opacity-80 transition-opacity" style={{ color: "rgba(255,255,255,0.5)" }}>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
            Events
          </Link>

          <p className="text-white/55 text-xs font-semibold tracking-[0.2em] uppercase mb-2">Lakeside Young Adults</p>
          <h1 className="font-playfair text-white leading-tight" style={{ fontSize: "clamp(2.2rem,6vw,3.4rem)", textShadow: "0 2px 20px rgba(0,0,0,0.55)" }}>
            Cinco de Mayo
            <br /><em className="not-italic" style={{ color: "#FBBF24" }}>Potluck</em>
          </h1>
          <p className="mt-3 text-sm font-medium" style={{ color: "rgba(255,255,255,0.65)" }}>
            May 5th · Click any item to sign up and bring it!
          </p>

          {/* Progress pill */}
          <div className="mt-6 inline-flex items-center gap-4 rounded-2xl px-5 py-3" style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(6px)", border: "1px solid rgba(255,255,255,0.15)" }}>
            <div className="text-left">
              <p className="text-white font-bold text-xl leading-none">{totalClaimed}<span className="text-white/50 text-base">/{totalItems}</span></p>
              <p className="text-white/50 text-xs mt-0.5">total sign-ups</p>
            </div>
            <div className="w-px h-9 bg-white/15" />
            <div style={{ width: 140 }}>
              <div className="flex justify-between text-xs mb-1.5" style={{ color: "rgba(255,255,255,0.5)" }}>
                <span>{pct}% covered</span>
                <span>{remaining} items left</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.2)" }}>
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: "linear-gradient(90deg,#fb923c,#fbbf24)" }} />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ════════════ ADMIN BAR ════════════ */}
      <div className="bg-white border-b px-4 py-2 flex items-center justify-between gap-3" style={{ borderColor: "#EDE5D8" }}>
        <span className="text-xs" style={{ color: "#9B8B7E" }}>
          {isAdmin ? "Admin mode: add, remove, or reset items and claims." : "Multiple people can sign up for the same item."}
        </span>
        <div className="flex items-center gap-3 flex-shrink-0">
          {isAdmin ? (
            <>
              <button
                onClick={handleResetAll}
                disabled={busy}
                className="text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors"
                style={{ background: "#FEF2F2", color: "#DC2626" }}
              >
                Reset all claims
              </button>
              <span className="text-xs font-semibold px-3 py-1 rounded-full border" style={{ background: "#F0FDF4", color: "#166534", borderColor: "#BBF7D0" }}>Admin on</span>
              <button onClick={handleAdminLogout} className="text-xs underline underline-offset-2" style={{ color: "#9B8B7E" }}>Sign out</button>
            </>
          ) : (
            <button onClick={() => setShowAdminLogin(true)} className="flex items-center gap-1 text-xs transition-colors" style={{ color: "#C0B0A4" }} title="Admin login">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              Admin
            </button>
          )}
        </div>
      </div>

      {/* ════════════ MAIN ════════════ */}
      <main className="max-w-2xl mx-auto px-4 pt-6 pb-16">
        {/* How it works */}
        <div className="rounded-2xl px-5 py-4 mb-6 flex items-start gap-3" style={{ background: "white", border: "1px solid #EDE5D8", boxShadow: "0 1px 4px rgba(28,20,16,0.05)" }}>
          <span className="text-2xl mt-0.5 flex-shrink-0">👋</span>
          <div>
            <p className="text-sm font-semibold text-gray-800">Here&apos;s how it works</p>
            <p className="text-sm mt-0.5 leading-relaxed" style={{ color: "#7A6A5E" }}>
              Tap a section to expand it, then click any item to sign up. Multiple people can sign up for the same thing - so bring what you can!
              Claimed items are locked, only the admin can reset them. Reach out to Thomas Lovin for any inquiries.
            </p>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-4">
          {enrichedSections.map((section, i) => (
            <div key={section.id} className="animate-fadeUp" style={{ animationDelay: `${i * 0.07}s` }}>
              <SectionCard
                section={section}
                claims={state.claims}
                isAdmin={isAdmin}
                itemImages={state.itemImages}
                quantityOverrides={state.quantityOverrides}
                onSelect={setPendingItem}
                onRemoveClaim={handleRemoveClaim}
                onRemoveItem={handleRemoveItem}
                onAddItem={setAddItemSection}
                onUploadImage={handleUploadImage}
                onEditItem={handleEditItem}
                defaultOpen={i === 0}
              />
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-8 flex flex-wrap justify-center gap-5 text-xs" style={{ color: "#9B8B7E" }}>
          <div className="flex items-center gap-1.5"><div className="w-4 h-4 rounded-full border-2 border-gray-300" />Available</div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded-full bg-green-400 flex items-center justify-center">
              <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
            </div>
            Claimed (items stay open for others)
          </div>
        </div>

        <p className="text-center text-xs mt-8" style={{ color: "#C0B0A4" }}>Lakeside Young Adults · Cinco de Mayo 2026 🌮</p>
      </main>

      {/* ════════════ CLAIM MODAL ════════════ */}
      {pendingItem && (
        <ClaimModal
          item={pendingItem}
          customImage={state.itemImages[pendingItem.id]}
          quantityOverride={state.quantityOverrides[pendingItem.id]}
          onConfirm={handleClaim}
          onCancel={() => setPendingItem(null)}
        />
      )}

      {/* ════════════ ADD ITEM MODAL ════════════ */}
      {addItemSection && (
        <AddItemModal
          defaultSectionId={addItemSection}
          onConfirm={handleAddItem}
          onCancel={() => setAddItemSection(null)}
        />
      )}

      {/* ════════════ ADMIN LOGIN MODAL ════════════ */}
      {showAdminLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
          onClick={e => { if (e.target === e.currentTarget) { setShowAdminLogin(false); setAdminPwInput(""); setAdminError(""); } }}
        >
          <div className="animate-popIn bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="h-1" style={{ background: "linear-gradient(90deg,#6B7280,#9CA3AF,#6B7280)" }} />
            <div className="p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "#F3F4F6" }}>
                  <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                </div>
                <div>
                  <h2 className="font-playfair font-bold text-gray-800">Admin Login</h2>
                  <p className="text-xs mt-0.5" style={{ color: "#9B8B7E" }}>Manage items and reset claims.</p>
                </div>
              </div>
              <form onSubmit={handleAdminLogin} className="space-y-3">
                <input
                  type="password" value={adminPwInput}
                  onChange={e => { setAdminPwInput(e.target.value); setAdminError(""); }}
                  placeholder="Password" autoFocus
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-300 placeholder:text-gray-300"
                />
                {adminError && <p className="text-red-500 text-xs bg-red-50 rounded-xl px-3.5 py-2.5">{adminError}</p>}
                <div className="flex gap-2.5">
                  <button type="button" onClick={() => { setShowAdminLogin(false); setAdminPwInput(""); setAdminError(""); }}
                    className="flex-1 border border-gray-200 text-gray-500 rounded-xl py-2.5 text-sm font-semibold hover:bg-gray-50 transition-colors"
                  >Cancel</button>
                  <button type="submit" className="flex-1 bg-gray-800 hover:bg-gray-700 text-white rounded-xl py-2.5 text-sm font-semibold transition-colors">Sign In</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ════════════ TOAST ════════════ */}
      {toast && (
        <div
          className="fixed bottom-6 left-1/2 z-50 px-5 py-3 rounded-2xl shadow-xl text-white text-sm font-semibold animate-toast whitespace-nowrap"
          style={{
            transform: "translateX(-50%)",
            background: toast.type === "success" ? "linear-gradient(135deg,#E8632A,#C89B0A)" : toast.type === "error" ? "#DC2626" : "#374151",
          }}
        >
          {toast.msg}
        </div>
      )}

      {/* Busy overlay */}
      {busy && (
        <div className="fixed inset-0 z-40 pointer-events-none flex items-end justify-center pb-24">
          <div className="px-4 py-2 rounded-full text-xs font-semibold text-white" style={{ background: "rgba(0,0,0,0.55)" }}>
            Saving…
          </div>
        </div>
      )}
    </div>
  );
}
