export function validateDate(date) {
  const valid = new Date(date);

  if (valid == "Invalid Date") {
    return false;
  }

  return valid;
}
