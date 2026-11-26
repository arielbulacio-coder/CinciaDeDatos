import { BIBLIOGRAFIA, CRONOGRAMA, CURSO, EVALUACION, OBJETIVOS, UNIDADES } from "../data/curso.js";

export default function Home() {
  return (
    <>
      <section className="hero">
        <span className="eyebrow">Curso virtual · {CURSO.codigo}</span>
        <h1>{CURSO.nombre}</h1>
        <p>
          Programación en Python orientada al análisis de datos: de los fundamentos a un primer modelo en
          scikit-learn, con notebooks en Google Colab y buenas prácticas de reproducibilidad.
        </p>
        <div className="meta">
          <span>Docente: <b>{CURSO.docente}</b></span>
          <span>Carrera: <b>{CURSO.carrera}</b></span>
          <span>Carga horaria: <b>{CURSO.carga}</b></span>
          <span>Modalidad: <b>{CURSO.modalidad}</b></span>
        </div>
        <div className="acciones">
          <a className="btn ambar" href="#/clase/10/presentacion">Ir a la Clase 10 →</a>
          <a className="btn sec" style={{ color: "#fff", borderColor: "#fff" }} href="#/clase/10/laboratorio">Laboratorio interactivo</a>
        </div>
      </section>

      <section className="bloque">
        <span className="eyebrow">Programa</span>
        <h2>Al finalizar la asignatura vas a poder…</h2>
        <div className="grid g2">
          {OBJETIVOS.map((o, i) => (
            <div key={o} className="card" style={{ display: "flex", gap: 14 }}>
              <span className="unidad-n" style={{ fontSize: 22 }}>{i + 1}</span>
              <p style={{ margin: 0 }}>{o}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bloque">
        <span className="eyebrow">Contenidos</span>
        <h2>Seis unidades</h2>
        <div className="grid g3">
          {UNIDADES.map((u) => (
            <article key={u.n} className={`card ${u.n === 4 ? "ambar" : "acento"}`}>
              <span className="unidad-n">U{u.n}</span>
              <h3>{u.titulo}</h3>
              <ul>{u.temas.map((t) => <li key={t}>{t}</li>)}</ul>
              {u.n === 4 && <a className="btn" style={{ marginTop: 14 }} href="#/clase/10/presentacion">Clase 10 desarrollada →</a>}
            </article>
          ))}
        </div>
      </section>

      <section className="bloque">
        <span className="eyebrow">Cronograma</span>
        <h2>Clase a clase</h2>
        <div className="tabla-scroll">
          <table className="tabla">
            <thead><tr><th className="num">Clase</th><th>Unidad</th><th>Tema</th><th>Material</th></tr></thead>
            <tbody>
              {CRONOGRAMA.map((c) => (
                <tr key={c.clase} className={c.destacada ? "destacada" : c.tipo || ""}>
                  <td className="num">{c.clase}</td>
                  <td>{c.unidad}</td>
                  <td>{c.tema}</td>
                  <td>{c.destacada ? <a href="#/clase/10/presentacion">Abrir</a> : c.tipo ? "Evaluación" : "En preparación"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="bloque grid g2">
        <div className="card acento">
          <h3>Evaluación y aprobación</h3>
          <ul>{EVALUACION.map((e) => <li key={e}>{e}</li>)}</ul>
        </div>
        <div className="card acento">
          <h3>Bibliografía</h3>
          <p><b>Obligatoria.</b> {BIBLIOGRAFIA.obligatoria}</p>
          <p style={{ margin: 0 }}><b>Complementaria.</b> {BIBLIOGRAFIA.complementaria}</p>
        </div>
      </section>
    </>
  );
}
