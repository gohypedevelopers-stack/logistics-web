import crypto from "crypto";

const DEFAULT_EXPIRY_MINUTES = 10;
const DEFAULT_PASSWORD_RESET_EXPIRY_MINUTES = 10;

export function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

export function generateEmailOtp() {
  return crypto.randomInt(0, 1_000_000).toString().padStart(6, "0");
}

export function getEmailOtpExpiryMinutes() {
  const raw = Number(process.env.EMAIL_OTP_EXPIRY_MINUTES ?? DEFAULT_EXPIRY_MINUTES);
  if (!Number.isFinite(raw)) return DEFAULT_EXPIRY_MINUTES;
  const normalized = Math.floor(raw);
  if (normalized < 1 || normalized > 60) return DEFAULT_EXPIRY_MINUTES;
  return normalized;
}

export function getPasswordResetOtpExpiryMinutes() {
  const raw = Number(
    process.env.PASSWORD_RESET_OTP_EXPIRY_MINUTES ?? DEFAULT_PASSWORD_RESET_EXPIRY_MINUTES
  );
  if (!Number.isFinite(raw)) return DEFAULT_PASSWORD_RESET_EXPIRY_MINUTES;
  const normalized = Math.floor(raw);
  if (normalized < 1 || normalized > 60) return DEFAULT_PASSWORD_RESET_EXPIRY_MINUTES;
  return normalized;
}

export function getEmailOtpExpiresAt(now = new Date()) {
  const minutes = getEmailOtpExpiryMinutes();
  return new Date(now.getTime() + minutes * 60 * 1000);
}

export function getPasswordResetOtpExpiresAt(now = new Date()) {
  const minutes = getPasswordResetOtpExpiryMinutes();
  return new Date(now.getTime() + minutes * 60 * 1000);
}

function getOtpSecret() {
  return process.env.EMAIL_OTP_SECRET ?? process.env.NEXTAUTH_SECRET ?? "ship2sell-email-otp-secret";
}

export function hashEmailOtp(email: string, otp: string) {
  return crypto
    .createHmac("sha256", getOtpSecret())
    .update(`${normalizeEmail(email)}:${otp}`)
    .digest("hex");
}
