# Cashmere Frontend Take Home

Build a responsive, dynamic, single-page application using **Next.js** that allows users to create and manage a multimedia portfolio. Users should be able to:

- Upload images and videos.
- Provide descriptions and metadata for each item.
- Organize portfolio items into expandable/collapsible sections.
- View a live preview of the portfolio.
- Save their portfolio by interacting with a backend API.

You are encouraged to make the UI polished and user-friendly, and demonstrate thoughtful state management and code organization. Bonus points for animations, elegant component abstractions, or enhancements to UX.

**🔎 You can use any coding tools that you like but you must be able to explain every line of code and what it does.**

---

## Technical Requirements

### Frontend (Next.js, React, Tailwind (optional))

- **File Upload**:
  - Allow image/video uploads via a form.
  - Preview uploaded media before submitting.

- **State Management**:
  - Use React Context, Redux, or any state solution to manage portfolio state.

- **Dynamic UI**:
  - Show/hide metadata fields based on file type.
  - Dynamically update portfolio preview as users make changes.

- **Expandable/Collapsible Sections**:
  - Group portfolio items into categories (e.g., "Photography", "Video Work").
  - Each group should be collapsible.

- **Persistence**:
  - Send portfolio data to a backend via API.
  - Allow users to save and then reload previously saved portfolios.

- **Creative UI**:
  - Provide a live visual preview area for the portfolio.
  - Style and layout is up to you — treat this like a real-world portfolio site.

---

## Backend
**Completing the API**
Please fill in the blank for the `POST /upload` endpoint to make the endpoint functional

Run the server using the following:
```bash
pip install fastapi uvicorn python-multipart pydantic
uvicorn main:app --reload
```

You are free to modify all existing code, plug in a database solution or add endpoints as you see fit.

---

## Submission Instructions

1. Fork the GitHub starter repo or create your own.
2. Include a `README.md` with:
   - Setup instructions.
   - Screenshots or a brief walkthrough of your UX.
   - Any additional features you built.
   - Any future improvements and features.
3. Provide a zip or GitHub link for both frontend and backend code.
4. (optional) deploy the backend and frontend (e.g. Render, Heroku)

---

## Evaluation Criteria

- Code quality, modularity, and readability.
- UX and UI polish.
- Proper use of React patterns and state management.
- Successful integration with FastAPI.
- Creative enhancements beyond the core requirements.
