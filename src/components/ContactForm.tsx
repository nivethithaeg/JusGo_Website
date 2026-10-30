"use client";

import { motion, useAnimationControls, useReducedMotion } from "framer-motion";
import { type FormEvent, useEffect, useRef, useState } from "react";
import { EASE_EXPO, SHAKE } from "@/lib/motion";

type Fields = { name: string; email: string; message: string };
type Errors = Partial<Record<keyof Fields, string>>;

const EMPTY: Fields = { name: "", email: "", message: "" };
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate({ name, email, message }: Fields): Errors {
  const errors: Errors = {};
  if (!name.trim()) errors.name = "Please enter your name.";
  if (!EMAIL_PATTERN.test(email.trim())) errors.email = "Please enter a valid email address.";
  if (message.trim().length < 10) errors.message = "Tell us a little more (at least 10 characters).";
  return errors;
}

/** Rounded field: the border eases to green on focus and a soft green glow spreads around it. */
const fieldClass =
  "peer w-full rounded-2xl border bg-white px-4 pb-2.5 pt-6 text-sm text-ink-900 outline-none transition-[border-color,box-shadow] duration-300 placeholder:text-transparent";
const FIELD_OK = "border-jg-900/15 hover:border-jg-900/30 focus:border-jg-600 focus:shadow-[0_0_0_4px_rgba(182,255,59,0.3),0_12px_28px_-14px_rgba(31,169,75,0.55)]";
const FIELD_ERROR = "border-red-500 focus:shadow-[0_0_0_4px_rgba(239,68,68,0.15)]";

/** Children of the form rise in one after another when it scrolls into view. */
const ITEM = { hidden: { opacity: 0, y: 18 }, shown: { opacity: 1, y: 0 } };

export function ContactForm({ email }: { email: string }) {
  const reduceMotion = useReducedMotion();
  const controls = useAnimationControls();
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach((id) => window.clearTimeout(id)), []);

  const update = (key: keyof Fields) => (event: { target: { value: string } }) => {
    setFields((current) => ({ ...current, [key]: event.target.value }));
    if (errors[key]) setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    const next = validate(fields);
    setErrors(next);
    if (Object.keys(next).length > 0) {
      if (!reduceMotion) void controls.start({ x: [...SHAKE.x], transition: SHAKE.transition });
      return;
    }
    const body = `${fields.message.trim()}\n\n${fields.name.trim()} (${fields.email.trim()})`;
    const href = `mailto:${email}?subject=${encodeURIComponent(`Hello JusGo from ${fields.name.trim()}`)}&body=${encodeURIComponent(body)}`;
    setStatus("sending");
    const scale = reduceMotion ? 0.2 : 1;
    timers.current.push(
      window.setTimeout(() => setStatus("done"), 900 * scale),
      window.setTimeout(() => {
        window.location.href = href;
        setSent(true);
        setStatus("idle");
      }, 1500 * scale),
    );
  };

  const field = (key: keyof Fields, label: string, input: "input" | "textarea", type?: string) => {
    const error = errors[key];
    const common = {
      id: `contact-${key}`,
      value: fields[key],
      placeholder: " ",
      onChange: update(key),
      "aria-invalid": error ? true : undefined,
      "aria-describedby": error ? `contact-${key}-error` : undefined,
      className: `${fieldClass} ${error ? FIELD_ERROR : FIELD_OK}`,
    };
    return (
      <motion.div variants={ITEM} transition={{ duration: 0.6, ease: EASE_EXPO }}>
        <div className="relative">
          {input === "textarea" ? <textarea {...common} rows={5} /> : <input {...common} type={type} />}
          <label
            htmlFor={common.id}
            className="pointer-events-none absolute left-4 top-[18px] origin-left text-sm text-ink-900/45 transition-transform duration-200 peer-focus:-translate-y-3 peer-focus:scale-75 peer-focus:text-jg-600 peer-[:not(:placeholder-shown)]:-translate-y-3 peer-[:not(:placeholder-shown)]:scale-75"
          >
            {label}
          </label>
        </div>
        {error ? <p id={`contact-${key}-error`} role="alert" className="mt-1.5 text-xs font-medium text-red-600">{error}</p> : null}
      </motion.div>
    );
  };

  if (sent) {
    return (
      <div className="flex flex-col items-center py-6 text-center sm:py-10" role="status">
        <svg aria-hidden="true" viewBox="0 0 52 52" className="h-20 w-20">
          <motion.circle
            cx="26"
            cy="26"
            r="23"
            fill="none"
            stroke="#1FA94B"
            strokeWidth="3"
            initial={reduceMotion ? false : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.6, ease: EASE_EXPO }}
          />
          <motion.path
            d="M15 27 L23 35 L38 18"
            fill="none"
            stroke="#1FA94B"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={reduceMotion ? false : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.45, delay: 0.5, ease: EASE_EXPO }}
          />
        </svg>
        <motion.h3
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7, ease: EASE_EXPO }}
          className="mt-5 font-display text-2xl font-extrabold tracking-[-0.04em] text-ink-900"
        >
          Your email draft is ready
        </motion.h3>
        <motion.p
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.85, ease: EASE_EXPO }}
          className="mt-2 max-w-sm text-sm leading-6 text-ink-900/60"
        >
          We opened your email app with the message filled in. Press send there to reach the JusGo team.
        </motion.p>
        <button
          type="button"
          onClick={() => {
            setFields(EMPTY);
            setSent(false);
          }}
          className="mt-6 text-xs font-bold text-jg-600 transition-colors hover:text-jg-900"
        >
          Write another message
        </button>
      </div>
    );
  }

  return (
    <motion.form noValidate onSubmit={onSubmit} animate={controls}>
      <motion.div
        initial={reduceMotion ? "shown" : "hidden"}
        whileInView="shown"
        viewport={{ once: true, amount: 0.15 }}
        variants={{ hidden: {}, shown: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } } }}
        className="space-y-4"
      >
        <motion.div variants={ITEM} transition={{ duration: 0.6, ease: EASE_EXPO }}>
          <h3 className="font-display text-2xl font-extrabold tracking-[-0.04em] text-ink-900">Send us a message</h3>
          <p className="mt-1.5 text-sm leading-6 text-ink-900/55">Tell us a little about what you need.</p>
        </motion.div>
        {field("name", "Name", "input", "text")}
        {field("email", "Email", "input", "email")}
        {field("message", "Message", "textarea")}
        <motion.div variants={ITEM} transition={{ duration: 0.6, ease: EASE_EXPO }} className="pt-1">
          <motion.button
            type="submit"
            data-cursor="Write"
            disabled={status !== "idle"}
            aria-live="polite"
            whileHover={reduceMotion || status !== "idle" ? undefined : { y: -3, scale: 1.03 }}
            whileTap={reduceMotion || status !== "idle" ? undefined : { scale: 0.96 }}
            transition={{ type: "spring", stiffness: 420, damping: 18 }}
            className="group inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-[#B6FF3B] px-8 py-4 text-sm font-extrabold text-[#071426] shadow-[0_14px_32px_-12px_rgba(182,255,59,0.95)] transition-shadow duration-300 hover:shadow-[0_18px_40px_-10px_rgba(182,255,59,1)] disabled:opacity-90 sm:w-auto sm:min-w-[13rem]"
          >
            {status === "idle" ? (
              <>
                Send message
                <span aria-hidden="true" className="inline-block transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-1.5">↗</span>
              </>
            ) : status === "sending" ? (
              <>
                <span aria-hidden="true" className="h-4 w-4 animate-spin rounded-full border-2 border-[#071426]/25 border-t-[#071426]" />
                Preparing…
              </>
            ) : (
              <>
                <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4">
                  <motion.path
                    d="M4 10.5 L8.5 15 L16 6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                  />
                </svg>
                Ready
              </>
            )}
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.form>
  );
}
