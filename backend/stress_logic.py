def calculate_stress(data):
    score = 0
    factors = []
    recommendations = []

    if data.sleep_duration < 6:
        score += 20
        factors.append("Low sleep duration")
        recommendations.append(
            "Try to get more consistent and sufficient sleep."
        )

    if data.work_hours > 10:
        score += 15
        factors.append("Long work hours")
        recommendations.append(
            "Take regular breaks and avoid excessive work hours."
        )

    if data.mood_level <= 2:
        score += 20
        factors.append("Low mood")
        recommendations.append(
            "Take time for relaxation and activities that help improve your mood."
        )

    if data.screen_time > 8:
        score += 10
        factors.append("High screen time")
        recommendations.append(
            "Reduce unnecessary screen time and take regular screen breaks."
        )

    if data.physical_activity < 30:
        score += 15
        factors.append("Low physical activity")
        recommendations.append(
            "Try to include at least some physical activity in your daily routine."
        )

    if data.heart_rate > 100:
        score += 10
        factors.append("High heart rate")
        recommendations.append(
            "Take some time to rest and monitor your heart rate."
        )

    if data.spo2 < 95:
        score += 10
        factors.append("Low SpO2")
        recommendations.append(
            "Monitor your oxygen level and consider seeking medical advice if it remains unusual."
        )

    if score <= 30:
        level = "Low"
    elif score <= 60:
        level = "Medium"
    else:
        level = "High"

    if level == "Low":
        summary = "Your current inputs indicate a low stress level."
    elif level == "Medium":
        summary = "Your current inputs indicate a moderate stress level."
    else:
        summary = "Your current inputs indicate a high stress level."

    if not recommendations:
        recommendations.append(
            "Keep maintaining your current healthy routine."
        )

    return score, level, summary, factors, recommendations