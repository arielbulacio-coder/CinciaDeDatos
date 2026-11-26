"""Genera los notebooks de Google Colab de la Clase 10.

* ``notebooks/clase10_docente.ipynb``    versión completa, con soluciones.
* ``notebooks/clase10_estudiante.ipynb`` versión con retos para completar.

Los notebooks son autocontenidos: generan el dataset y definen las funciones
dentro del propio notebook, así funcionan en Colab sin subir archivos.

Uso::

    python src/crear_notebooks.py
"""

import inspect
import sys
from pathlib import Path

import nbformat as nbf

RAIZ = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(RAIZ / "src"))
import eda_utils  # noqa: E402
import generar_datos  # noqa: E402

REPO_COLAB = "arielbulacio-coder/CinciaDeDatos"


def md(texto):
    return nbf.v4.new_markdown_cell(texto.strip())


def code(texto):
    return nbf.v4.new_code_cell(texto.strip())


def fuente_generador():
    partes = [
        "SEMILLA = 2026",
        "N_HOGARES = 500",
        f"REGIONES = {generar_datos.REGIONES!r}",
        f"PESOS_REGION = {generar_datos.PESOS_REGION!r}",
        f"FACTOR_REGION = {generar_datos.FACTOR_REGION!r}",
        "",
        inspect.getsource(generar_datos.generar),
    ]
    return "\n".join(partes)


def fuente_utils():
    nombres = ["limites_iqr", "atipicos_iqr", "atipicos_zscore", "atipicos_zscore_robusto",
               "winsorizar", "normalizar_minmax", "estandarizar", "resumen_atipicos"]
    return "\n\n".join(inspect.getsource(getattr(eda_utils, n)) for n in nombres)


def badge(nombre):
    url = (f"https://colab.research.google.com/github/{REPO_COLAB}/blob/main/"
           f"clase-10-outliers-transformaciones/notebooks/{nombre}")
    return f"[![Abrir en Colab](https://colab.research.google.com/assets/colab-badge.svg)]({url})"


def celdas(docente: bool):
    nombre = "clase10_docente.ipynb" if docente else "clase10_estudiante.ipynb"
    version = "Versión docente (con soluciones)" if docente else "Versión estudiante"
    c = []
    c.append(md(f"""
# Clase 10 · ¿Error o hallazgo?
## Detección de valores atípicos, análisis de distribuciones y transformaciones

**Python para Ciencia de Datos (3.4.258)** · Unidad 4 – Análisis exploratorio de datos
Licenciatura en Inteligencia Artificial y Ciencia de Datos · UADE · Prof. Lic. Ariel Bulacio

{badge(nombre)} &nbsp; *{version}*

**Al finalizar vas a poder:**
1. **Detectar** valores atípicos con IQR y z-score, y explicar por qué difieren.
2. **Decidir y justificar** qué hacer con cada atípico: corregir, conservar o marcar.
3. **Transformar** variables (log, normalización, discretización) y **crear** nuevas.

> Dataset: 500 hogares **simulados** con la estructura de la Encuesta Permanente de Hogares (EPH – INDEC).
> No son datos reales: fueron diseñados para contener errores de carga y valores extremos genuinos.
"""))

    c.append(md("## 0 · Preparación del entorno"))
    c.append(code("""
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# Paleta institucional UADE: azul para los datos, ámbar para resaltar
AZUL, AMBAR, TINTA = "#2F6DB5", "#D98600", "#061B2C"
sns.set_theme(style="whitegrid", rc={"axes.titleweight": "bold", "axes.titlelocation": "left"})
pd.options.display.float_format = "{:,.2f}".format
"""))
    c.append(md("""
### Generar el dataset
La función crea siempre los mismos 500 hogares (semilla fija → **reproducibilidad**).
En la tarea vas a reemplazar esta celda por los microdatos reales de la EPH.
"""))
    c.append(code(fuente_generador() + "\n\ndf = generar()\ndf.head()"))
    c.append(md("""
### Funciones de la clase
Son las mismas que están en `src/eda_utils.py`, que además tiene tests en `pytest` (Unidad 6).
"""))
    c.append(code(fuente_utils()))

    c.append(md("## 1 · Detectar: antes de calcular, mirá la distribución"))
    c.append(code('df.describe().T'))
    c.append(md("""
**Pregunta:** ¿qué te llama la atención del `max` de `edad_jefe`, `horas_trabajo` e `ingreso_total`?
"""))
    c.append(code("""
s = df["ingreso_total"]
print(f"Media:   ${s.mean():>14,.0f}")
print(f"Mediana: ${s.median():>14,.0f}")
print(f"Asimetría (skew): {s.skew():.2f}")
"""))
    c.append(code("""
fig, axes = plt.subplots(1, 2, figsize=(13, 4))
sns.histplot(s[s < 2e7] / 1e6, bins=40, color=AZUL, ax=axes[0])
axes[0].axvline(s.median() / 1e6, color=TINTA, ls="--", label="mediana")
axes[0].axvline(s.mean() / 1e6, color=AMBAR, ls="--", label="media")
axes[0].set(title="Ingreso (sin el hogar de $135 M)", xlabel="millones de $")
axes[0].legend()
sns.boxplot(x=s / 1e6, color=AZUL, ax=axes[1])
axes[1].set(title="Boxplot del ingreso (con todos los hogares)", xlabel="millones de $")
plt.tight_layout()
"""))
    c.append(md("""
**Atípico ≠ error.**
- *Error de carga o medición*: imposible o incoherente (edad 999, 400 h/semana, un cero de más).
- *Extremo genuino*: real pero poco frecuente. Muchas veces es lo más interesante.
"""))

    c.append(md("### Método 1 · Regla de Tukey (IQR)"))
    c.append(code("""
inf, sup = limites_iqr(s)
q1, q3 = s.quantile([.25, .75])
print(f"Q1 = {q1:,.0f}  Q3 = {q3:,.0f}  IQR = {q3 - q1:,.0f}")
print(f"Límites: [{inf:,.0f} ; {sup:,.0f}]")
print("Atípicos por IQR:", atipicos_iqr(s).sum())
"""))
    c.append(md("### Método 2 · z-score y el efecto enmascaramiento"))
    c.append(code("""
print("z-score |z|>3          :", atipicos_zscore(s).sum())
print("z-score sin el hogar 57:", atipicos_zscore(s.drop(56)).sum())
print("z robusto (MAD)        :", atipicos_zscore_robusto(s).sum())
"""))
    c.append(md("""
El hogar de \\$135 M **infla el desvío estándar** y esconde a los demás: con él, el z-score encuentra uno solo.
Si lo sacamos, aparecen otros. Por eso, con variables asimétricas preferimos **IQR** o **z robusto** (mediana y MAD).
"""))
    c.append(code('resumen_atipicos(df, ["ingreso_total", "edad_jefe", "horas_trabajo", "miembros"])'))

    c.append(md("## 2 · Decidir: tres situaciones, tres decisiones"))
    c.append(md("""
| Situación | Decisión | Ejemplo |
|---|---|---|
| Error evidente | Corregir con la fuente o pasar a `NaN` | `edad_jefe = 999` |
| Extremo genuino | Conservar; usar mediana, log o winsorizar | ingreso \\$15,2 M |
| Dudoso | Marcar con una *flag* y analizar con y sin él | ingreso \\$135 M |
"""))
    c.append(code("""
limpio = df.copy()

# 1) Errores evidentes → NaN (documentado)
limpio.loc[limpio["edad_jefe"] > 110, "edad_jefe"] = np.nan        # 999 = "no responde"
limpio.loc[limpio["horas_trabajo"] > 168, "horas_trabajo"] = np.nan # una semana tiene 168 h

# 2) Dudoso → flag, y lo excluimos del análisis de ingresos
limpio["flag_ingreso_dudoso"] = limpio["ingreso_total"] > 100_000_000
limpio.loc[limpio["flag_ingreso_dudoso"], "ingreso_total"] = np.nan

limpio.isna().sum()
"""))
    c.append(md("""
> 📝 **Registro de decisiones:** cada cambio queda escrito en el notebook. Otra persona tiene que poder reproducirlo.
"""))

    c.append(md("## 3 · Transformar"))
    c.append(md("### Logaritmo: domar la asimetría"))
    c.append(code("""
ing = limpio["ingreso_total"].dropna()
limpio["log_ingreso"] = np.log10(limpio["ingreso_total"])
log_ing = limpio["log_ingreso"].dropna()

print(f"Asimetría original: {ing.skew():.2f} → atípicos IQR: {atipicos_iqr(ing).sum()}")
print(f"Asimetría log10:    {log_ing.skew():.2f} → atípicos IQR: {atipicos_iqr(log_ing).sum()}")

fig, axes = plt.subplots(1, 2, figsize=(13, 4))
sns.histplot(ing / 1e6, bins=40, color=AZUL, ax=axes[0]).set(title="Original", xlabel="millones de $")
sns.histplot(log_ing, bins=40, color=AZUL, ax=axes[1]).set(title="log10(ingreso)")
plt.tight_layout()
"""))
    c.append(md("### Normalizar (min-max) y estandarizar (z)"))
    c.append(code("""
edad = limpio["edad_jefe"].dropna()
comparacion = pd.DataFrame({
    "original": edad,
    "minmax": normalizar_minmax(edad),
    "z": estandarizar(edad),
})
comparacion.describe().loc[["mean", "std", "min", "max"]]
"""))
    c.append(code("""
# Lo mismo con scikit-learn (lo usaremos en la Unidad 5)
from sklearn.preprocessing import MinMaxScaler, StandardScaler, RobustScaler

X = limpio[["edad_jefe"]].dropna()
for scaler in (MinMaxScaler(), StandardScaler(), RobustScaler()):
    r = scaler.fit_transform(X)
    print(f"{type(scaler).__name__:15s} min={r.min():6.2f}  max={r.max():6.2f}")
"""))
    c.append(md("""
⚠️ El escalado cambia **las unidades, no la forma**: no corrige la asimetría. Para eso, log.
"""))
    c.append(md("### Discretizar: `pd.cut` vs `pd.qcut`"))
    c.append(code("""
limpio["tramo_edad"] = pd.cut(limpio["edad_jefe"], bins=[17, 29, 44, 64, 120],
                              labels=["18–29", "30–44", "45–64", "65+"])
limpio["quintil"] = pd.qcut(limpio["ingreso_total"], q=5, labels=["Q1", "Q2", "Q3", "Q4", "Q5"])

print(limpio["tramo_edad"].value_counts().sort_index(), "\\n")
print(limpio["quintil"].value_counts().sort_index())
"""))
    c.append(md("### Crear variables nuevas"))
    c.append(code("""
limpio["ingreso_pc"] = limpio["ingreso_total"] / limpio["miembros"]
limpio["flag_atipico"] = atipicos_iqr(limpio["log_ingreso"])

limpio.groupby("quintil", observed=True)["ingreso_pc"].median().map("${:,.0f}".format)
"""))

    c.append(md("## 4 · Manos al código: retos"))
    c.append(md("""
**Reto 1 · Detectar.** Encontrá los atípicos de `horas_trabajo` (en `df`, el original) con IQR y con z robusto. ¿Coinciden?
"""))
    c.append(code("""
h = df["horas_trabajo"]
print("IQR:", list(h[atipicos_iqr(h)]))
print("z robusto:", list(h[atipicos_zscore_robusto(h)]))
# IQR marca 3 h (muy poco, pero posible) y 400 h (imposible); el z robusto solo marca el 400.
""" if docente else """
h = df["horas_trabajo"]
# TODO: mostrá los valores atípicos según IQR y según z robusto
"""))
    c.append(md("""
**Reto 2 · Decidir.** Escribí en una celda Markdown qué hiciste con cada atípico de `horas_trabajo` y por qué.
"""))
    c.append(md("""
*Solución modelo:* el valor 400 es imposible (una semana tiene 168 h) → `NaN`. Las 3 h semanales
son extremas pero plausibles (trabajo ocasional) → se conservan. Los dos métodos no coinciden:
IQR es más estricto con los valores bajos.
""" if docente else """
*Tu justificación acá…*
"""))
    c.append(md("""
**Reto 3 · Transformar.** Calculá la mediana de `ingreso_pc` por región y ordenala. ¿Cambia el ranking respecto de `ingreso_total`?
"""))
    c.append(code("""
ranking = (limpio.groupby("region")[["ingreso_total", "ingreso_pc"]]
                 .median()
                 .rank(ascending=False)
                 .astype(int)
                 .sort_values("ingreso_pc"))
ranking
""" if docente else """
# TODO: agrupá por región, calculá la mediana de ingreso_total e ingreso_pc y compará los rankings
"""))

    c.append(md("## 5 · Autoevaluación: tests rápidos"))
    c.append(code("""
assert limpio["edad_jefe"].max() < 120, "Quedan edades imposibles"
assert limpio["horas_trabajo"].max() <= 168, "Quedan horas imposibles"
assert limpio["flag_ingreso_dudoso"].sum() == 1, "El hogar dudoso debe quedar marcado"
assert {"log_ingreso", "ingreso_pc", "quintil", "tramo_edad"} <= set(limpio.columns)
print("✅ Todo en orden")
"""))
    c.append(md("""
## Cierre
1. **Mirar antes de borrar:** un atípico puede ser error o hallazgo.
2. **El método depende de la distribución:** IQR y z robusto resisten; el z-score se enmascara.
3. **Transformar no es maquillar:** log para la asimetría, escalar para comparar, discretizar para interpretar.

**Ticket de salida:** en una frase, ¿por qué el z-score encontró un solo atípico en los ingresos?

**Tarea (aula invertida):** repetí este flujo con los microdatos reales de la EPH (INDEC), variable ITF.
**Lectura:** Bruce, Bruce y Gedeck (2022), cap. 1.
"""))
    return c


def main():
    salida = RAIZ / "notebooks"
    salida.mkdir(exist_ok=True)
    for docente, nombre in [(True, "clase10_docente.ipynb"), (False, "clase10_estudiante.ipynb")]:
        nb = nbf.v4.new_notebook()
        nb.cells = celdas(docente)
        nb.metadata = {
            "colab": {"provenance": [], "toc_visible": True},
            "kernelspec": {"name": "python3", "display_name": "Python 3"},
            "language_info": {"name": "python"},
        }
        nbf.write(nb, salida / nombre)
        print("Escrito", salida / nombre)


if __name__ == "__main__":
    main()
