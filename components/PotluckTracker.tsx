"use client";

import { useState, useEffect, useCallback } from "react";
import { sections, Item } from "@/lib/data";
import {
  Claim, CustomItem,
  getClaims, saveClaim, removeClaim, getInitials,
  isAdminAuthed, setAdminAuthed, checkAdminPassword,
  getCustomItems, saveCustomItem, deleteCustomItem,
  getHiddenItemIds, hideDefaultItem,
  getItemImages, setItemImage,
} from "@/lib/storage";
import SectionCard from "./SectionCard";
import ClaimModal from "./ClaimModal";
import AddItemModal from "./AddItemModal";

const HERO_IMG = "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=1600&q=80";

export default function PotluckTracker() {
  "use no memo"; // opt out of React Compiler — state contains non-primitive types

  /* ── Core state ── */
  const [claims,        setClaims]        = useState<Record<string, Claim>>({});
  const [customItems,   setCustomItems]   = useState<CustomItem[]>([]);
  const [hiddenIds,     setHiddenIds]     = useState<string[]>([]);
  const [itemImages,    setItemImages]    = useState<Record<string, string>>({});

  /* ── UI state ── */
  const [pendingItem,   setPendingItem]   = useState<Item | null>(null);
  const [isAdmin,       setIsAdmin]       = useState(false);
  const [showAdminModal,setShowAdminModal]= useState(false);
  const [adminPw,       setAdminPw]       = useState("");
  const [adminError,    setAdminError]    = useState("");
  const [addItemSection,setAddItemSection]= useState<string | null>(null);
  const [toast,         setToast]         = useState<{ msg: string; type: "success" | "info" } | null>(null);

  /* ── Bootstrap from localStorage ── */
  useEffect(() => {
    setClaims(getClaims());
    setCustomItems(getCustomItems());
    setHiddenIds(getHiddenItemIds());
    setItemImages(getItemImages());
    setIsAdmin(isAdminAuthed());
  }, []);

  /* ── Toast helper ── */
  const showToast = useCallback((msg: string, type: "success" | "info" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3200);
  }, []);

  /* ── Merge sections: filter hidden + append custom items ── */
  const safeHiddenIds: string[] = Array.isArray(hiddenIds) ? hiddenIds : [];
  const enrichedSections = sections.map((section) => ({
    ...section,
    items: [
      ...section.items.filter((item) => !safeHiddenIds.includes(item.id)),
      ...customItems
        .filter((ci) => ci.sectionId === section.id)
        .map((ci) => ({
          id: ci.id,
          name: ci.name,
          description: ci.description,
          emoji: ci.emoji,
          quantity: ci.quantity,
        })),
    ],
  }));

  /* ── Claim handlers ── */
  function handleClaim(name: string, quantity: string) {
    if (!pendingItem) return;
    const claim: Claim = {
      itemId: pendingItem.id,
      name,
      initials: getInitials(name),
      quantity,
      claimedAt: new Date().toISOString(),
    };
    saveClaim(claim);
    setClaims(getClaims());
    setPendingItem(null);
    showToast(`Signed up! ${claim.initials} is bringing "${pendingItem.name}" 🎉`);
  }

  function handleReset(itemId: string) {
    removeClaim(itemId);
    setClaims(getClaims());
    showToast("Claim cleared", "info");
  }

  /* ── Admin item handlers ── */
  function handleAddItem(item: Omit<CustomItem, "id">, imageDataUrl?: string) {
    const id = `custom-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const newItem: CustomItem = { ...item, id };
    saveCustomItem(newItem);
    if (imageDataUrl) setItemImage(id, imageDataUrl);
    setCustomItems(getCustomItems());
    setItemImages(getItemImages());
    setAddItemSection(null);
    showToast(`"${newItem.name}" added!`, "info");
  }

  function handleRemoveItem(itemId: string) {
    if (itemId.startsWith("custom-")) {
      deleteCustomItem(itemId);
      setCustomItems(getCustomItems());
    } else {
      hideDefaultItem(itemId);
      setHiddenIds(getHiddenItemIds());
    }
    setClaims(getClaims());
    setItemImages(getItemImages());
    showToast("Item removed", "info");
  }

  function handleUploadImage(itemId: string, dataUrl: string) {
    setItemImage(itemId, dataUrl);
    setItemImages(getItemImages());
    showToast("Image updated!", "info");
  }

  /* ── Admin login / logout ── */
  function handleAdminLogin(e: React.FormEvent) {
    e.preventDefault();
    if (checkAdminPassword(adminPw)) {
      setAdminAuthed(true);
      setIsAdmin(true);
      setShowAdminModal(false);
      setAdminPw("");
      setAdminError("");
      showToast("Admin mode on", "info");
    } else {
      setAdminError("Wrong password — try again.");
    }
  }

  function handleAdminLogout() {
    setAdminAuthed(false);
    setIsAdmin(false);
    showToast("Signed out of admin mode", "info");
  }

  /* ── Progress totals ── */
  const totalItems   = enrichedSections.reduce((a, s) => a + s.items.length, 0);
  const totalClaimed = Object.keys(claims).length;
  const remaining    = totalItems - totalClaimed;
  const pct          = totalItems > 0 ? Math.round((totalClaimed / totalItems) * 100) : 0;

  /* ── Find current pending item's custom image ── */
  const pendingImage = pendingItem ? itemImages[pendingItem.id] : undefined;

  return (
    <div className="min-h-screen" style={{ background: "#FAF4E8" }}>

      {/* ════════════ HERO BANNER ════════════ */}
      <header className="relative overflow-hidden" style={{ minHeight: 300 }}>
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${HERO_IMG}')`, backgroundColor: "#7C3B1A" }}
        />
        {/* Dark warm overlay */}
        <div className="absolute inset-0" style={{
          background: "linear-gradient(160deg,rgba(25,8,0,0.78) 0%,rgba(80,25,5,0.62) 55%,rgba(18,6,0,0.82) 100%)",
        }}/>
        {/* Subtle dot texture */}
        <div className="absolute inset-0 opacity-[0.06]" style={{
          backgroundImage: "radial-gradient(circle,#fff 1.5px,transparent 1.5px)",
          backgroundSize: "26px 26px",
        }}/>

        <div className="relative z-10 max-w-2xl mx-auto px-5 py-12 text-center">
          <p className="text-white/55 text-xs font-semibold tracking-[0.2em] uppercase mb-2">
            Lakeside Young Adults
          </p>
          <h1
            className="font-playfair text-white leading-tight"
            style={{ fontSize: "clamp(2.2rem,6vw,3.4rem)", textShadow: "0 2px 20px rgba(0,0,0,0.55)" }}
          >
            Cinco de Mayo
            <br />
            <em className="not-italic" style={{ color: "#FBBF24" }}>Potluck</em>
          </h1>
          <p className="mt-3 text-sm font-medium" style={{ color: "rgba(255,255,255,0.65)" }}>
            May 5th · Tap any item to sign up and bring it!
          </p>

          {/* Progress pill */}
          <div className="mt-6 inline-flex items-center gap-4 rounded-2xl px-5 py-3"
            style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(6px)", border: "1px solid rgba(255,255,255,0.15)" }}
          >
            <div className="text-left">
              <p className="text-white font-bold text-xl leading-none">{totalClaimed}<span className="text-white/50 text-base">/{totalItems}</span></p>
              <p className="text-white/50 text-xs mt-0.5">items claimed</p>
            </div>
            <div className="w-px h-9 bg-white/15" />
            <div style={{ width: 140 }}>
              <div className="flex justify-between text-xs mb-1.5" style={{ color: "rgba(255,255,255,0.5)" }}>
                <span>{pct}% filled</span>
                <span>{remaining} left</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.2)" }}>
                <div className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${pct}%`, background: "linear-gradient(90deg,#fb923c,#fbbf24)" }}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ════════════ ADMIN BAR ════════════ */}
      <div className="bg-white border-b px-4 py-2 flex items-center justify-between gap-3" style={{ borderColor: "#EDE5D8" }}>
        <span className="text-xs" style={{ color: "#9B8B7E" }}>
          {isAdmin
            ? "Admin mode: you can add, remove, and reset items."
            : "Questions? Text your group leader."}
        </span>
        {isAdmin ? (
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold px-3 py-1 rounded-full border" style={{ background: "#F0FDF4", color: "#166534", borderColor: "#BBF7D0" }}>
              Admin on
            </span>
            <button onClick={handleAdminLogout} className="text-xs underline underline-offset-2 transition-colors" style={{ color: "#9B8B7E" }}>
              Sign out
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowAdminModal(true)}
            className="flex items-center gap-1 text-xs transition-colors"
            style={{ color: "#C0B0A4" }}
            title="Admin login"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            Admin
          </button>
        )}
      </div>

      {/* ════════════ MAIN CONTENT ════════════ */}
      <main className="max-w-2xl mx-auto px-4 pt-6 pb-16">

        {/* Intro card */}
        <div
          className="rounded-2xl px-5 py-4 mb-6 flex items-start gap-3"
          style={{ background: "white", border: "1px solid #EDE5D8", boxShadow: "0 1px 4px rgba(28,20,16,0.05)" }}
        >
          <span className="text-2xl mt-0.5 flex-shrink-0">👋</span>
          <div>
            <p className="text-sm font-semibold text-gray-800">Here's how it works</p>
            <p className="text-sm mt-0.5 leading-relaxed" style={{ color: "#7A6A5E" }}>
              Tap a section to expand it, then click any open item to claim it.
              Once you sign up, your initials will appear so others know it's covered.
              Claimed items are locked, only the admin can reset them. Reach out to Thomas Lovin for any inquries.
            </p>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-4">
          {enrichedSections.map((section, i) => (
            <div
              key={section.id}
              className="animate-fadeUp"
              style={{ animationDelay: `${i * 0.07}s` }}
            >
              <SectionCard
                section={section}
                claims={claims}
                isAdmin={isAdmin}
                itemImages={itemImages}
                onSelect={setPendingItem}
                onReset={handleReset}
                onRemove={handleRemoveItem}
                onUploadImage={handleUploadImage}
                onAddItem={setAddItemSection}
                defaultOpen={i === 0}
              />
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-8 flex flex-wrap justify-center gap-5 text-xs" style={{ color: "#9B8B7E" }}>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
            Available
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded-full bg-green-400 flex items-center justify-center">
              <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
              </svg>
            </div>
            Claimed
          </div>
          {isAdmin && (
            <>
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-lg flex items-center justify-center" style={{ background: "#FEF3C7" }}>
                  <svg className="w-3 h-3" style={{ color: "#B45309" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                  </svg>
                </div>
                Reset claim
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-lg flex items-center justify-center" style={{ background: "#FEF2F2" }}>
                  <svg className="w-3 h-3" style={{ color: "#DC2626" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                </div>
                Delete item
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-lg flex items-center justify-center" style={{ background: "#EFF6FF" }}>
                  <svg className="w-3 h-3" style={{ color: "#3B82F6" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                </div>
                Upload image
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-xs mt-8" style={{ color: "#C0B0A4" }}>
          Lakeside Young Adults · Cinco de Mayo 2025 🌮
        </p>
      </main>

      {/* ════════════ CLAIM MODAL ════════════ */}
      {pendingItem && (
        <ClaimModal
          item={pendingItem}
          customImage={pendingImage}
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
      {showAdminModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
          onClick={(e) => {
            if (e.target === e.currentTarget) { setShowAdminModal(false); setAdminPw(""); setAdminError(""); }
          }}
        >
          <div className="animate-popIn bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="h-1" style={{ background: "linear-gradient(90deg,#6B7280,#9CA3AF,#6B7280)" }} />
            <div className="p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "#F3F4F6" }}>
                  <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                  </svg>
                </div>
                <div>
                  <h2 className="font-playfair font-bold text-gray-800">Admin Login</h2>
                  <p className="text-xs mt-0.5" style={{ color: "#9B8B7E" }}>Manage items and reset claims.</p>
                </div>
              </div>
              <form onSubmit={handleAdminLogin} className="space-y-3">
                <input
                  type="password"
                  value={adminPw}
                  onChange={(e) => { setAdminPw(e.target.value); setAdminError(""); }}
                  placeholder="Password"
                  autoFocus
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-300 placeholder:text-gray-300"
                />
                {adminError && <p className="text-red-500 text-xs bg-red-50 rounded-xl px-3.5 py-2.5">{adminError}</p>}
                <div className="flex gap-2.5">
                  <button type="button"
                    onClick={() => { setShowAdminModal(false); setAdminPw(""); setAdminError(""); }}
                    className="flex-1 border border-gray-200 text-gray-500 rounded-xl py-2.5 text-sm font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button type="submit"
                    className="flex-1 bg-gray-800 hover:bg-gray-700 text-white rounded-xl py-2.5 text-sm font-semibold transition-colors"
                  >
                    Sign In
                  </button>
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
            background: toast.type === "success"
              ? "linear-gradient(135deg,#E8632A,#C89B0A)"
              : "#374151",
          }}
        >
          {toast.msg}
        </div>
      )}
    </div>
  );
}
