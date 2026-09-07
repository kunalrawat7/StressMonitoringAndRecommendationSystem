from pydantic import BaseModel, Field

class UserCreate(BaseModel):
    name: str
    email: str


class AssessmentCreate(BaseModel):
    user_id: int

    sleep_duration: float = Field(ge=0, le=24)
    work_hours: float = Field(ge=0, le=24)
    mood_level: int = Field(ge=1, le=5)
    screen_time: float = Field(ge=0, le=24)
    physical_activity: float = Field(ge=0, le=1440)
    heart_rate: int = Field(ge=30, le=220)
    spo2: float = Field(ge=50, le=100)