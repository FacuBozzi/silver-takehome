import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Form from "../App";

describe("Signup Form", () => {
  it("renders the email and password inputs", () => {
    render(<Form />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /create account/i }),
    ).toBeInTheDocument();
  });

  it("shows validation errors for invalid input", async () => {
    render(<Form />);

    const submitButton = screen.getByRole("button", {
      name: /create account/i,
    });

    // submitting empty fields
    fireEvent.click(submitButton);

    expect(
      await screen.findByText(/enter a valid email address/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/password needs at least one special character/i),
    ).toBeInTheDocument();
  });

  it("shows success message when form is valid and submitted", async () => {
    render(<Form />);

    // fill out the form
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "Password123!" },
    });

    fireEvent.click(screen.getByRole("button", { name: /create account/i }));

    // check for loading state
    expect(screen.getByText(/submitting.../i)).toBeInTheDocument();

    // wait for the mock API to finish (default 1000ms in our code)
    const successMsg = await screen.findByText(
      /success! your account has been created/i,
    );
    expect(successMsg).toBeInTheDocument();
  });

  it("shows API error for a repeated email", async () => {
    render(<Form />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "repeated@gmail.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "Password123!" },
    });

    fireEvent.click(screen.getByRole("button", { name: /create account/i }));

    const errorMsg = await screen.findByText(
      /this email is already registered/i,
    );
    expect(errorMsg).toBeInTheDocument();
  });
});
