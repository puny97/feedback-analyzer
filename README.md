# Reviewly — Project Feedback Analyser

Reviewly is a small web app for understanding customer feedback. Enter a review
to get an AI-generated sentiment label, a score from 1 to 5, and a one-word
theme. The app uses a React frontend, a FastAPI backend, and Google's Gemini API.

## Requirements 

- Python 3.13
- [uv](https://docs.astral.sh/uv/)
- Node.js and npm
- A Google Gemini API key

## Setup

### 1. Configure the Gemini API key

Set `GEMINI_API_KEY` in your environment. For example, in PowerShell:

```powershell
$env:GEMINI_API_KEY = "your-gemini-api-key"
```

Keep the key private and do not commit it to source control.

### 2. Start the backend

From the repository root, install the Python dependencies and start the API:

```powershell
uv sync
uv run uvicorn main:app --app-dir src --reload --host 127.0.0.1 --port 8000
```

The API is available at `http://127.0.0.1:8000`. FastAPI's interactive
documentation is at `http://127.0.0.1:8000/docs`.

### 3. Configure and start the frontend

In a second terminal, create `frontend/.env.local` with the backend URL:

```dotenv
VITE_API_URL=http://127.0.0.1:8000
```

Then install the frontend dependencies and start Vite:

```powershell
cd frontend
npm ci
npm run dev
```

Open the local URL printed by Vite (by default, `http://localhost:5173`).

## API

`POST /analyze` accepts a JSON body containing the review text:

```json
{
  "text": "The food arrived quickly and tasted great."
}
```

The response contains the sentiment label (`positive`, `negative`, or
`neutral`), a score from 1 to 5, and a lowercase, one-word theme:

```json
{
  "label": "positive",
  "score": 5,
  "theme": "taste"
}
```

## Development

Run the frontend linter and production build from `frontend`:

```powershell
npm run lint
npm run build
```

## Project layout

```text
src/
  api.py        Review analysis endpoint and Gemini integration
  main.py       FastAPI application and CORS configuration
frontend/
  src/          React application
  package.json  Frontend scripts and dependencies
pyproject.toml  Python project metadata and dependencies

```
