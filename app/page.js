"use client";
import { useEffect, useState } from "react";

const USER = "Difusionhumanas";
const PASS = "humanas2026";

/* =========================
   CATEGORÍAS
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

  IDIOMAS_EDUCACION: [
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
  /* =========================
     LOGIN STATE
  ========================= */
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [logged, setLogged] = useState(false);

  /* =========================
     APP STATE
  ========================= */
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

  /* =========================
     LOGIN VIEW
  ========================= */
  if (!logged) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          fontFamily: "Arial",
          background: "#f5f5f5"
        }}
      >
        <div
          style={{
            background: "#fff",
            padding: 40,
            borderRadius: 12,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            textAlign: "center",
            width: 320
          }}
        >
          <img
            src="/Membrete-UNVMHumanas.jpg"
            alt="UNVM Humanas"
            style={{
              width: 200,
              marginBottom: 20
            }}
          />

          <h2 style={{ marginBottom: 20 }}>Acceso al sistema</h2>

          <input
            placeholder="Usuario"
            onChange={(e) => setUser(e.target.value)}
            style={{
              padding: 10,
              marginBottom: 10,
              width: "100%",
              borderRadius: 6,
              border: "1px solid #ccc"
            }}
          />

          <input
            type="password"
            placeholder="Clave"
            onChange={(e) => setPass(e.target.value)}
            style={{
              padding: 10,
              marginBottom: 15,
              width: "100%",
              borderRadius: 6,
              border: "1px solid #ccc"
            }}
          />

          <button
            onClick={() => {
              if (user === USER && pass === PASS) {
                setLogged(true);
              } else {
                alert("Usuario o clave incorrectos");
              }
            }}
            style={{
              padding: 10,
              width: "100%",
              borderRadius: 6,
              border: "none",
              background: "#005CA9",
              color: "#fff",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            Ingresar
          </button>
        </div>
      </div>
    );
  }

  /* =========================
     MAIN APP
  ========================= */
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
      {/* SIDEBAR */}
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

      {/* MAIN */}
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