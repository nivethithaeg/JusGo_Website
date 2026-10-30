"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { Card, Chip, Icon, Row, Shot } from "@/components/venues/VenueMocks";
import { EASE_EXPO } from "@/lib/motion";

const ITEM = { hidden: { opacity: 0, y: 12 }, shown: { opacity: 1, y: 0 } };

function Mono({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <span className={`font-mono ${className}`}>{children}</span>;
}

function Button({ children, solid = true }: { children: ReactNode; solid?: boolean }) {
  return (
    <span className={`rounded-full px-3 py-1 text-[9px] font-bold ${solid ? "bg-[#B6FF3B] text-[#071426]" : "border border-white/20 text-white/70"}`}>{children}</span>
  );
}

/* ---------- home: welcome banner + setup checklist ---------- */

const CHECKLIST = [
  { label: "API Setup", done: true },
  { label: "Webhook / API Setup", done: true },
  { label: "Venues", done: false },
  { label: "Verify Integration", done: false },
  { label: "Go Live", done: false },
];

export function DevHomeMock() {
  return (
    <Shot title="Developer home">
      <div className="rounded-xl border border-[#B6FF3B]/20 bg-gradient-to-r from-[#B6FF3B]/10 to-transparent p-3">
        <p className="text-[11px] font-bold">Welcome back, Developer</p>
        <p className="mt-1 text-[9px] text-white/55">
          Your developer ID <Mono className="rounded-md bg-white/10 px-1.5 py-0.5 text-[#B6FF3B]">DEV-4821</Mono>
        </p>
      </div>
      <p className="mb-2 mt-3 text-[9px] font-semibold uppercase tracking-[0.12em] text-white/45">Setup checklist</p>
      <div className="space-y-2">
        {CHECKLIST.map((step, i) => (
          <Row key={step.label}>
            <span className="flex items-center gap-2">
              <span className={`grid h-5 w-5 place-items-center rounded-full text-[9px] font-bold ${step.done ? "bg-[#B6FF3B] text-[#071426]" : "bg-white/10 text-white/50"}`}>
                {step.done ? <Icon name="check" className="h-3 w-3" /> : i + 1}
              </span>
              {step.label}
            </span>
            <Chip tone={step.done ? "lime" : "grey"}>{step.done ? "Done" : "To do"}</Chip>
          </Row>
        ))}
      </div>
    </Shot>
  );
}

/* ---------- step 1: API setup ---------- */

export function ApiKeyMock() {
  return (
    <Shot title="API Setup">
      <Row>
        <span className="flex items-center gap-2">
          <Icon name="grid" className="h-3.5 w-3.5 text-[#B6FF3B]" />
          <span>
            <span className="block font-semibold">Project · Your booking app</span>
            <span className="text-[9px] text-white/45">One project per app</span>
          </span>
        </span>
        <Chip tone="blue">Sandbox</Chip>
      </Row>
      <Card className="mt-3">
        <p className="text-[9px] text-white/50">Sandbox API key</p>
        <p className="mt-2 break-all rounded-lg bg-black/30 px-3 py-2 text-[10px] text-[#B6FF3B]">
          <Mono>jsg_test_4f9c2a71.••••••••••••••••••••</Mono>
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Chip tone="amber">Shown once</Chip>
          <Chip>Not stored in readable form</Chip>
          <span className="ml-auto"><Button>Create key</Button></span>
        </div>
      </Card>
    </Shot>
  );
}

/* ---------- step 2: webhooks ---------- */

const EVENTS = ["booking.held", "booking.confirmed", "booking.cancelled", "booking.expired"];

export function WebhookMock() {
  return (
    <Shot title="Webhook / API Setup">
      <Row>
        <Mono className="truncate text-white/80">https://api.yourapp.com/jusgo/webhook</Mono>
        <Chip tone="lime">HTTPS</Chip>
      </Row>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {EVENTS.map((event) => (
          <motion.span key={event} variants={ITEM} transition={{ duration: 0.45, ease: EASE_EXPO }}>
            <Chip tone="lime">
              <Mono>{event}</Mono>
            </Chip>
          </motion.span>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Button solid={false}>Rotate signing secret</Button>
        <Button>Send test</Button>
      </div>
      <p className="mb-2 mt-4 text-[9px] font-semibold uppercase tracking-[0.12em] text-white/45">Delivery log</p>
      <div className="space-y-1.5">
        {[
          ["booking.confirmed", "200 OK", "lime"],
          ["booking.held", "200 OK", "lime"],
          ["booking.cancelled", "500 · retrying", "amber"],
        ].map(([event, status, tone]) => (
          <Row key={event}>
            <Mono className="text-white/75">{event}</Mono>
            <Chip tone={tone as "lime" | "amber"}>{status}</Chip>
          </Row>
        ))}
      </div>
    </Shot>
  );
}

export function SyncModesMock() {
  return (
    <Shot title="Keeping bookings in sync">
      <div className="grid gap-2 sm:grid-cols-2">
        <Card>
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-[#B6FF3B]/10 text-[#B6FF3B]">
            <Icon name="clock" className="h-3.5 w-3.5" />
          </span>
          <p className="mt-2 text-[10px] font-bold">Booking sync</p>
          <p className="mt-1 text-[9px] leading-4 text-white/55">JusGo pulls bookings from your own API on a schedule.</p>
        </Card>
        <Card>
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-[#B6FF3B]/10 text-[#B6FF3B]">
            <Icon name="webhook" className="h-3.5 w-3.5" />
          </span>
          <p className="mt-2 text-[10px] font-bold">Inbound webhook</p>
          <p className="mt-1 text-[9px] leading-4 text-white/55">You push changes to JusGo as they happen. A change event log records each one.</p>
        </Card>
      </div>
    </Shot>
  );
}

/* ---------- step 3: venues ---------- */

export function VenueAccessMock() {
  const rows = [
    { venue: "Greenline Turf", state: "Approved", tone: "lime" as const },
    { venue: "Rally Sports Arena", state: "Approved", tone: "lime" as const },
    { venue: "Baseline Courts", state: "Waiting for owner", tone: "amber" as const },
  ];
  return (
    <Shot title="Venues">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-[11px] font-bold">Venue access</p>
        <Button>Request access</Button>
      </div>
      <div className="space-y-2">
        {rows.map((r) => (
          <Row key={r.venue}>
            <span className="font-semibold">{r.venue}</span>
            <Chip tone={r.tone}>{r.state}</Chip>
          </Row>
        ))}
      </div>
      <p className="mb-2 mt-4 flex items-center justify-between text-[9px] font-semibold uppercase tracking-[0.12em] text-white/45">
        ID mapping <Button solid={false}>Auto-match</Button>
      </p>
      <div className="space-y-1.5">
        {[
          ["Turf A", "turf_102"],
          ["Turf B", "turf_103"],
        ].map(([ours, yours]) => (
          <Row key={ours}>
            <span>{ours}</span>
            <span className="text-white/35">→</span>
            <Mono className="text-[#B6FF3B]">{yours}</Mono>
          </Row>
        ))}
      </div>
    </Shot>
  );
}

/* ---------- step 4: verify ---------- */

export function VerifyMock() {
  const checks = ["List venues", "Check availability", "Booking dry run"];
  return (
    <Shot title="Verify Integration">
      <div className="space-y-2">
        {checks.map((check) => (
          <Row key={check}>
            <span className="flex items-center gap-2">
              <span className="grid h-5 w-5 place-items-center rounded-full bg-[#B6FF3B] text-[#071426]">
                <Icon name="check" className="h-3 w-3" />
              </span>
              {check}
            </span>
            <Chip tone="lime">Passed</Chip>
          </Row>
        ))}
      </div>
      <p className="mt-3 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-[10px] text-white/60">Sandbox only. No real bookings are made.</p>
    </Shot>
  );
}

/* ---------- step 5: go live ---------- */

const RULES = [
  "Hold the slot before you take payment",
  "Treat a 409 SLOT_TAKEN as “don't charge the customer”",
  "Process the webhooks you receive",
  "Report every booking and cancellation",
];

export function GoLiveMock() {
  return (
    <Shot title="Go Live">
      <div className="mb-3 flex items-center gap-2">
        <Chip tone="lime">Approved for production</Chip>
      </div>
      <ul className="space-y-1.5">
        {RULES.map((rule) => (
          <Row key={rule}>
            <span className="flex items-center gap-2">
              <Icon name="check" className="h-3 w-3 shrink-0 text-[#B6FF3B]" />
              {rule}
            </span>
          </Row>
        ))}
      </ul>
      <Card className="mt-3">
        <p className="text-[9px] text-white/50">Production API key</p>
        <p className="mt-2 rounded-lg bg-black/30 px-3 py-2 text-[10px] text-[#B6FF3B]">
          <Mono>jsg_live_••••••••.••••••••••••••••</Mono>
        </p>
      </Card>
    </Shot>
  );
}

/* ---------- how slots stay in sync: diagram ---------- */

const APPS = [
  { label: "Your app", x: 60, y: 60 },
  { label: "App B", x: 60, y: 200 },
  { label: "App C", x: 340, y: 60 },
  { label: "Venue desk", x: 340, y: 200 },
];

export function SyncDiagram() {
  const reduceMotion = useReducedMotion();
  return (
    <Shot title="One calendar per turf">
      <svg viewBox="0 0 400 260" className="h-auto w-full" role="img" aria-label="Diagram: a booking made on any app updates the turf calendar, which signals every other app with a signed webhook">
        {APPS.map((app) => (
          <g key={app.label}>
            <motion.path
              d={`M${app.x} ${app.y} L200 130`}
              fill="none"
              stroke="#B6FF3B"
              strokeOpacity="0.5"
              strokeWidth="1.5"
              strokeDasharray="5 6"
              animate={reduceMotion ? undefined : { strokeDashoffset: [0, -22] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
            />
            <rect x={app.x - 38} y={app.y - 16} width="76" height="32" rx="10" fill="#0b1c33" stroke="white" strokeOpacity="0.15" />
            <text x={app.x} y={app.y + 4} textAnchor="middle" fill="white" fillOpacity="0.85" fontSize="10" fontWeight="600" fontFamily="Inter, sans-serif">
              {app.label}
            </text>
          </g>
        ))}
        <motion.circle
          cx="200"
          cy="130"
          r="38"
          fill="none"
          stroke="#B6FF3B"
          strokeWidth="1.5"
          animate={reduceMotion ? undefined : { scale: [1, 1.5], opacity: [0.5, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
          style={{ transformOrigin: "200px 130px" }}
        />
        <circle cx="200" cy="130" r="38" fill="#0A3D2A" stroke="#B6FF3B" strokeOpacity="0.5" />
        <text x="200" y="127" textAnchor="middle" fill="white" fontSize="11" fontWeight="800" fontFamily="Plus Jakarta Sans, sans-serif">Turf</text>
        <text x="200" y="141" textAnchor="middle" fill="#B6FF3B" fontSize="9" fontWeight="700" fontFamily="Inter, sans-serif">CALENDAR</text>
      </svg>
      <div className="mt-2 flex flex-wrap justify-center gap-1.5">
        {EVENTS.map((event) => (
          <Chip key={event} tone="lime">
            <Mono>{event}</Mono>
          </Chip>
        ))}
      </div>
    </Shot>
  );
}

/* ---------- the Partner API ---------- */

export function ApiCodeMock() {
  return (
    <Shot title="Partner API">
      <pre className="overflow-x-auto rounded-lg bg-black/30 p-3 font-mono text-[10px] leading-5 text-white/75">
        <span className="text-white/35">{"// every request is signed with your key"}</span>
        {"\n"}
        <span className="text-[#B6FF3B]">POST</span> …/functions/v1/partner-api/v1/bookings
        {"\n"}
        <span className="text-sky-300">X-Api-Key</span>: {"<client_id>.<secret>"}
        {"\n\n"}
        <span className="text-white/35">{"// slot already sold elsewhere"}</span>
        {"\n"}
        <span className="text-amber-300">409</span> {"{ \"error\": \"SLOT_TAKEN\" }"}
      </pre>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <Card>
          <Chip tone="blue">Sandbox</Chip>
          <p className="mt-2 text-[10px] font-bold"><Mono>jsg_test_…</Mono></p>
          <p className="mt-1 text-[9px] leading-4 text-white/55">Reads real data. Creating a booking is a dry run.</p>
        </Card>
        <Card>
          <Chip tone="lime">Production</Chip>
          <p className="mt-2 text-[10px] font-bold"><Mono>jsg_live_…</Mono></p>
          <p className="mt-1 text-[9px] leading-4 text-white/55">Creates real bookings.</p>
        </Card>
      </div>
    </Shot>
  );
}

export function RateLimitMock() {
  return (
    <Shot title="Limits and errors">
      <p className="text-[9px] text-white/50">Rate limit per project</p>
      <div className="mt-2 flex items-end gap-2">
        <span className="text-2xl font-extrabold">120</span>
        <span className="pb-1 text-[10px] text-white/50">requests / minute</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
        <motion.span
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 0.62 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: EASE_EXPO }}
          className="block h-full origin-left rounded-full bg-[#B6FF3B]"
        />
      </div>
      <p className="mb-2 mt-4 text-[9px] font-semibold uppercase tracking-[0.12em] text-white/45">Errors come back as JSON</p>
      <div className="flex flex-wrap gap-2">
        <Chip tone="amber"><Mono>SLOT_TAKEN</Mono></Chip>
        <Chip tone="red"><Mono>RATE_LIMITED</Mono></Chip>
      </div>
      <p className="mt-3 text-[9px] leading-4 text-white/50">Webhook repeats are ignored using the <Mono className="text-white/70">X-JusGo-Delivery</Mono> header.</p>
    </Shot>
  );
}

/* ---------- more pages ---------- */

export function DevBookingsMock() {
  const rows = [
    { id: "BK-2041", venue: "Greenline Turf", via: "Your app", tone: "lime" as const, status: "Synced" },
    { id: "BK-2040", venue: "Rally Sports Arena", via: "App B", tone: "lime" as const, status: "Synced" },
    { id: "BK-2039", venue: "Greenline Turf", via: "Venue desk", tone: "blue" as const, status: "Held" },
  ];
  return (
    <Shot title="Bookings & connected venues">
      <div className="space-y-2">
        {rows.map((r) => (
          <Row key={r.id}>
            <span>
              <Mono className="block font-semibold text-white/85">{r.id}</Mono>
              <span className="text-[9px] text-white/45">{r.venue} · via {r.via}</span>
            </span>
            <Chip tone={r.tone}>{r.status}</Chip>
          </Row>
        ))}
      </div>
      <p className="mt-3 text-[9px] text-white/45">Plus the venue owners you are linked to.</p>
    </Shot>
  );
}

export function ApiLogsMock() {
  const rows = [
    { call: "POST /v1/bookings", code: "409", note: "SLOT_TAKEN", tone: "amber" as const },
    { call: "POST /v1/bookings", code: "200", note: "created", tone: "lime" as const },
    { call: "GET  /v1/venues", code: "200", note: "ok", tone: "lime" as const },
    { call: "POST /v1/bookings", code: "429", note: "RATE_LIMITED", tone: "red" as const },
  ];
  return (
    <Shot title="API Logs">
      <div className="space-y-1.5">
        {rows.map((r, i) => (
          <Row key={i}>
            <Mono className="text-white/80">{r.call}</Mono>
            <span className="flex items-center gap-2">
              <span className="text-[9px] text-white/40">{r.note}</span>
              <Chip tone={r.tone}>{r.code}</Chip>
            </span>
          </Row>
        ))}
      </div>
    </Shot>
  );
}

export function DocsHelpMock() {
  return (
    <Shot title="Documentation & API Help">
      <div className="space-y-2">
        <motion.p variants={ITEM} className="ml-auto max-w-[80%] rounded-xl rounded-br-sm bg-[#B6FF3B] px-3 py-2 text-[10px] font-medium text-[#071426]">
          Why did I get SLOT_TAKEN?
        </motion.p>
        <motion.p variants={ITEM} className="max-w-[88%] rounded-xl rounded-bl-sm border border-white/10 bg-white/[0.05] px-3 py-2 text-[10px] leading-4 text-white/75">
          That slot was just sold on another platform. Don&apos;t charge the customer, and offer another time.
        </motion.p>
      </div>
      <p className="mt-3 text-[9px] text-white/45">A help chat sits next to the full documentation.</p>
    </Shot>
  );
}

export function DevTeamMock() {
  const members = [
    { name: "Meena (Engineer)", perms: ["View bookings", "View API logs"] },
    { name: "Arjun (Support)", perms: ["View bookings"] },
  ];
  return (
    <Shot title="Team members">
      <div className="space-y-2">
        {members.map((m) => (
          <Card key={m.name}>
            <div className="flex items-center justify-between gap-2">
              <p className="text-[10px] font-bold">{m.name}</p>
              <Chip tone="blue">Integration viewer</Chip>
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
              {m.perms.map((p) => (
                <Chip key={p} tone="lime">{p}</Chip>
              ))}
            </div>
          </Card>
        ))}
      </div>
      <p className="mt-3 text-[9px] text-white/45">Owner only. Staff never see this page.</p>
    </Shot>
  );
}
