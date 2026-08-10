import type { FormEvent } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
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
    // setMessage("Login successful!");
    // onLogin();
    navigate("/home")

    // Later, redirect to the home page here.
    // window.location.href = "/";
  }

  return (
    <main>

   
    <form onSubmit={handleLogin}>
      <h1>Login</h1>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        required
      />

      <button type="submit">Login</button>

      {message && <p>{message}</p>}
       
    </form>

        <p>
            New user? <Link to="/register">Create an account</Link>
        </p>  

   </main>
  
  );
}

export default Login;