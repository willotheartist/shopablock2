// src/app/sign-in/sign-in-error-cleaner.tsx
"use client";

import { useEffect } from "react";

export default function SignInErrorCleaner() {
  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.delete("error");
    window.history.replaceState({}, "", url.toString());
  }, []);

  return null;
}
