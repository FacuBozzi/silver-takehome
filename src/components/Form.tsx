import { useRef } from "react";
import type { KeyboardEvent } from "react";
import { useSignupForm } from "../hooks/useSignupForm";
import { usePasswordStrength } from "../hooks/usePasswordStrength";
import PasswordChecklist from "./PasswordChecklist";
import PasswordStrengthMeter from "./PasswordStrengthMeter";
import SignupHistory from "./SignupHistory";

export default function Form() {
  const {
    email,
    password,
    status,
    feedback,
    setEmail,
    setPassword,
    handleSubmit,
    history,
    clearHistory,
  } = useSignupForm();
  const strength = usePasswordStrength(password);
  const formRef = useRef<HTMLFormElement>(null);

  const handleShortcut = (event: KeyboardEvent<HTMLFormElement>) => {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      event.preventDefault();
      if (status !== "submitting") {
        formRef.current?.requestSubmit();
      }
    }
  };

  return (
    <section className="form-card" aria-live="polite">
      <header className="form-card__header">
        <h2>Create your account</h2>
        <p>
          Fill in your email and a strong password that follows the rules listed
          below.
        </p>
      </header>

      <form
        ref={formRef}
        data-testid="signup-form"
        className="signup-form"
        noValidate
        onSubmit={handleSubmit}
        onKeyDown={handleShortcut}
      >
        <div className="form-field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            aria-describedby="email-hint"
          />
          <small id="email-hint" className="hint">
            Must contain “@” and a domain like “example.com”.
          </small>
        </div>

        <div className="form-field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            aria-describedby="password-hint"
          />
          <small id="password-hint" className="hint">
            Needs at least 8 chars, one number, and one special character.
          </small>
          <PasswordChecklist rules={strength.ruleStates} />
        </div>

        <PasswordStrengthMeter
          label={strength.label}
          percent={strength.percent}
          passedRules={strength.passedRules}
        />

        {feedback && (
          <div className={`form-feedback form-feedback--${status}`}>
            {feedback}
          </div>
        )}

        <button
          type="submit"
          className="primary-btn"
          disabled={status === "submitting"}
        >
          {status === "submitting" ? "Submitting..." : "Create account"}
        </button>
        <p className="shortcut-hint">
          Tip: Press ⌘ + Enter (Mac) or Ctrl + Enter (Win/Linux) to submit from
          the keyboard.
        </p>
      </form>

      <SignupHistory history={history} onClear={clearHistory} />
    </section>
  );
}
