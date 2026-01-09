import { FormEvent, useCallback, useState } from "react";
import { FormStatus } from "../types/form";
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

  const resetFeedback = useCallback(() => {
    setStatus("idle");
    setFeedback(null);
  }, []);

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      resetFeedback();

      const issues = validateFields(email.trim(), password);

      if (issues.length) {
        setStatus("error");
        setFeedback(issues.join(" "));
        return;
      }

      setStatus("submitting");

      try {
        const response = await mockAPI({ email: email.trim(), password });
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
    },
    [email, password, resetFeedback],
  );

  return {
    email,
    password,
    status,
    feedback,
    setEmail,
    setPassword,
    handleSubmit,
  };
};
