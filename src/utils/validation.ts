export const hasSpecialCharacter = (value: string) => /[^A-Za-z0-9]/.test(value);
export const hasNumber = (value: string) => /\d/.test(value);
export const hasValidLength = (value: string) => value.length >= 8;
export const isValidEmail = (value: string) => /\S+@\S+\.\S+/.test(value);
