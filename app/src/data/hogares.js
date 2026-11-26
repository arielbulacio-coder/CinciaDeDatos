import crudos from "./hogares.json";

// Dataset completo, tal como viene (con errores de carga).
export const HOGARES = crudos;

export const VARIABLES = {
  ingreso_total: { nombre: "Ingreso total del hogar", unidad: "$", escala: 1e6, sufijo: " M" },
  edad_jefe: { nombre: "Edad del jefe de hogar", unidad: "años", escala: 1, sufijo: "" },
  horas_trabajo: { nombre: "Horas trabajadas por semana", unidad: "h", escala: 1, sufijo: "" },
  miembros: { nombre: "Miembros del hogar", unidad: "personas", escala: 1, sufijo: "" },
};

export const col = (nombre, filas = HOGARES) => filas.map((h) => h[nombre]);

// Versión con las decisiones de la clase aplicadas (errores → fuera).
export const LIMPIO = HOGARES.filter(
  (h) => h.ingreso_total < 1e8 && h.edad_jefe < 120 && h.horas_trabajo <= 168,
);

export const REGIONES = ["GBA", "Pampeana", "NOA", "NEA", "Cuyo", "Patagonia"];
