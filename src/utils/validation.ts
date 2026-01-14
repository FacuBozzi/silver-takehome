export const hasSpecialCharacter = (value: string) =>
  /[^A-Za-z0-9]/.test(value);
export const hasNumber = (value: string) => /\d/.test(value);
export const hasValidLength = (value: string) => value.length >= 8;
export const isValidEmail = (value: string) => {
  //must have exactly one @ symbol
  const atIndex = value.indexOf("@");
  if (atIndex === -1 || value.lastIndexOf("@") !== atIndex) {
    return false;
  }

  const localPart = value.slice(0, atIndex);
  const domain = value.slice(atIndex + 1);

  //local part must be non-empty and not start/end with a dot
  if (
    !localPart ||
    localPart.startsWith(".") ||
    localPart.endsWith(".") ||
    localPart.includes("..")
  ) {
    return false;
  }

  //domain must have at least one dot, not at start/end, no consecutive dots
  const dotIndex = domain.indexOf(".");
  if (
    dotIndex === -1 ||
    dotIndex === 0 ||
    domain.endsWith(".") ||
    domain.includes("..")
  ) {
    return false;
  }

  //TLD must be at least 2 characters
  const tld = domain.slice(domain.lastIndexOf(".") + 1);
  if (tld.length < 2) {
    return false;
  }

  return true;
};

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
