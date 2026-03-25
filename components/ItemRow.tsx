"use client";

import { useRef, useState } from "react";
import { Claim } from "@/lib/actions";
import { Item } from "@/lib/data";

type Props = {
  item: Item;
  claims: Claim[];
  isAdmin: boolean;
  hidden?: boolean;
  customImage?: string;
  quantityOverride?: string;
  accentColor: string;
  onSelect: () => void;
  onRemoveClaim: (claimId: string) => Promise<void>;
  onRemove: () => Promise<void>;
  onUnhide: () => Promise<void>;
  onUploadImage: (dataUrl: string) => Promise<void>;
  onEditItem: (updates: { name?: string; description?: string; emoji?: string; quantity?: string }) => Promise<void>;
};

export default function ItemRow({
  item, claims, isAdmin, hidden = false, customImage, quantityOverride, accentColor,
  onSelect, onRemoveClaim, onRemove, onUnhide, onUploadImage, onEditItem,
}: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [editingQty, setEditingQty] = useState(false);
  const [qtyInput,   setQtyInput]   = useState("");

  const displayQty    = quantityOverride ?? item.quantity;
  const hasClaims     = claims.length > 0;
  const visibleClaims = claims.slice(0, 4);
  const overflow      = claims.length - 4;

  function claimInitials(claim: Claim): string {
    if (claim.initials) return claim.initials;
    return claim.name.trim().split(/\s+/).map(w => w[0]?.toUpperCase() ?? "").slice(0, 2).join("");
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const res = ev.target?.result;
      if (typeof res === "string") onUploadImage(res);
    };
    reader.readAsDataURL(file);
  }

  function startEditQty() {
    setQtyInput(displayQty ?? "");
    setEditingQty(true);
  }

  function saveQty() {
    const trimmed = qtyInput.trim();
    if (trimmed && trimmed !== displayQty) onEditItem({ quantity: trimmed });
    setEditingQty(false);
  }

  /* ── Hidden item (admin only) ── */
  if (hidden) {
    return (
      <div className="px-4 py-3 flex items-center gap-3 opacity-40">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 text-xl" style={{ background: "#F5EFE6" }}>
          {item.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-gray-400 line-through">{item.name}</p>
          <p className="text-xs mt-0.5" style={{ color: "#C4B5A5" }}>Hidden</p>
        </div>
        <button
          onClick={e => { e.stopPropagation(); onUnhide(); }}
          className="text-xs px-3 py-1.5 rounded-full font-semibold transition-all"
          style={{ background: "#F0FDF4", color: "#166534", border: "1px solid #BBF7D0", opacity: 1 }}
          title="Restore item"
        >
          Restore
        </button>
      </div>
    );
  }

  return (
    <div className="px-4 py-3.5 transition-colors duration-150" style={{ background: "transparent" }}>

      {/* ── Main row ── */}
      <div className="flex items-start gap-3">

        {/* Food icon */}
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 text-xl mt-0.5 overflow-hidden cursor-pointer"
          style={{ background: customImage ? "transparent" : accentColor + "18", border: customImage ? "none" : `1px solid ${accentColor}28` }}
          onClick={onSelect}
        >
          {customImage
            ? <img src={customImage} alt="" className="w-full h-full object-cover" />
            : <span>{item.emoji}</span>
          }
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0 cursor-pointer" onClick={onSelect}>
          <p className="font-semibold text-sm leading-snug text-gray-800">{item.name}</p>
          <p className="text-xs mt-0.5 truncate" style={{ color: "#9B8B7E" }}>{item.description}</p>
          {displayQty && (
            <div className="flex items-center gap-1 mt-1">
              {editingQty ? (
                <input
                  autoFocus
                  className="text-xs border rounded-lg px-2 py-0.5 focus:outline-none focus:ring-1"
                  style={{ borderColor: accentColor + "60", color: accentColor, width: 140 }}
                  value={qtyInput}
                  onChange={e => setQtyInput(e.target.value)}
                  onBlur={saveQty}
                  onKeyDown={e => { if (e.key === "Enter") saveQty(); if (e.key === "Escape") setEditingQty(false); }}
                  onClick={e => e.stopPropagation()}
                />
              ) : (
                <>
                  <span className="text-xs font-medium" style={{ color: accentColor + "BB" }}>
                    Needed: {displayQty}
                  </span>
                  {isAdmin && (
                    <button
                      onClick={e => { e.stopPropagation(); startEditQty(); }}
                      className="opacity-50 hover:opacity-100 transition-opacity"
                      title="Edit quantity"
                    >
                      <svg className="w-3 h-3" style={{ color: accentColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                      </svg>
                    </button>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Right-side controls */}
        <div className="flex-shrink-0 flex flex-col items-end gap-2">

          {/* Claim button - always visible */}
          <button
            onClick={onSelect}
            className="text-xs px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-all hover:shadow-sm"
            style={{ background: accentColor + "18", color: accentColor, border: `1px solid ${accentColor}25` }}
          >
            {hasClaims ? "I'll bring some too +" : "Claim →"}
          </button>

          {/* Admin item controls */}
          {isAdmin && (
            <div className="flex items-center gap-1">
              {/* Upload image */}
              <label
                title="Set custom image"
                className="p-1.5 rounded-lg cursor-pointer transition-colors"
                style={{ background: "#EFF6FF", color: "#3B82F6" }}
                onClick={e => e.stopPropagation()}
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              </label>
              {/* Delete */}
              <button
                onClick={e => { e.stopPropagation(); onRemove(); }}
                title="Remove item"
                className="p-1.5 rounded-lg transition-colors"
                style={{ background: "#FEF2F2", color: "#DC2626" }}
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Claims row ── */}
      {hasClaims && (
        <div className="mt-2.5 ml-14 flex items-center flex-wrap gap-1.5">
          {isAdmin ? (
            /* Admin: chips with X remove buttons */
            <>
              {claims.map(claim => (
                <button
                  key={claim.claimId}
                  onClick={e => { e.stopPropagation(); onRemoveClaim(claim.claimId); }}
                  className="group flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border transition-colors"
                  style={{ background: "#F0FDF4", borderColor: "#BBF7D0", color: "#166534" }}
                  title={`${claim.name} - ${claim.quantity}`}
                >
                  <span className="font-bold">{claimInitials(claim)}</span>
                  <span className="opacity-80 truncate font-medium" style={{ maxWidth: 110 }}>{claim.name}</span>
                  <span className="opacity-40">·</span>
                  <span className="opacity-60 truncate" style={{ maxWidth: 70 }}>{claim.quantity}</span>
                  <svg className="w-2.5 h-2.5 opacity-50 group-hover:opacity-100 transition-opacity flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              ))}
            </>
          ) : (
            /* Normal: overlapping avatar stack */
            <>
              <div className="flex items-center">
                {visibleClaims.map((claim, i) => (
                  <div
                    key={claim.claimId}
                    className="w-7 h-7 rounded-full text-white text-xs font-bold flex items-center justify-center ring-2 ring-white flex-shrink-0"
                    style={{ background: "linear-gradient(135deg,#2A6041,#3A7A51)", marginLeft: i > 0 ? -6 : 0, zIndex: visibleClaims.length - i }}
                    title={`${claimInitials(claim)} - ${claim.quantity}`}
                  >
                    {claimInitials(claim)}
                  </div>
                ))}
                {overflow > 0 && (
                  <div
                    className="w-7 h-7 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold flex items-center justify-center ring-2 ring-white flex-shrink-0"
                    style={{ marginLeft: -6 }}
                  >
                    +{overflow}
                  </div>
                )}
              </div>
              <span className="text-xs" style={{ color: "#9B8B7E" }}>
                {claims.length === 1 ? `${claimInitials(claims[0])} is bringing this` : `${claims.length} people signed up`}
              </span>
            </>
          )}
        </div>
      )}
    </div>
  );
}
