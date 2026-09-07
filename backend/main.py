from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from database import engine, Base, get_db
from stress_logic import calculate_stress

import models
import schemas


app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://stress-monitoring-system-henna.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


Base.metadata.create_all(bind=engine)


@app.get("/")
def home():
    return {
        "message": "Stress Management API is working"
    }


@app.post("/users")
def create_user(
    user: schemas.UserCreate,
    db: Session = Depends(get_db)
):
    existing_user = db.query(models.User).filter(
        models.User.email == user.email
    ).first()

    if existing_user:
        return existing_user

    new_user = models.User(
        name=user.name,
        email=user.email
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


@app.get("/users/{user_id}")
def get_user(
    user_id: int,
    db: Session = Depends(get_db)
):
    user = db.query(models.User).filter(
        models.User.id == user_id
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return user


@app.post("/assessments")
def create_assessment(
    assessment: schemas.AssessmentCreate,
    db: Session = Depends(get_db)
):
    user = db.query(models.User).filter(
        models.User.id == assessment.user_id
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    score, level, summary, factors, recommendations = calculate_stress(
        assessment
    )

    new_assessment = models.Assessment(
        user_id=assessment.user_id,
        sleep_duration=assessment.sleep_duration,
        work_hours=assessment.work_hours,
        mood_level=assessment.mood_level,
        screen_time=assessment.screen_time,
        physical_activity=assessment.physical_activity,
        heart_rate=assessment.heart_rate,
        spo2=assessment.spo2,
        stress_score=score,
        stress_level=level
    )

    db.add(new_assessment)
    db.commit()
    db.refresh(new_assessment)

    return {
        "assessment_id": new_assessment.id,
        "stress_score": score,
        "stress_level": level,
        "summary": summary,
        "factors": factors,
        "recommendations": recommendations,
        "created_at": new_assessment.created_at
    }


@app.get("/users/{user_id}/assessments")
def get_user_assessments(
    user_id: int,
    db: Session = Depends(get_db)
):
    user = db.query(models.User).filter(
        models.User.id == user_id
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    assessments = db.query(models.Assessment).filter(
        models.Assessment.user_id == user_id
    ).order_by(
        models.Assessment.created_at.desc()
    ).all()

    return assessments

@app.get("/users-by-email")
def get_user_by_email(
    email: str,
    db: Session = Depends(get_db)
):
    user = db.query(models.User).filter(
        models.User.email == email
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return user