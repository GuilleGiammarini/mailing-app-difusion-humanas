"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/* 🧠 MAPA REAL */
const carrerasPorCategoria = {
  SALUD: [
    "MEDICINA",
    "ENFERMERÍA",
    "LIC. EN TERAPIA OCUPACIONAL",
  ],
  EDUCACIÓN: [
    "PSICOPEDAGOGÍA",
    "LIC GESTIÓN EDUCATIVA",
    "CIENCIAS DE LA EDUCACIÓN",
    "PROF LENGUA INGLESA",
    "PROF LENGUA Y LITERATURA",
    "LIC EN LENGUA Y LITERATURA",
    "LICENCIATURA EN EDUCACIÓN FISICA",
    "PROF EN MATEMÁTICA",
    "ESPACIO COMÚN A LOS PROFESORADOS",
    "LIC EN CIENCIAS",
    "CTFC",
    "TUILSA-E",
    "PEUAM",
    "LABORATORIO DE INVESTIGACION Y PRODUCCIÓN EN CS HUMANAS",
  ],
  ARTE: [
    "DISEÑO",
    "LIC EN COMPOSICION",
    "LIC INTERPRET VOCAL",
    "ESPECIALIZACION EN ARTE COMUNITARIO",
  ],
  POSGRADOS: [
    "ESPECIALIZACION EN DOCENCIA UNIVERSITARIA",
    "DOCTORADO EN PEDAGOGÍA",
    "ESPECIALIZACIÓN EN TECNOLOGÍAS DE LA INFORMACIÓN...",
  ],
  PUICYM: ["PUICYM"],
};

export default function DocentesPage() {
  const router = useRouter();

  const [docentes, setDocentes] = useState([]);
  const [filtros, setFiltros] = useState([]);
  const [filtroActivo, setFiltroActivo] = useState("");
  const [carreraActiva, setCarreraActiva] = useState("");

  /* 🔐 LOGIN */
  useEffect(() => {
    const auth = localStorage.getItem("auth");
    if (!auth) router.push("/");
  }, []);

  /* 🔹 FILTROS */
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

  /* 🔹 DOCENTES */
  useEffect(() => {
    if (!filtroActivo) return;

    setCarreraActiva("");

    fetch(`/api/docentes?filtro=${filtroActivo}`)
      .then((res) => res.json())
      .then((data) => {
        setDocentes(data.docentes || []);
      });
  }, [filtroActivo]);

  /* 🔧 NORMALIZADOR */
  const normalizar = (t) =>
    t
      .toUpperCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();

  /* 🔹 FILTRO FINAL */
  const docentesFiltrados = carreraActiva
    ? docentes.filter((d) =>
        (d.carrera || "")
          .split("|")
          .map((c) => normalizar(c))
          .includes(normalizar(carreraActiva))
      )
    : docentes;

  const carrerasDisponibles =
    carrerasPorCategoria[filtroActivo] || [];

  const copiarEmails = () => {
    const lista = docentesFiltrados.map((d) => d.correo).join(",");
    navigator.clipboard.writeText(lista);
    alert("Emails copiados");
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      
      {/* HEADER ORIGINAL */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
        marginBottom: 20,
      }}>
        <img src="/Membrete-UNVMHumanas.jpg" style={{ height: 50 }} />

        <h1 style={{ color: "#005CA9", margin: 0 }}>
          UNVM · Sistema de Mailing
        </h1>

        <img src="/Membrete-UNVMHumanas.jpg" style={{ height: 50 }} />
      </div>

      {/* BOTONES */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        gap: 10,
        marginBottom: 20,
      }}>
        <button
          onClick={() => router.push("/alumnos")}
          style={{
            backgroundColor: "#E0E0E0",
            padding: "10px 18px",
            borderRadius: 6,
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Alumnos
        </button>

        <button
          style={{
            backgroundColor: "#005CA9",
            color: "white",
            padding: "10px 18px",
            borderRadius: 6,
            fontWeight: "bold",
          }}
        >
          Docentes
        </button>

        <button
          onClick={() => {
            localStorage.removeItem("auth");
            router.push("/");
          }}
          style={{
            backgroundColor: "#d9534f",
            color: "#fff",
            padding: "10px 18px",
            borderRadius: 6,
            fontWeight: "bold",
          }}
        >
          Cerrar sesión
        </button>
      </div>

      {/* CONTENIDO */}
      <div style={{ display: "flex", gap: 20 }}>
        
        {/* IZQUIERDA (INTACTO) */}
        <div style={{ width: "35%" }}>
          <h3>Datos Docentes</h3>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 10,
            maxHeight: "75vh",
            overflowY: "auto",
          }}>
            {docentesFiltrados.map((doc, i) => (
              <div key={i} style={{
                backgroundColor: "#EDEDED",
                padding: 8,
                borderRadius: 6,
                fontSize: 12,
              }}>
                <div style={{ fontWeight: "bold" }}>
                  {doc.nombre}
                </div>
                <div style={{ fontSize: 11 }}>
                  {doc.carrera}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* DERECHA (MISMO ESTILO) */}
        <div style={{ width: "65%" }}>
          <h3>Selecciona Categoría</h3>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {filtros.map((f, i) => (
              <button
                key={i}
                onClick={() => setFiltroActivo(f)}
                style={{
                  backgroundColor: filtroActivo === f ? "#005CA9" : "#E0E0E0",
                  color: filtroActivo === f ? "white" : "#333",
                  padding: "8px 14px",
                  borderRadius: 6,
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                {f}
              </button>
            ))}
          </div>

          {/* 🔥 NUEVO PERO CON ESTILO ORIGINAL */}
          {filtroActivo && (
            <>
              <h3 style={{ marginTop: 20 }}>Filtrar por Carrera</h3>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                <button
                  onClick={() => setCarreraActiva("")}
                  style={{
                    backgroundColor: carreraActiva === "" ? "#333" : "#ddd",
                    color: carreraActiva === "" ? "white" : "#000",
                    padding: "6px 10px",
                    borderRadius: 6,
                    cursor: "pointer",
                  }}
                >
                  Todas
                </button>

                {carrerasDisponibles.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => setCarreraActiva(c)}
                    style={{
                      backgroundColor: carreraActiva === c ? "#333" : "#ddd",
                      color: carreraActiva === c ? "white" : "#000",
                      padding: "6px 10px",
                      borderRadius: 6,
                      cursor: "pointer",
                    }}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </>
          )}

          <div style={{ marginTop: 20 }}>
            <h4>
              {filtroActivo} {carreraActiva && `- ${carreraActiva}`} — {docentesFiltrados.length} docentes
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
                backgroundColor: "#FFD600",
                padding: 10,
                fontWeight: "bold",
              }}
            >
              Copiar emails
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}