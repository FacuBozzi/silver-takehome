import { ApiResponse, SignupPayload } from "../types/form";

const API = (data: SignupPayload): Promise<ApiResponse> =>
  new Promise((res) => {
    const isRepeated = data.email === "repeated@gmail.com";
    setTimeout(
      () =>
        res({
          status: isRepeated ? "ERROR" : "OK",
        }),
      1000,
    );
  });

export default API;
