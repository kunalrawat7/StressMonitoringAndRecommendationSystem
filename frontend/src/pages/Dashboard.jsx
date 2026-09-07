import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ClipboardList,
  HeartPulse,
  Gauge,
  CalendarDays,
  Plus,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import { API_URL } from "../config";

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("stress_user");

    if (!storedUser) {
      navigate("/access");
      return;
    }

    const currentUser = JSON.parse(storedUser);

    setUser(currentUser);

    const fetchAssessments = async () => {
      try {
        const response = await fetch(
          `${API_URL}/users/${currentUser.id}/assessments`
        );

        if (!response.ok) {
          throw new Error("Failed to load assessments");
        }

        const data = await response.json();

        setAssessments(data);

      } catch (err) {
        setError(err.message);

      } finally {
        setLoading(false);
      }
    };

    fetchAssessments();

  }, [navigate]);

  const latestAssessment = assessments[0];

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  const getLevelStyle = (level) => {
    if (level === "Low") {
      return "bg-green-100 text-green-700";
    }

    if (level === "Medium") {
      return "bg-amber-100 text-amber-700";
    }

    return "bg-red-100 text-red-700";
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />

      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">

            <div>
              <p className="text-slate-500">
                Welcome back
              </p>

              <h1 className="text-3xl font-bold text-slate-900">
                {user?.name || "User"}
              </h1>
            </div>

            <button
              onClick={() => navigate("/assessment")}
              className="flex items-center justify-center gap-2 bg-pink-500 hover:bg-pink-600 text-white px-5 py-3 rounded-xl font-medium transition"
            >
              <Plus size={20} />
              Take Assessment
            </button>

          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">

            <StatCard
              title="Total Assessments"
              value={assessments.length}
              icon={ClipboardList}
            />

            <StatCard
              title="Latest Stress Level"
              value={latestAssessment?.stress_level || "No data"}
              icon={HeartPulse}
            />

            <StatCard
              title="Latest Score"
              value={
                latestAssessment
                  ? `${latestAssessment.stress_score}/100`
                  : "No data"
              }
              icon={Gauge}
            />

            <StatCard
              title="Last Assessment"
              value={
                latestAssessment
                  ? formatDate(latestAssessment.created_at)
                  : "No data"
              }
              icon={CalendarDays}
            />

          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 mt-8">

            <div className="flex items-center justify-between mb-5">

              <h2 className="text-xl font-semibold text-slate-900">
                Recent Assessments
              </h2>

              <button
                onClick={() => navigate("/history")}
                className="text-pink-500 font-medium"
              >
                View all
              </button>

            </div>

            {loading ? (
              <p className="text-slate-500">
                Loading...
              </p>

            ) : error ? (
              <p className="text-red-500">
                {error}
              </p>

            ) : assessments.length === 0 ? (
              <div className="text-center py-10">

                <HeartPulse
                  className="mx-auto text-pink-300 mb-3"
                  size={40}
                />

                <p className="text-slate-600">
                  You haven't taken any assessments yet.
                </p>

                <button
                  onClick={() => navigate("/assessment")}
                  className="mt-4 text-pink-500 font-medium"
                >
                  Take your first assessment
                </button>

              </div>

            ) : (
              <div className="space-y-3">

                {assessments.slice(0, 5).map((assessment) => (
                  <div
                    key={assessment.id}
                    className="flex items-center justify-between border border-slate-100 rounded-xl p-4"
                  >

                    <div>
                      <p className="font-medium text-slate-900">
                        {formatDate(assessment.created_at)}
                      </p>

                      <p className="text-sm text-slate-500">
                        Stress Score: {assessment.stress_score}/100
                      </p>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelStyle(
                        assessment.stress_level
                      )}`}
                    >
                      {assessment.stress_level}
                    </span>

                  </div>
                ))}

              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value, icon: Icon }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5">

      <div className="bg-pink-50 w-10 h-10 rounded-xl flex items-center justify-center mb-4">
        <Icon
          className="text-pink-500"
          size={20}
        />
      </div>

      <p className="text-sm text-slate-500">
        {title}
      </p>

      <p className="text-xl font-bold text-slate-900 mt-1">
        {value}
      </p>

    </div>
  );
}

export default Dashboard;