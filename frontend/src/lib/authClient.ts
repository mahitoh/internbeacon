"use client";

import { useSyncExternalStore } from "react";
import { AUTH_CHANGE_EVENT, getStoredUser, type AuthUser } from "@/lib/api";

function subscribe(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};

  const onStorage = () => onStoreChange();
  const onAuthChange = () => onStoreChange();

  window.addEventListener("storage", onStorage);
  window.addEventListener(AUTH_CHANGE_EVENT, onAuthChange);

  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(AUTH_CHANGE_EVENT, onAuthChange);
  };
}

function getSnapshot(): AuthUser | null {
  return getStoredUser();
}

function getServerSnapshot(): AuthUser | null {
  return null;
}

export function useAuthUser() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
