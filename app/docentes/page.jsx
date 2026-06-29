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

  const [docentes, setDocentes] = useState([]);
  const [filtros, setFiltros] = useState([]);
  const [filtroActivo, setFiltroActivo] = useState("");
  const [carreraActiva, setCarreraActiva] = useState("");

  useEffect(() => {
    const auth = localStorage.getItem("auth");
    if (!auth) router.push("/");
  }, []);

  useEffect(() => {
    fetch("/api/docentes")
      .then((res) => res.json())
      .then((data) => {
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

  useEffect(() => {
    if (!filtroActivo) return;

    setCarreraActiva("");

    fetch(`/api/docentes?filtro=${filtroActivo}`)
      .then((res) => res.json())
      .then((data) => setDocentes(data.docentes || []));
  }, [filtroActivo]);

  const normalizar = (t) =>
    t
      .toUpperCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();

  const docentesFiltrados = carreraActiva
    ? docentes.filter((d) =>
        (d.carrera || "")
          .split("|")
          .map((c) => normalizar(c))
          .includes(normalizar(carreraActiva))
      )
    : docentes;

  const carrerasDisponibles = carrerasPorCategoria[filtroActivo] || [];

  const copiarEmails = () => {
    navigator.clipboard.writeText(
      docentesFiltrados.map((d) => d.correo).join(",")
    );
  };

  const limpiarFiltros = () => {
    setFiltroActivo("");
    setCarreraActiva("");
    setDocentes([]);
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

            <div style={{ maxHeight: "75vh", overflowY: "auto" }}>
              {docentesFiltrados.map((doc, i) => (
                <div key={i} style={card()}>
                  <b>{doc.nombre}</b>
                  <div style={{ fontSize: 12 }}>{doc.carrera}</div>
                </div>
              ))}
            </div>
          </div>

          {/* DERECHA */}
          <div style={glass()}>
            <h3 style={{ color: "white" }}>Categorías</h3>

            {/* 🔥 BOTÓN LIMPIAR */}
            <button
              onClick={limpiarFiltros}
              disabled={!filtroActivo && !carreraActiva}
              style={{
                background: (!filtroActivo && !carreraActiva)
                  ? "rgba(255,255,255,0.3)"
                  : "#ff4d4f",
                color: "white",
                padding: "8px 12px",
                borderRadius: 6,
                fontWeight: "bold",
                cursor: (!filtroActivo && !carreraActiva)
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
                {filtroActivo} — {docentesFiltrados.length} docentes
              </h4>

              <textarea
                value={docentesFiltrados.map((d) => d.correo).join(",")}
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
  background: "rgba(255,255,255,0.9)",
  padding: 10,
  borderRadius: 8,
  marginBottom: 8,
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