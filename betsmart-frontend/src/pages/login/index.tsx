// src/pages/login/Login.tsx
import React, { useState } from "react";
import { useUser } from "../../contexts/UserContext"; // Import custom hook
import { useRouter } from "next/router"; // Import useRouter for redirect
import "./Login.css"; // Regular CSS import, not CSS Module
import Image from 'next/image';

const Login: React.FC = () => {
  const { login } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();  // Initialize useRouter

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login({ email, password });  // Set user in context
    console.log("Logged in as:", email);
    router.push("/dashboard");  // Redirect after login
  };

  return (
    <div className="container">
        <Image
        src="/images/betsmartlogo-black.png" // Path to the image in your project
        alt="Description of the image"
        width={100} // Specify the width of the image in pixels
        height={95} // Specify the height of the image in pixels
      />
      <h1 className="title">BetSmart</h1>
      <p className="subtitle">Gamifying academics.</p>
      <form className="form" onSubmit={handleLogin}>
        <div className="inputGroup">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="inputGroup">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="button">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
