// Modalidad de la clase: "presencial" (por defecto) o "virtual".
// Cambia las consignas de participación (mano alzada / chat, grupos / salas).
import { useSyncExternalStore } from "react";

const CLAVE = "modalidad-clase";
const oyentes = new Set();

function leer() {
  try { return localStorage.getItem(CLAVE) === "virtual" ? "virtual" : "presencial"; } catch { return "presencial"; }
}

export function setModalidad(m) {
  try { localStorage.setItem(CLAVE, m); } catch { /* sin almacenamiento */ }
  oyentes.forEach((f) => f());
}

function suscribir(f) {
  oyentes.add(f);
  const otraVentana = (e) => { if (e.key === CLAVE) f(); };
  window.addEventListener("storage", otraVentana);
  return () => { oyentes.delete(f); window.removeEventListener("storage", otraVentana); };
}

export function useModalidad() {
  return useSyncExternalStore(suscribir, leer, () => "presencial");
}

export const TEXTOS = {
  presencial: {
    pieClase: "Clase presencial · notebooks en Google Colab",
    votar: "Votá a mano alzada: 30 segundos. Al final de la clase volvemos a votar.",
    responder: "Respondé a mano alzada:",
    grupos: "Manos al código · Google Colab · Grupos de 3 en el aula",
    revelado: "Evaluación formativa: cada respuesta se revela con un clic (→)",
    recurso: "Recurso",
    encuesta: "Votación a mano alzada",
  },
  virtual: {
    pieClase: "Modalidad virtual · aula sincrónica + Google Colab",
    votar: "Votá en el chat: 30 segundos. Al final de la clase volvemos a votar.",
    responder: "Respondé en el chat:",
    grupos: "Manos al código · Google Colab · Salas de 3",
    revelado: "Evaluación formativa: cada respuesta se revela con un clic (→)",
    recurso: "Recurso virtual",
    encuesta: "Encuesta en vivo, chat",
  },
};

export function useTextos() {
  return TEXTOS[useModalidad()];
}
