"use client";

import { useState } from "react";

const USER = "Difusionhumanas";
const PASS = "humanas2026";

export default function LoginPage() {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");

  const handleLogin = () => {
    if (user.trim() === USER && pass.trim() === PASS) {
      localStorage.setItem("auth", "true");
      window.location.href = "/alumnos";
    } else {
      alert("Usuario o contraseña incorrectos");
    }
  };

  return (
    <div
      style={{
        fontFamily: "Arial",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: "url('/Ingreso_UNVM.jpg')",
backgroundSize: "cover",
backgroundPosition: "center",
backgroundRepeat: "no-repeat",
      }}
    >
      <div
        style={{
          padding: 30,
          borderRadius: 12,
          backgroundColor: "#ffffff",
          width: 320,
          boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
          textAlign: "center",
        }}
      >
        {/* 🔥 IMAGEN DENTRO DEL CUADRO */}
        <img
          src="/Membrete-UNVMHumanas.jpg"
          alt="logo"
          style={{
            height: 70,
            marginBottom: 15,
            objectFit: "contain",
          }}
        />

        {/* 🔥 TITULO */}
        <h2 style={{ marginBottom: 20 }}>Login Difusión</h2>

        <input
          placeholder="Usuario"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          style={{ width: "100%", marginBottom: 10, padding: 8 }}
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          style={{ width: "100%", marginBottom: 15, padding: 8 }}
        />

        <button
          onClick={handleLogin}
          style={{
            width: "100%",
            padding: 10,
            backgroundColor: "#005CA9",
            color: "white",
            border: "none",
            cursor: "pointer",
            fontWeight: "bold",
            borderRadius: 6,
          }}
        >
          Ingresar
        </button>
      </div>
    </div>
  );
}