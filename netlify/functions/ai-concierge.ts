import type { Handler } from '@netlify/functions';

/**
 * Optional free-form AI Concierge chat endpoint.
 *
 * The guided estimate wizard in the app (src/components/ai/AiConciergeChat.tsx)
 * is fully deterministic and works with zero configuration — it reads
 * Tough Concrete's own pricing rules and never invents a number. This
 * function is only used for open-ended natural-language questions typed
 * into the concierge's free-text box, so it hands off to an LLM for
 * conversational quality while still being constrained to the same
 * pricing/service-type context passed in by the client.
 *
 * Requires the ANTHROPIC_API_KEY environment variable (set in Netlify:
 * Site settings → Environment variables). Never hardcode the key. If it
 * is not set, this function responds with `configured: false` and the
 * frontend falls back to the guided wizard — it never fabricates a reply.
 */

interface RequestBody {
  message: string;
  history?: { role: 'user' | 'assistant'; content: string }[];
  pricingContext?: Record<string, unknown>;
}

const SYSTEM_PROMPT = `You are the Tough Concrete AI Concierge for Tough Concrete Construction, LLC, a concrete
contractor. You help visitors identify what concrete service they need, collect basic project
requirements (dimensions, finish, access, timeline), and explain next steps.

Rules you must always follow:
- Only use the pricing figures provided to you in the pricing context. NEVER invent, estimate, or
  guess a dollar amount that isn't derivable from that data.
- If no pricing rule applies to the described project, say a site visit or owner review is required
  instead of guessing.
- Any price you do give must be clearly labeled "Preliminary Estimate" and followed by this exact
  disclaimer: "This preliminary estimate is based on the information provided and is not a binding
  quote. Final pricing is subject to site conditions, verified measurements, accessibility, material
  requirements, project specifications, and final approval by Tough Concrete Construction, LLC."
- You cannot create a binding contract, finalize a price, or promise a schedule date. All of that
  requires owner/staff approval.
- For structural concrete, foundations, retaining walls, engineered plans, or unclear access, tell
  the customer "Site Inspection Required" and recommend scheduling a site visit.
- Keep answers concise and friendly, 2-4 sentences unless the customer asks for detail.`;

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        configured: false,
        message:
          'Free-form AI chat is not configured yet on this deployment (ANTHROPIC_API_KEY is not set). ' +
          'The guided estimate wizard below still works fully — it uses Tough Concrete’s own pricing rules directly.',
      }),
    };
  }

  let body: RequestBody;
  try {
    body = JSON.parse(event.body ?? '{}');
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON body' }) };
  }

  if (!body.message || typeof body.message !== 'string') {
    return { statusCode: 400, body: JSON.stringify({ error: 'message is required' }) };
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-5',
        max_tokens: 600,
        system: `${SYSTEM_PROMPT}\n\nPricing context (JSON, authoritative — do not deviate from it):\n${JSON.stringify(
          body.pricingContext ?? {},
        )}`,
        messages: [...(body.history ?? []), { role: 'user', content: body.message }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return {
        statusCode: 502,
        body: JSON.stringify({ configured: true, error: `Upstream AI error: ${errText.slice(0, 300)}` }),
      };
    }

    const data = (await response.json()) as { content?: { type: string; text?: string }[] };
    const text = data.content?.find((c) => c.type === 'text')?.text ?? '';

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ configured: true, message: text }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ configured: true, error: err instanceof Error ? err.message : 'Unknown error' }),
    };
  }
};
