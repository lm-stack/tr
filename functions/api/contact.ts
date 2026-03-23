interface Env {
  TURNSTILE_SECRET_KEY: string;
  N8N_WEBHOOK_URL: string;
}

function sanitize(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function jsonResponse(body: Record<string, unknown>, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  // Parse body
  let body: Record<string, string>;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ success: false, error: "Invalid JSON" }, 400);
  }

  // Honeypot — silent 200 so the bot thinks it succeeded
  if (body.website) {
    return jsonResponse({ success: true }, 200);
  }

  // Validate Turnstile token
  const turnstileToken = body["cf-turnstile-response"] ?? body.token ?? "";
  const remoteip = request.headers.get("CF-Connecting-IP") ?? "";

  const turnstileResponse = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: env.TURNSTILE_SECRET_KEY,
        response: turnstileToken,
        remoteip,
      }),
    }
  );

  const turnstileResult = await turnstileResponse.json<{ success: boolean; "error-codes"?: string[] }>();

  if (!turnstileResult.success) {
    return jsonResponse({ success: false, error: "Turnstile validation failed", details: turnstileResult["error-codes"] }, 403);
  }

  // Sanitize fields (escape &, <, >) — keep email raw
  const cleanData = {
    firstname: sanitize(body.firstname ?? ""),
    lastname: sanitize(body.lastname ?? ""),
    email: body.email ?? "",
    phone: sanitize(body.phone ?? ""),
    message: sanitize(body.message ?? ""),
    page: sanitize(body.page ?? ""),
  };

  // Forward to n8n
  const n8nResponse = await fetch(env.N8N_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cleanData),
  });

  if (!n8nResponse.ok) {
    return jsonResponse({ success: false, error: "Upstream error" }, 502);
  }

  return jsonResponse({ success: true }, 200);
};
