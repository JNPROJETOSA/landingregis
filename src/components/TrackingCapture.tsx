"use client";

/**
 * Captura de origem (ref, cupom, UTM) no primeiro carregamento:
 * preserva na sessão e limpa a URL (preservando âncoras).
 * O mesmo par de chaves é lido por getStoredOrigin() no formulário e
 * no link de WhatsApp, garantindo que o código viaje com o usuário.
 */

const SCRIPT = `
(function(){
  try {
    var u = new URL(location.href);
    var sp = u.searchParams;
    var o = { utm: {} };
    var keys = [
      ["utm_source","source"],
      ["utm_medium","medium"],
      ["utm_campaign","campaign"],
      ["utm_term","term"],
      ["utm_content","content"]
    ];
    keys.forEach(function(k){ var v = sp.get(k[0]); if (v) o.utm[k[1]] = v; });
    var ref = sp.get("ref"); if (ref) o.ref = ref;
    var cupom = sp.get("cupom"); if (cupom) o.cupom = cupom;
    if (o.ref || o.cupom || Object.keys(o.utm).length) {
      var prev = null;
      try {
        prev = JSON.parse(sessionStorage.getItem("regisdencia.origin.v1") || "null");
      } catch (e) {}
      var merged = prev || { utm: {} };
      merged.utm = Object.assign({}, merged.utm, o.utm);
      if (o.ref) merged.ref = o.ref;
      if (o.cupom) merged.cupom = o.cupom;
      sessionStorage.setItem("regisdencia.origin.v1", JSON.stringify(merged));
      var s = new URLSearchParams(u.search);
      keys.forEach(function(k){ s.delete(k[0]); });
      s.delete("ref"); s.delete("cupom");
      var q = s.toString();
      history.replaceState(null, "", u.pathname + (q ? "?" + q : "") + u.hash);
    }
  } catch (e) {}
})();
`;

export function TrackingCapture() {
  return <script dangerouslySetInnerHTML={{ __html: SCRIPT }} />;
}
