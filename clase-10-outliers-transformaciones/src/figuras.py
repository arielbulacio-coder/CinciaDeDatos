"""Genera las figuras de la presentación de la Clase 10 (paleta UADE).

Uso::

    python src/figuras.py      # escribe PNG en figuras/
"""

from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt  # noqa: E402
import numpy as np  # noqa: E402
import pandas as pd  # noqa: E402

import eda_utils as eu  # noqa: E402

RAIZ = Path(__file__).resolve().parents[1]
SALIDA = RAIZ / "figuras"

# Paleta UADE: azul institucional para los datos, ámbar FAIN para resaltar.
TINTA = "#061B2C"
TINTA_2 = "#4E5B66"
AZUL = "#2F6DB5"
AMBAR = "#D98600"
GRILLA = "#E3E8EE"

plt.rcParams.update({
    "font.size": 13,
    "axes.edgecolor": GRILLA,
    "axes.labelcolor": TINTA_2,
    "axes.titlecolor": TINTA,
    "axes.titleweight": "bold",
    "axes.titlesize": 15,
    "axes.titlelocation": "left",
    "axes.spines.top": False,
    "axes.spines.right": False,
    "axes.grid": True,
    "axes.axisbelow": True,
    "grid.color": GRILLA,
    "grid.linewidth": 0.8,
    "xtick.color": TINTA_2,
    "ytick.color": TINTA_2,
    "figure.dpi": 100,
    "savefig.dpi": 200,
    "savefig.bbox": "tight",
    "savefig.facecolor": "white",
})

MILLON = 1_000_000


def _guardar(fig, nombre):
    fig.savefig(SALIDA / nombre)
    plt.close(fig)


def fig_media_vs_mediana(df):
    s = df["ingreso_total"] / MILLON
    fig, ax = plt.subplots(figsize=(10, 4.6))
    visibles = s[s < 17]
    ax.hist(visibles, bins=np.arange(0, 17, 0.4), color=AZUL,
            edgecolor="white", linewidth=1.2)
    media, mediana = s.mean(), s.median()
    for valor, etiqueta, color, dy in [(mediana, "Mediana", TINTA, 0.93),
                                       (media, "Media", AMBAR, 0.78)]:
        ax.axvline(valor, color=color, lw=2.2, ls="--")
        ax.text(valor + 0.2, ax.get_ylim()[1] * dy,
                f"{etiqueta}: ${valor:.2f} M", color=TINTA,
                fontsize=13, fontweight="bold")
    ax.annotate("1 hogar con $135 M\n(fuera del gráfico) →",
                xy=(16.6, 2), xytext=(12.2, ax.get_ylim()[1] * 0.45),
                fontsize=12, color=TINTA, ha="left",
                arrowprops=dict(arrowstyle="->", color=AMBAR, lw=1.8))
    ax.set_xlabel("Ingreso total mensual del hogar (millones de $)")
    ax.set_ylabel("Cantidad de hogares")
    ax.set_title("Un solo valor arrastra la media; la mediana resiste")
    _guardar(fig, "01_media_vs_mediana.png")


def fig_boxplot_anatomia(df):
    s = df["ingreso_total"] / MILLON
    q1, med, q3 = s.quantile([0.25, 0.5, 0.75])
    inf, sup = eu.limites_iqr(s)
    atip = s[eu.atipicos_iqr(s)]
    fig, ax = plt.subplots(figsize=(10, 3.9))
    ax.add_patch(plt.Rectangle((q1, -0.28), q3 - q1, 0.56, facecolor="#D6E4F5",
                               edgecolor=AZUL, lw=2))
    ax.plot([med, med], [-0.28, 0.28], color=TINTA, lw=3)
    bigote_sup = s[s <= sup].max()
    ax.plot([s.min(), q1], [0, 0], color=AZUL, lw=2)
    ax.plot([q3, bigote_sup], [0, 0], color=AZUL, lw=2)
    ax.axvline(sup, color=AMBAR, lw=1.8, ls="--", ymin=0.22, ymax=0.88)
    visibles = atip[atip < 17]
    ax.scatter(visibles, np.zeros(len(visibles)), s=70, color=AMBAR,
               edgecolor="white", linewidth=1.5, zorder=3)
    def coma(x):
        return f"{x:.2f}".replace(".", ",")

    ax.text(med, 0.36, f"Mediana {coma(med)}", ha="center", va="bottom",
            color=TINTA, fontsize=11, fontweight="bold")
    ax.text(q1 - 0.05, -0.36, f"Q1\n{coma(q1)}", ha="right", va="top",
            color=TINTA, fontsize=11)
    ax.text(q3 + 0.05, -0.36, f"Q3\n{coma(q3)}", ha="left", va="top",
            color=TINTA, fontsize=11)
    ax.text((q1 + q3) / 2, -0.78, f"IQR = Q3 − Q1 = {coma(q3 - q1)}",
            ha="center", color=TINTA, fontsize=11, fontweight="bold")
    ax.text(sup + 0.15, 0.40, f"Límite superior\nQ3 + 1,5·IQR = {coma(sup)}",
            color=TINTA, fontsize=11, va="center")
    ax.text(10.5, -0.42, f"{len(atip)} hogares marcados como atípicos",
            color=TINTA, fontsize=12, fontweight="bold", ha="center")
    ax.set_xlim(0, 17)
    ax.set_ylim(-0.95, 0.65)
    ax.set_yticks([])
    ax.grid(axis="y", visible=False)
    ax.spines["left"].set_visible(False)
    ax.set_xlabel("Ingreso total mensual (millones de $)")
    ax.set_title("Anatomía del boxplot: la regla de Tukey (IQR)")
    _guardar(fig, "02_boxplot_iqr.png")


def fig_log(df):
    s = df["ingreso_total"].copy()
    s[s > 100 * MILLON] = np.nan        # error de carga ya tratado
    s = s.dropna()
    fig, axes = plt.subplots(1, 2, figsize=(11, 4.2))
    axes[0].hist(s / MILLON, bins=40, color=AZUL, edgecolor="white", lw=1)
    axes[0].set_title(f"Original — asimetría = {s.skew():.2f}")
    axes[0].set_xlabel("Ingreso (millones de $)")
    axes[0].set_ylabel("Hogares")
    log_s = np.log10(s)
    axes[1].hist(log_s, bins=40, color=AZUL, edgecolor="white", lw=1)
    axes[1].set_title(f"log10(ingreso) — asimetría = {log_s.skew():.2f}")
    axes[1].set_xlabel("log10(ingreso)")
    n_raw, n_log = eu.atipicos_iqr(s).sum(), eu.atipicos_iqr(log_s).sum()
    for ax, n in [(axes[0], n_raw), (axes[1], n_log)]:
        ax.text(0.97, 0.92, f"Atípicos IQR: {n}", transform=ax.transAxes,
                ha="right", color=TINTA, fontweight="bold",
                bbox=dict(boxstyle="round,pad=0.35", fc="#FFF4DC", ec=AMBAR))
    fig.tight_layout(w_pad=3)
    _guardar(fig, "03_transformacion_log.png")


def fig_escalado(df):
    e = df.loc[df["edad_jefe"] < 120, "edad_jefe"]
    versiones = [
        (e, "Original (años)"),
        (eu.normalizar_minmax(e), "Min-Max → [0, 1]"),
        (eu.estandarizar(e), "Estandarización z → μ=0, σ=1"),
    ]
    fig, axes = plt.subplots(1, 3, figsize=(12, 3.6))
    for ax, (serie, titulo) in zip(axes, versiones):
        ax.hist(serie, bins=25, color=AZUL, edgecolor="white", lw=1)
        ax.set_title(titulo, fontsize=13)
        ax.set_yticks([])
        ax.grid(axis="y", visible=False)
        ax.spines["left"].set_visible(False)
        ax.text(0.03, 0.88, f"[{serie.min():.2f} ; {serie.max():.2f}]",
                transform=ax.transAxes, fontsize=11, color=TINTA)
    fig.suptitle("Edad del jefe de hogar: misma forma, distinta escala",
                 x=0.01, ha="left", fontweight="bold", color=TINTA, fontsize=15)
    fig.tight_layout()
    _guardar(fig, "04_escalado.png")


def fig_discretizacion(df):
    e = df.loc[df["edad_jefe"] < 120, "edad_jefe"]
    s = df.loc[df["ingreso_total"] < 100 * MILLON, "ingreso_total"]
    tramos = pd.cut(e, bins=[17, 29, 44, 64, 120],
                    labels=["18–29", "30–44", "45–64", "65+"])
    quintiles = pd.qcut(s, q=5, labels=["Q1", "Q2", "Q3", "Q4", "Q5"])
    fig, axes = plt.subplots(1, 2, figsize=(11, 4))
    for ax, serie, titulo in [
        (axes[0], tramos, "pd.cut → cortes definidos por el dominio"),
        (axes[1], quintiles, "pd.qcut → quintiles (igual frecuencia)"),
    ]:
        conteo = serie.value_counts().sort_index()
        barras = ax.bar(conteo.index.astype(str), conteo.values, color=AZUL,
                        width=0.62, edgecolor="white", lw=2)
        ax.bar_label(barras, padding=3, color=TINTA, fontsize=12)
        ax.set_title(titulo, fontsize=13)
        ax.set_ylim(0, conteo.max() * 1.18)
        ax.grid(axis="x", visible=False)
    axes[0].set_xlabel("Tramo de edad del jefe de hogar")
    axes[1].set_xlabel("Quintil de ingreso")
    axes[0].set_ylabel("Hogares")
    fig.tight_layout(w_pad=3)
    _guardar(fig, "05_discretizacion.png")


if __name__ == "__main__":
    SALIDA.mkdir(exist_ok=True)
    datos = pd.read_csv(RAIZ / "datos" / "hogares_simulado.csv")
    fig_media_vs_mediana(datos)
    fig_boxplot_anatomia(datos)
    fig_log(datos)
    fig_escalado(datos)
    fig_discretizacion(datos)
    print("Figuras generadas en", SALIDA)
