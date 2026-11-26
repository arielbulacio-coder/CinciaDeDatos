// Contenidos tomados del programa 3.4.258 (aprobado CF FAIN Nº 534, 09/09/2025).

export const CURSO = {
  nombre: "Python para Ciencia de Datos",
  codigo: "3.4.258",
  carrera: "Licenciatura en Inteligencia Artificial y Ciencia de Datos",
  departamento: "Dpto. de Tecnología Informática · Ciclo Inicial",
  facultad: "Facultad de Ingeniería y Ciencias Exactas",
  carga: "68 h",
  docente: "Prof. Lic. Ariel Bulacio",
  modalidad: "Virtual · clases sincrónicas + Google Colab",
};

export const OBJETIVOS = [
  "Comprender y aplicar los fundamentos de programación en Python, orientados al análisis y manipulación de datos.",
  "Utilizar librerías fundamentales (NumPy, Pandas, Matplotlib, Seaborn, Scikit-learn) en contextos de ciencia de datos.",
  "Implementar programas para la limpieza, transformación y análisis exploratorio de datos (EDA).",
  "Diseñar y ejecutar flujos de trabajo reproducibles para proyectos de ciencia de datos.",
  "Integrar conocimientos previos de matemáticas y estadística en el desarrollo de soluciones.",
  "Adoptar buenas prácticas de programación: documentación, testing básico y control de versiones.",
];

export const UNIDADES = [
  {
    n: 1,
    titulo: "Fundamentos de programación en Python aplicados a datos",
    temas: ["Jupyter, Colab e IDEs", "Variables, tipos y estructuras de control", "PEP 8 y docstrings", "Errores y excepciones", "E/S: CSV, TXT, JSON"],
  },
  {
    n: 2,
    titulo: "Estructuras y librerías científicas",
    temas: ["NumPy y vectorización", "Series y DataFrames", "Indexación, filtrado, uniones", "Nulos, duplicados y tipos", "CSV, Excel, SQL, JSON"],
  },
  {
    n: 3,
    titulo: "Visualización de datos con Python",
    temas: ["Comunicación visual", "Matplotlib: líneas, barras, histogramas", "Seaborn: heatmaps, boxplots, pairplots", "Personalización y exportación"],
  },
  {
    n: 4,
    titulo: "Análisis exploratorio de datos (EDA)",
    temas: ["describe(), tendencia central y dispersión", "groupby y pivot tables", "Atípicos y distribuciones", "Normalización, discretización, nuevas variables", "Datasets abiertos: salud, economía, ambiente"],
  },
  {
    n: 5,
    titulo: "Introducción al modelado con Scikit-learn",
    temas: ["Flujo: carga → preprocesamiento → train/test → evaluación", "Regresión lineal y k-NN", "Accuracy, RMSE, matriz de confusión", "Pipelines"],
  },
  {
    n: 6,
    titulo: "Buenas prácticas y reproducibilidad",
    temas: ["Estructura y documentación de proyectos", "Pytest y unittest", "Git y GitHub", "Entornos virtuales y notebooks reproducibles"],
  },
];

export const CRONOGRAMA = [
  { clase: 1, unidad: "1", tema: "Python en entornos científicos (Jupyter, Colab, IDEs). Variables, tipos y estructuras de control." },
  { clase: 2, unidad: "1", tema: "PEP 8, docstrings y comentarios. Errores y excepciones. Entrada y salida de datos (CSV, TXT, JSON)." },
  { clase: 3, unidad: "2", tema: "Arreglos y operaciones vectorizadas con NumPy. DataFrames y Series con Pandas." },
  { clase: 4, unidad: "2", tema: "Indexación, selección, filtrado, concatenación y unión. Limpieza: nulos, duplicados, tipos. Formatos." },
  { clase: 5, unidad: "3", tema: "Comunicación visual de datos. Matplotlib: líneas, barras, histogramas, dispersión." },
  { clase: 6, unidad: "3", tema: "Seaborn: mapas de calor, boxplots, pairplots. Personalización y exportación." },
  { clase: 7, unidad: "1, 2, 3", tema: "Simulacro Primer Parcial", tipo: "evaluacion" },
  { clase: 8, unidad: "1, 2, 3", tema: "Primer Parcial", tipo: "evaluacion" },
  { clase: 9, unidad: "4", tema: "Estadísticas descriptivas (.describe(), tendencia central y dispersión). groupby y pivot tables." },
  { clase: 10, unidad: "4", tema: "Detección de valores atípicos y análisis de distribuciones. Transformaciones: normalización, discretización y nuevas variables.", destacada: true },
  { clase: 11, unidad: "5", tema: "Flujo de trabajo en ciencia de datos: carga, preprocesamiento, train/test, entrenamiento, evaluación." },
  { clase: 12, unidad: "5", tema: "Regresión lineal simple, k-NN. Accuracy, RMSE, matriz de confusión. Pipelines." },
  { clase: 13, unidad: "6", tema: "Git y GitHub aplicados a proyectos de datos. Notebooks y entornos virtuales." },
  { clase: 14, unidad: "6", tema: "Documentación y estructura de proyectos. Testing con Pytest y unittest." },
  { clase: 15, unidad: "4, 5, 6", tema: "Simulacro Segundo Parcial", tipo: "evaluacion" },
  { clase: 16, unidad: "4, 5, 6", tema: "Segundo Parcial", tipo: "evaluacion" },
  { clase: 17, unidad: "1 a 6", tema: "Recuperatorio y Final Adelantado", tipo: "evaluacion" },
  { clase: 18, unidad: "1 a 6", tema: "Final Regular", tipo: "evaluacion" },
];

export const EVALUACION = [
  "Asistencia mínima del 75 %.",
  "Dos parciales (y recuperatorio), aprobados con 4 o más. Opcional: trabajos prácticos con defensa.",
  "Promoción: 8 o más en cada parcial, sin haber rendido recuperatorio.",
  "Con 4 a 7: examen final dentro de los 11 turnos siguientes.",
];

export const BIBLIOGRAFIA = {
  obligatoria: "Bruce, P., Bruce, A. y Gedeck, P. (2022). Estadística práctica para ciencia de datos con R y Python. Marcombo.",
  complementaria: "Holguín Londoño, G. A., Holguín Londoño, M. y Moreno Gallón, D. A. (2024). Introducción a la ciencia y análisis de datos con Python: una visión empresarial. Universidad Tecnológica de Pereira.",
};
