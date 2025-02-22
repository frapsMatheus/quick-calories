const rateLimit = new Map<string, { count: number; timestamp: number }>();
const LIMIT = 10; 
const WINDOW = 60 * 1000;

export function rateLimiter(clientIP: string) {
  const now = Date.now();
  const clientLimit = rateLimit.get(clientIP) || { count: 0, timestamp: now };

  if (now - clientLimit.timestamp >= WINDOW) {
    clientLimit.count = 0;
    clientLimit.timestamp = now;
  }

  if (clientLimit.count >= LIMIT) {
    return {
      error: true,
      message: 'Rate limit exceeded. Try again later.',
    }
  }

  clientLimit.count++;
  rateLimit.set(clientIP, clientLimit);

  return {
    error: false,
    message: 'Rate limit not exceeded.',
  };
}
