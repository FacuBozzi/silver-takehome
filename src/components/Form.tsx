import { FormEvent, useState } from "react";
import { ApiResponse, FormStatus, SignupPayload } from "../types/form";
import {
  hasSpecialCharacter,
  hasNumber,
  hasValidLength,
  isValidEmail,
} from "../utils/validation";
import API from "../utils/mockAPI";

export default function Form() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [feedback, setFeedback] = useState<string | null>(null);

  const resetFeedback = () => {
    setStatus("idle");
    setFeedback(null);
  };

  const validate = () => {
    const issues: string[] = [];

    if (!isValidEmail(email)) {
      issues.push(
        "Please enter a valid email address that includes “@” and a domain.",
      );
    }

    if (!hasSpecialCharacter(password)) {
      issues.push("Password needs at least one special character.");
    }

    if (!hasNumber(password)) {
      issues.push("Password needs at least one number.");
    }

    if (!hasValidLength(password)) {
      issues.push("Password needs to be at least 8 characters long.");
    }

    return issues;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    resetFeedback();

    const issues = validate();

    if (issues.length) {
      setStatus("error");
      setFeedback(issues.join(" "));
      return;
    }

    setStatus("submitting");

    try {
      const response = await API({ email, password });
      if (response.status === "OK") {
        setStatus("success");
        setFeedback("Success! Your account has been created.");
        setEmail("");
        setPassword("");
      } else {
        setStatus("error");
        setFeedback("This email is already registered. Try another one.");
      }
    } catch (error) {
      setStatus("error");
      setFeedback("Something went wrong. Please try again.");
      console.error(error);
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

      <form className="signup-form" noValidate onSubmit={handleSubmit}>
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
        </div>

        <section className="requirements">
          <h3>Password Requirements</h3>
          <ul>
            <li>At least one special character</li>
            <li>At least one number</li>
            <li>Minimum of 8 characters</li>
          </ul>
        </section>

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
      </form>
    </section>
  );
}
