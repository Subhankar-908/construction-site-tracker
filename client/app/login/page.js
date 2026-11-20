"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

export default function Login() {
  const { authenticate } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await authenticate(mode, form);
      router.replace("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form className="card center" onSubmit={submit}>
      <h1>Site Tracker</h1>
      <p className="muted">{mode === "login" ? "Sign in to your account" : "Create an account (the first user becomes Admin)"}</p>
      {mode === "register" && (<><label>Name</label><input className="input" value={form.name} onChange={set("name")} required /></>)}
      <label>Email</label>
      <input className="input" type="email" value={form.email} onChange={set("email")} required />
      <label>Password</label>
      <input className="input" type="password" value={form.password} onChange={set("password")} required minLength={6} />
      {error && <p className="error">{error}</p>}
      <p><button className="btn" type="submit">{mode === "login" ? "Log in" : "Register"}</button></p>
      <a href="#" onClick={(e) => { e.preventDefault(); setMode(mode === "login" ? "register" : "login"); }}>
        {mode === "login" ? "Need an account? Register" : "Have an account? Log in"}
      </a>
    </form>
  );
}
