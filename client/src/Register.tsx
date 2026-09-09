import { type FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    try {
      const response = await fetch(
        "http://localhost:3000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name,
            email,
            password
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Registration failed");
        return;
      }
      setMessage("Registration successful! Redirecting to login...")
      // // Optional: automatically log the user in after registration
      // localStorage.setItem("token", data.token);

      // setMessage("Registration successful!");
      // setName("");
      // setEmail("");
      // setPassword("");

      //Redirect to login after one second
      setTimeout(()=> {
        navigate("/login");
      }, 1000)
    } catch {
      setMessage("Cannot connect to the server");
    }
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
        <form onSubmit={handleRegister} style={{ display: "grid", gap: "16px" }}>
          <h1 style={{ margin: 0, textAlign: "center", color: "#f8fafc", fontSize: "2rem" }}>Create Account</h1>

          <div style={{ display: "grid", gap: "8px" }}>
            <label style={{ color: "#e2e8f0", fontWeight: 600 }}>Name</label>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Your name"
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
          </div>

          <div style={{ display: "grid", gap: "8px" }}>
            <label style={{ color: "#e2e8f0", fontWeight: 600 }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
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
          </div>

          <div style={{ display: "grid", gap: "8px" }}>
            <label style={{ color: "#e2e8f0", fontWeight: 600 }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="At least 8 characters"
              minLength={8}
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
          </div>

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
            Register
          </button>
        </form>

        <p style={{ marginTop: "18px", textAlign: "center", color: "#cbd5e1" }}>
          Already have an account? <Link to="/login" style={{ color: "#fbbf24", fontWeight: 700 }}>Login</Link>
        </p>

        {message && <p style={{ marginTop: "12px", color: "#fca5a5", textAlign: "center" }}>{message}</p>}
      </div>
    </main>
  );
}

export default Register;