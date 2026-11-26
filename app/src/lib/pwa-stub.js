// En la versión pendrive (archivo único, abierto con file://) no hay service worker.
export function registerSW() {
  return () => {};
}
