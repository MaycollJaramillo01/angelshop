export const addHours = (date: Date, hours: number): Date => {
  return new Date(date.getTime() + hours * 60 * 60 * 1000);
};

export const isPast = (date: Date): boolean => date.getTime() <= Date.now();
