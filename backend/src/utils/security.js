/**
 * Security & Encryption Utility for Shakti Platform
 * - AES-256-GCM authenticated encryption for sensitive Aadhaar numbers
 * - Blind indexing (HMAC-SHA256) for privacy-preserving duplicate detection
 * - UIDAI Verhoeff algorithm validation for Aadhaar number correctness
 * - Masking utility for safe UI presentation
 */

const crypto = require('crypto');

// Derive 32-byte encryption key
const RAW_KEY = process.env.ENCRYPTION_KEY || process.env.JWT_SECRET || 'shakti_super_secret_encryption_key_32bytes!';
const ENCRYPTION_KEY = crypto.createHash('sha256').update(RAW_KEY).digest(); // Exactly 32 bytes

// Verhoeff algorithm multiplication and permutation tables
const d_table = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
  [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
  [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
  [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
  [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
  [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
  [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
  [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
  [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
];

const p_table = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
  [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
  [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
  [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
  [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
  [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
  [7, 0, 4, 6, 9, 1, 3, 2, 5, 8]
];

/**
 * Validates whether an Aadhaar number is mathematically valid using Verhoeff checksum.
 */
function validateAadhaar(aadhaar) {
  if (!aadhaar) return false;
  const clean = String(aadhaar).replace(/\D/g, '');
  if (clean.length !== 12) return false;
  // Aadhaar cannot start with 0 or 1
  if (clean[0] === '0' || clean[0] === '1') return false;

  let c = 0;
  const invertedArray = clean.split('').map(Number).reverse();
  for (let i = 0; i < invertedArray.length; i++) {
    c = d_table[c][p_table[i % 8][invertedArray[i]]];
  }
  return c === 0;
}

/**
 * Encrypts an Aadhaar number using AES-256-GCM.
 * Returns { encrypted: "iv:authTag:ciphertext", last4: "1234", hash: "hmac..." }
 */
function encryptAadhaar(aadhaar) {
  const clean = String(aadhaar).replace(/\D/g, '');
  if (clean.length !== 12) {
    throw new Error('Aadhaar number must be exactly 12 digits');
  }

  const iv = crypto.randomBytes(12); // 96-bit IV recommended for GCM
  const cipher = crypto.createCipheriv('aes-256-gcm', ENCRYPTION_KEY, iv);
  
  let ciphertext = cipher.update(clean, 'utf8', 'hex');
  ciphertext += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');

  // Packed string: iv:tag:ciphertext
  const encrypted = `${iv.toString('hex')}:${authTag}:${ciphertext}`;

  // Blind index for duplicate detection
  const hash = crypto.createHmac('sha256', ENCRYPTION_KEY).update(clean).digest('hex');

  const last4 = clean.slice(-4);

  return {
    encrypted,
    hash,
    last4,
    masked: `•••• •••• ${last4}`
  };
}

/**
 * Decrypts an AES-256-GCM encrypted Aadhaar string.
 */
function decryptAadhaar(encryptedString) {
  if (!encryptedString || !encryptedString.includes(':')) return null;
  const [ivHex, tagHex, ciphertextHex] = encryptedString.split(':');
  
  const iv = Buffer.from(ivHex, 'hex');
  const tag = Buffer.from(tagHex, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-gcm', ENCRYPTION_KEY, iv);
  decipher.setAuthTag(tag);

  let decrypted = decipher.update(ciphertextHex, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

/**
 * Masks an Aadhaar string for public display (e.g. "•••• •••• 9012").
 */
function maskAadhaar(aadhaarOrLast4) {
  if (!aadhaarOrLast4) return '';
  const clean = String(aadhaarOrLast4).replace(/\D/g, '');
  const last4 = clean.length >= 4 ? clean.slice(-4) : clean.padStart(4, '0');
  return `•••• •••• ${last4}`;
}

module.exports = {
  validateAadhaar,
  encryptAadhaar,
  decryptAadhaar,
  maskAadhaar,
};
