// 🔥 CACHE EN MEMORIA (mejora performance)
let cache = null;
let cacheTime = 0;

const CACHE_TTL = 60 * 1000; // 1 minuto

export async function GET(request) {
  try {
    const SHEET_ID = "1iblG9SpwGwhoPzyXNlZEOZteCa4upVgi9et4RBXg4Pk";

    const { searchParams } = new URL(request.url);
    const INTERES_BUSCADO = searchParams.get("interes");

    const now = Date.now();

    // =========================
    // 🔥 RESPUESTA CACHÉ (solo cuando NO hay filtro)
    // =========================
    if (!INTERES_BUSCADO && cache && now - cacheTime < CACHE_TTL) {
      return Response.json(cache);
    }

    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`;

    const res = await fetch(url);
    const text = await res.text();

    const json = JSON.parse(text.substr(47).slice(0, -2));
    const rows = json.table.rows;

    // =========================
    // 📊 MAPEO DE DATOS
    // =========================
    const data = rows.map((row) => ({
      correo: row.c[2]?.v,
      interes: row.c[3]?.v,
    }));

    // =========================
    // 📌 INTERESES ÚNICOS
    // =========================
    const interesesUnicos = [
      ...new Set(
        data
          .map((r) => r.interes)
          .filter(
            (i) =>
              i &&
              i !== "INTERÉS" &&
              i !== "COMPUTED_VALUE"
          )
      ),
    ];

    // =========================
    // 📌 SI NO HAY FILTRO → DEVUELVE LISTA GENERAL
    // =========================
    if (!INTERES_BUSCADO) {
      const response = {
        intereses: interesesUnicos,
      };

      // 🔥 guardar en cache
      cache = response;
      cacheTime = now;

      return Response.json(response);
    }

    // =========================
    // 📧 FILTRO DE EMAILS
    // =========================
    const emailsFiltrados = data
      .filter(
        (r) =>
          r.correo &&
          r.interes &&
          r.interes.toLowerCase().includes(INTERES_BUSCADO.toLowerCase())
      )
      .map((r) => r.correo);

    const emailsUnicos = [...new Set(emailsFiltrados)];

    // =========================
    // 📤 RESPUESTA FILTRADA
    // =========================
    return Response.json({
      total: emailsUnicos.length,
      emails: emailsUnicos.join(","),
      intereses: interesesUnicos,
    });

  } catch (error) {
    return Response.json({
      error: error.message,
    });
  }
}