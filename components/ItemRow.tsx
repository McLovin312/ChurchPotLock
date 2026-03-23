"use client";

import { useRef } from "react";
import { Claim } from "@/lib/storage";
import { Item } from "@/lib/data";

type Props = {
  item: Item;
  claim: Claim | undefined;
  isAdmin: boolean;
  customImage?: string;        // base64 data-URL from localStorage
  onSelect: (item: Item) => void;
  onReset: (itemId: string) => void;
  onRemove: (itemId: string) => void;
  onUploadImage: (itemId: string, dataUrl: string) => void;
  accentColor: string;
};

export default function ItemRow({
  item, claim, isAdmin, customImage,
  onSelect, onReset, onRemove, onUploadImage,
  accentColor,
}: Props) {
  const isClaimed = !!claim;
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result;
      if (typeof result === "string") onUploadImage(item.id, result);
    };
    reader.readAsDataURL(file);
  }

  return (
    <div
      className={`
        flex items-center gap-3 px-4 py-3.5 transition-colors duration-150
        ${isClaimed
          ? "cursor-default"
          : "cursor-pointer group hover:bg-[#FEFAF3]"
        }
      `}
      style={{ backgroundColor: isClaimed ? accentColor + "05" : undefined }}
      onClick={() => { if (!isClaimed) onSelect(item); }}
      role={!isClaimed ? "button" : undefined}
      tabIndex={!isClaimed ? 0 : undefined}
      onKeyDown={(e) => { if (!isClaimed && (e.key === "Enter" || e.key === " ")) onSelect(item); }}
      aria-disabled={isClaimed}
    >
      {/* Radio circle */}
      <div className="flex-shrink-0 mt-0.5">
        <div
          className="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 flex-shrink-0"
          style={{
            borderColor: isClaimed ? "#4ADE80" : "#D1D5DB",
            backgroundColor: isClaimed ? "#4ADE80" : "transparent",
          }}
        >
          {isClaimed && (
            <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
            </svg>
          )}
        </div>
      </div>

      {/* Food icon — custom image or emoji */}
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden text-xl"
        style={{
          background: customImage ? "transparent" : accentColor + "18",
          border: customImage ? "none" : `1px solid ${accentColor}28`,
          opacity: isClaimed ? 0.45 : 1,
          transition: "opacity 0.2s",
        }}
      >
        {customImage
          ? <img src={customImage} alt="" className="w-full h-full object-cover" />
          : <span>{item.emoji}</span>
        }
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p
          className="font-semibold text-sm leading-snug"
          style={{
            color: isClaimed ? "#9CA3AF" : "#1C1410",
            textDecoration: isClaimed ? "line-through" : "none",
          }}
        >
          {item.name}
        </p>
        <p className="text-xs mt-0.5 truncate" style={{ color: "#9B8B7E" }}>
          {item.description}
        </p>
        {item.quantity && !isClaimed && (
          <p className="text-xs mt-0.5 font-medium" style={{ color: accentColor + "BB" }}>
            Needed: {item.quantity}
          </p>
        )}
      </div>

      {/* Right-side controls */}
      <div className="flex items-center gap-1.5 flex-shrink-0">

        {/* Claimed: initials avatar + admin controls */}
        {isClaimed && claim && (
          <>
            <div
              className="w-8 h-8 rounded-full text-white text-xs font-bold flex items-center justify-center shadow-sm"
              style={{ background: "linear-gradient(135deg,#2A6041,#3A7A51)" }}
              title={`${claim.name} — ${claim.quantity}`}
            >
              {claim.initials}
            </div>
            {/* Quantity chip */}
            <span
              className="text-xs px-2 py-0.5 rounded-full font-medium hidden sm:inline"
              style={{ background: "#F3F4F6", color: "#6B7280" }}
            >
              {claim.quantity}
            </span>
            {/* Reset claim button (admin only) */}
            {isAdmin && (
              <button
                onClick={(e) => { e.stopPropagation(); onReset(item.id); }}
                title="Reset claim"
                className="p-1.5 rounded-lg transition-colors"
                style={{ background: "#FEF3C7", color: "#B45309" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#FDE68A")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#FEF3C7")}
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
              </button>
            )}
          </>
        )}

        {/* Unclaimed: hover hint */}
        {!isClaimed && !isAdmin && (
          <span
            className="text-xs px-2.5 py-1 rounded-full font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
            style={{ background: accentColor + "15", color: accentColor }}
          >
            Claim →
          </span>
        )}

        {/* Admin-only: image upload + delete */}
        {isAdmin && (
          <div className="flex items-center gap-1 ml-1">
            {/* Upload image */}
            <label
              title="Set custom image"
              className="p-1.5 rounded-lg cursor-pointer transition-colors"
              style={{ background: "#EFF6FF", color: "#3B82F6" }}
              onClick={(e) => e.stopPropagation()}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#DBEAFE")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#EFF6FF")}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>

            {/* Delete item */}
            <button
              onClick={(e) => { e.stopPropagation(); onRemove(item.id); }}
              title="Remove item"
              className="p-1.5 rounded-lg transition-colors"
              style={{ background: "#FEF2F2", color: "#DC2626" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#FEE2E2")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#FEF2F2")}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
