/**
 * Basit, bağımlılıksız hız sınırlayıcı.
 * Not: bellek içidir; tek instance için yeterlidir. Çok instance'lı bir dağıtımda
 * paylaşımlı bir sayaç (Redis vb.) gerekir.
 */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;

const hits = new Map<string, number[]>();

export function rateLimit(key: string): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((time) => now - time < WINDOW_MS);

  if (recent.length >= MAX_REQUESTS) {
    const oldest = recent[0] ?? now;
    hits.set(key, recent);
    return { allowed: false, retryAfterSeconds: Math.ceil((WINDOW_MS - (now - oldest)) / 1000) };
  }

  recent.push(now);
  hits.set(key, recent);

  // Basit temizlik: harita büyürse eskimiş anahtarları at.
  if (hits.size > 5000) {
    for (const [existingKey, times] of hits) {
      if (times.every((time) => now - time >= WINDOW_MS)) hits.delete(existingKey);
    }
  }

  return { allowed: true, retryAfterSeconds: 0 };
}
