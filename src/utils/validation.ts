export const hasSpecialCharacter = (value: string) => /[^A-Za-z0-9]/.test(value);
export const hasNumber = (value: string) => /\d/.test(value);
export const hasValidLength = (value: string) => value.length >= 8;
export const isValidEmail = (value: string) => /\S+@\S+\.\S+/.test(value);

export const passwordRuleChecks = [
  {
    label: "At least one special character",
    check: hasSpecialCharacter,
  },
  {
    label: "At least one number",
    check: hasNumber,
  },
  {
    label: "Minimum of 8 characters",
    check: hasValidLength,
  },
];
