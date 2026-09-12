import type { JpDate } from '@/types/rirekisho';

export function calculateAge(dob: JpDate, today: Date = new Date()): number {
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth() + 1;

  let age = todayYear - dob.year;
  if (todayMonth < dob.month) {
    age--;
  }
  return age;
}
