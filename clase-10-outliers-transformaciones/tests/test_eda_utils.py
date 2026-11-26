"""Tests básicos (pytest) de src/eda_utils.py — práctica de la Unidad 6."""

import sys
from pathlib import Path

import numpy as np
import pandas as pd
import pytest

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))
import eda_utils as eu  # noqa: E402


@pytest.fixture
def serie_con_atipico():
    return pd.Series([10, 12, 11, 13, 12, 11, 10, 12, 13, 100])


def test_limites_iqr_valores_conocidos():
    s = pd.Series([1, 2, 3, 4, 5, 6, 7, 8])  # Q1=2.75, Q3=6.25, IQR=3.5
    inf, sup = eu.limites_iqr(s)
    assert inf == pytest.approx(2.75 - 1.5 * 3.5)
    assert sup == pytest.approx(6.25 + 1.5 * 3.5)


def test_atipicos_iqr_detecta_el_100(serie_con_atipico):
    mascara = eu.atipicos_iqr(serie_con_atipico)
    assert mascara.sum() == 1
    assert serie_con_atipico[mascara].iloc[0] == 100


def test_zscore_sufre_enmascaramiento_en_muestras_chicas(serie_con_atipico):
    # Con n=10 el propio 100 infla el desvío: |z| < 3 y NO se detecta.
    assert eu.atipicos_zscore(serie_con_atipico).sum() == 0
    # El z robusto (mediana/MAD) sí lo detecta.
    assert eu.atipicos_zscore_robusto(serie_con_atipico).sum() == 1


def test_minmax_rango_0_1(serie_con_atipico):
    r = eu.normalizar_minmax(serie_con_atipico)
    assert r.min() == 0 and r.max() == 1


def test_minmax_serie_constante():
    assert (eu.normalizar_minmax(pd.Series([5, 5, 5])) == 0).all()


def test_estandarizar_media_0_desvio_1():
    s = pd.Series(np.random.default_rng(0).normal(50, 10, 1000))
    z = eu.estandarizar(s)
    assert z.mean() == pytest.approx(0, abs=1e-9)
    assert z.std() == pytest.approx(1)


def test_winsorizar_conserva_filas(serie_con_atipico):
    w = eu.winsorizar(serie_con_atipico)
    assert len(w) == len(serie_con_atipico)
    assert w.max() < 100


def test_no_modifica_la_serie_original(serie_con_atipico):
    copia = serie_con_atipico.copy()
    eu.winsorizar(serie_con_atipico)
    eu.normalizar_minmax(serie_con_atipico)
    pd.testing.assert_series_equal(serie_con_atipico, copia)
