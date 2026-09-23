"use client";

import { useEffect } from "react";
import { registrarEvento } from "@/app/(app)/acervo-actions";

/** Grava a visita uma vez ao abrir a tela (e não em prefetch de link). */
export function RegistrarVisita() {
  useEffect(() => {
    void registrarEvento("viu_calculadora");
  }, []);
  return null;
}
