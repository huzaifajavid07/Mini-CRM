import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged, getRedirectResult } from "firebase/auth";
import { auth } from "../firebase";

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  

  useEffect(() => {
    let unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  

  if (loading) {
  return <div className="text-center p-4">Loading CRM...</div>;
}

if (!user) {
  return <Navigate to="/login" replace state={{ from: location }} />;
}

// 👇 If user is already logged in and still on /login, send to dashboard
if (user && location.pathname === "/login") {
  return <Navigate to="/dashboard" replace />;
}

return children;
}