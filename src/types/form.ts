export type FormStatus = "idle" | "submitting" | "success" | "error";

export type SignupPayload = {
  email: string;
  password: string;
};

export type ApiResponse = {
  status: "OK" | "ERROR";
};

export type SignupRecord = {
  email: string;
  timestamp: number;
};
