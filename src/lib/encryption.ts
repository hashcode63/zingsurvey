// src/lib/encryption.ts
import crypto from 'crypto';

// Encryption key from environment variables
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
const IV_LENGTH = 16; // For AES, this is always 16

// Encrypt sensitive data
export function encrypt(text: string): string {
  if (!ENCRYPTION_KEY) throw new Error('Encryption key is not set');
  
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(
    'aes-256-cbc',
    Buffer.from(ENCRYPTION_KEY),
    iv
  );
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  // Return iv + encrypted data
  return `${iv.toString('hex')}:${encrypted}`;
}

// Decrypt sensitive data
export function decrypt(text: string): string {
  if (!ENCRYPTION_KEY) throw new Error('Encryption key is not set');
  
  const parts = text.split(':');
  const iv = Buffer.from(parts[0], 'hex');
  const encryptedText = parts[1];
  
  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    Buffer.from(ENCRYPTION_KEY),
    iv
  );
  
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

// Generate a secure reference ID
export function generateReference(): string {
  return `ZING-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
}

// Verify a signature for webhooks
export function verifySignature(payload: string, signature: string): boolean {
  if (!process.env.PAYMENT_SECRET_KEY) throw new Error('Payment secret key is not set');
  
  const hmac = crypto.createHmac('sha256', process.env.PAYMENT_SECRET_KEY);
  const calculatedSignature = hmac.update(payload).digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(calculatedSignature),
    Buffer.from(signature)
  );
}