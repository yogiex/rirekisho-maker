/** 満年齢 (full age). `today` injected for determinism (RULES §9). */
export function getFullAge(
  dob: { year: number; month: number; day: number },
  today: Date,
): number {
  let age = today.getFullYear() - dob.year;
  const month = today.getMonth() + 1;
  const day = today.getDate();
  if (month < dob.month || (month === dob.month && day < dob.day)) age -= 1;
  return Math.max(age, 0);
}
