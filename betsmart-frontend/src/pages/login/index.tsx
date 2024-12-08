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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Create the request body (JSON data)
    const requestBody = {
      email,
      password
    };

    try {
      // Send POST request to Flask backend
      const response = await fetch('http://127.0.0.1:5000/gradescopeAuth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Indicate that we're sending JSON
        },
        body: JSON.stringify(requestBody), // Send the request body as a JSON string
      });

      // Check if the response was successful
      if (response.ok) {
        const data = await response.json();
        console.log("Success:", data);

        // If the backend returns success, we can store the user in context and redirect
        login({ email, password });  // Set user in context
        console.log("Logged in as:", email);
        router.push("/dashboard");  // Redirect after login
      } else {
        const errorData = await response.json();
        console.log("Error:", errorData);
        // Optionally, handle error responses (e.g., display error message to the user)
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
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
