# Python para Ciencia de Datos · UADE

Curso virtual de la asignatura **Python para Ciencia de Datos (3.4.258)**, Licenciatura en Inteligencia
Artificial y Ciencia de Datos, Facultad de Ingeniería y Ciencias Exactas (UADE).
Prof. Lic. Ariel Bulacio.

La **Clase 10** (Unidad 4 – EDA: atípicos, distribuciones y transformaciones) está desarrollada completa
para la prueba de oposición: presentación de 20 minutos, laboratorio interactivo, notebooks de Colab y plan docente.

**Sitio publicado:** https://arielbulacio-coder.github.io/CinciaDeDatos/
(se actualiza solo con cada `push` a `main`, mediante `.github/workflows/pages.yml`).
La versión pendrive se descarga desde el sitio: `clase10-pendrive.zip`.

## Contenido del repositorio

```
app/                                React + Vite, PWA instalable y offline
  src/presentacion/                 17 diapositivas con gráficos en vivo, ventana del orador, votación
  src/pages/                        Curso, Laboratorio, Práctica y Colab, Plan docente
  src/lib/stats.js                  Estadística en JS (mismos resultados que pandas, con tests)
clase-10-outliers-transformaciones/
  src/generar_datos.py              Dataset simulado (500 hogares, estructura EPH) reproducible
  src/eda_utils.py                  Funciones de atípicos y transformaciones
  src/crear_notebooks.py            Genera los notebooks de Colab
  src/figuras.py                    Figuras estáticas (paleta UADE)
  notebooks/                        clase10_estudiante.ipynb y clase10_docente.ipynb
  tests/                            pytest
```

## La app (PWA)

```bash
cd app
npm install
npm run dev              # desarrollo: http://localhost:5173
npm test                 # tests de estadística (comparados con pandas)
npm run build            # dist/: PWA instalable, funciona sin conexión
npm run build:pendrive   # dist-pendrive/index.html: un solo archivo, se abre con doble clic
npm run preview          # sirve dist/ en http://localhost:4173
```

### Presentar la clase

1. Abrir **Clase 10 → Presentación → ▶ Presentar**.
2. `F` pantalla completa · `→` / espacio / puntero avanzan · `←` retrocede.
3. `O` abre la **ventana del orador** (notas, cronómetro de 20 min con desfase respecto del plan, siguiente diapositiva).
   En la videollamada se comparte solo la ventana de la presentación.
4. `T` inicia el cronómetro. Los botones de cada diapositiva (con/sin hogar #57, k = 1,5/3, log, escalados, cut/qcut)
   se usan con el mouse.

### Para el pendrive

Copiar la carpeta `app/dist-pendrive/` completa (incluye los notebooks). Se abre `index.html` con doble clic,
sin internet ni servidor. Las tipografías caen a las del sistema si no hay conexión.

## Google Colab

Los notebooks son **autocontenidos**: generan el dataset y definen las funciones dentro del propio notebook.

- El botón **Abrir en Colab** de la app abre el notebook directamente desde este repositorio
  (`COLAB.REPO` en `app/src/config.js`).
- Sin conexión a GitHub: descargar el `.ipynb` desde la app y en Colab usar *Archivo → Subir notebook*.

## Modalidad presencial o virtual

En la página de la clase (o con la tecla `M` mientras se presenta) se elige la modalidad. Cambian las consignas
de participación: votación a mano alzada o por chat, grupos en el aula o salas virtuales.

## Python

```bash
python -m venv .venv
.venv/Scripts/pip install pandas numpy matplotlib seaborn scikit-learn nbformat nbclient ipykernel pytest
cd clase-10-outliers-transformaciones
../.venv/Scripts/python src/generar_datos.py
../.venv/Scripts/python src/crear_notebooks.py
../.venv/Scripts/python -m pytest -q tests
```

> El dataset es **simulado** con fines didácticos (estructura inspirada en la EPH – INDEC). No son datos reales.
