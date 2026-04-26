import { Suspense } from "react";
import { TrackingClient } from "./TrackingClient";

export default function TrackingPage() {
  return (
    <Suspense fallback={<section className="mx-auto max-w-4xl px-4 py-12">Loading tracking...</section>}>
      <TrackingClient />
    </Suspense>
  );
}

