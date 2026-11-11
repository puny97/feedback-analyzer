from dotenv import load_dotenv
from fastapi import APIRouter
from google import genai
from google.genai import types
from pydantic import BaseModel

load_dotenv()
client = genai.Client()

router = APIRouter()


class Review(BaseModel):
    text: str


class Analysis(BaseModel):
    label: str
    score: int
    theme: str


@router.post("/analyze")


def analyze(review: Review):
    response = client.models.generate_content(
        model="gemini-3.8-flash",
        contents=(
            "Analyze this customer review \n"
            "label must be 'positive', 'negative', or 'neutral' \n"
            "score must be a number from 1 (very bad) to 5 (very good) \n"
            "theme must be ONE lowercase word for the main topic \n"
            "(for example: delivery, taste, price,service, quality). \n"
            f"Review: {review.text}"
        ),
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=Analysis,
        ),
    )
    return response.parsed
