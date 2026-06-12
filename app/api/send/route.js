// 🔥 CACHE EN MEMORIA
let cache = {
  data: null,
  time: 0
};

const CACHE_TTL = 60 * 1000; // 1 minuto

export async function GET(request) {
  try {
    const SHEET_ID = "1iblG9SpwGwhoPzyXNlZEOZteCa4upVgi9et4RBXg4Pk";

    const { searchParams } = new URL(request.url);
    const INTERES_BUSCADO = searchParams.get("interes");
    const now = Date.now();

    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`;

    let rows;

    // =========================
    // 🔥 CACHE
    // =========================
    if (cache.data && now - cache.time < CACHE_TTL) {
      rows = cache.data;
    } else {
      const res = await fetch(url);
      const text = await res.text();

      const json = JSON.parse(text.substr(47).slice(0, -2));
      rows = json.table.rows;

      cache.data = rows;
      cache.time = now;
    }

    // =========================
    // 📊 MAPEO
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
    // 📌 SIN FILTRO
    // =========================
    if (!INTERES_BUSCADO) {
      return Response.json({
        intereses: interesesUnicos,
      });
    }

    // =========================
    // 📧 FILTRO EMAILS
    // =========================
    const emailsUnicos = [
      ...new Set(
        data
          .filter(
            (r) =>
              r.correo &&
              r.interes &&
              r.interes.toLowerCase().includes(
                INTERES_BUSCADO.toLowerCase()
              )
          )
          .map((r) => r.correo)
      ),
    ];

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