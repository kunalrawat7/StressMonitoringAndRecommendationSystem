import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { History as HistoryIcon } from "lucide-react";

import Sidebar from "../components/Sidebar";
import { API_URL } from "../config";

function History() {
  const navigate = useNavigate();

  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedUser =
      localStorage.getItem("stress_user");

    if (!storedUser) {
      navigate("/access");
      return;
    }

    const user = JSON.parse(storedUser);

    const fetchHistory = async () => {
      try {
        const response = await fetch(
          `${API_URL}/users/${user.id}/assessments`
        );

        if (!response.ok) {
          throw new Error(
            "Failed to load assessment history"
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

    fetchHistory();

  }, [navigate]);

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
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

      <main className="flex-1 p-8 overflow-x-auto">

        <div className="max-w-7xl mx-auto">

          <div className="mb-8">

            <h1 className="text-3xl font-bold text-slate-900">
              Assessment History
            </h1>

            <p className="text-slate-500 mt-2">
              Review your previous stress assessments.
            </p>

          </div>

          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">

            {loading ? (
              <p className="p-6 text-slate-500">
                Loading history...
              </p>

            ) : error ? (
              <p className="p-6 text-red-500">
                {error}
              </p>

            ) : assessments.length === 0 ? (
              <div className="text-center py-14">

                <HistoryIcon
                  size={42}
                  className="mx-auto text-pink-300 mb-3"
                />

                <p className="text-slate-500">
                  No assessments found.
                </p>

              </div>

            ) : (
              <div className="overflow-x-auto">

                <table className="w-full text-left">

                  <thead className="bg-slate-50 text-sm text-slate-500">

                    <tr>
                      <th className="p-4">Date</th>
                      <th className="p-4">Sleep</th>
                      <th className="p-4">Work</th>
                      <th className="p-4">Mood</th>
                      <th className="p-4">Screen</th>
                      <th className="p-4">Activity</th>
                      <th className="p-4">Heart Rate</th>
                      <th className="p-4">SpO₂</th>
                      <th className="p-4">Score</th>
                      <th className="p-4">Level</th>
                    </tr>

                  </thead>

                  <tbody>

                    {assessments.map((assessment) => (
                      <tr
                        key={assessment.id}
                        className="border-t border-slate-100"
                      >

                        <td className="p-4 whitespace-nowrap">
                          {formatDate(
                            assessment.created_at
                          )}
                        </td>

                        <td className="p-4">
                          {assessment.sleep_duration}h
                        </td>

                        <td className="p-4">
                          {assessment.work_hours}h
                        </td>

                        <td className="p-4">
                          {assessment.mood_level}/5
                        </td>

                        <td className="p-4">
                          {assessment.screen_time}h
                        </td>

                        <td className="p-4">
                          {assessment.physical_activity} min
                        </td>

                        <td className="p-4">
                          {assessment.heart_rate}
                        </td>

                        <td className="p-4">
                          {assessment.spo2}%
                        </td>

                        <td className="p-4 font-semibold">
                          {assessment.stress_score}
                        </td>

                        <td className="p-4">

                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelStyle(
                              assessment.stress_level
                            )}`}
                          >
                            {assessment.stress_level}
                          </span>

                        </td>

                      </tr>
                    ))}

                  </tbody>
                </table>

              </div>
            )}

          </div>

        </div>
      </main>
    </div>
  );
}

export default History;