"use client";

import { type FormEvent, useState } from "react";
import { Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/store/auth";

const inputCls =
  "w-full rounded-md border border-cocoa/15 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-berry/40";

export function AdminAccount() {
  const { user, token, updateSession } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    if (!token) return;
    if (!currentPassword) return setError("Enter your current password to confirm the change.");
    if (newPassword && newPassword.length < 8) return setError("New password must be at least 8 characters.");
    if (newPassword && newPassword !== confirm) return setError("New password and confirmation do not match.");

    const body: { currentPassword: string; name?: string; email?: string; newPassword?: string } = { currentPassword };
    if (name.trim() && name.trim() !== user?.name) body.name = name.trim();
    if (email.trim() && email.trim().toLowerCase() !== user?.email?.toLowerCase()) body.email = email.trim();
    if (newPassword) body.newPassword = newPassword;

    if (!body.name && !body.email && !body.newPassword) {
      return setError("Nothing to change yet — update your name, email or password first.");
    }

    setSaving(true);
    try {
      const res = await api.updateCredentials(token, body);
      updateSession(res.token, res.user);
      setCurrentPassword("");
      setNewPassword("");
      setConfirm("");
      setNotice("Saved. Use your new login details next time you sign in.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update your details.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mt-4 rounded-lg bg-white p-5">
      <h2 className="font-display text-2xl font-bold">Login Details</h2>
      <p className="mt-1 text-sm text-cocoa/55">Change your admin name, email or password. Your current password is required to confirm any change.</p>

      {error && <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      {notice && <p className="mt-4 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">{notice}</p>}

      <form onSubmit={submit} className="mt-5 grid max-w-xl gap-4">
        <label className="grid gap-1 text-sm">
          <span className="font-semibold text-cocoa/70">Name</span>
          <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="font-semibold text-cocoa/70">Email <span className="font-normal text-cocoa/40">· this is your login</span></span>
          <input type="email" autoComplete="username" className={inputCls} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        </label>

        <hr className="border-cocoa/10" />
        <p className="text-sm font-semibold text-cocoa/70">Change password <span className="font-normal text-cocoa/40">· leave blank to keep your current one</span></p>
        <label className="grid gap-1 text-sm">
          <span className="font-semibold text-cocoa/70">New password</span>
          <input type="password" autoComplete="new-password" className={inputCls} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="At least 8 characters" />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="font-semibold text-cocoa/70">Confirm new password</span>
          <input type="password" autoComplete="new-password" className={inputCls} value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Re-type the new password" />
        </label>

        <hr className="border-cocoa/10" />
        <label className="grid gap-1 text-sm">
          <span className="font-semibold text-cocoa/70">Current password <span className="font-normal text-berry">· required</span></span>
          <input type="password" autoComplete="current-password" required className={inputCls} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Confirm it's you" />
        </label>

        <div>
          <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-md bg-berry px-5 py-2 text-sm font-semibold text-white hover:bg-berry/90 disabled:opacity-50">
            {saving ? <Loader2 className="animate-spin" size={16} /> : null} Save login details
          </button>
        </div>
      </form>
    </div>
  );
}
