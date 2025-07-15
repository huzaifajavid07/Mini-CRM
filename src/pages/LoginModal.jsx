import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
 
} from "firebase/auth";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");
  const [isRegister, setIsRegister] = useState(false);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(""), 3000);
  };

 

  const validate = () => {
    const newErrors = {};
    if (!email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email.trim())) {
      newErrors.email = "Invalid email format.";
    }
    if (!password.trim()) {
      newErrors.password = "Password is required.";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLoginOrRegister = async () => {
  if (!validate()) return;

  setLoading(true);

  try {
    if (isRegister) {
      await createUserWithEmailAndPassword(auth, email, password);
      showToast("✅ Registered successfully. Please log in.");
      setIsRegister(false);
      return;
    } else {
      // ✅ first try login
      await signInWithEmailAndPassword(auth, email, password);

      localStorage.setItem("loggedIn", "true");
      showToast("✅ Logged in successfully.");
      
      // ✅ only open window after successful login
      const newWindow = window.open("/dashboard", "_blank", "noopener,noreferrer");

      if (newWindow) {
        navigate("/dashboard"); // fallback
      }
    }
  } catch (err) {
    console.error(err);
    let message = "An error occurred. Please try again.";
    if (err.code === "auth/user-not-found") {
      message = "Account not registered. Please register first.";
    } else if (err.code === "auth/wrong-password") {
      message = "Incorrect password.";
    } else if (err.code === "auth/too-many-requests") {
      message = "Too many failed attempts. Please try again later.";
    } else if (err.code === "auth/email-already-in-use") {
      message = "This email is already registered.";
    } else if (err.code === "auth/weak-password") {
      message = "Password should be at least 6 characters.";
    } else if (err.code === "auth/invalid-credential") {
      message =
        "Account not registered or invalid credentials. Please register first or check your email & password.";
    } else {
      message = err.message;
    }
    setErrors({ general: message });
  } finally {
    setLoading(false);
  }
};


 const handleGoogleLogin = async () => {
   showToast("Google login not implemented yet. Coming soon!");
  
};



  const handleMicrosoftLogin = () => {
    showToast("Microsoft login not implemented yet. Coming soon!");
  };

  const handleGitHubLogin = () => {
    showToast("GitHub login not implemented yet. Coming soon!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-700 via-green-800 to-green-900 text-white flex flex-col md:flex-row">
      <div className="flex-1 flex flex-col justify-center items-center text-center p-6 md:p-12">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
          Welcome to <span className="text-lime-300">MiniCRM</span>
        </h1>
        <p className="text-lg md:text-xl max-w-md">
          Manage your <span className="text-lime-300">clients</span>, close more{" "}
          <span className="text-lime-300">deals</span>, and stay on top of your{" "}
          <span className="text-lime-300">tasks</span> — all in one sleek,
          easy-to-use platform.
        </p>
      </div>

      <div className="flex-1 flex justify-center items-center p-6 md:p-12">
        <div className="bg-white text-black shadow-lg rounded-lg p-8 w-full max-w-sm">
          <h3 className="text-2xl font-bold mb-4 text-center">
            {isRegister ? "Register for MiniCRM" : "Log In to MiniCRM"}
          </h3>

          {errors.general && (
            <div className="text-red-500 text-sm text-center mb-2">
              {errors.general}
            </div>
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full p-2 border rounded mb-1 focus:ring-2 focus:ring-green-300 ${
              errors.email ? "border-red-400" : ""
            }`}
          />
          <div className="text-red-500 text-xs mb-2 min-h-[1.25rem]">
            {errors.email || <span>&nbsp;</span>}
          </div>

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full p-2 border rounded mb-1 focus:ring-2 focus:ring-green-300 ${
              errors.password ? "border-red-400" : ""
            }`}
          />
          <div className="text-red-500 text-xs mb-2 min-h-[1.25rem]">
            {errors.password || <span>&nbsp;</span>}
          </div>

          <button
            onClick={handleLoginOrRegister}
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 mb-2 disabled:opacity-50"
          >
            {loading
              ? isRegister
                ? "Registering..."
                : "Logging in..."
              : isRegister
              ? "Register"
              : "Log In"}
          </button>

          <div className="text-center text-sm text-gray-600 mb-4">
            {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              onClick={() => setIsRegister(!isRegister)}
              className="text-green-600 hover:underline"
            >
              {isRegister ? "Log in here" : "Register here"}
            </button>
          </div>

          <div className="flex items-center my-4">
            <hr className="flex-grow border-t" />
            <span className="px-2 text-gray-400 text-sm">or</span>
            <hr className="flex-grow border-t" />
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full border py-2 rounded hover:bg-gray-100 mb-2 flex items-center justify-center gap-2 text-black disabled:opacity-50"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt=""
              className="w-5 h-5"
            />
            Continue with Google
          </button>

          <button
            onClick={handleMicrosoftLogin}
            className="w-full border py-2 rounded hover:bg-gray-100 mb-2 flex items-center justify-center gap-2 text-black"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg"
              alt=""
              className="w-5 h-5"
            />
            Continue with Microsoft
          </button>

          <button
            onClick={handleGitHubLogin}
            className="w-full border py-2 rounded hover:bg-gray-100 flex items-center justify-center gap-2 text-black"
          >
            <img
              src="https://www.svgrepo.com/show/512317/github-142.svg"
              alt=""
              className="w-5 h-5"
            />
            Continue with GitHub
          </button>

          {toast && (
            <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-2 rounded shadow">
              {toast}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
