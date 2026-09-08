import { type FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login({ onLogin }: { onLogin?: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const response = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        password
      })
    });

    const data = await response.json();

    if (!response.ok) {
      setMessage(data.message || "Login failed");
      return;
    }

    localStorage.setItem("token", data.token);
    onLogin?.();
    navigate("/home");

    // Later, redirect to the home page here.
    // window.location.href = "/";
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        background: "radial-gradient(circle at top, #1e293b 0%, #0f172a 45%, #020617 100%)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "#111827",
          borderRadius: "20px",
          boxShadow: "0 18px 45px rgba(15, 23, 42, 0.45)",
          padding: "32px 28px",
          border: "1px solid #334155",
        }}
      >
        <form onSubmit={handleLogin} style={{ display: "grid", gap: "16px" }}>
          <h1 style={{ margin: 0, textAlign: "center", color: "#f8fafc", fontSize: "2rem" }}>Login</h1>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            style={{
              width: "100%",
              padding: "12px 14px",
              borderRadius: "10px",
              border: "1px solid #475569",
              fontSize: "1rem",
              boxSizing: "border-box",
              background: "#0f172a",
              color: "#f8fafc",
            }}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            style={{
              width: "100%",
              padding: "12px 14px",
              borderRadius: "10px",
              border: "1px solid #475569",
              fontSize: "1rem",
              boxSizing: "border-box",
              background: "#0f172a",
              color: "#f8fafc",
            }}
          />

          <button
            type="submit"
            style={{
              padding: "12px 16px",
              borderRadius: "10px",
              border: "none",
              background: "#0f172a",
              color: "#ffffff",
              fontWeight: 700,
              fontSize: "1rem",
              cursor: "pointer",
            }}
          >
            Login
          </button>

          {message && <p style={{ margin: 0, color: "#b91c1c", textAlign: "center" }}>{message}</p>}
        </form>

        <p style={{ marginTop: "18px", textAlign: "center", color: "#374151" }}>
          New user? <Link to="/register" style={{ color: "#fbbf24", fontWeight: 700 }}>Create an account</Link>
        </p>
      </div>
    </main>
  );
}

export default Login;