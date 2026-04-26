"use client";

import { useState } from "react";
import { Star, X } from "lucide-react";
import { api } from "@/lib/api";
import type { Order } from "@/types";

interface Props {
  order: Order;
  token: string;
  onClose: () => void;
}

export function ReviewPopup({ order, token, onClose }: Props) {
  const [selectedProduct, setSelectedProduct] = useState<{ productId: string; name: string } | null>(
    order.items[0] ? { productId: order.items[0].productId, name: order.items[0].name } : null
  );
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    if (!selectedProduct || rating === 0) { setError("Please select a rating."); return; }
    if (comment.trim().length < 3) { setError("Please write a short comment (at least 3 characters)."); return; }
    setLoading(true);
    setError("");
    try {
      await api.createReview(token, { productId: selectedProduct.productId, rating, comment: comment.trim() });
      setSubmitted(true);
      setTimeout(onClose, 2000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to submit review.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <button onClick={onClose} className="absolute right-4 top-4 rounded-full p-1 hover:bg-cream">
          <X size={20} />
        </button>

        {submitted ? (
          <div className="py-8 text-center">
            <div className="mb-3 text-4xl">🎉</div>
            <h2 className="font-display text-2xl font-bold">Thank you!</h2>
            <p className="mt-2 text-cocoa/65">Your review will appear once approved.</p>
          </div>
        ) : (
          <>
            <h2 className="font-display text-2xl font-bold">How was your order?</h2>
            <p className="mt-1 text-sm text-cocoa/60">Order {order.trackingCode} · Leave a review for one of your items</p>

            {order.items.length > 1 && (
              <div className="mt-4">
                <label className="text-sm font-semibold">Choose item to review</label>
                <select
                  className="mt-1 w-full rounded-md border border-cocoa/15 bg-cream p-2 text-sm"
                  value={selectedProduct?.productId ?? ""}
                  onChange={(e) => {
                    const item = order.items.find((i) => i.productId === e.target.value);
                    if (item) setSelectedProduct({ productId: item.productId, name: item.name });
                  }}
                >
                  {order.items.map((item) => (
                    <option key={item.productId} value={item.productId}>{item.name}</option>
                  ))}
                </select>
              </div>
            )}

            {order.items.length === 1 && (
              <p className="mt-3 font-semibold">{selectedProduct?.name}</p>
            )}

            <div className="mt-4 flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onMouseEnter={() => setHovered(star)}
                  onMouseLeave={() => setHovered(0)}
                  onClick={() => setRating(star)}
                  className="p-0.5"
                >
                  <Star
                    size={28}
                    className={`transition ${star <= (hovered || rating) ? "fill-amber-400 text-amber-400" : "text-cocoa/20"}`}
                  />
                </button>
              ))}
            </div>

            <textarea
              className="mt-4 w-full rounded-md border border-cocoa/15 bg-cream p-3 text-sm focus:outline-none focus:ring-2 focus:ring-berry/40"
              placeholder="Tell us what you loved (or didn't)…"
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

            {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

            <div className="mt-4 flex gap-3">
              <button
                onClick={submit}
                disabled={loading}
                className="flex-1 rounded-lg bg-cocoa py-2 font-semibold text-white transition hover:bg-cocoa/90 disabled:opacity-50"
              >
                {loading ? "Submitting…" : "Submit Review"}
              </button>
              <button
                onClick={onClose}
                className="rounded-lg border border-cocoa/20 px-4 py-2 text-sm font-semibold hover:bg-cream"
              >
                Skip
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
