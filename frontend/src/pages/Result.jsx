import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  ArrowLeft,
  CheckCircle2,
  Lightbulb,
  AlertCircle,
  LayoutDashboard,
} from "lucide-react";

import Sidebar from "../components/Sidebar";

function Result() {
  const navigate = useNavigate();
  const location = useLocation();

  const storedResult =
    localStorage.getItem("latest_result");

  const result =
    location.state?.result ||
    (storedResult ? JSON.parse(storedResult) : null);

  if (!result) {
    return (
      <div className="min-h-screen bg-slate-50 flex">
        <Sidebar />

        <main className="flex-1 flex items-center justify-center p-8">

          <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center max-w-md">

            <AlertCircle
              className="mx-auto text-amber-500 mb-4"
              size={42}
            />

            <h1 className="text-xl font-semibold text-slate-900">
              No assessment result found
            </h1>

            <p className="text-slate-500 mt-2">
              Take a new assessment to view your stress result.
            </p>

            <button
              onClick={() => navigate("/assessment")}
              className="mt-6 bg-pink-500 text-white px-5 py-3 rounded-xl"
            >
              Take Assessment
            </button>

          </div>

        </main>
      </div>
    );
  }

  const levelStyle =
    result.stress_level === "Low"
      ? "bg-green-100 text-green-700"
      : result.stress_level === "Medium"
      ? "bg-amber-100 text-amber-700"
      : "bg-red-100 text-red-700";

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />

      <main className="flex-1 p-8">

        <div className="max-w-4xl mx-auto">

          <button
            onClick={() => navigate("/assessment")}
            className="flex items-center gap-2 text-slate-500 mb-6"
          >
            <ArrowLeft size={18} />
            New Assessment
          </button>

          <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">

            <p className="text-slate-500">
              Your Stress Score
            </p>

            <div className="text-6xl font-bold text-slate-900 mt-2">

              {result.stress_score}

              <span className="text-xl text-slate-400">
                /100
              </span>

            </div>

            <span
              className={`inline-block mt-4 px-4 py-2 rounded-full font-semibold ${levelStyle}`}
            >
              {result.stress_level} Stress
            </span>

            <p className="text-slate-600 mt-6 max-w-xl mx-auto">
              {result.summary}
            </p>

          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-6">

            <div className="bg-white border border-slate-200 rounded-2xl p-6">

              <div className="flex items-center gap-2 mb-5">

                <AlertCircle className="text-pink-500" />

                <h2 className="text-xl font-semibold text-slate-900">
                  Contributing Factors
                </h2>

              </div>

              {result.factors.length === 0 ? (
                <p className="text-slate-500">
                  No major stress factors were identified.
                </p>

              ) : (
                <div className="space-y-3">

                  {result.factors.map((factor, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3"
                    >

                      <CheckCircle2
                        size={18}
                        className="text-pink-500 mt-0.5"
                      />

                      <p className="text-slate-600">
                        {factor}
                      </p>

                    </div>
                  ))}

                </div>
              )}

            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6">

              <div className="flex items-center gap-2 mb-5">

                <Lightbulb className="text-purple-500" />

                <h2 className="text-xl font-semibold text-slate-900">
                  Recommendations
                </h2>

              </div>

              <div className="space-y-3">

                {result.recommendations.map(
                  (recommendation, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3"
                    >

                      <CheckCircle2
                        size={18}
                        className="text-purple-500 mt-0.5"
                      />

                      <p className="text-slate-600">
                        {recommendation}
                      </p>

                    </div>
                  )
                )}

              </div>

            </div>

          </div>

          <div className="flex justify-center mt-8">

            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl"
            >
              <LayoutDashboard size={19} />
              Back to Dashboard
            </button>

          </div>

        </div>
      </main>
    </div>
  );
}

export default Result;