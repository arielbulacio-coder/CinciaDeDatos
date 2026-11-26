import { useEffect, useState } from "react";
import Clase10 from "./pages/Clase10.jsx";
import Home from "./pages/Home.jsx";

import Presentador from "./presentacion/Presentador.jsx";
import Orador from "./presentacion/Orador.jsx";

// Enrutamiento por hash: funciona igual en la PWA y abriendo el archivo
// desde un pendrive (file://), sin configurar un servidor.
function useRuta() {
  const leer = () => (location.hash.replace(/^#/, "") || "/").split("?")[0];
  const [ruta, setRuta] = useState(leer);
  useEffect(() => {
    const cambio = () => { setRuta(leer()); window.scrollTo(0, 0); };
    window.addEventListener("hashchange", cambio);
    return () => window.removeEventListener("hashchange", cambio);
  }, []);
  return ruta;
}

function useInstalacion() {
  const [evento, setEvento] = useState(null);
  const [online, setOnline] = useState(navigator.onLine);
  useEffect(() => {
    const antes = (e) => { e.preventDefault(); setEvento(e); };
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("beforeinstallprompt", antes);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("beforeinstallprompt", antes);
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);
  const instalar = async () => {
    if (!evento) return;
    evento.prompt();
    await evento.userChoice;
    setEvento(null);
  };
  return { puedeInstalar: Boolean(evento), instalar, online };
}

function Topbar({ ruta }) {
  const { puedeInstalar, instalar, online } = useInstalacion();
  const enlaces = [
    ["#/", "Curso", ruta === "/"],
    ["#/clase/10/presentacion", "Clase 10", ruta.startsWith("/clase/10")],
  ];
  return (
    <header className="topbar">
      <div className="topbar-in">
        <a className="marca" href="#/">
          <img src="./icon.svg" alt="" />
          <span><b>Python para Ciencia de Datos</b><small>UADE · Lic. en IA y Ciencia de Datos</small></span>
        </a>
        {!online && <span className="offline-chip">Sin conexión · modo offline</span>}
        <nav>
          {enlaces.map(([href, txt, activo]) => (
            <a key={href} href={href} className={activo ? "activo" : ""}>{txt}</a>
          ))}
          {puedeInstalar && <button className="btn-instalar" onClick={instalar}>Instalar app</button>}
        </nav>
      </div>
    </header>
  );
}

export default function App() {
  const ruta = useRuta();

  if (ruta.startsWith("/presentar")) {
    const n = Number(ruta.split("/")[2] || 1);
    return <Presentador inicio={Math.max(0, n - 1)} />;
  }
  if (ruta === "/orador") {
    return <Orador />;
  }

  const m = ruta.match(/^\/clase\/10(?:\/(\w+))?/);
  return (
    <>
      <Topbar ruta={ruta} />
      <main>{m ? <Clase10 pestana={m[1] || "presentacion"} /> : <Home />}</main>
      <footer className="pie">
        UADE · Facultad de Ingeniería y Ciencias Exactas · Python para Ciencia de Datos (3.4.258) · Prof. Lic. Ariel Bulacio
      </footer>
    </>
  );
}
