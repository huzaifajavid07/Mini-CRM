import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";

export default function LoadingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // when logged in, redirect to dashboard
        window.location.href = "/dashboard";
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
      fontFamily: "sans-serif",
    }}>
      <h2>Loading…</h2>
      <p>Please wait while we log you in and redirect you.</p>
    </div>
  );
}
