import { useEffect, useState } from "react";

export const OPCIONES = [
  ["A", "Lo borro"],
  ["B", "Lo corrijo"],
  ["C", "Lo dejo como está"],
  ["D", "Depende…"],
];

const leer = (clave) => {
  try {
    return JSON.parse(localStorage.getItem(`voto-${clave}`)) || { A: 0, B: 0, C: 0, D: 0 };
  } catch {
    return { A: 0, B: 0, C: 0, D: 0 };
  }
};

const guardar = (clave, v) => {
  try { localStorage.setItem(`voto-${clave}`, JSON.stringify(v)); } catch { /* sin almacenamiento */ }
};

/**
 * Votación en vivo. El docente carga los votos que llegan por el chat
 * (un clic por voto). Se guardan en el navegador para comparar la votación
 * inicial con la del cierre.
 */
export function Votacion({ clave, comparar, compacto = false }) {
  const [votos, setVotos] = useState(() => leer(clave));
  const [previos, setPrevios] = useState(() => (comparar ? leer(comparar) : null));

  useEffect(() => {
    if (!comparar) return undefined;
    const t = setInterval(() => setPrevios(leer(comparar)), 1000);
    return () => clearInterval(t);
  }, [comparar]);

  const sumar = (op) => {
    const nuevo = { ...votos, [op]: votos[op] + 1 };
    setVotos(nuevo);
    guardar(clave, nuevo);
  };
  const reiniciar = () => {
    const cero = { A: 0, B: 0, C: 0, D: 0 };
    setVotos(cero);
    guardar(clave, cero);
  };

  const total = Object.values(votos).reduce((a, b) => a + b, 0);
  const totalPrev = previos ? Object.values(previos).reduce((a, b) => a + b, 0) : 0;
  const pct = (n, t) => (t ? Math.round((100 * n) / t) : 0);

  return (
    <div className={`s-votacion ${compacto ? "compacto" : ""}`}>
      <div className="s-opciones">
        {OPCIONES.map(([op, txt]) => (
          <button key={op} className={`s-pill-btn ${op === "D" ? "ambar" : ""}`} onClick={() => sumar(op)}
            title="Sumar un voto">
            <b>{op}</b> · {txt}
            {total > 0 && <span className="s-conteo">{votos[op]}</span>}
          </button>
        ))}
      </div>
      {comparar && (
        <table className="s-tabla s-comparar">
          <thead><tr><th>Opción</th><th className="num">Inicio</th><th className="num">Cierre</th></tr></thead>
          <tbody>
            {OPCIONES.map(([op]) => (
              <tr key={op}>
                <td>{op}</td>
                <td className="num">{pct(previos[op], totalPrev)} %</td>
                <td className="num"><b>{pct(votos[op], total)} %</b></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <button className="s-reiniciar" onClick={reiniciar}>Reiniciar votos ({total})</button>
    </div>
  );
}
