import { randomBytes } from 'crypto';

export const generateCode = (): string => {
  return randomBytes(4).toString('hex').toUpperCase();
};
