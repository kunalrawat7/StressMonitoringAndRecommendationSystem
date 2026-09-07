import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import Sidebar from "../components/Sidebar";
import { API_URL } from "../config";

function Trends() {
  const navigate = useNavigate();

  const [assessments, setAssessments] =
    useState([]);

  const [period, setPeriod] =
    useState("daily");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const storedUser =
      localStorage.getItem("stress_user");

    if (!storedUser) {
      navigate("/access");
      return;
    }

    const user = JSON.parse(storedUser);

    const fetchAssessments = async () => {
      try {
        const response = await fetch(
          `${API_URL}/users/${user.id}/assessments`
        );

        if (!response.ok) {
          throw new Error(
            "Failed to load trend data"
          );
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

  const getGroupKey = (dateString) => {
    const date = new Date(dateString);

    if (period === "monthly") {
      return date.toLocaleDateString(
        undefined,
        {
          month: "short",
          year: "numeric",
        }
      );
    }

    if (period === "weekly") {
      const start = new Date(date);

      start.setDate(
        date.getDate() - date.getDay()
      );

      return `Week of ${start.toLocaleDateString()}`;
    }

    return date.toLocaleDateString();
  };

  const grouped = {};

  assessments.forEach((assessment) => {
    const key = getGroupKey(
      assessment.created_at
    );

    if (!grouped[key]) {
      grouped[key] = {
        total: 0,
        count: 0,
      };
    }

    grouped[key].total +=
      assessment.stress_score;

    grouped[key].count += 1;
  });

  const chartData = Object.entries(grouped)
    .map(([label, values]) => ({
      label,
      score: Math.round(
        values.total / values.count
      ),
    }))
    .reverse();

  const scores = assessments.map(
    (assessment) =>
      assessment.stress_score
  );

  const average =
    scores.length > 0
      ? Math.round(
          scores.reduce(
            (total, score) =>
              total + score,
            0
          ) / scores.length
        )
      : 0;

  const highest =
    scores.length > 0
      ? Math.max(...scores)
      : 0;

  const lowest =
    scores.length > 0
      ? Math.min(...scores)
      : 0;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />

      <main className="flex-1 p-8">

        <div className="max-w-7xl mx-auto">

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">

            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Stress Trends
              </h1>

              <p className="text-slate-500 mt-2">
                Understand how your stress changes over time.
              </p>
            </div>

            <div className="flex bg-white border border-slate-200 rounded-xl p-1">

              {[
                "daily",
                "weekly",
                "monthly",
              ].map((item) => (
                <button
                  key={item}
                  onClick={() => setPeriod(item)}
                  className={`px-4 py-2 rounded-lg capitalize ${
                    period === item
                      ? "bg-pink-500 text-white"
                      : "text-slate-500"
                  }`}
                >
                  {item}
                </button>
              ))}

            </div>

          </div>

          <div className="grid sm:grid-cols-3 gap-5 mb-8">

            <SummaryCard
              title="Average Score"
              value={average}
            />

            <SummaryCard
              title="Highest Score"
              value={highest}
            />

            <SummaryCard
              title="Lowest Score"
              value={lowest}
            />

          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6">

            <h2 className="text-xl font-semibold text-slate-900 mb-6">
              {period.charAt(0).toUpperCase() +
                period.slice(1)}{" "}
              Stress
            </h2>

            {loading ? (
              <p className="text-slate-500">
                Loading trends...
              </p>

            ) : error ? (
              <p className="text-red-500">
                {error}
              </p>

            ) : chartData.length === 0 ? (
              <p className="text-slate-500">
                Take an assessment to start
                seeing your stress trends.
              </p>

            ) : (
              <div className="w-full h-80">

                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >

                  <LineChart data={chartData}>

                    <CartesianGrid
                      strokeDasharray="3 3"
                    />

                    <XAxis
                      dataKey="label"
                      tick={{ fontSize: 12 }}
                    />

                    <YAxis
                      domain={[0, 100]}
                    />

                    <Tooltip />

                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#ec4899"
                      strokeWidth={3}
                    />

                  </LineChart>

                </ResponsiveContainer>

              </div>
            )}

          </div>

        </div>
      </main>
    </div>
  );
}

function SummaryCard({
  title,
  value,
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5">

      <p className="text-sm text-slate-500">
        {title}
      </p>

      <p className="text-3xl font-bold text-slate-900 mt-2">

        {value}

        <span className="text-sm text-slate-400">
          /100
        </span>

      </p>

    </div>
  );
}

export default Trends;