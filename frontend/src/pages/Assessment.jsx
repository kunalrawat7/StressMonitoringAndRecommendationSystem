import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Moon,
  BriefcaseBusiness,
  Smile,
  Monitor,
  Activity,
  HeartPulse,
  Wind,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import { API_URL } from "../config";

function Assessment() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    sleep_duration: "",
    work_hours: "",
    mood_level: "",
    screen_time: "",
    physical_activity: "",
    heart_rate: "",
    spo2: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fields = [
    {
      name: "sleep_duration",
      label: "Sleep Duration",
      unit: "hours",
      icon: Moon,
      min: 0,
      max: 24,
      step: 0.5,
    },
    {
      name: "work_hours",
      label: "Work Hours",
      unit: "hours",
      icon: BriefcaseBusiness,
      min: 0,
      max: 24,
      step: 0.5,
    },
    {
      name: "mood_level",
      label: "Mood Level",
      unit: "1 - 5",
      icon: Smile,
      min: 1,
      max: 5,
      step: 1,
    },
    {
      name: "screen_time",
      label: "Screen Time",
      unit: "hours",
      icon: Monitor,
      min: 0,
      max: 24,
      step: 0.5,
    },
    {
      name: "physical_activity",
      label: "Physical Activity",
      unit: "minutes",
      icon: Activity,
      min: 0,
      max: 1440,
      step: 1,
    },
    {
      name: "heart_rate",
      label: "Heart Rate",
      unit: "BPM",
      icon: HeartPulse,
      min: 30,
      max: 220,
      step: 1,
    },
    {
      name: "spo2",
      label: "SpO₂",
      unit: "%",
      icon: Wind,
      min: 50,
      max: 100,
      step: 0.1,
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const storedUser =
      localStorage.getItem("stress_user");

    if (!storedUser) {
      navigate("/access");
      return;
    }

    const user = JSON.parse(storedUser);

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/assessments`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            user_id: user.id,
            sleep_duration: Number(formData.sleep_duration),
            work_hours: Number(formData.work_hours),
            mood_level: Number(formData.mood_level),
            screen_time: Number(formData.screen_time),
            physical_activity: Number(
              formData.physical_activity
            ),
            heart_rate: Number(formData.heart_rate),
            spo2: Number(formData.spo2),
          }),
        }
      );

      if (!response.ok) {
        const data = await response.json();

        throw new Error(
          typeof data.detail === "string"
            ? data.detail
            : "Failed to submit assessment"
        );
      }

      const result = await response.json();

      localStorage.setItem(
        "latest_result",
        JSON.stringify(result)
      );

      navigate("/result", {
        state: { result },
      });

    } catch (err) {
      setError(err.message);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />

      <main className="flex-1 p-8">

        <div className="max-w-4xl mx-auto">

          <div className="mb-8">

            <h1 className="text-3xl font-bold text-slate-900">
              Stress Assessment
            </h1>

            <p className="text-slate-500 mt-2">
              Enter your current lifestyle and health information.
            </p>

          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8"
          >

            <div className="grid md:grid-cols-2 gap-6">

              {fields.map((field) => {
                const Icon = field.icon;

                return (
                  <div key={field.name}>

                    <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">

                      <Icon
                        size={18}
                        className="text-pink-500"
                      />

                      {field.label}

                    </label>

                    <div className="relative">

                      <input
                        type="number"
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleChange}
                        min={field.min}
                        max={field.max}
                        step={field.step}
                        required
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 pr-20 outline-none focus:ring-2 focus:ring-pink-300"
                      />

                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                        {field.unit}
                      </span>

                    </div>

                  </div>
                );
              })}

            </div>

            {error && (
              <p className="text-red-500 text-sm mt-5">
                {error}
              </p>
            )}

            <div className="flex justify-end mt-8">

              <button
                type="submit"
                disabled={loading}
                className="bg-pink-500 hover:bg-pink-600 disabled:opacity-60 text-white px-7 py-3 rounded-xl font-semibold transition"
              >
                {loading
                  ? "Analyzing..."
                  : "Check My Stress"}
              </button>

            </div>

          </form>

        </div>
      </main>
    </div>
  );
}

export default Assessment;