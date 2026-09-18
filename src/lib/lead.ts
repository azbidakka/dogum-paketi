/** İstemci ve sunucuda ortak kullanılan form doğrulama kuralları. */

export type LeadInput = {
  name: string;
  phone: string;
  email: string;
  message: string;
  consent: boolean;
  /** Bot tuzağı (honeypot) — gerçek kullanıcı bu alanı doldurmaz. */
  website?: string;
  /** Kampanya kaynağı; PII içermez. */
  utm?: string;
};

export type LeadErrors = Partial<Record<"name" | "phone" | "email" | "message" | "consent", string>>;

export const MESSAGE_MAX = 1000;

/** Türkiye cep/sabit hat numarasını yalnızca rakamlara indirger. */
export function normalizePhone(value: string): string {
  let digits = value.replace(/\D/g, "");
  if (digits.startsWith("90") && digits.length > 10) digits = digits.slice(2);
  if (digits.startsWith("0")) digits = digits.slice(1);
  return digits;
}

/** Yazarken "0532 123 45 67" biçiminde gösterir. */
export function formatPhone(value: string): string {
  const digits = normalizePhone(value).slice(0, 10);
  if (!digits) return "";

  const parts = [digits.slice(0, 3), digits.slice(3, 6), digits.slice(6, 8), digits.slice(8, 10)];
  return `0${parts.filter(Boolean).join(" ")}`.trimEnd();
}

export function isValidPhone(value: string): boolean {
  const digits = normalizePhone(value);
  // Alan/operatör kodu 2-5 arası başlar; 10 hane olmalı (ör. 5321234567, 2165814200)
  return /^[2-5]\d{9}$/.test(digits);
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(value.trim());
}

export function validateLead(input: LeadInput): LeadErrors {
  const errors: LeadErrors = {};

  if (input.name.trim().length < 2) {
    errors.name = "Lütfen ad ve soyadınızı yazın.";
  }

  if (!isValidPhone(input.phone)) {
    errors.phone = "Lütfen geçerli bir telefon numarası girin (ör. 0532 123 45 67).";
  }

  if (input.email.trim() && !isValidEmail(input.email)) {
    errors.email = "Lütfen geçerli bir e-posta adresi girin.";
  }

  if (input.message.length > MESSAGE_MAX) {
    errors.message = `Mesaj en fazla ${MESSAGE_MAX} karakter olabilir.`;
  }

  if (!input.consent) {
    errors.consent = "Devam edebilmek için Aydınlatma Metni onayı gerekir.";
  }

  return errors;
}
