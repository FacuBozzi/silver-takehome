import { useRef, useEffect } from "react";
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
    fieldErrors,
    setEmail,
    setPassword,
    handleSubmit,
    history,
    clearHistory,
  } = useSignupForm();
  const strength = usePasswordStrength(password);
  const formRef = useRef<HTMLFormElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  //focus first invalid field on error
  useEffect(() => {
    if (status === "error") {
      if (fieldErrors.email) {
        emailInputRef.current?.focus();
      } else if (fieldErrors.password) {
        passwordInputRef.current?.focus();
      }
    }
  }, [status, fieldErrors]);

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
            ref={emailInputRef}
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            aria-describedby={
              fieldErrors.email ? "email-error email-hint" : "email-hint"
            }
            aria-invalid={fieldErrors.email ? "true" : undefined}
          />
          <small id="email-hint" className="hint">
            Must contain "@" and a domain like "example.com".
          </small>
          {fieldErrors.email && (
            <span id="email-error" className="field-error" role="alert">
              {fieldErrors.email}
            </span>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="password">Password</label>
          <input
            ref={passwordInputRef}
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            aria-describedby={
              fieldErrors.password
                ? "password-error password-hint"
                : "password-hint"
            }
            aria-invalid={fieldErrors.password ? "true" : undefined}
          />
          <small id="password-hint" className="hint">
            Needs at least 8 chars, one number, and one special character.
          </small>
          {fieldErrors.password && (
            <span id="password-error" className="field-error" role="alert">
              {fieldErrors.password}
            </span>
          )}
          <PasswordChecklist rules={strength.ruleStates} />
        </div>

        <PasswordStrengthMeter
          label={strength.label}
          percent={strength.percent}
          passedRules={strength.passedRules}
        />

        {feedback && (
          <div
            className={`form-feedback form-feedback--${status}`}
            role={status === "error" ? "alert" : "status"}
            aria-live="polite"
          >
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
