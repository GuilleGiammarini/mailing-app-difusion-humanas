"use client";
import { useEffect, useState } from "react";

/* =========================
   CATEGORÍAS (NUEVO PANEL)
========================= */
const CATEGORY_MAP = {
  SALUD: [
    "ENFERMERÍA",
    "SALUD MENTAL",
    "MEDICINA",
    "ALZHEIMER",
    "ESTRÉS",
    "TERAPIA OCUPACIONAL",
    "LEY SALUD MENTAL",
    "NUTRICIÓN"
  ],

  IDIOMAS: [
    "INGLÉS",
    "PORTUGUÉS",
    "FRANCÉS",
    "ITALIANO",
    "ALEMÁN"
  ],

  IDIOMAS_EDUCACION:[
    "LENGUAJE DE SEÑAS"
  ],

  EDUCACION: [
    "DOCENCIA",
    "EDUCACIÓN"
  ],

  EDUCACION_FISICA: [
    "EDUCACION FISICA",
    "DEPORTES",
    "RUGBY",
    "FÚTBOL"
  ],

  ARTE_COMUNITARIO: [
    "ARTE",
    "PATRIMONIO"
  ],

  COMUNICACION_DIGITAL: [
    "AUDIOVISUAL",
    "STREAMING",
    "FOTOGRAFÍA"
  ],

    HUMANIDADES: [
    "JORNADAS MEDIAEVALIA",
    "DIPLO CS HUMANAS",
    "LENGUA Y LITERATURA",
    "JORNADAS GRADUADXS HUMANAS"
  ],

  TECNOLOGIA_EDUCATIVA: [
    "TIC",
    "TECNOLOGÍA",
    "PLATAFORMAS",
    "RECURSOS EDUCATIVOS",
    "STREAMING"
  ],

  MUSICA: [
    "MUSICA"
  ],
  
  OTROS: [
    "OTROS"
  ]
};

export default function Home() {
  const [interes, setInteres] = useState(null);
  const [emails, setEmails] = useState("");
  const [total, setTotal] = useState(0);
  const [intereses, setIntereses] = useState([]);
  const [categoriaActiva, setCategoriaActiva] = useState(null);

  /* =========================
     TRAER INTERESES
  ========================= */
  useEffect(() => {
    fetch("/api/send")
      .then((res) => res.json())
      .then((data) => setIntereses(data.intereses || []));
  }, []);

  /* =========================
     TRAER EMAILS
  ========================= */
  useEffect(() => {
    if (interes) {
      fetch(`/api/send?interes=${interes}`)
        .then((res) => res.json())
        .then((data) => {
          setEmails(data.emails || "");
          setTotal(data.total || 0);
        });
    }
  }, [interes]);

  const copiar = () => {
    navigator.clipboard.writeText(emails);
  };

  return (
    <div
      style={{
        display: "flex",
        maxWidth: 1200,
        margin: "40px auto",
        gap: 20,
        fontFamily: "Arial"
      }}
    >
      {/* =========================
          SIDEBAR CATEGORÍAS
      ========================= */}
      <div style={{ width: 280 }}>
        <h2 style={{ color: "#005CA9" }}>Categorías</h2>

        {Object.keys(CATEGORY_MAP).map((cat) => (
          <div
            key={cat}
            onMouseEnter={() => setCategoriaActiva(cat)}
            onClick={() => setCategoriaActiva(cat)}
            style={{
              padding: 12,
              marginBottom: 8,
              borderRadius: 8,
              cursor: "pointer",
              background: categoriaActiva === cat ? "#005CA9" : "#eee",
              color: categoriaActiva === cat ? "#fff" : "#000",
              fontWeight: "bold"
            }}
          >
            {cat}
          </div>
        ))}

        {/* PANEL EXPLICATIVO */}
        <div
          style={{
            marginTop: 20,
            padding: 15,
            border: "1px solid #ddd",
            borderRadius: 10,
            minHeight: 150
          }}
        >
          {categoriaActiva ? (
            <>
              <h4>{categoriaActiva}</h4>
              <ul>
                {CATEGORY_MAP[categoriaActiva].map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </>
          ) : (
            <p>Pasa el mouse o selecciona una categoría</p>
          )}
        </div>
      </div>

      {/* =========================
          TU SISTEMA ORIGINAL
      ========================= */}
      <div style={{ flex: 1 }}>
        <h1 style={{ color: "#005CA9", textAlign: "center" }}>
          UNVM · Sistema de Mailing
        </h1>

        <div
          style={{
            background: "#fff",
            padding: 25,
            borderRadius: 12,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            marginBottom: 20
          }}
        >
          <h3>Seleccionar interés</h3>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {intereses.map((i, index) => (
              <button
                key={index}
                onClick={() => setInteres(i)}
                style={{
                  padding: "10px 15px",
                  borderRadius: 8,
                  border: "none",
                  cursor: "pointer",
                  fontWeight: "bold",
                  backgroundColor: interes === i ? "#005CA9" : "#E5E7EB",
                  color: interes === i ? "#fff" : "#111"
                }}
              >
                {i}
              </button>
            ))}
          </div>
        </div>

        {interes && (
          <div
            style={{
              background: "#fff",
              padding: 25,
              borderRadius: 12,
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
            }}
          >
            <h3>
              {interes} — {total} emails
            </h3>

            <textarea
              value={emails}
              readOnly
              rows={8}
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 8,
                border: "1px solid #ccc",
                marginBottom: 10
              }}
            />

            <button
              onClick={copiar}
              style={{
                padding: "10px 15px",
                borderRadius: 8,
                border: "none",
                backgroundColor: "#F2A900",
                fontWeight: "bold",
                cursor: "pointer"
              }}
            >
              Copiar emails
            </button>
          </div>
        )}
      </div>
    </div>
  );
}