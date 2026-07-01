// 🔥 CACHE EN MEMORIA
let cache = {
  data: null,
  time: 0
};

const CACHE_TTL = 60 * 1000; // 1 minuto

// 🔥 NORMALIZADOR (ANTI BUGS)
const normalize = (str) =>
  (str || "")
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

// 🔥 AGRUPACIONES DE INTERESES
const CATEGORY_EXPANSION = {
  IDIOMAS: ["INGLÉS", "PORTUGUÉS", "FRANCÉS", "ITALIANO", "ALEMÁN"],
  COMUNICACION_DIGITAL: ["AUDIOVISUAL", "STREAMING", "FOTOGRAFÍA"],
  EDUCACION: ["DOCENCIA", "EDUCACIÓN", "EDUCACION"],
  LENGUA_DE_SEÑAS: ["LENGUA DE SEÑAS"],
  EDUCACION_FISICA: ["EDUCACION FISICA", "DEPORTES", "RUGBY", "FÚTBOL"],
  LENGUA_LITERATURA: ["LENGUA Y LITERATURA"],
  TECNOLOGIA_EDUCATIVA: ["EDUCACIÓN_TECNOLOGIA"],

};

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
    // 🔥 EXPANSIÓN DE CATEGORÍA
    // =========================
    let interesesABuscar = [];

    if (CATEGORY_EXPANSION[INTERES_BUSCADO]) {
      interesesABuscar = CATEGORY_EXPANSION[INTERES_BUSCADO];
    } else {
      interesesABuscar = [INTERES_BUSCADO];
    }

    // 🔥 NORMALIZAR TODO
    const interesesNormalizados = interesesABuscar.map(normalize);

    // =========================
    // 📧 FILTRO EMAILS
    // =========================
    const emailsUnicos = [
      ...new Set(
        data
          .filter((r) => {
            if (!r.correo || !r.interes) return false;

            const interesFila = normalize(r.interes);

            return interesesNormalizados.some((interes) =>
              interesFila.includes(interes)
            );
          })
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