import { z } from 'zod';
import type { FastifyInstance } from 'fastify';
import type { AppDeps } from '../app';
import { createPaymentProvider } from '../billing/flutterwave';
import { WEBHOOK_QUEUE } from '../jobs/billing';
import { insertWebhookEvent, webhookEventKey } from '../repos/webhooks';

/**
 * Dev-only simulated hosted checkout (ADR-0008).
 *
 * With `FLUTTERWAVE_SECRET_KEY` empty, the fake payment driver hands the app a
 * deterministic checkout URL (`…/flutterwave/authorize?tx_ref=…&amount=…`). The
 * app opens that URL with `Linking.openURL`, but nothing else in the system
 * serves it — so a real browser open landed on the 404 handler and a plan change
 * could never complete locally.
 *
 * This route stands in for Flutterwave's hosted page. On confirm it feeds a
 * *simulated* `charge.completed` event through the very same inbox insert and
 * `webhooks` job a real callback uses (`amount` is decimal major units), so
 * payment truth still comes from the signature-verified job path (Rule 01).
 * When checkout carried a `callbackUrl` (the app deep link), the page returns
 * the browser to it so paying hands control back to the app automatically.
 * Only the signature step is skipped, and the whole route is registered only
 * when the real driver is disabled and we are not in production.
 */

const AUTHORIZE_PATH = '/flutterwave/authorize';

const MoneyParam = z.string().regex(/^\d+$/);

const AuthorizeQuery = z
  .object({
    tx_ref: z.string().min(1).max(200),
    amount: MoneyParam.optional(),
    callback: z.string().min(1).max(500).optional(),
  })
  .strict();

/**
 * Only an absolute custom-scheme deep link (`rota://billing`) may be used as the
 * return target, so a crafted `?callback=` can never turn the fake page into an
 * open redirect to the web or smuggle markup into the rendered script.
 */
function safeReturnUrl(callback: string | undefined): string | undefined {
  if (!callback) return undefined;
  let parsed: URL;
  try {
    parsed = new URL(callback);
  } catch {
    return undefined;
  }
  if (!parsed.protocol.endsWith(':') || parsed.protocol === 'http:' || parsed.protocol === 'https:') {
    return undefined;
  }
  return /^[a-z][a-z0-9+.-]*:\/\/[A-Za-z0-9._~:?#@!$&'()*+,;=%-]+$/i.test(callback) ? callback : undefined;
}

const CompleteBody = z
  .object({ tx_ref: z.string().min(1).max(200), amount: MoneyParam.optional() })
  .strict();

export function registerDevCheckoutRoutes(app: FastifyInstance, deps: AppDeps): void {
  if (deps.env.NODE_ENV === 'production') return;
  if (createPaymentProvider(deps.env).name !== 'fake') return;

  app.get(AUTHORIZE_PATH, async (req, reply) => {
    const query = AuthorizeQuery.parse(req.query);
    reply.type('text/html; charset=utf-8');
    return authorizePage(query.tx_ref, query.amount, safeReturnUrl(query.callback));
  });

  app.post(AUTHORIZE_PATH, async (req, reply) => {
    const body = CompleteBody.parse(req.body ?? {});
    // The fake URL carries integer minor units; Flutterwave speaks decimal
    // major units, so convert on the way back into the webhook payload.
    const amountMajor = body.amount !== undefined ? Number(body.amount) / 100 : undefined;
    const payload: Record<string, unknown> = {
      event: 'charge.completed',
      data: {
        status: 'successful',
        tx_ref: body.tx_ref,
        ...(amountMajor !== undefined ? { amount: amountMajor, currency: 'USD' } : {}),
      },
    };
    const raw = JSON.stringify(payload);
    const eventKey = webhookEventKey(payload, raw);
    const stored = await insertWebhookEvent(deps.topology.global, {
      provider: 'flutterwave',
      eventKey,
      payload,
    });
    if (stored) await deps.queue.add(WEBHOOK_QUEUE, { eventId: stored.id }, { attempts: 5 });
    return { ok: true, reference: body.tx_ref };
  });
}

const HTML_ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (ch) => HTML_ESCAPES[ch] ?? ch);
}

function formatAmount(amount: string | undefined): string {
  if (amount === undefined) return 'the plan price';
  return `$${(Number(amount) / 100).toFixed(2)}`;
}

function authorizePage(txRef: string, amount: string | undefined, callback: string | undefined): string {
  const display = formatAmount(amount);
  const refJson = JSON.stringify(txRef);
  const amountJson = JSON.stringify(amount ?? '');
  const callbackJson = JSON.stringify(callback ?? '');
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Test checkout · Rota</title>
<style>
  :root { color-scheme: light; }
  body { margin: 0; min-height: 100vh; display: flex; align-items: center; justify-content: center;
    background: #f6f7f9; color: #111; font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; }
  .card { width: 100%; max-width: 360px; background: #fff; border-radius: 16px; padding: 32px;
    box-shadow: 0 10px 30px rgba(0,0,0,.08); text-align: center; }
  .kicker { color: #6b7280; font-size: 13px; }
  .amount { font-size: 34px; font-weight: 700; margin: 10px 0; }
  .ref { color: #6b7280; font-size: 12px; word-break: break-all; }
  button { width: 100%; margin-top: 24px; padding: 14px; border: 0; border-radius: 10px;
    background: #4f46e5; color: #fff; font-size: 16px; font-weight: 600; cursor: pointer; }
  button:disabled { opacity: .6; }
  .msg { margin-top: 16px; font-size: 14px; min-height: 20px; }
</style>
</head>
<body>
  <div class="card">
    <div class="kicker">Rota · test checkout — no real money moves</div>
    <div class="amount">${escapeHtml(display)}</div>
    <div class="ref">${escapeHtml(txRef)}</div>
    <button id="pay">Pay ${escapeHtml(display)}</button>
    <div class="msg" id="msg"></div>
  </div>
  <script>
    var txRef = ${refJson};
    var amount = ${amountJson};
    var callback = ${callbackJson};
    var btn = document.getElementById('pay');
    var msg = document.getElementById('msg');
    btn.addEventListener('click', function () {
      btn.disabled = true;
      msg.textContent = 'Completing…';
      fetch(location.pathname, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(amount ? { tx_ref: txRef, amount: amount } : { tx_ref: txRef }),
      })
        .then(function (res) {
          if (!res.ok) throw new Error('HTTP ' + res.status);
          btn.textContent = 'Paid';
          if (callback) {
            msg.textContent = 'Payment complete. Returning to the Rota app…';
            window.location.href = callback;
          } else {
            msg.textContent = 'Payment complete. You can return to the Rota app.';
          }
        })
        .catch(function (err) {
          btn.disabled = false;
          msg.textContent = 'Could not complete: ' + err.message;
        });
    });
  </script>
</body>
</html>`;
}
