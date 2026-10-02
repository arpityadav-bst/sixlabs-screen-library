"use client";

// The forms, built from the system's fields and buttons. Waitlist runs for real: invalid shows once the field is left, the
// error clears as the value turns valid, submit focuses the field when it is wrong, then the button is busy
// and a toast confirms. Given a step it holds that step still, for the flow strip. Nothing is sent anywhere.
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/design-system/Button";
import { ButtonGroup } from "@/components/design-system/ButtonGroup";
import { Card } from "@/components/design-system/Card";
import { Checkbox } from "@/components/design-system/Checkbox";
import { Dialog } from "@/components/design-system/Dialog";
import { Select } from "@/components/design-system/Select";
import { TextArea } from "@/components/design-system/TextArea";
import { TextInput } from "@/components/design-system/TextInput";
import { TextLink } from "@/components/design-system/TextLink";
import { Toast } from "@/components/design-system/Toast";
import { CONTACT, EMAIL, FLOW, SIGN_IN, TOPICS, WAITLIST, type FlowStep } from "./forms-data";
import s from "./forms.module.css";

type Phase = "idle" | "sending" | "sent";
const SEND_MS = 1400;

const phaseOf = (step?: FlowStep): Phase => (step === "submitting" ? "sending" : step === "success" ? "sent" : "idle");

export function Waitlist({ step }: { step?: FlowStep }) {
  const id = useId();
  const live = step === undefined;
  const [value, setValue] = useState(FLOW.find((f) => f.step === step)?.value ?? "");
  // left once: focus moved off it with something in it, or submitted. From then the field re-checks as it types.
  const [left, setLeft] = useState(step === "invalid" || step === "fixed");
  const [phase, setPhase] = useState<Phase>(phaseOf(step));
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const valid = EMAIL.test(value.trim());
  const error = left && !valid ? (value.trim() ? WAITLIST.invalid : WAITLIST.empty) : undefined;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!live || phase === "sending") return;
    setLeft(true);
    if (!valid) {
      document.getElementById(id)?.focus();
      return;
    }
    setPhase("sending");
    timer.current = window.setTimeout(() => {
      setPhase("sent");
      setValue("");
      setLeft(false);
    }, SEND_MS);
  };

  return (
    <div data-pin="card" className={s["ds-fm-w"]}>
      <Card tone="surface">
        <form className={s["ds-fm-line"]} onSubmit={submit} noValidate>
          <TextInput
            id={id}
            className={s["ds-fm-grow"]}
            label={WAITLIST.label}
            type="email"
            size="lg"
            autoComplete="email"
            inputMode="email"
            placeholder={WAITLIST.placeholder}
            value={value}
            readOnly={phase === "sending"}
            error={error}
            onChange={(v) => {
              setValue(v);
              if (phase === "sent") setPhase("idle");
            }}
            onBlur={() => {
              if (live && value.trim() !== "") setLeft(true);
            }}
          />
          <Button type="submit" size="xl" loading={phase === "sending"} className={s["ds-fm-submit"]}>
            {WAITLIST.cta}
          </Button>
        </form>
      </Card>
      {phase === "sent" && (
        <div className={s["ds-fm-toast"]}>
          <Toast tone="success" title={WAITLIST.sent} body={WAITLIST.sentBody} onDismiss={() => setPhase("idle")} />
        </div>
      )}
    </div>
  );
}

/** The flow, one held step after another. Each step is inert, so only the live line above takes input. */
export function WaitlistFlow() {
  return (
    <ol className={s["ds-fm-flow"]} aria-label="Validation, step by step">
      {FLOW.map((f) => (
        <li key={f.step} className={s["ds-fm-step"]}>
          <p className="ds-label">{f.label}</p>
          <div inert>
            <Waitlist step={f.step} />
          </div>
        </li>
      ))}
    </ol>
  );
}

export function SignIn() {
  const [shown, setShown] = useState(false);
  const show = (
    <span data-pin="show">
      <Button
        variant="ghost"
        size="xs"
        aria-label={shown ? "Hide password" : "Show password"}
        onClick={() => setShown((v) => !v)}
      >
        {shown ? "Hide" : "Show"}
      </Button>
    </span>
  );
  return (
    <div data-pin="signin" className={s["ds-fm-dialog"]}>
      <Dialog
        inline
        size="md"
        title={SIGN_IN.title}
        footer={
          <Button size="lg" fullWidth>
            {SIGN_IN.title}
          </Button>
        }
      >
        <div data-pin="fields" className={s["ds-fm-stack"]}>
          <TextInput label={SIGN_IN.email} type="email" autoComplete="email" placeholder={WAITLIST.placeholder} />
          <TextInput label={SIGN_IN.password} type={shown ? "text" : "password"} autoComplete="current-password" trailing={show} />
          <div data-pin="keep" className={s["ds-fm-row"]}>
            <Checkbox label={SIGN_IN.keep} />
            <TextLink href="#forms">{SIGN_IN.forgot}</TextLink>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

export function Contact() {
  return (
    <form data-pin="contact" className={s["ds-fm-contact"]} onSubmit={(e) => e.preventDefault()} noValidate>
      <div className={s["ds-fm-stack"]}>
        <Select label={CONTACT.topic} options={TOPICS} placeholder="Choose a job" />
        <TextArea label={CONTACT.message} helper={CONTACT.messageHelper} maxLength={500} />
        <Checkbox label={CONTACT.consent} />
      </div>
      <div className={s["ds-fm-actions"]}>
        <ButtonGroup>
          <Button variant="secondary">{CONTACT.cancel}</Button>
          <Button type="submit">{CONTACT.send}</Button>
        </ButtonGroup>
      </div>
    </form>
  );
}
