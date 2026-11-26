"""Funciones reutilizables para la Clase 10: atípicos y transformaciones.

Todas reciben una ``pd.Series`` numérica y devuelven un objeto nuevo
(no modifican la serie original).
"""

from __future__ import annotations

import pandas as pd


def limites_iqr(serie: pd.Series, k: float = 1.5) -> tuple[float, float]:
    """Devuelve los límites de Tukey: (Q1 - k*IQR, Q3 + k*IQR).

    Args:
        serie: valores numéricos (se ignoran los NaN).
        k: multiplicador del rango intercuartílico. 1.5 = atípico, 3 = extremo.
    """
    q1, q3 = serie.quantile([0.25, 0.75])
    iqr = q3 - q1
    return q1 - k * iqr, q3 + k * iqr


def atipicos_iqr(serie: pd.Series, k: float = 1.5) -> pd.Series:
    """Máscara booleana: True donde el valor cae fuera de los límites de Tukey."""
    inferior, superior = limites_iqr(serie, k)
    return (serie < inferior) | (serie > superior)


def atipicos_zscore(serie: pd.Series, umbral: float = 3.0) -> pd.Series:
    """Máscara booleana: True donde |z| > umbral, con z = (x - media) / desvío.

    Advertencia: la media y el desvío se ven afectados por los mismos
    atípicos que se quieren detectar (efecto *enmascaramiento*).
    Supone una distribución aproximadamente normal.
    """
    z = (serie - serie.mean()) / serie.std()
    return z.abs() > umbral


def atipicos_zscore_robusto(serie: pd.Series, umbral: float = 3.5) -> pd.Series:
    """Máscara booleana con z robusto (mediana y MAD), de Iglewicz y Hoaglin.

    z_r = 0.6745 * (x - mediana) / MAD
    """
    mediana = serie.median()
    mad = (serie - mediana).abs().median()
    if mad == 0:
        return pd.Series(False, index=serie.index)
    z_r = 0.6745 * (serie - mediana) / mad
    return z_r.abs() > umbral


def winsorizar(serie: pd.Series, k: float = 1.5) -> pd.Series:
    """Recorta (sin eliminar filas) los valores fuera de los límites de Tukey."""
    inferior, superior = limites_iqr(serie, k)
    return serie.clip(lower=inferior, upper=superior)


def normalizar_minmax(serie: pd.Series) -> pd.Series:
    """Escala al rango [0, 1]: (x - min) / (max - min)."""
    rango = serie.max() - serie.min()
    if rango == 0:
        return pd.Series(0.0, index=serie.index)
    return (serie - serie.min()) / rango


def estandarizar(serie: pd.Series) -> pd.Series:
    """Estandarización z: media 0 y desvío 1."""
    return (serie - serie.mean()) / serie.std()


def resumen_atipicos(df: pd.DataFrame, columnas: list[str]) -> pd.DataFrame:
    """Tabla comparativa: cuántos atípicos detecta cada método en cada columna."""
    filas = []
    for col in columnas:
        s = df[col].dropna()
        filas.append({
            "variable": col,
            "asimetria": round(s.skew(), 2),
            "IQR (k=1.5)": int(atipicos_iqr(s).sum()),
            "z-score (|z|>3)": int(atipicos_zscore(s).sum()),
            "z robusto (>3.5)": int(atipicos_zscore_robusto(s).sum()),
        })
    return pd.DataFrame(filas).set_index("variable")
