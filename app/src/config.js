// Configuración de Google Colab.
// Colab abre notebooks directamente desde GitHub. Cuando el repositorio esté
// publicado, reemplazá REPO por "usuario/repositorio" y el botón
// "Abrir en Colab" funcionará con un clic.
export const COLAB = {
  REPO: "arielbulacio-coder/CinciaDeDatos",
  RAMA: "main",
  CARPETA: "clase-10-outliers-transformaciones/notebooks",
};

export const NOTEBOOKS = {
  estudiante: "clase10_estudiante.ipynb",
  docente: "clase10_docente.ipynb",
};

export function colabUrl(archivo) {
  if (!COLAB.REPO) return null;
  return `https://colab.research.google.com/github/${COLAB.REPO}/blob/${COLAB.RAMA}/${COLAB.CARPETA}/${archivo}`;
}

export const COLAB_SUBIR = "https://colab.research.google.com/#create=true";
