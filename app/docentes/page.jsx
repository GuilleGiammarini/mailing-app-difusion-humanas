"use client";

import { useEffect, useState } from "react";

export default function DocentesPage() {
  const [docentes, setDocentes] = useState([]);
  const [filtros, setFiltros] = useState([]);
  const [filtroActivo, setFiltroActivo] = useState("");

  // 🔹 TRAER FILTROS
  useEffect(() => {
    fetch("/api/docentes")
      .then((res) => res.json())
      .then((data) => {
        setFiltros(data.filtros || []);
      });
  }, []);

  // 🔹 TRAER DOCENTES SEGÚN FILTRO
  useEffect(() => {
    if (!filtroActivo) return;

    fetch(`/api/docentes?filtro=${filtroActivo}`)
      .then((res) => res.json())
      .then((data) => {
        setDocentes(data.docentes || []);
      });
  }, [filtroActivo]);

  // 🔹 COPIAR EMAILS
  const copiarEmails = () => {
    const lista = docentes.map((d) => d.correo).join(",");
    navigator.clipboard.writeText(lista);
    alert("Emails copiados");
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      {/* 🔥 HEADER CON IMÁGENES */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 20,
          marginBottom: 20,
        }}
      >
        <img
          src="/Membrete-UNVMHumanas.jpg"
          alt="logo"
          style={{ height: 50 }}
        />

        <h1 style={{ color: "#005CA9", margin: 0 }}>
          UNVM · Sistema de Mailing
        </h1>

        <img
          src="/Membrete-UNVMHumanas.jpg"
          alt="logo"
          style={{ height: 50 }}
        />
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
        <button
          style={{
            backgroundColor: "#E0E0E0",
            color: "#333",
            border: "none",
            padding: "10px 18px",
            borderRadius: 6,
            cursor: "pointer",
            fontWeight: "bold",
          }}
          onClick={() => (window.location.href = "/")}
        >
          Alumnos
        </button>

        <button
          style={{
            backgroundColor: "#005CA9",
            color: "white",
            border: "none",
            padding: "10px 18px",
            borderRadius: 6,
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Docentes
        </button>
      </div>

      <div style={{ display: "flex", gap: 20 }}>
        {/* 🧱 IZQUIERDA */}
        <div style={{ width: "35%" }}>
          <h3>Datos Docentes</h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 10,
              maxHeight: "75vh",
              overflowY: "auto",
              paddingRight: 10,
            }}
          >
            {docentes.map((doc, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: "#EDEDED",
                  padding: "8px 10px",
                  borderRadius: 6,
                  fontSize: 12,
                  lineHeight: 1.2,
                }}
              >
                <div style={{ fontWeight: "bold" }}>
                  {doc.nombre}
                </div>

                <div style={{ fontSize: 11, color: "#555" }}>
                  {doc.carrera}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 🧱 DERECHA */}
        <div style={{ width: "65%" }}>
          <h3>Selecciona Designación</h3>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {filtros.map((f, i) => (
              <button
                key={i}
                onClick={() => setFiltroActivo(f)}
                style={{
                  backgroundColor:
                    filtroActivo === f ? "#005CA9" : "#E0E0E0",
                  color: filtroActivo === f ? "white" : "#333",
                  border: "none",
                  padding: "8px 14px",
                  borderRadius: 6,
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                {f}
              </button>
            ))}
          </div>

          <div style={{ marginTop: 20 }}>
            <h4>
              {filtroActivo} — {docentes.length} docentes
            </h4>

            <textarea
              value={docentes.map((d) => d.correo).join(",")}
              readOnly
              style={{
                width: "100%",
                height: 120,
                marginTop: 10,
              }}
            />

            <button
              onClick={copiarEmails}
              style={{
                marginTop: 10,
                backgroundColor: "#FFD600",
                border: "none",
                padding: "10px 15px",
                cursor: "pointer",
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