export type Day = {
  [key: string]: number | string | boolean;
  day: number;
  date: string;
  year: string;
  name: string;
  lastMonth: boolean;
  weekNumber: number;
};

export type EventsByYear = { [key: string]: { [key: string]: Event[] } };
