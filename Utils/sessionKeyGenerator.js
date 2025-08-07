import { randomBytes } from 'crypto';

// Generate a random session key
export const generateSessionKey = () => {
  return randomBytes(16).toString('hex'); // 32-character unique string
};


