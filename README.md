# Signup Form Challenge

This repo implements the take-home Signup Form challenge. The app renders a reusable `<Form />` component inside `src/App.tsx` that validates user input, calls the provided mock `API`, and surfaces success/error feedback with polished styling and accessibility affordances.

## 1. Getting Started (fresh install)

1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Start the dev server**
   ```bash
   npm start
   ```
   The app runs on <http://localhost:3000>. Hot reload is enabled via Create React App.
3. **Run the production build (sanity check)**
   ```bash
   npm run build
   ```
   This ensures the code compiles without type errors.

## 2. Testing the project

The project uses Vitest plus Testing Library to assert the form’s behavior.

- **Run the full suite once**
  ```bash
  npx vitest run
  ```
- **Run in watch/UI mode (optional)**
  ```bash
  npx vitest
  ```

## 3. Manual verification checklist

Follow these usage scenarios after running `npm start` to confirm the product requirements end-to-end:

1. **Invalid email**
   - Type `invalid-email` in the Email field and a valid password (e.g., `Password1!`).
   - Click `Create account`.
   - Verify the inline feedback reads “Please enter a valid email address…”.
2. **Fail each password rule**
   - Use `valid@example.com` and try passwords missing each rule (no special char, no number, <8 chars).
   - Confirm the feedback lists every violated rule so the user knows what to fix.
3. **Duplicate email scenario**
   - Use email `repeated@gmail.com` with `Password123!`.
   - Submit and wait ~1 second (mock API delay). You should see “This email is already registered. Try another one.”
4. **Successful signup**
   - Use any other email (e.g., `newuser@example.com`) and `Password123!`.
   - Submit and verify:
     - Button shows “Submitting…” and is disabled during the request.
     - Success message “Success! Your account has been created.” appears.
     - Inputs clear back to empty strings.

## 4. Technical decisions & trade-offs

- **Typed validation helpers** — Email/password checks live in small pure functions (`hasSpecialCharacter`, `hasNumber`, etc.) to keep `handleSubmit` readable and make future reuse trivial.
- **Union status + typed API** — `FormStatus` and `ApiResponse` unions drive UI state (loading/disabled feedback) and solve TS’s `unknown` response warning. Typing the mock API also makes it easy to swap with a real endpoint.
- **Single component for clarity** — Requirements are limited, so keeping the form inline in `App.tsx` avoids unnecessary prop drilling while still exposing a clean `<Form />` unit the tests can render directly.
- **Pure CSS styling** — Requirements forbid extra UI libs, so the look is achieved with a single `styles.css` file (card layout, responsive padding, focus outlines) to stay lightweight but polished.
- **Testing stack** — Vitest + Testing Library mirrors how a user interacts with the DOM. Tests cover validation, API error, success flow, and disabled-button states to prevent regressions in critical UX paths.

Trade-off: sticking to a hand-rolled form instead of pulling a form library (Formik, React Hook Form) keeps dependencies minimal but means validation logic is manual. Given the tight scope, this was an acceptable trade.

## 5. Extra mile highlights

1. **Accessibility & UX polish** — `aria-live="polite"`, descriptive hints, and disabled states reduce surprises for keyboard or screen-reader users beyond the bare minimum spec.
2. **Robust automated tests** — Added high-signal Vitest specs so the reviewer can verify the expected behavior non-interactively.
3. **Detailed documentation & verification steps** — This README spells out exactly how to run, test, and validate the scenarios so interviewers don’t have to guess, satisfying the “no troubleshooting” goal.

These additions go beyond the original bullet list yet stay aligned with the challenge scope, providing a reviewer-quality experience.
