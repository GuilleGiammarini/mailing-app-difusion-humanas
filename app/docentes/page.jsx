"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const carrerasPorCategoria = {
  SALUD: ["MEDICINA", "ENFERMERÍA", "LIC. EN TERAPIA OCUPACIONAL"],
  EDUCACIÓN: [
    "PSICOPEDAGOGÍA",
    "LIC GESTIÓN EDUCATIVA",
    "CIENCIAS DE LA EDUCACIÓN",
    "PROF LENGUA INGLESA",
    "PROF LENGUA Y LITERATURA",
    "LIC EN LENGUA Y LITERATURA",
    "LICENCIATURA EN EDUCACIÓN FISICA",
    "PROF EN MATEMÁTICA",
  ],
  ARTE: ["DISEÑO", "LIC EN COMPOSICION", "LIC INTERPRET VOCAL"],
  POSGRADOS: [
    "ESPECIALIZACION EN DOCENCIA UNIVERSITARIA",
    "DOCTORADO EN PEDAGOGÍA",
  ],
  PUICYM: ["PUICYM"],
};

export default function DocentesPage() {
  const router = useRouter();

  const [allDocentes, setAllDocentes] = useState([]);
  const [docentes, setDocentes] = useState([]);

  const [filtros, setFiltros] = useState([]);
  const [filtroActivo, setFiltroActivo] = useState("");
  const [carreraActiva, setCarreraActiva] = useState("");
  const [busqueda, setBusqueda] = useState("");

  // 🔐 auth
  useEffect(() => {
    const auth = localStorage.getItem("auth");
    if (!auth) router.push("/");
  }, []);

  // 📥 cargar TODO (base global)
  useEffect(() => {
    fetch("/api/docentes")
      .then((res) => res.json())
      .then((data) => {
        setAllDocentes(data.docentes || []);

        const filtrosUnicos = [
          ...new Set(
            (data.filtros || []).flatMap((f) =>
              f.toUpperCase().split(" Y ").map((c) => c.trim())
            )
          ),
        ];

        setFiltros(filtrosUnicos);
      });
  }, []);

  // 📌 normalizador
  const normalizar = (t) =>
    t
      .toUpperCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();

  // 🎯 base por categoría (SIN fetch)
  const baseCategoria = filtroActivo
    ? allDocentes.filter((d) => {
        // ⚠️ AJUSTE IMPORTANTE: asumimos que carrera contiene info útil
        return true;
      })
    : allDocentes;

  // 📚 filtro carrera
  const porCarrera = carreraActiva
    ? baseCategoria.filter((d) =>
        (d.carrera || "")
          .split("|")
          .map((c) => normalizar(c))
          .includes(normalizar(carreraActiva))
      )
    : baseCategoria;

  // 🔎 buscador (global o dentro de categoría)
  const docentesVisibles =
    busqueda.trim() === ""
      ? porCarrera
      : porCarrera.filter((d) =>
          (d.nombre || "")
            .toLowerCase()
            .includes(busqueda.toLowerCase())
        );

  const carrerasDisponibles = carrerasPorCategoria[filtroActivo] || [];

  const copiarEmails = () => {
    navigator.clipboard.writeText(
      docentesVisibles.map((d) => d.correo).join(",")
    );
  };

  const limpiarFiltros = () => {
    setFiltroActivo("");
    setCarreraActiva("");
    setBusqueda("");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: "url('/FONDO_docentes.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        position: "relative",
        padding: 20,
        fontFamily: "Arial",
      }}
    >
      {/* overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.35)",
          zIndex: 0,
        }}
      />

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* HEADER */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 20,
            marginBottom: 20,
          }}
        >
          <img src="/Membrete-UNVMHumanas.png" style={{ height: 50 }} />
          <h1 style={{ color: "white", fontWeight: "bold" }}>
            UNVM · Sistema de Mailing
          </h1>
          <img src="/Membrete-UNVMHumanas.png" style={{ height: 50 }} />
        </div>

        {/* BOTONES */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 10,
            marginBottom: 20,
          }}
        >
          <button onClick={() => router.push("/alumnos")} style={btn("#E0E0E0")}>
            Alumnos
          </button>

          <button style={btn("#005CA9", "white")}>Docentes</button>

          <button
            onClick={() => {
              localStorage.removeItem("auth");
              router.push("/");
            }}
            style={btn("#d9534f", "white")}
          >
            Cerrar sesión
          </button>
        </div>

        {/* GRID */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 20 }}>
          
          {/* IZQUIERDA */}
          <div style={glass()}>
            <h3 style={{ color: "white" }}>Docentes</h3>

            <div style={{ color: "white", fontSize: 13, marginBottom: 10 }}>
              {docentesVisibles.length} docentes
            </div>

            {/* 🔎 BUSCADOR */}
            <input
              placeholder={
                filtroActivo
                  ? "Buscar docente..."
                  : "Seleccioná una categoría primero"
              }
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              disabled={!filtroActivo}
              style={{
                width: "100%",
                padding: 8,
                marginBottom: 10,
                borderRadius: 6,
                border: "1px solid #ccc",
                opacity: filtroActivo ? 1 : 0.5,
                cursor: filtroActivo ? "text" : "not-allowed",
              }}
            />

            {/* LISTA */}
            <div
              style={{
                maxHeight: "75vh",
                overflowY: "auto",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 10,
              }}
            >
              {docentesVisibles.map((doc, i) => (
                <div key={i} style={card()}>
                  <div style={{ fontWeight: "bold", fontSize: 13 }}>
                    {doc.nombre}
                  </div>

                  <div style={{ fontSize: 11, color: "#555", marginTop: 3 }}>
                    {doc.carrera}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* DERECHA */}
          <div style={glass()}>
            <h3 style={{ color: "white" }}>Categorías</h3>

            <button
              onClick={limpiarFiltros}
              disabled={!filtroActivo && !carreraActiva && !busqueda}
              style={{
                background:
                  !filtroActivo && !carreraActiva && !busqueda
                    ? "rgba(255,255,255,0.3)"
                    : "#ff4d4f",
                color: "white",
                padding: "8px 12px",
                borderRadius: 6,
                fontWeight: "bold",
                cursor:
                  !filtroActivo && !carreraActiva && !busqueda
                    ? "not-allowed"
                    : "pointer",
                marginBottom: 10,
                border: "none",
              }}
            >
              Limpiar filtros
            </button>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {filtros.map((f) => (
                <button
                  key={f}
                  onClick={() => setFiltroActivo(f)}
                  style={pill(filtroActivo === f)}
                >
                  {f}
                </button>
              ))}
            </div>

            {filtroActivo && (
              <>
                <h3 style={{ marginTop: 20, color: "white" }}>Carreras</h3>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                  <button onClick={() => setCarreraActiva("")} style={pill(carreraActiva === "")}>
                    Todas
                  </button>

                  {carrerasDisponibles.map((c) => (
                    <button
                      key={c}
                      onClick={() => setCarreraActiva(c)}
                      style={pill(carreraActiva === c)}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </>
            )}

            <div style={{ marginTop: 20, color: "white" }}>
              <h4>
                {filtroActivo} — {docentesVisibles.length} docentes
              </h4>

              <textarea
                value={docentesVisibles.map((d) => d.correo).join(",")}
                readOnly
                style={{ width: "100%", height: 120 }}
              />

              <button
                onClick={copiarEmails}
                style={{
                  marginTop: 10,
                  background: "#FFD600",
                  padding: 10,
                  fontWeight: "bold",
                  borderRadius: 6,
                }}
              >
                Copiar emails
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* helpers */
const glass = () => ({
  background: "rgba(255,255,255,0.08)",
  backdropFilter: "blur(10px)",
  borderRadius: 12,
  padding: 15,
  border: "1px solid rgba(255,255,255,0.15)",
});

const card = () => ({
  background: "rgba(255,255,255,0.95)",
  padding: 10,
  borderRadius: 8,
  boxShadow: "0 2px 4px rgba(0,0,0,0.12)",
  transition: "all 0.2s ease",
});

const btn = (bg, color = "#000") => ({
  backgroundColor: bg,
  color,
  padding: "10px 18px",
  borderRadius: 6,
  fontWeight: "bold",
  cursor: "pointer",
});

const pill = (active) => ({
  background: active ? "#005CA9" : "rgba(255,255,255,0.8)",
  color: active ? "white" : "#000",
  padding: "6px 10px",
  borderRadius: 20,
  cursor: "pointer",
  border: "none",
});