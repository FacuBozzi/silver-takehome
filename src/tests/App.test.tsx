import { render, screen, fireEvent } from "@testing-library/react";
import Form from "../App";

test("renders the email and password inputs", () => {
  render(<Form />);
  expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
});

test("shows success message on valid submission", async () => {
  render(<Form />);

  fireEvent.change(screen.getByLabelText(/email/i), {
    target: { value: "test@example.com" },
  });
  fireEvent.change(screen.getByLabelText(/password/i), {
    target: { value: "Password123!" },
  });
  fireEvent.click(screen.getByRole("button", { name: /create account/i }));

  const successMsg = await screen.findByText(
    /success! your account has been created/i,
  );
  expect(successMsg).toBeInTheDocument();
});
