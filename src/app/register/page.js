"use client";
import { useState } from "react";
import axios from "axios";

export default function Register() {
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("regular"); 
  const data = localStorage.getItem("user");
  const user = data !== "undefined" ? JSON.parse(data) : null;
  const isAdmin = user && user.role == "admin";

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/users", {
        name,
        password,
        role,
        email,
      });
    } catch (error) {
      console.error("Registration failed:", error.message);
    }
  };

  return (
    <div className="container">
      <h1>Registro</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            Nombres:
          </label>
          <input
            type="text"
            className="form-control"
            id="username"
            placeholder="Enter user name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email:
          </label>
          <input
            type="text"
            className="form-control"
            id="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Contraseña:
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="tournamentName" className="form-label">
            Rol:
          </label>
          <select className="form-control" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="regular">Usuario normal</option>
            <option value="admin" disabled={!isAdmin}>Administrador</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary">Registrarse</button>
      </form>
    </div>
  );
}
