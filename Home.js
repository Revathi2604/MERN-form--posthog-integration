import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import posthog from "posthog-js";

function Home() {
  const location = useLocation();

  useEffect(() => {
    // Track page view event
    posthog.capture("$pageview");

    // Clean up when component unmounts
    return () => {
      // Track page leave event
      posthog.capture("$pageleave");
    };
  }, []);

  return (
    <div className="homepage">
      <h1>Hello {location.state.id} and welcome to the home</h1>

      {/* Track custom event */}
      <button
        onClick={() =>
          posthog.capture("Button Click", { button: "Custom Button" })
        }
      >
        Custom Button
      </button>
    </div>
  );
}

export default Home;
