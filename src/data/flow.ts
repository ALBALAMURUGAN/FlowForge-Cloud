import type { LucideIcon } from 'lucide-react';
import {
  Webhook, Braces, Globe2, GitBranch, CreditCard, Database, Send,
  Timer, Zap, Mail, FileJson, MessageSquare, ShieldCheck, CloudUpload, ShoppingCart,
} from 'lucide-react';

/* ─────────────────────────────────────────────────────────────
   FlowForge — shared workflow model
   Single source of truth for the canvas, runner & debugger.
   ───────────────────────────────────────────────────────────── */

export type NodeKind = 'trigger' | 'python' | 'node' | 'http' | 'branch' | 'store' | 'notify' | 'gate';
export type NodeStatus = 'idle' | 'queued' | 'running' | 'success' | 'failed' | 'retrying' | 'skipped';

export interface FlowNode {
  id: string;
  index: number;
  kind: NodeKind;
  label: string;
  sub: string;
  meta: string;
  icon: LucideIcon;
  accent: 'violet' | 'gold' | 'emerald' | 'rose' | 'sky';
  x: number;
  y: number;
  p50: number; // ms
  logs: { run: string; ok: string; fail?: string };
}

export const NODE_W = 158;
export const NODE_H = 104;
export const CANVAS_W = 1244;
export const CANVAS_H = 344;

export const FLOW_NODES: FlowNode[] = [
  { id: 'webhook', index: 0, kind: 'trigger', label: 'Order received',    sub: 'POST /hooks/orders',      meta: 'HMAC-SHA256 verified', icon: Webhook,    accent: 'violet', x: 26,   y: 150, p50: 4,
    logs: { run: 'inbound request accepted · 2.1 KB', ok: 'signature valid · event evt_ord_9f31 queued' } },
  { id: 'validate', index: 1, kind: 'python', label: 'Validate payload',  sub: 'Python 3.12 · pydantic',  meta: 'schema order.v3',      icon: Braces,     accent: 'sky',    x: 198,  y: 96,  p50: 38,
    logs: { run: 'cold start 214ms · warm 12ms', ok: '42 fields valid · types coerced · 0 errors' } },
  { id: 'enrich',   index: 2, kind: 'http',   label: 'Enrich customer',   sub: 'CRM · GET /customers',    meta: 'cache ttl 60s · hit 87%', icon: Globe2,  accent: 'violet', x: 370,  y: 208, p50: 61,
    logs: { run: 'cache miss → upstream CRM (read)', ok: 'LTV $4,820 · tier GOLD · segment B2B' } },
  { id: 'fraud',    index: 3, kind: 'branch', label: 'Fraud score 0.12',  sub: 'model ff-fraud · v2.4',   meta: 'threshold 0.80 → pass', icon: GitBranch, accent: 'gold',   x: 542,  y: 104, p50: 24,
    logs: { run: 'scoring 38 features against v2.4', ok: 'score 0.12 < 0.80 → route: charge' } },
  { id: 'charge',   index: 4, kind: 'node',   label: 'Charge payment',    sub: 'Node 20 · Stripe API',    meta: 'idempotency ff_9f31…', icon: CreditCard, accent: 'gold',   x: 714,  y: 200, p50: 412,
    logs: { run: 'POST api.stripe.com/v1/charges', ok: 'ch_3Q…9f2 · $1,299.00 · captured', fail: 'HTTP 402 card_declined · insufficient_funds' } },
  { id: 'record',   index: 5, kind: 'store',  label: 'Persist order',     sub: 'PostgreSQL · orders',     meta: 'ACID · WAL level 2',   icon: Database,   accent: 'emerald', x: 886,  y: 104, p50: 9,
    logs: { run: 'BEGIN · INSERT INTO orders …', ok: 'row ord_2214 · committed in 8ms' } },
  { id: 'notify',   index: 6, kind: 'notify', label: 'Notify fulfilment', sub: 'Slack + SES email',       meta: 'template order.ok',    icon: Send,       accent: 'violet', x: 1058, y: 172, p50: 140,
    logs: { run: 'rendering template order.ok', ok: '#fulfilment ✓ · 3 recipients notified' } },
];

export const idleStatuses = (value: NodeStatus = 'idle'): Record<string, NodeStatus> =>
  Object.fromEntries(FLOW_NODES.map((n) => [n.id, value]));

export const failedRunStatuses = (): Record<string, NodeStatus> => ({
  webhook: 'success', validate: 'success', enrich: 'success', fraud: 'success',
  charge: 'failed', record: 'skipped', notify: 'skipped',
});

/* ── debugger ──────────────────────────────────────────────── */
export const CHARGE_ERROR = {
  code: 'HTTP 402 · card_declined',
  reason: 'insufficient_funds',
  upstream: 'api.stripe.com · 412ms · req_ff_9f31c2',
  retryable: true,
  attempt: '1 of 3 · exponential backoff 2s → 8s → 32s',
  payload: [
    { k: 'cart_id', v: '"c_8842"' },
    { k: 'amount', v: '1299.00' },
    { k: 'currency', v: '"USD"' },
    { k: 'customer', v: 'cus_N72b…e1 (redacted)' },
    { k: 'idempotency_key', v: 'ff_9f31_charge_retry' },
  ],
  stack: [
    'Error: card_declined: insufficient_funds',
    '  at chargeCard (stripe.ts:84)',
    '  at handler (charge.ts:31) · attempt 1/3',
    '  at Runtime.invoke (node20:fn/handler)',
  ],
  blast: ['Persist order — never executed', 'Notify fulfilment — never executed', 'Saga compensation armed · refund not required (no capture)'],
};

/* ── palette for the visual builder ────────────────────────── */
export interface PaletteItem { id: string; label: string; sub: string; icon: LucideIcon; tag: string }
export const PALETTE: PaletteItem[] = [
  { id: 'cron',    label: 'Cron trigger',    sub: 'On a schedule',        icon: Timer,        tag: 'TRIGGER' },
  { id: 'webhook2',label: 'Webhook trigger', sub: 'On an HTTP request',   icon: Webhook,      tag: 'TRIGGER' },
  { id: 'upload',  label: 'File received',   sub: 'On an upload event',   icon: CloudUpload,  tag: 'TRIGGER' },
  { id: 'pyfn',    label: 'Python function', sub: '3.12 · 10s timeout',   icon: Braces,       tag: 'COMPUTE' },
  { id: 'njfn',    label: 'Node function',   sub: '20 · 256 MB',          icon: Zap,          tag: 'COMPUTE' },
  { id: 'mail',    label: 'Send email',      sub: 'SES · templates',      icon: Mail,         tag: 'ACTION' },
  { id: 'slack',   label: 'Slack message',   sub: '#channels & DMs',      icon: MessageSquare,tag: 'ACTION' },
  { id: 'json',    label: 'Transform JSON',  sub: 'jq expressions',       icon: FileJson,     tag: 'LOGIC' },
  { id: 'guard',   label: 'Guard / policy',  sub: 'OPA rules · RBAC',     icon: ShieldCheck,  tag: 'LOGIC' },
  { id: 'stripe2', label: 'Charge / refund', sub: 'Stripe · idempotent',  icon: CreditCard,   tag: 'ACTION' },
  { id: 'cart',    label: 'Cart events',     sub: 'Abandonment · paid',   icon: ShoppingCart, tag: 'EVENT' },
];

/* ── analytics series (14 days) ─────────────────────────────── */
export const DAILY_RUNS = [412_800, 438_120, 401_500, 455_910, 502_340, 489_700, 467_030,
  521_000, 548_260, 533_400, 590_150, 612_480, 588_330, 634_200];

export const FAILURE_MODES = [
  { label: 'Upstream 5xx / 402', pct: 31, heal: 'auto-retry ×3' },
  { label: 'Step timeout > 10s', pct: 27, heal: 'reprovisioned pool' },
  { label: 'Validation error',   pct: 18, heal: 'quarantined + alert' },
  { label: 'OOM / memory limit', pct: 14, heal: 'mem tier bumped' },
  { label: 'Rate limited (429)', pct: 7,  heal: 'backoff + queue' },
  { label: 'Other',              pct: 3,  heal: 'on-call paged' },
];

/* ── integrations marquee ───────────────────────────────────── */
export const INTEGRATIONS = [
  'Stripe', 'Shopify', 'Salesforce', 'PostgreSQL', 'Slack', 'Kafka',
  'Snowflake', 'HubSpot', 'Datadog', 'Twilio', 'Notion', 'Linear',
  'S3', 'RabbitMQ', 'SendGrid', 'Segment', 'BigQuery', 'GitHub',
];
