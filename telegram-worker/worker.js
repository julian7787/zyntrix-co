/**
 * Zyntrix Lead-Relay — Cloudflare Worker
 *
 * Nimmt die Kontaktformular-Anfrage von zyntrix.co entgegen und postet sie in
 * eine Telegram-Gruppe. Der Bot-Token liegt ausschliesslich hier als Secret,
 * nie im Browser.
 *
 * Secrets (wrangler secret put …):
 *   TELEGRAM_BOT_TOKEN   Token von @BotFather, z. B. 8123456789:AAH…
 *   TELEGRAM_CHAT_ID     Chat-ID der Gruppe, z. B. -1001234567890
 *
 * Optionale Variablen (wrangler.toml [vars]):
 *   ALLOWED_ORIGINS      Kommaliste erlaubter Origins. Leer = alle erlaubt.
 *   TELEGRAM_TOPIC_ID    Thread-ID, falls die Gruppe Themen (Topics) nutzt.
 */

const FIELDS = [
  ['name', 'Name'],
  ['firma', 'Unternehmen & Branche'],
  ['email', 'E-Mail'],
  ['telefon', 'Telefon'],
  ['zeitfresser', 'Zeitfresser']
];

const REQUIRED = ['name', 'firma', 'email'];
const MAX_FIELD_LENGTH = 2000;

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const allowed = (env.ALLOWED_ORIGINS || '')
      .split(',')
      .map((o) => o.trim())
      .filter(Boolean);
    const cors = corsHeaders(origin, allowed);

    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    if (request.method !== 'POST') return json({ error: 'method_not_allowed' }, 405, cors);
    if (allowed.length && !allowed.includes(origin)) return json({ error: 'forbidden_origin' }, 403, cors);

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: 'invalid_json' }, 400, cors);
    }
    if (!body || typeof body !== 'object') return json({ error: 'invalid_body' }, 400, cors);

    // Honeypot: unsichtbares Feld, das nur Bots ausfuellen. Wir antworten mit
    // 200, damit der Bot keinen Hinweis auf die Filterung bekommt.
    if (clean(body.website)) return json({ ok: true }, 200, cors);

    const lead = {};
    for (const [key] of FIELDS) lead[key] = clean(body[key]);
    for (const key of REQUIRED) {
      if (!lead[key]) return json({ error: 'missing_field', field: key }, 400, cors);
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) {
      return json({ error: 'invalid_email' }, 400, cors);
    }

    if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) {
      console.error('TELEGRAM_BOT_TOKEN oder TELEGRAM_CHAT_ID fehlt');
      return json({ error: 'not_configured' }, 500, cors);
    }

    const payload = {
      chat_id: env.TELEGRAM_CHAT_ID,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
      text: buildMessage(lead, body, request)
    };
    if (env.TELEGRAM_TOPIC_ID) payload.message_thread_id = Number(env.TELEGRAM_TOPIC_ID);

    const tg = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!tg.ok) {
      console.error('Telegram API Fehler', tg.status, await tg.text());
      return json({ error: 'telegram_failed' }, 502, cors);
    }

    return json({ ok: true }, 200, cors);
  }
};

function buildMessage(lead, body, request) {
  const lines = ['<b>Neue Anfrage über zyntrix.co</b>', ''];
  for (const [key, label] of FIELDS) {
    if (lead[key]) lines.push(`<b>${escapeHtml(label)}:</b> ${escapeHtml(lead[key])}`);
  }
  lines.push('');
  const seite = clean(body.seite);
  if (seite) lines.push(`<b>Seite:</b> ${escapeHtml(seite)}`);
  const land = request.headers.get('CF-IPCountry');
  if (land) lines.push(`<b>Land:</b> ${escapeHtml(land)}`);
  lines.push(`<b>Zeit:</b> ${new Date().toLocaleString('de-AT', { timeZone: 'Europe/Vienna' })}`);
  return lines.join('\n');
}

function clean(value) {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, MAX_FIELD_LENGTH);
}

function escapeHtml(value) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function corsHeaders(origin, allowed) {
  const allowOrigin = allowed.length ? (allowed.includes(origin) ? origin : allowed[0]) : '*';
  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin'
  };
}

function json(data, status, headers) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...headers, 'Content-Type': 'application/json' }
  });
}
