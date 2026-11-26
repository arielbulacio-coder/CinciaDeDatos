"""Genera el dataset didáctico de la Clase 10.

Dataset SIMULADO de hogares, inspirado en la estructura de la Encuesta
Permanente de Hogares (EPH - INDEC). No son datos reales: está diseñado
para contener, de forma controlada, los fenómenos que se estudian en clase:

* una variable fuertemente asimétrica (``ingreso_total``),
* valores atípicos *genuinos* (hogares de ingresos muy altos),
* valores atípicos por *error de carga* (dos ceros de más, el código 999
  de "no responde", horas trabajadas imposibles).

Uso::

    python src/generar_datos.py            # escribe datos/hogares_simulado.csv
"""

from pathlib import Path

import numpy as np
import pandas as pd

SEMILLA = 2026
N_HOGARES = 500
REGIONES = ["GBA", "Pampeana", "NOA", "NEA", "Cuyo", "Patagonia"]
PESOS_REGION = [0.38, 0.25, 0.11, 0.08, 0.08, 0.10]
FACTOR_REGION = {"GBA": 1.00, "Pampeana": 0.95, "NOA": 0.78,
                 "NEA": 0.74, "Cuyo": 0.85, "Patagonia": 1.30}


def generar(n: int = N_HOGARES, semilla: int = SEMILLA) -> pd.DataFrame:
    """Devuelve un DataFrame reproducible de ``n`` hogares simulados."""
    rng = np.random.default_rng(semilla)

    region = rng.choice(REGIONES, size=n, p=PESOS_REGION)
    miembros = np.clip(rng.poisson(2.2, size=n) + 1, 1, 8)
    edad_jefe = np.clip(rng.normal(47, 14, size=n), 18, 90).round().astype(int)
    horas = np.clip(rng.normal(40, 11, size=n), 0, 75).round().astype(int)

    # Ingreso log-normal: asimetría a derecha, típica de variables económicas.
    base = rng.lognormal(mean=np.log(1_150_000), sigma=0.55, size=n)
    factor = np.array([FACTOR_REGION[r] for r in region])
    ingreso = (base * factor * (1 + 0.08 * (miembros - 1))).round(-3)

    df = pd.DataFrame({
        "id_hogar": np.arange(1, n + 1),
        "region": region,
        "miembros": miembros,
        "edad_jefe": edad_jefe,
        "horas_trabajo": horas,
        "ingreso_total": ingreso,
    })

    # --- Atípicos GENUINOS: hogares de muy altos ingresos (existen). ---
    df.loc[[17, 133, 288, 402], "ingreso_total"] = [9_800_000, 12_500_000,
                                                    8_900_000, 15_200_000]
    df.loc[133, "region"] = "Patagonia"   # caso usado en la práctica guiada
    # --- Atípicos por ERROR de carga. ---
    df.loc[56, "ingreso_total"] = 1_350_000 * 100   # dos ceros de más
    df.loc[[91, 377], "edad_jefe"] = 999            # código "no responde"
    df.loc[245, "horas_trabajo"] = 400              # imposible (> 168 h/semana)

    return df


if __name__ == "__main__":
    destino = Path(__file__).resolve().parents[1] / "datos" / "hogares_simulado.csv"
    generar().to_csv(destino, index=False)
    print(f"Dataset escrito en {destino}")
