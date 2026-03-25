"use client";

import { useState, useEffect, useRef } from "react";
import { Item } from "@/lib/data";

type Props = {
  item: Item;
  customImage?: string;
  quantityOverride?: string;
  onConfirm: (name: string, quantity: string) => void;
  onCancel: () => void;
};

export default function ClaimModal({ item, customImage, quantityOverride, onConfirm, onCancel }: Props) {
  const [name,     setName]     = useState("");
  const [quantity, setQuantity] = useState(quantityOverride ?? item.quantity ?? "");
  const [error,    setError]    = useState("");
  const nameRef = useRef<HTMLInputElement>(null);
  const displayQty = quantityOverride ?? item.quantity;

  useEffect(() => { nameRef.current?.focus(); }, []);
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onCancel(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onCancel]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim())     { setError("Please enter your name."); return; }
    if (!quantity.trim()) { setError("Please tell us how much you're bringing."); return; }
    onConfirm(name.trim(), quantity.trim());
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
      onClick={e => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <div className="animate-popIn bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        <div className="h-1.5" style={{ background: "linear-gradient(90deg,#E8632A,#C89B0A,#2176AE)" }} />

        <div className="p-6">
          {/* Item header */}
          <div className="flex items-start gap-3.5 mb-5">
            <div className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden text-3xl"
              style={{ background: customImage ? "transparent" : "#FFF3EB", border: "1px solid #FFD5BB" }}
            >
              {customImage ? <img src={customImage} alt="" className="w-full h-full object-cover" /> : <span>{item.emoji}</span>}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-widest mb-0.5" style={{ color: "#9B8B7E" }}>Signing up to bring</p>
              <h2 className="font-playfair font-bold text-gray-900 leading-snug" style={{ fontSize: "1.15rem" }}>{item.name}</h2>
              <p className="text-xs mt-0.5" style={{ color: "#9B8B7E" }}>{item.description}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Your name <span className="text-red-400">*</span>
              </label>
              <input
                ref={nameRef} type="text" value={name}
                onChange={e => { setName(e.target.value); setError(""); }}
                placeholder="e.g. Maria Garcia"
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 placeholder:text-gray-300"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                How much are you bringing? <span className="text-red-400">*</span>
              </label>
              <input
                type="text" value={quantity}
                onChange={e => { setQuantity(e.target.value); setError(""); }}
                placeholder={displayQty ?? "e.g. 2 bags, 1 gallon…"}
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 placeholder:text-gray-300"
              />
              {displayQty && (
                <p className="text-xs mt-1.5" style={{ color: "#9B8B7E" }}>
                  Suggested: <span className="font-medium text-gray-600">{displayQty}</span>
                </p>
              )}
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm rounded-xl px-3.5 py-2.5" style={{ background: "#FEF2F2", color: "#DC2626" }}>
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                </svg>
                {error}
              </div>
            )}

            <div className="flex gap-2.5 pt-1">
              <button type="button" onClick={onCancel}
                className="flex-1 border border-gray-200 text-gray-500 rounded-xl py-2.5 text-sm font-semibold hover:bg-gray-50 transition-colors"
              >Cancel</button>
              <button type="submit"
                className="flex-1 text-white rounded-xl py-2.5 text-sm font-semibold shadow-sm hover:opacity-90 transition-opacity"
                style={{ background: "linear-gradient(135deg,#E8632A,#C89B0A)" }}
              >I&apos;ll bring this! 🎉</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
