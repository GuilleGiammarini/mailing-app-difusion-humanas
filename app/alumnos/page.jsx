"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

/* =========================
   CATEGORÍAS
========================= */
const CATEGORY_MAP = {
  SALUD: ["ENFERMERÍA", "SALUD MENTAL", "MEDICINA", "ALZHEIMER", "ESTRÉS", "TERAPIA OCUPACIONAL", "LEY SALUD MENTAL", "NUTRICIÓN"],
  IDIOMAS: ["INGLÉS", "PORTUGUÉS", "FRANCÉS", "ITALIANO", "ALEMÁN"],
  IDIOMAS_EDUCACION: ["LENGUAJE DE SEÑAS"],
  EDUCACION: ["DOCENCIA", "EDUCACIÓN"],
  EDUCACION_FISICA: ["EDUCACION FISICA", "DEPORTES", "RUGBY", "FÚTBOL"],
  ARTE_COMUNITARIO: ["ARTE", "PATRIMONIO"],
  COMUNICACION_DIGITAL: ["AUDIOVISUAL", "STREAMING", "FOTOGRAFÍA"],
  HUMANIDADES: ["JORNADAS MEDIAEVALIA", "DIPLO CS HUMANAS", "JORNADAS GRADUADXS HUMANAS"],
  TECNOLOGIA_EDUCATIVA: ["TIC", "TECNOLOGÍA", "PLATAFORMAS", "RECURSOS EDUCATIVOS", "STREAMING"],
  LENGUA_LITERATURA: ["LENGUA Y LITERATURA"],
  MUSICA: ["MUSICA"],
  MATEMATICA: ["MATEMATICA"],
  OTROS: ["OTROS"]
};

export default function AlumnosPage() {
  const router = useRouter();

  useEffect(() => {
    const auth = localStorage.getItem("auth");
    if (!auth) router.push("/");
  }, []);

  const logout = () => {
    localStorage.removeItem("auth");
    router.push("/");
  };

  const [interes, setInteres] = useState(null);
  const [total, setTotal] = useState(0);
  const [intereses, setIntereses] = useState([]);
  const [categoriaActiva, setCategoriaActiva] = useState(null);

  const [emailChunks, setEmailChunks] = useState([]);
  const [chunkIndex, setChunkIndex] = useState(0);

  useEffect(() => {
    fetch("/api/send")
      .then((r) => r.json())
      .then((d) => setIntereses(d.intereses || []));
  }, []);

  useEffect(() => {
    if (interes) {
      fetch(`/api/send?interes=${interes}`)
        .then((r) => r.json())
        .then((d) => {
          const allEmails = (d.emails || "")
            .split(",")
            .map((e) => e.trim())
            .filter(Boolean);

          const chunks = [];
          for (let i = 0; i < allEmails.length; i += 100) {
            chunks.push(allEmails.slice(i, i + 100));
          }

          setEmailChunks(chunks);
          setChunkIndex(0);
          setTotal(d.total || 0);
        });
    }
  }, [interes]);

  const copiar = () => {
    const current = emailChunks[chunkIndex]?.join(",") || "";
    navigator.clipboard.writeText(current);
  };

  /* 🔥 LIMPIAR FILTROS */
  const limpiarFiltros = () => {
    setInteres(null);
    setCategoriaActiva(null);
    setEmailChunks([]);
    setChunkIndex(0);
    setTotal(0);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: "url('/FONDO_alumnos.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        position: "relative",
        padding: 20,
        display: "flex",
        justifyContent: "center",
        fontFamily: "Arial",
      }}
    >
      {/* OVERLAY */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.35)",
          zIndex: 0,
        }}
      />

      {/* CONTENIDO */}
      <div
        style={{
          width: "100%",
          maxWidth: 1200,
          display: "flex",
          gap: 20,
          position: "relative",
          zIndex: 1,
        }}
      >

        {/* SIDEBAR */}
        <div style={glass()}>
          <h2 style={{ color: "white" }}>Categorías</h2>

          {Object.keys(CATEGORY_MAP).map((cat) => (
            <div
              key={cat}
              onMouseEnter={() => setCategoriaActiva(cat)}
              onClick={() => setCategoriaActiva(cat)}
              style={pill(cat === categoriaActiva)}
            >
              {cat}
            </div>
          ))}

          <button
            onClick={limpiarFiltros}
            style={{
              marginTop: 15,
              width: "100%",
              padding: "10px",
              borderRadius: 10,
              border: "none",
              cursor: "pointer",
              background: "#ff4d4d",
              color: "white",
              fontWeight: "bold"
            }}
          >
            Limpiar filtros
          </button>

          <div style={innerGlass()}>
            {categoriaActiva ? (
              <>
                <h4 style={{ color: "white" }}>{categoriaActiva}</h4>
                <ul style={{ color: "white" }}>
                  {CATEGORY_MAP[categoriaActiva].map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              </>
            ) : (
              <p style={{ color: "white" }}>
                Pasa el mouse o selecciona categoría
              </p>
            )}
          </div>
        </div>

        {/* MAIN */}
        <div style={glass(true)}>

          {/* HEADER */}
          <div style={header()}>
            <img src="/Membrete-UNVMHumanas.png" style={{ height: 60 }} />
            <h1 style={{ color: "white" }}>
              UNVM · Sistema de Mailing
            </h1>
            <img src="/Membrete-UNVMHumanas.png" style={{ height: 60 }} />
          </div>

          {/* BOTONES */}
          <div style={row()}>
            <Link href="/alumnos">
              <button style={btnPrimary}>Alumnos</button>
            </Link>

            <Link href="/docentes">
              <button style={btnSecondary}>Docentes</button>
            </Link>

            <button onClick={logout} style={btnDanger}>
              Cerrar sesión
            </button>
          </div>

          {/* INTERESES */}
          <div style={innerGlass()}>
            <h3 style={{ color: "white" }}>Seleccionar interés</h3>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {intereses.map((i) => (
                <button
                  key={i}
                  onClick={() => setInteres(i)}
                  style={pill(i === interes)}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>

          {/* EMAILS */}
          {interes && (
            <div style={innerGlass()}>
              <h3 style={{ color: "white" }}>
                {interes} — {total} emails
              </h3>

              <p style={{ color: "white" }}>
                Bloque {chunkIndex + 1} de {emailChunks.length}
              </p>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {emailChunks.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setChunkIndex(i)}
                    style={pill(i === chunkIndex)}
                  >
                    Bloque {i + 1}
                  </button>
                ))}
              </div>

              <textarea
                value={emailChunks[chunkIndex]?.join(",") || ""}
                readOnly
                style={{
                  width: "100%",
                  height: 150,
                  marginTop: 10,
                  borderRadius: 10,
                  padding: 10,
                  background: "rgba(255,255,255,0.9)",
                  border: "none",
                }}
              />

              <button onClick={copiar} style={btnPrimary}>
                Copiar bloque
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

/* =========================
   GLASS HELPERS
========================= */

const glass = (main = false) => ({
  width: main ? "100%" : 280,
  padding: 15,
  borderRadius: 16,
  background: "rgba(255,255,255,0.12)",
  backdropFilter: "blur(14px)",
  boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
  border: "1px solid rgba(255,255,255,0.2)",
});

const innerGlass = () => ({
  marginTop: 15,
  padding: 12,
  borderRadius: 12,
  background: "rgba(255,255,255,0.08)",
  border: "1px solid rgba(255,255,255,0.15)",
});

const header = () => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: 20,
  marginBottom: 15,
});

const row = () => ({
  display: "flex",
  justifyContent: "center",
  gap: 10,
  marginBottom: 20,
});

const btnPrimary = {
  backgroundColor: "#005CA9",
  color: "white",
  padding: "10px 18px",
  borderRadius: 10,
  border: "none",
  cursor: "pointer",
};

const btnSecondary = {
  backgroundColor: "rgba(255,255,255,0.2)",
  color: "white",
  padding: "10px 18px",
  borderRadius: 10,
  border: "1px solid rgba(255,255,255,0.3)",
  cursor: "pointer",
};

const btnDanger = {
  backgroundColor: "#d9534f",
  color: "#fff",
  padding: "10px 18px",
  borderRadius: 10,
  border: "none",
  cursor: "pointer",
};

const pill = (active) => ({
  padding: "8px 12px",
  borderRadius: 20,
  border: "1px solid rgba(255,255,255,0.2)",
  cursor: "pointer",
  background: active ? "#005CA9" : "rgba(255,255,255,0.12)",
  color: "white",
});