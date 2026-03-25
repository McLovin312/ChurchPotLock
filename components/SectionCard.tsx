"use client";

import { useState } from "react";
import { Section, Item } from "@/lib/data";
import { Claim } from "@/lib/actions";
import ItemRow from "./ItemRow";

type Props = {
  section: Section;
  claims: Record<string, Claim[]>;
  isAdmin: boolean;
  itemImages: Record<string, string>;
  quantityOverrides: Record<string, string>;
  onSelect: (item: Item) => void;
  onRemoveClaim: (itemId: string, claimId: string) => Promise<void>;
  onRemoveItem: (itemId: string) => Promise<void>;
  onUnhideItem: (itemId: string) => Promise<void>;
  onAddItem: (sectionId: string) => void;
  onUploadImage: (itemId: string, dataUrl: string) => Promise<void>;
  onEditItem: (itemId: string, updates: { name?: string; description?: string; emoji?: string; quantity?: string }) => Promise<void>;
  defaultOpen?: boolean;
};

export default function SectionCard({
  section, claims, isAdmin, itemImages, quantityOverrides,
  onSelect, onRemoveClaim, onRemoveItem, onUnhideItem, onAddItem, onUploadImage, onEditItem,
  defaultOpen = false,
}: Props) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const itemsWithAnyClaim = section.items.filter(i => (claims[i.id]?.length ?? 0) > 0).length;
  const total = section.items.length;
  const pct   = total > 0 ? Math.round((itemsWithAnyClaim / total) * 100) : 0;

  return (
    <div
      className="rounded-2xl overflow-hidden bg-white"
      style={{
        border: "1px solid #EDE5D8",
        borderTop: `4px solid ${section.accentColor}`,
        boxShadow: "0 1px 6px rgba(28,20,16,0.07)",
      }}
    >
      {/* ── Header ── */}
      <button
        onClick={() => setIsOpen(o => !o)}
        className="w-full text-left flex items-center gap-4 px-5 py-4 focus:outline-none transition-colors"
        style={{ background: isOpen ? section.accentColor + "07" : "transparent" }}
        aria-expanded={isOpen}
      >
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 shadow-sm"
          style={{ background: `linear-gradient(145deg,${section.accentColor}EE,${section.accentColor}BB)` }}
        >
          {section.emoji}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h2 className="font-playfair font-bold text-gray-900 leading-tight" style={{ fontSize: "1.2rem" }}>
                {section.title}
              </h2>
              <p className="text-xs mt-0.5 truncate" style={{ color: "#9B8B7E" }}>{section.subtitle}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0 mt-0.5">
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${section.badgeClass}`}>
                {itemsWithAnyClaim}/{total}
              </span>
              <div className="transition-transform duration-300" style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}>
                <svg style={{ width: 18, height: 18, color: "#9B8B7E" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-2.5 flex items-center gap-2">
            <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "#EDE5D8" }}>
              <div className={`h-full rounded-full transition-all duration-700 ${section.progressClass}`} style={{ width: `${pct}%` }} />
            </div>
            <span className="text-xs tabular-nums w-8 text-right" style={{ color: "#9B8B7E" }}>{pct}%</span>
          </div>
        </div>
      </button>

      {/* ── Accordion body ── */}
      <div style={{ display: "grid", gridTemplateRows: isOpen ? "1fr" : "0fr", transition: "grid-template-rows 0.35s cubic-bezier(0.4,0,0.2,1)" }}>
        <div style={{ overflow: "hidden", minHeight: 0 }}>
          <div style={{ height: 1, background: "#EDE5D8", marginLeft: 20, marginRight: 20 }} />

          {section.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center" style={{ color: "#9B8B7E" }}>
              <span className="text-3xl mb-2">📋</span>
              <p className="text-sm font-medium">No items yet</p>
              {isAdmin && <p className="text-xs mt-1">Use "Add item" below to get started</p>}
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: "#F5EFE6" }}>
              {section.items.map(item => (
                <ItemRow
                  key={item.id}
                  item={item}
                  claims={claims[item.id] ?? []}
                  isAdmin={isAdmin}
                  hidden={(item as Item & { hidden?: boolean }).hidden ?? false}
                  customImage={itemImages[item.id]}
                  quantityOverride={quantityOverrides[item.id]}
                  accentColor={section.accentColor}
                  onSelect={() => onSelect(item)}
                  onRemoveClaim={claimId => onRemoveClaim(item.id, claimId)}
                  onRemove={() => onRemoveItem(item.id)}
                  onUnhide={() => onUnhideItem(item.id)}
                  onUploadImage={dataUrl => onUploadImage(item.id, dataUrl)}
                  onEditItem={updates => onEditItem(item.id, updates)}
                />
              ))}
            </div>
          )}

          {/* Admin add-item footer */}
          {isAdmin && (
            <div className="px-4 py-3 flex items-center justify-center border-t" style={{ borderColor: "#EDE5D8", borderStyle: "dashed" }}>
              <button
                onClick={() => onAddItem(section.id)}
                className="flex items-center gap-1.5 text-sm font-semibold transition-colors"
                style={{ color: section.accentColor }}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
                </svg>
                Add item to {section.title}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
