"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { useAuth } from "@/store/auth";

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", address: "" });
  const [error, setError] = useState("");
  const auth = useAuth();
  const router = useRouter();

  async function submit() {
    try {
      if (mode === "login") await auth.login(form.email, form.password);
      else await auth.register(form);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    }
  }

  return (
    <section className="mx-auto max-w-md px-4 py-12">
      <div className="rounded-lg bg-white p-6 shadow-premium">
        <h1 className="font-display text-4xl font-bold">{mode === "login" ? "Login" : "Register"}</h1>
        <div className="mt-5 grid gap-3">
          {mode === "register" && <input className="focus-ring rounded-md border border-cocoa/15 p-3" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />}
          <input className="focus-ring rounded-md border border-cocoa/15 p-3" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          {mode === "register" && <input className="focus-ring rounded-md border border-cocoa/15 p-3" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />}
          {mode === "register" && <input className="focus-ring rounded-md border border-cocoa/15 p-3" placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />}
          <input className="focus-ring rounded-md border border-cocoa/15 p-3" placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          {error && <p className="rounded-md bg-berry/10 p-3 text-sm text-berry">{error}</p>}
          <Button onClick={submit}>{mode === "login" ? "Login" : "Create Account"}</Button>
          <button className="text-sm font-semibold text-berry" onClick={() => setMode(mode === "login" ? "register" : "login")}>
            {mode === "login" ? "Need an account? Register" : "Already registered? Login"}
          </button>
        </div>
      </div>
    </section>
  );
}

