"use client";

import { useState, useRef } from "react";
import { sections } from "@/lib/data";
import { CustomItem } from "@/lib/actions";

type Props = {
  defaultSectionId: string;
  onConfirm: (item: Omit<CustomItem, "id">, imageDataUrl?: string) => void;
  onCancel: () => void;
};

const EMOJI_SUGGESTIONS = ["🍽️", "🥗", "🫙", "🍱", "🥘", "🍲", "🧁", "🍰", "🎂", "🍜", "🥙", "🫔", "🌯", "🥪", "🍕", "🧆", "🥚", "🧇", "🥞", "🫕"];

export default function AddItemModal({ defaultSectionId, onConfirm, onCancel }: Props) {
  const [sectionId, setSectionId] = useState(defaultSectionId);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [emoji, setEmoji] = useState("🍽️");
  const [quantity, setQuantity] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result;
      if (typeof result === "string") setImagePreview(result);
    };
    reader.readAsDataURL(file);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) { setError("Please enter an item name."); return; }
    onConfirm(
      { sectionId, name: name.trim(), description: description.trim(), emoji, quantity: quantity.trim() || undefined },
      imagePreview ?? undefined,
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <div className="animate-popIn bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header strip */}
        <div className="h-1" style={{ background: "linear-gradient(90deg,#E8632A,#C89B0A,#2176AE)" }} />

        <div className="p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-playfair font-bold text-gray-900 text-lg">Add New Item</h2>
              <p className="text-xs mt-0.5" style={{ color: "#9B8B7E" }}>Fill in the details below</p>
            </div>
            <button onClick={onCancel} className="text-gray-300 hover:text-gray-500 transition-colors p-1">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Section selector */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Section</label>
              <div className="grid grid-cols-3 gap-2">
                {sections.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSectionId(s.id)}
                    className="py-2 px-3 rounded-xl text-sm font-semibold border-2 transition-all"
                    style={{
                      borderColor: sectionId === s.id ? s.accentColor : "#E5E7EB",
                      background: sectionId === s.id ? s.accentColor + "15" : "white",
                      color: sectionId === s.id ? s.accentColor : "#6B7280",
                    }}
                  >
                    {s.emoji} {s.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Item name <span className="text-red-400 normal-case font-normal">(required)</span>
              </label>
              <input
                autoFocus
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); setError(""); }}
                placeholder="e.g. Queso Fundido"
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 placeholder:text-gray-300"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Melted cheese with chorizo"
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 placeholder:text-gray-300"
              />
            </div>

            {/* Emoji + Quantity row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Icon (emoji)</label>
                <input
                  type="text"
                  value={emoji}
                  onChange={(e) => setEmoji(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-lg text-center focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300"
                  maxLength={2}
                />
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {EMOJI_SUGGESTIONS.map((em) => (
                    <button
                      key={em}
                      type="button"
                      onClick={() => setEmoji(em)}
                      className="text-base hover:scale-125 transition-transform"
                      title={em}
                    >
                      {em}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Quantity needed</label>
                <input
                  type="text"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="e.g. 2 cups"
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 placeholder:text-gray-300"
                />
              </div>
            </div>

            {/* Image upload */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Custom image <span className="font-normal normal-case" style={{ color: "#9B8B7E" }}>(optional)</span>
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="flex items-center gap-2 border border-dashed border-gray-300 hover:border-gray-400 rounded-xl px-4 py-2.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                  {imagePreview ? "Change image" : "Upload image"}
                </button>
                {imagePreview && (
                  <div className="relative">
                    <img src={imagePreview} alt="preview" className="w-12 h-12 rounded-lg object-cover border border-gray-200" />
                    <button
                      type="button"
                      onClick={() => { setImagePreview(null); if (fileRef.current) fileRef.current.value = ""; }}
                      className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 rounded-full text-white flex items-center justify-center"
                    >
                      <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </div>

            {error && (
              <p className="text-red-500 text-sm bg-red-50 rounded-xl px-3.5 py-2">{error}</p>
            )}

            <div className="flex gap-2.5 pt-1">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 border border-gray-200 text-gray-500 rounded-xl py-2.5 text-sm font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 text-white rounded-xl py-2.5 text-sm font-semibold shadow-sm transition-opacity hover:opacity-90"
                style={{ background: "linear-gradient(135deg,#E8632A,#C89B0A)" }}
              >
                Add Item
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
