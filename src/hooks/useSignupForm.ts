import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { FormStatus, SignupRecord } from "../types/form";
import mockAPI from "../utils/mockAPI";
import {
  hasSpecialCharacter,
  hasNumber,
  hasValidLength,
  isValidEmail,
} from "../utils/validation";

export interface FieldErrors {
  email: string | null;
  password: string | null;
}

const validateFields = (email: string, password: string): FieldErrors => {
  const errors: FieldErrors = { email: null, password: null };

  if (!isValidEmail(email)) {
    errors.email =
      'Please enter a valid email address that includes "@" and a domain.';
  }

  const passwordIssues: string[] = [];
  if (!hasSpecialCharacter(password)) {
    passwordIssues.push("at least one special character");
  }
  if (!hasNumber(password)) {
    passwordIssues.push("at least one number");
  }
  if (!hasValidLength(password)) {
    passwordIssues.push("at least 8 characters");
  }

  if (passwordIssues.length) {
    errors.password = `Password needs ${passwordIssues.join(", ")}.`;
  }

  return errors;
};

export const useSignupForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({
    email: null,
    password: null,
  });
  const [history, setHistory] = useState<SignupRecord[]>([]);
  const isSubmittingRef = useRef(false);

  useEffect(() => {
    const stored = localStorage.getItem("signupHistory");
    if (stored) {
      try {
        setHistory(JSON.parse(stored));
      } catch (error) {
        console.error("Failed to parse signup history", error);
      }
    }
  }, []);

  const persistHistory = useCallback((records: SignupRecord[]) => {
    setHistory(records);
    localStorage.setItem("signupHistory", JSON.stringify(records));
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem("signupHistory");
  }, []);

  const resetFeedback = useCallback(() => {
    setStatus("idle");
    setFeedback(null);
    setFieldErrors({ email: null, password: null });
  }, []);

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (isSubmittingRef.current) {
        return;
      }
      resetFeedback();

      const normalizedEmail = email.trim();
      const errors = validateFields(normalizedEmail, password);
      const hasErrors = errors.email || errors.password;

      if (hasErrors) {
        setStatus("error");
        setFieldErrors(errors);
        const messages = [errors.email, errors.password]
          .filter(Boolean)
          .join(" ");
        setFeedback(messages);
        return;
      }

      const alreadySignedUp = history.some(
        (entry) => entry.email.toLowerCase() === normalizedEmail.toLowerCase(),
      );

      if (alreadySignedUp) {
        setStatus("error");
        setFeedback(
          "This email already signed up on this device. Try a different one.",
        );
        return;
      }

      setStatus("submitting");
      isSubmittingRef.current = true;

      try {
        const response = await mockAPI({ email: normalizedEmail, password });
        if (response.status === "OK") {
          const timestamp = Date.now();
          const newRecord: SignupRecord = { email: normalizedEmail, timestamp };

          setStatus("success");
          setFeedback("Success! Your account has been created.");
          setEmail("");
          setPassword("");
          persistHistory([newRecord, ...history].slice(0, 5));
        } else {
          setStatus("error");
          setFeedback("This email is already registered. Try another one.");
        }
      } catch (error) {
        setStatus("error");
        setFeedback("Something went wrong. Please try again.");
        console.error(error);
      } finally {
        isSubmittingRef.current = false;
      }
    },
    [email, password, history, persistHistory, resetFeedback],
  );

  return {
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
  };
};
