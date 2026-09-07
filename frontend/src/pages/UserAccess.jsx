import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HeartPulse } from "lucide-react";

import { API_URL } from "../config";

function UserAccess() {
  const navigate = useNavigate();

  const [mode, setMode] = useState("new");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      let response;

      if (mode === "new") {
        response = await fetch(`${API_URL}/users`, {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name,
            email,
          }),
        });
      } else {
        response = await fetch(
          `${API_URL}/users-by-email?email=${encodeURIComponent(email)}`
        );
      }

      if (!response.ok) {
        const data = await response.json();

        throw new Error(
          typeof data.detail === "string"
            ? data.detail
            : "Something went wrong"
        );
      }

      const user = await response.json();

      localStorage.setItem(
        "stress_user",
        JSON.stringify(user)
      );

      navigate("/dashboard");

    } catch (err) {
      setError(err.message);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center px-6">

      <div className="w-full max-w-md">

        <div className="flex justify-center items-center gap-2 mb-6">
          <HeartPulse className="text-pink-500 w-8 h-8" />

          <span className="text-xl font-bold text-slate-900">
            Stress Monitor
          </span>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100">

          <h1 className="text-3xl font-bold text-slate-900 text-center">
            Welcome
          </h1>

          <p className="text-slate-500 text-center mt-2">
            Start tracking and understanding your stress.
          </p>

          <div className="grid grid-cols-2 bg-slate-100 rounded-xl p-1 mt-6">

            <button
              type="button"
              onClick={() => {
                setMode("new");
                setError("");
              }}
              className={`py-2 rounded-lg font-medium transition ${
                mode === "new"
                  ? "bg-white text-pink-500 shadow-sm"
                  : "text-slate-500"
              }`}
            >
              New User
            </button>

            <button
              type="button"
              onClick={() => {
                setMode("existing");
                setError("");
              }}
              className={`py-2 rounded-lg font-medium transition ${
                mode === "existing"
                  ? "bg-white text-pink-500 shadow-sm"
                  : "text-slate-500"
              }`}
            >
              Existing User
            </button>

          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-6 space-y-5"
          >

            {mode === "new" && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Enter your name"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-pink-300"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-pink-300"
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-pink-500 hover:bg-pink-600 disabled:opacity-60 text-white py-3 rounded-xl font-semibold transition"
            >
              {loading
                ? "Please wait..."
                : mode === "new"
                ? "Create Account"
                : "Continue"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}

export default UserAccess;