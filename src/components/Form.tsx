import { useSignupForm } from "../hooks/useSignupForm";

export default function Form() {
  const {
    email,
    password,
    status,
    feedback,
    setEmail,
    setPassword,
    handleSubmit,
  } = useSignupForm();

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
