import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { FormStatus, SignupRecord } from "../types/form";
import mockAPI from "../utils/mockAPI";
import {
  hasSpecialCharacter,
  hasNumber,
  hasValidLength,
  isValidEmail,
} from "../utils/validation";

const validateFields = (email: string, password: string) => {
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

export const useSignupForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [feedback, setFeedback] = useState<string | null>(null);
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
  }, []);

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (isSubmittingRef.current) {
        return;
      }
      resetFeedback();

      const normalizedEmail = email.trim();
      const issues = validateFields(normalizedEmail, password);

      if (issues.length) {
        setStatus("error");
        setFeedback(issues.join(" "));
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
    setEmail,
    setPassword,
    handleSubmit,
    history,
    clearHistory,
  };
};
