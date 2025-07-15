import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();

  const handleTryIt = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-700 via-green-800 to-green-900 text-white flex flex-col justify-center items-center text-center p-6 relative">
      <h1 className="text-5xl md:text-6xl font-extrabold mb-4 animate-fadeIn">
        Take Control of Your <span className="text-lime-300">Clients</span>
      </h1>

      <p className="text-lg md:text-xl mb-6 max-w-2xl animate-slideUp">
        MiniCRM helps you manage <span className="text-lime-300">clients</span>, close more <span className="text-lime-300">deals</span>, and track <span className="text-lime-300">tasks</span> — all in one sleek, easy-to-use platform.
      </p>

      <button
        onClick={handleTryIt}
        className="bg-lime-300 text-green-900 px-8 py-3 rounded-full shadow-lg hover:scale-105 hover:bg-lime-400 transition flex items-center gap-2 animate-fadeIn cursor-pointer"
      >
        Try it for Free <ArrowRight size={20} />
      </button>

      {/* Feature Cards */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full">
        <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl shadow hover:shadow-lg hover:scale-105 transition">
          <h3 className="text-2xl text-lime-300 mb-2">Transparent Pricing</h3>
          <p className="text-gray-200">
            Simple, affordable plans that fit your business. No hidden fees.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl shadow hover:shadow-lg hover:scale-105 transition">
          <h3 className="text-2xl text-lime-300 mb-2">Why MiniCRM?</h3>
          <p className="text-gray-200">
            Designed for productivity and ease of use, MiniCRM keeps you focused.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl shadow hover:shadow-lg hover:scale-105 transition">
          <h3 className="text-2xl text-lime-300 mb-2">Contact Us</h3>
          <p className="text-gray-200">
            Our support team is here to help — any time you need it.
          </p>
        </div>
      </div>

      <div className="absolute bottom-1 text-sm text-gray-300">
        © {new Date().getFullYear()} Designed & Developed by Huzaifa Javid
      </div>
    </div>
  );
}
