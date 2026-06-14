// 🔥 CACHE EN MEMORIA
let cache = {
  data: null,
  time: 0,
};

const CACHE_TTL = 60 * 1000;

export async function GET(request) {
  try {
    const SHEET_ID = "1iblG9SpwGwhoPzyXNlZEOZteCa4upVgi9et4RBXg4Pk";
    const SHEET_NAME = "UNIFICACIÓN MAILS HUMANAS DOCENTES";

    const { searchParams } = new URL(request.url);
    const FILTRO = searchParams.get("filtro");

    const now = Date.now();

    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(
      SHEET_NAME
    )}`;

    let rows;

    // 🔹 CACHE
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
    // 📊 MAPEO DOCENTES
    // =========================
    const data = rows.map((row) => {
      const correo = row.c[5]?.v || "";

      return {
        nombre: row.c[0]?.v || "",
        carrera: row.c[1]?.v || "",
        correo: correo,
        estadoCorreo: correo ? "OK" : "SIN EMAIL",
        filtro: row.c[7]?.v
          ? row.c[7].v.toString().trim().toUpperCase()
          : "",
      };
    });

    // =========================
    // 📌 FILTROS ÚNICOS
    // =========================
    const filtrosUnicos = [
      ...new Set(
        data
          .map((r) => r.filtro)
          .filter((f) => f && f !== "FILTRO DESIGNACIÓN")
      ),
    ];

    // =========================
    // 📌 FILTRAR DOCENTES
    // =========================
    let docentesFiltrados = data;

    if (FILTRO) {
      docentesFiltrados = data.filter((r) =>
        r.filtro.toLowerCase().includes(FILTRO.toLowerCase())
      );
    }

    // 🔥 SIEMPRE DEVOLVER DOCENTES
    return Response.json({
      total: docentesFiltrados.length,
      docentes: docentesFiltrados,
      filtros: filtrosUnicos,
    });

  } catch (error) {
    return Response.json({
      error: error.message,
      docentes: [],
      filtros: [],
    });
  }
}