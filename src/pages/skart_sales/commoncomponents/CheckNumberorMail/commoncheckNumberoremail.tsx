export const CheckNumberOrEMail = (value: any, forwhat: string) => {
  const numbers = /^[-+]?[0-9]+$/;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (forwhat == "num" && value.match(numbers)) {
    return true;
  } else if (forwhat == "email" && emailPattern.test(value)) {
    return true;
  }
};
