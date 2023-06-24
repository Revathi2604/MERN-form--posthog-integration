import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import posthog from "posthog-js";

function Signup() {
  const history = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  posthog.init("phc_", {
    api_host: "https://app.posthog.com",
  });
  //   useEffect(() => {
  //     // Track page view event
  //     posthog.capture("$pageview");

  //     // Clean up when component unmounts
  //     return () => {
  //       // Track page leave event
  //       posthog.capture("$pageleave");
  //     };
  //   }, []);

  async function submit(e) {
    e.preventDefault();
    posthog.capture("my event", { property: "value" });
    try {
      const res = await axios.post("http://localhost:8000/signup", {
        email,
        password,
      });
      console.log(res.data);
      if (res.status === 400) {
        alert("User already exists");

        // Track user exists event
        posthog.capture("User Exists", { id: res.data.data.insertedId });
      } else {
        history("/home", { state: { id: email } });

        // Track successful signup event
        posthog.capture("new user", { id: res.data.data.insertedId });
      }
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div className="signup">
      <h1>Signup</h1>
      <form>
        <input
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <input type="submit" onClick={submit} />

        {/* Track button click event */}
        <button
          onClick={() => posthog.capture("Button Click", { button: "Sign Up" })}
        >
          Sign Up
        </button>
      </form>
      <br />
      <p>OR</p>
      <br />
      <Link to="/">Login Page</Link>
    </div>
  );
}

export default Signup;
