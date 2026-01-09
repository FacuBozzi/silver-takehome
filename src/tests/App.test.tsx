import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Form from "../components/Form";

beforeEach(() => {
  localStorage.clear();
});

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
    undefined,
    { timeout: 2000 },
  );
  expect(successMsg).toBeInTheDocument();
});

test("submits via keyboard shortcut", async () => {
  render(<Form />);

  fireEvent.change(screen.getByLabelText(/email/i), {
    target: { value: "shortcut@example.com" },
  });
  fireEvent.change(screen.getByLabelText(/password/i), {
    target: { value: "Password123!" },
  });

  fireEvent.keyDown(screen.getByTestId("signup-form"), {
    key: "Enter",
    ctrlKey: true,
  });

  const successMsg = await screen.findByText(
    /success! your account has been created/i,
    undefined,
    { timeout: 2000 },
  );
  expect(successMsg).toBeInTheDocument();
});

test("persists signup history in localStorage", async () => {
  const { unmount } = render(<Form />);

  fireEvent.change(screen.getByLabelText(/email/i), {
    target: { value: "history@example.com" },
  });
  fireEvent.change(screen.getByLabelText(/password/i), {
    target: { value: "Password123!" },
  });
  fireEvent.click(screen.getByRole("button", { name: /create account/i }));

  await screen.findByText(
    /success! your account has been created/i,
    undefined,
    {
      timeout: 2000,
    },
  );

  await waitFor(() =>
    expect(
      screen.getByRole("heading", { name: /recent signups/i }),
    ).toBeInTheDocument(),
  );

  unmount();

  render(<Form />);

  await waitFor(() =>
    expect(
      screen.getByRole("heading", { name: /recent signups/i }),
    ).toBeInTheDocument(),
  );
  expect(screen.getByText(/history@example.com/i)).toBeInTheDocument();
});

test("clears signup history when clear button is pressed", async () => {
  render(<Form />);

  fireEvent.change(screen.getByLabelText(/email/i), {
    target: { value: "clear@example.com" },
  });
  fireEvent.change(screen.getByLabelText(/password/i), {
    target: { value: "Password123!" },
  });
  fireEvent.click(screen.getByRole("button", { name: /create account/i }));

  await screen.findByText(
    /success! your account has been created/i,
    undefined,
    {
      timeout: 2000,
    },
  );

  await screen.findByRole("heading", { name: /recent signups/i });

  const clearButton = await screen.findByRole("button", {
    name: /clear recent signup history/i,
  });

  fireEvent.click(clearButton);

  await waitFor(() =>
    expect(
      screen.queryByRole("heading", { name: /recent signups/i }),
    ).not.toBeInTheDocument(),
  );

  expect(localStorage.getItem("signupHistory")).toBeNull();
});

test("prevents duplicate signup when email exists in history", async () => {
  render(<Form />);

  fireEvent.change(screen.getByLabelText(/email/i), {
    target: { value: "dupe@example.com" },
  });
  fireEvent.change(screen.getByLabelText(/password/i), {
    target: { value: "Password123!" },
  });
  fireEvent.click(screen.getByRole("button", { name: /create account/i }));

  await screen.findByText(
    /success! your account has been created/i,
    undefined,
    {
      timeout: 2000,
    },
  );

  fireEvent.change(screen.getByLabelText(/email/i), {
    target: { value: "DUPE@example.com" },
  });
  fireEvent.change(screen.getByLabelText(/password/i), {
    target: { value: "Newpassword1!" },
  });
  fireEvent.click(screen.getByRole("button", { name: /create account/i }));

  expect(
    await screen.findByText(/already signed up on this device/i),
  ).toBeInTheDocument();

  const historyItems = screen.getAllByRole("listitem");
  expect(historyItems).toHaveLength(1);
});
