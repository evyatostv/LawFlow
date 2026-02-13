"use client";

import { Button } from "@/components/ui/button";

export default function PrintClient() {
  return (
    <div className="mb-6 flex justify-end">
      <Button onClick={() => window.print()}>הדפס / שמור כ-PDF</Button>
    </div>
  );
}
