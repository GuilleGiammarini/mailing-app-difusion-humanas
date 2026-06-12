"use client";
import { useEffect, useState } from "react";

const USER = "Difusionhumanas";
const PASS = "humanas2026";

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
  HUMANIDADES: ["JORNADAS MEDIAEVALIA", "DIPLO CS HUMANAS", "LENGUA Y LITERATURA", "JORNADAS GRADUADXS HUMANAS"],
  TECNOLOGIA_EDUCATIVA: ["TIC", "TECNOLOGÍA", "PLATAFORMAS", "RECURSOS EDUCATIVOS", "STREAMING"],
  MUSICA: ["MUSICA"],
  OTROS: ["OTROS"]
};

export default function Home() {
  /* =========================
     LOGIN
  ========================= */
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [logged, setLogged] = useState(false);

  /* =========================
     APP
  ========================= */
  const [interes, setInteres] = useState(null);
  const [emails, setEmails] = useState("");
  const [total, setTotal] = useState(0);
  const [intereses, setIntereses] = useState([]);
  const [categoriaActiva, setCategoriaActiva] = useState(null);

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
          setEmails(d.emails || "");
          setTotal(d.total || 0);
        });
    }
  }, [interes]);

  const copiar = () => {
    navigator.clipboard.writeText(emails);
  };

  /* =========================
     LOGIN SCREEN
  ========================= */
  if (!logged) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "#f5f5f5",
        fontFamily: "Arial"
      }}>
        <div style={{
          background: "#fff",
          padding: 40,
          borderRadius: 12,
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          textAlign: "center",
          width: 320
        }}>
          <img
            src="/Membrete-UNVMHumanas.jpg"
            style={{ width: 200, marginBottom: 20 }}
            alt="UNVM"
          />

          <h3>Acceso al sistema</h3>

          <input
            placeholder="Usuario"
            onChange={(e) => setUser(e.target.value)}
            style={{ width: "100%", padding: 10, marginBottom: 10 }}
          />

          <input
            type="password"
            placeholder="Clave"
            onChange={(e) => setPass(e.target.value)}
            style={{ width: "100%", padding: 10, marginBottom: 15 }}
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
              width: "100%",
              padding: 10,
              background: "#005CA9",
              color: "#fff",
              border: "none",
              borderRadius: 6,
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
     APP PRINCIPAL
  ========================= */
  return (
    <div style={{ display: "flex", maxWidth: 1200, margin: "40px auto", gap: 20, fontFamily: "Arial" }}>
      
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

        <div style={{ marginTop: 20, padding: 15, border: "1px solid #ddd", borderRadius: 10 }}>
          {categoriaActiva ? (
            <>
              <h4>{categoriaActiva}</h4>
              <ul>
                {CATEGORY_MAP[categoriaActiva].map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </>
          ) : (
            <p>Pasa el mouse o selecciona categoría</p>
          )}
        </div>
      </div>

      {/* MAIN */}
      <div style={{ flex: 1 }}>
        
        {/* HEADER CON LOGOS */}
<div style={{
  position: "relative",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: 20,
  marginBottom: 20
}}>

  {/* BOTONES ARRIBA DERECHA */}
  <div style={{
    position: "absolute",
    right: 0,
    top: 0,
    display: "flex",
    gap: 10
  }}>
    <button
      style={{
        padding: "6px 12px",
        borderRadius: 6,
        border: "none",
        background: "#005CA9",
        color: "#fff"
      }}
    >
      Alumnos
    </button>

    <button
      onClick={() => window.location.href = "/docentes"}
      style={{
        padding: "6px 12px",
        borderRadius: 6,
        border: "none",
        background: "#E5E7EB",
        cursor: "pointer"
      }}
    >
      Docentes
    </button>
  </div>

  <img src="/Membrete-UNVMHumanas.jpg" style={{ height: 60 }} />
  
  <h1 style={{ color: "#005CA9", margin: 0 }}>
    UNVM · Sistema de Mailing
  </h1>

  <img src="/Membrete-UNVMHumanas.jpg" style={{ height: 60 }} />
</div>

        {/* INTERESES */}
        <div style={{ background: "#fff", padding: 25, borderRadius: 12 }}>
          <h3>Seleccionar interés</h3>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {intereses.map((i) => (
              <button
                key={i}
                onClick={() => setInteres(i)}
                style={{
                  padding: "10px 15px",
                  borderRadius: 8,
                  border: "none",
                  cursor: "pointer",
                  background: interes === i ? "#005CA9" : "#E5E7EB",
                  color: interes === i ? "#fff" : "#111"
                }}
              >
                {i}
              </button>
            ))}
          </div>
        </div>

        {/* EMAILS */}
        {interes && (
          <div style={{ marginTop: 20, background: "#fff", padding: 25, borderRadius: 12 }}>
            <h3>{interes} — {total} emails</h3>

            <textarea value={emails} readOnly style={{ width: "100%", height: 150 }} />

            <button onClick={copiar} style={{ marginTop: 10, padding: 10, background: "#F2A900" }}>
              Copiar emails
            </button>
          </div>
        )}
      </div>
    </div>
  );
}