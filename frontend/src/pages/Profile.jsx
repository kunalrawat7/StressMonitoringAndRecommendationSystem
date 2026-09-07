import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  User,
  Mail,
  CalendarDays,
  ClipboardList,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import { API_URL } from "../config";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] =
    useState(null);

  const [
    assessmentCount,
    setAssessmentCount,
  ] = useState(0);

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

    const currentUser =
      JSON.parse(storedUser);

    const fetchProfile = async () => {
      try {
        const [
          userResponse,
          assessmentResponse,
        ] = await Promise.all([
          fetch(
            `${API_URL}/users/${currentUser.id}`
          ),

          fetch(
            `${API_URL}/users/${currentUser.id}/assessments`
          ),
        ]);

        if (
          !userResponse.ok ||
          !assessmentResponse.ok
        ) {
          throw new Error(
            "Failed to load profile"
          );
        }

        const userData =
          await userResponse.json();

        const assessmentData =
          await assessmentResponse.json();

        setUser(userData);

        setAssessmentCount(
          assessmentData.length
        );

      } catch (err) {
        setError(err.message);

      } finally {
        setLoading(false);
      }
    };

    fetchProfile();

  }, [navigate]);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString(
      undefined,
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex">
        <Sidebar />

        <main className="flex-1 p-8">
          <p className="text-slate-500">
            Loading profile...
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />

      <main className="flex-1 p-8">

        <div className="max-w-4xl mx-auto">

          <div className="mb-8">

            <h1 className="text-3xl font-bold text-slate-900">
              Profile
            </h1>

            <p className="text-slate-500 mt-2">
              View your account and assessment information.
            </p>

          </div>

          {error && (
            <p className="text-red-500 mb-6">
              {error}
            </p>
          )}

          {user && (
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">

              <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-8">

                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm">

                  <User
                    size={36}
                    className="text-pink-500"
                  />

                </div>

                <h2 className="text-2xl font-bold text-slate-900 mt-4">
                  {user.name}
                </h2>

                <p className="text-slate-500">
                  Stress Monitor User
                </p>

              </div>

              <div className="p-8 grid md:grid-cols-2 gap-6">

                <ProfileItem
                  icon={Mail}
                  label="Email"
                  value={user.email}
                />

                <ProfileItem
                  icon={CalendarDays}
                  label="Member Since"
                  value={formatDate(
                    user.created_at
                  )}
                />

                <ProfileItem
                  icon={ClipboardList}
                  label="Total Assessments"
                  value={assessmentCount}
                />

                <ProfileItem
                  icon={User}
                  label="User ID"
                  value={user.id}
                />

              </div>

            </div>
          )}

        </div>
      </main>
    </div>
  );
}

function ProfileItem({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="flex items-start gap-4 border border-slate-100 rounded-xl p-4">

      <div className="bg-pink-50 p-3 rounded-xl">

        <Icon
          size={20}
          className="text-pink-500"
        />

      </div>

      <div>
        <p className="text-sm text-slate-500">
          {label}
        </p>

        <p className="font-semibold text-slate-900 mt-1">
          {value}
        </p>
      </div>

    </div>
  );
}

export default Profile;