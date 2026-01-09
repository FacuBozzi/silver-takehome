# Signup Form Challenge

This repo implements the Silver.dev take-home Signup Form challenge. The app renders a reusable `<Form />` component inside `src/App.tsx` that validates user input, calls the provided mock `API`, and surfaces success/error feedback with polished styling and accessibility affordances.

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

Tests run with Jest (via `react-scripts test`) and React Testing Library to simulate real user interaction.

- **Run the suite (watch mode)**
  ```bash
  npm test
  ```
- **CI-style single run (no watch)**
  ```bash
  CI=true npm test
  ```

## 3. Manual verification checklist

Follow these usage scenarios after running `npm start` to confirm the product requirements end-to-end:

1. **Invalid email**
   - Type `invalid-email` (or `invalid-email@gmail`/`invalid-email.com`) in the Email field and a valid password (e.g., `Password1!`).
   - Click `Create account`.
   - Verify the inline feedback reads “Please enter a valid email address…”.
2. **Fail each password rule**
   - Use `valid@example.com` and try passwords missing each rule (no special char, no number, <8 chars).
   - Confirm the feedback lists every violated rule so the user knows what to fix.
3. **Duplicate email scenario**
   - Use email `repeated@gmail.com` with `Password123!` (or any valid password).
   - Submit and wait ~1 second (mock API delay). You should see “This email is already registered. Try another one.”
4. **Successful signup**
   - Use any other email (e.g., `newuser@example.com`) and `Password123!`.
   - Submit and verify:
     - Button shows “Submitting…” and is disabled during the request.
     - Success message “Success! Your account has been created.” appears.
     - Inputs clear back to empty strings.
5. **Password strength meter & checklist**
   - While typing different passwords, watch the checklist badges toggle and the strength bar label move from “Needs work” → “Excellent” as more rules are satisfied.
6. **Keyboard shortcut**
   - With focus anywhere inside the form, press `Ctrl + Enter` (or `⌘ + Enter` on macOS); verify it submits just like clicking the button.
7. **Recent signup history**
   - After a successful signup, a “Recent signups” panel appears with the email/timestamp. Refresh the page—it should persist thanks to `localStorage`. Use the `Clear history` button to remove all entries (and verify the panel disappears + storage clears).
   - Attempt another signup using the exact same email (case-insensitive) without clearing history; the form should block it locally with an inline message about that email already being registered on this device.

## 4. Surprise features

- **Live password strength system** — Requirement badges update in real time and feed a strength bar so users know exactly which rule they’re missing.
- **Power-user keyboard shortcut** — `Ctrl/⌘ + Enter` submits the form instantly; a tooltip reminds reviewers of the shortcut.
- **Recent signup history** — Successful submissions are cached (locally) and rendered in a mini activity log with a “Clear history” control and duplicate-email guard, showcasing state persistence patterns and lifecycle hygiene.

## 5. Technical decisions & trade-offs

- **Typed validation helpers** — Email/password checks live in small pure functions (`hasSpecialCharacter`, `hasNumber`, etc.) to keep `handleSubmit` readable and make reuse trivial.
- **Union status + typed API** — `FormStatus` and `ApiResponse` unions drive UI state (loading/disabled feedback) and solve TS’s `unknown` response warning. Typing the mock API (now exported from `utils/mockAPI.ts`) also makes it easy to swap in a real endpoint.
- **Dedicated form module + shared types + hook** — `components/Form.tsx` stays presentational while `hooks/useSignupForm.ts` centralizes validation/submission/history logic, and `types/form.ts` shares the shape definitions. This separation keeps `App.tsx` focused on composition and makes reuse/extensibility easier.
- **Accessibility & UX polish** — `aria-live="polite"`, descriptive helper text, focus outlines, and disabled states reduce surprises for keyboard or screen-reader users beyond the bare minimum spec.
- **Pure CSS styling** — Since Tailwind (my usual go-to) wasn’t part of the starter `package.json`, I inferred sticking with vanilla CSS was safest. Everything lives in `styles.css` (card layout, responsive padding, focus outlines) to stay lightweight but polished.
- **Testing stack** — Jest + Testing Library mirrors how a user interacts with the DOM. Specs cover validation, API error, success flow, and disabled-button states to prevent regressions in critical UX paths.

Trade-off: sticking to a hand-rolled form instead of pulling a form library (Formik, React Hook Form) keeps dependencies minimal but means validation logic is manual. Given the tight scope, this was an acceptable trade, and the extra validation/a11y polish plus focused docs go the extra mile without bloating dependencies.
