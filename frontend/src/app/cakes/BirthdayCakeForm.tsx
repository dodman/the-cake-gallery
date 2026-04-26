"use client";

import { Button } from "@/components/Button";

export function BirthdayCakeForm() {
  return (
    <section className="bg-white py-12">
      <div className="mx-auto max-w-4xl px-4">
        <h2 className="font-display text-4xl font-bold">Birthday Cake Custom Order</h2>
        <form className="mt-6 grid gap-4 md:grid-cols-2">
          <input className="focus-ring rounded-md border border-cocoa/15 p-3" placeholder="Full name" />
          <input className="focus-ring rounded-md border border-cocoa/15 p-3" placeholder="Phone number" />
          <input className="focus-ring rounded-md border border-cocoa/15 p-3" placeholder="Cake size" />
          <input className="focus-ring rounded-md border border-cocoa/15 p-3" placeholder="Preferred date" type="date" />
          <textarea className="focus-ring rounded-md border border-cocoa/15 p-3 md:col-span-2" placeholder="Theme, flavor, colors and message" rows={4} />
          <Button className="md:col-span-2" type="button">Submit Cake Request</Button>
        </form>
      </div>
    </section>
  );
}

