# Mahim AI

A small, responsive AI workspace and project browser made from the ideas and catalog in [Shubhamsaboo/awesome-llm-apps](https://github.com/Shubhamsaboo/awesome-llm-apps).

## What is included

- **App Library:** searchable catalog of 122 projects across 16 categories, parsed from the source repository's README; each card links to its original source.
- **AI Chat:** general, research, travel, writing, and document-oriented modes. Uses a server-side OpenAI-compatible chat-completions proxy when configured; clearly labelled demo mode otherwise.
- **Document Q&A:** browser-side upload and preview for UTF-8 TXT, Markdown, CSV, JSON, and LOG files (up to 200 KB). Document text is sent to the configured provider only after you ask a question.
- **Agent Studio:** prompt starters inspired by selected repository projects.
- **Favorites and chat history:** saved in this browser's local storage.
- **No frontend framework or third-party package required.** The API key stays on the server, not in browser storage.

> Mahim AI is a hub/prototype, not a one-click integration of all 122 independent source apps. Each repository project may have its own dependencies, API requirements, and setup instructions. Review the original project before running or deploying it.

## Run locally

Requires Python 3.9+.

```bash
python3 server.py
```

Open <http://localhost:8000>.

## Publish a demo on Render (free tier)

1. Put the contents of this folder at the root of a GitHub repository and push it.
2. In Render, choose **New → Blueprint** and connect that repository. Render will read `render.yaml` and create the Python web service. You can also choose **New → Web Service** manually, with build command `echo "No third-party dependencies required"` and start command `python3 server.py`.
3. Use the generated `https://…onrender.com` URL on your phone. The app is responsive; in the mobile browser, use **Add to Home Screen** if you want an app-like shortcut.

Render's free web services sleep after 15 minutes without inbound traffic and can take about a minute to wake. The free instance-hour allowance is shared across the workspace. The app starts safely in demo mode without an AI key.

**Security:** the current prototype does not include a user login. Do not add a paid AI API key to a public deployment until you have added access protection; otherwise anyone who finds the URL could use the chat endpoint and consume your API quota. For personal mobile use, add a password/login gate before enabling live AI.

## Enable live AI locally

1. Copy `.env.example` to `.env`.
2. Set your provider credentials in `.env`:

   ```dotenv
   OPENAI_API_KEY=your_real_key
   OPENAI_MODEL=gpt-4o-mini
   OPENAI_BASE_URL=https://api.openai.com/v1
   ```

3. Restart `python3 server.py`.

The backend accepts an OpenAI-compatible `/chat/completions` endpoint, so you can change `OPENAI_BASE_URL` and `OPENAI_MODEL` for a compatible provider. Never commit `.env` or publish a live API key. If you deploy this app publicly, add authentication, rate limiting, and HTTPS first.

## Source and attribution

The project catalog's titles, descriptions, and links are indexed from [awesome-llm-apps](https://github.com/Shubhamsaboo/awesome-llm-apps), licensed under Apache-2.0. This app is an independent interface and does not copy or run all of the linked backends.
