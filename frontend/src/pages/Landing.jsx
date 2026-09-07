import { useNavigate } from "react-router-dom";

import {
  HeartPulse,
  Activity,
  ChartNoAxesCombined,
} from "lucide-react";

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center">
      <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12 items-center">

        <div>
          <div className="flex items-center gap-2 mb-6">
            <HeartPulse className="text-pink-500 w-8 h-8" />

            <span className="text-xl font-bold text-slate-900">
              Stress Monitor
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 leading-tight">
            Understand Your Stress.

            <span className="text-pink-500">
              {" "}Build Better Habits.
            </span>
          </h1>

          <p className="mt-6 text-lg text-slate-600 max-w-xl">
            Track your daily lifestyle, understand your stress level,
            and receive personalized recommendations based on your habits
            and health inputs.
          </p>

          <button
            onClick={() => navigate("/access")}
            className="mt-8 bg-pink-500 hover:bg-pink-600 text-white px-7 py-3 rounded-xl font-semibold transition"
          >
            Get Started
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100">

          <h2 className="text-2xl font-semibold text-slate-900 mb-6">
            Take control of your wellbeing
          </h2>

          <div className="space-y-6">

            <div className="flex gap-4">
              <div className="bg-pink-100 p-3 rounded-xl">
                <Activity className="text-pink-500" />
              </div>

              <div>
                <h3 className="font-semibold text-slate-900">
                  Track Daily Lifestyle
                </h3>

                <p className="text-slate-500 text-sm">
                  Record sleep, work, mood, activity and health data.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="bg-purple-100 p-3 rounded-xl">
                <HeartPulse className="text-purple-500" />
              </div>

              <div>
                <h3 className="font-semibold text-slate-900">
                  Understand Your Stress
                </h3>

                <p className="text-slate-500 text-sm">
                  Get a simple stress score and stress level.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="bg-pink-100 p-3 rounded-xl">
                <ChartNoAxesCombined className="text-pink-500" />
              </div>

              <div>
                <h3 className="font-semibold text-slate-900">
                  Follow Your Progress
                </h3>

                <p className="text-slate-500 text-sm">
                  View history and trends over time.
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default Landing;