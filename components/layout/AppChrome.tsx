"use client";

import dynamic from "next/dynamic";

const CustomCursor = dynamic(() => import("@/components/ui/CustomCursor"), { ssr: false });
const GlobalEyeBackground = dynamic(() => import("@/components/ui/GlobalEyeBackground"));

export default function AppChrome() {
  return (
    <>
      <CustomCursor />
      <GlobalEyeBackground />
    </>
  );
}
