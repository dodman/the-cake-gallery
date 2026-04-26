"use client";

import { useState } from "react";
import { Button } from "@/components/Button";
import { api } from "@/lib/api";

export default function ContactPage() {
  const mapUrl = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL ?? "https://www.google.com/maps?q=Lusaka%2C%20Zambia&output=embed";
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  function change(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) { setError("Please fill in all fields."); return; }
    setLoading(true);
    setError("");
    try {
      await api.sendMessage(form);
      setSuccess(true);
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-14">
      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <h1 className="font-display text-5xl font-bold">Contact Us</h1>
          <p className="mt-3 text-cocoa/65">Place a special request, ask about catering, or confirm delivery coverage.</p>

          {success ? (
            <div className="mt-8 rounded-xl bg-green-50 border border-green-200 p-6">
              <h2 className="font-display text-2xl font-bold text-green-800">Message sent! 🎉</h2>
              <p className="mt-2 text-green-700">We&apos;ve received your message and will get back to you soon.</p>
              <button
                onClick={() => setSuccess(false)}
                className="mt-4 text-sm font-semibold text-green-700 underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form className="mt-8 grid gap-4" onSubmit={send}>
              <input
                className="focus-ring rounded-md border border-cocoa/15 bg-white p-3"
                placeholder="Name"
                value={form.name}
                onChange={change("name")}
                required
              />
              <input
                className="focus-ring rounded-md border border-cocoa/15 bg-white p-3"
                placeholder="Email"
                type="email"
                value={form.email}
                onChange={change("email")}
                required
              />
              <textarea
                className="focus-ring rounded-md border border-cocoa/15 bg-white p-3"
                placeholder="Message"
                rows={5}
                value={form.message}
                onChange={change("message")}
                required
              />
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" disabled={loading}>
                {loading ? "Sending…" : "Send Message"}
              </Button>
            </form>
          )}
        </div>
        <iframe
          title="The Cake Gallery location"
          src={mapUrl}
          className="min-h-[420px] w-full rounded-lg border-0 shadow-premium"
          loading="lazy"
        />
      </div>
    </section>
  );
}
