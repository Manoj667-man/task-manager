import React, { useState } from "react";
import "./App.css";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {

    if(email === "admin@gmail.com" && password === "admin123"){
      alert("Login Successful");
      window.location.href = "/dashboard";
    }
    else{
      alert("Invalid Credentials");
    }
  };

  return (
    <div className="login-container">

      <div className="login-box">

        <h1>Login</h1>

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
        />

        <button onClick={handleLogin}>
          Login
        </button>

      </div>

    </div>
  );
}

export default Login;