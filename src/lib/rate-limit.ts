// For MVP, we'll create a basic in-memory rate limiter or a mock wrapper
// In production, this would use @upstash/redis or rate-limiter-flexible

type RateLimitResult = {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
};

// In-memory store for development (DO NOT USE IN PRODUCTION SERVERLESS)
// Serverless environments will wipe this between invocations.
const memoryStore = new Map<string, { count: number; resetTime: number }>();

export async function rateLimit(
  identifier: string,
  limit: number = 10,
  windowMs: number = 60000 // 1 minute default
): Promise<RateLimitResult> {
  const now = Date.now();
  const resetTime = now + windowMs;
  
  // Clean up expired entries (simple garbage collection)
  for (const [key, val] of memoryStore.entries()) {
    if (val.resetTime < now) {
      memoryStore.delete(key);
    }
  }

  const record = memoryStore.get(identifier);

  if (!record) {
    memoryStore.set(identifier, { count: 1, resetTime });
    return {
      success: true,
      limit,
      remaining: limit - 1,
      reset: resetTime,
    };
  }

  if (record.resetTime < now) {
    // Window expired, reset
    memoryStore.set(identifier, { count: 1, resetTime });
    return {
      success: true,
      limit,
      remaining: limit - 1,
      reset: resetTime,
    };
  }

  // Still in window
  const newCount = record.count + 1;
  memoryStore.set(identifier, { count: newCount, resetTime: record.resetTime });

  return {
    success: newCount <= limit,
    limit,
    remaining: Math.max(0, limit - newCount),
    reset: record.resetTime,
  };
}

/**
 * Example usage in an API route:
 * 
 * const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
 * const { success } = await rateLimit(`generate_cover_letter_${ip}`, 10, 60000);
 * 
 * if (!success) {
 *   return NextResponse.json({ error: "Too many requests" }, { status: 429 });
 * }
 */
