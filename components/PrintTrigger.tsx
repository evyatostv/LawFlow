"use client";

import * as React from "react";

export function PrintTrigger({ autoPrint }: { autoPrint?: boolean }) {
  React.useEffect(() => {
    if (autoPrint) {
      window.print();
    }
  }, [autoPrint]);
  return null;
}
