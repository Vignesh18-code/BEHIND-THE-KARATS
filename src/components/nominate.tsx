"use client";

import { useState } from "react";
import { Reveal } from "./reveal";
import { IconArrowRight, IconCheck } from "./icons";
import { NOMINATE_BENEFITS, SOCIAL } from "@/lib/site-content";

/**
 * Where submissions go. The site is a static export with no server of its own,
 * so the form posts straight to a form service. Both Web3Forms and Formspree
 * accept a plain FormData POST and answer with JSON, so either works: set the
 * endpoint, and the key only if the service wants one.
 *
 * Set NEXT_PUBLIC_FORM_KEY in the Vercel project (Settings -> Environment
 * Variables) and redeploy. Until it is set, the form tells people it could not
 * send rather than pretending it did.
 */
const ENDPOINT = process.env.NEXT_PUBLIC_FORM_ENDPOINT || "https://api.web3forms.com/submit";
const ACCESS_KEY = process.env.NEXT_PUBLIC_FORM_KEY || "";

const FIELDS = [
  { name: "name", label: "Name", type: "text", placeholder: "Your full name", required: true, half: true },
  { name: "phone", label: "Phone", type: "tel", placeholder: "Your contact number", required: true, half: true },
  { name: "email", label: "Email", type: "email", placeholder: "Your email address", required: true, half: true },
  { name: "business", label: "What Do You Do?", type: "text", placeholder: "Business / craft / role", required: true, half: true },
] as const;

export function Nominate() {
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "failed">("idle");
  const sent = status === "sent";

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const next: Record<string, boolean> = {};
    for (const field of FIELDS) {
      const value = String(data.get(field.name) ?? "").trim();
      if (!value) next[field.name] = true;
      else if (field.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) next[field.name] = true;
    }
    if (!String(data.get("story") ?? "").trim()) next.story = true;
    setErrors(next);
    if (Object.keys(next).length) {
      document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
      return;
    }

    setStatus("sending");
    if (ACCESS_KEY) data.append("access_key", ACCESS_KEY);
    data.append("subject", "New nomination — Behind The Karats");
    try {
      const response = await fetch(ENDPOINT, { method: "POST", body: data, headers: { Accept: "application/json" } });
      if (!response.ok) throw new Error(String(response.status));
      form.reset();
      setStatus("sent");
    } catch {
      // Never show a thank-you for something that did not arrive.
      setStatus("failed");
    }
  };

  return <section id="nominate" className="relative z-20 border-t border-white/5 section-space">
    <div className="site-container">
      <div className="grid gap-8 sm:gap-10 lg:gap-14 lg:grid-cols-2">
        <Reveal>
          <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">Nominate / Pitch</span>
          <h2 className="mt-4 font-glitz text-4xl font-normal leading-tight tracking-tight text-white sm:text-5xl">
            YOUR STORY<br />COULD BE NEXT.
          </h2>
          <p className="mt-6 font-cormorant text-xl italic text-light-muted">Some stories are meant to travel further.</p>
          <p className="mt-5 text-sm leading-relaxed text-light-muted">
            Built something from scratch? Turned a setback into a comeback? Or lived a journey that could inspire someone else?
          </p>
          <p className="mt-4 text-sm leading-relaxed text-light-muted">
            If you believe your story deserves to be heard, tell us about it. Vikas Singhvi and the Behind the Karats team would love to hear from you.
          </p>
          <ul className="mt-10 space-y-5">
            {NOMINATE_BENEFITS.map(item => <li key={item.title} className="flex gap-4">
              <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-gold/40 bg-gold/10 text-gold">
                <IconCheck className="h-3 w-3" />
              </span>
              <div>
                <h3 className="font-glitz text-sm font-normal uppercase tracking-wider text-white">{item.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-light-muted">{item.body}</p>
              </div>
            </li>)}
          </ul>
        </Reveal>

        <Reveal delay={120}>
          <div className="nomination-card rounded-3xl border border-white/10 bg-noir-card/80 p-5 shadow-2xl backdrop-blur-sm sm:p-8 xl:p-10">
            {sent ? <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full border border-gold/40 bg-gold/10 text-gold">
                <IconCheck className="h-7 w-7" />
              </span>
              <h3 className="mt-6 font-glitz text-2xl font-normal text-white">Thank you.</h3>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-light-muted">
                Your story is with the editorial desk. If it&rsquo;s a fit for the show, the team will reach out personally.
              </p>
              <button type="button" onClick={() => setStatus("idle")} className="mt-8 text-[11px] font-semibold uppercase tracking-widest text-gold hover:text-gold-light">
                Submit another story
              </button>
            </div> : <>
              <h3 className="font-glitz text-2xl font-normal text-white">Tell Us Your Story</h3>
              <p className="mt-2 text-[11px] uppercase tracking-[0.2em] text-gold-muted">Apply to be a featured guest on the show</p>
              <form className="mt-8 space-y-5" onSubmit={onSubmit} noValidate>
                <div className="nomination-fields">
                  {FIELDS.map(field => <div key={field.name} className="flex min-w-0 flex-col">
                    <label className="form-label" htmlFor={field.name}>{field.label} {field.required && <span className="text-gold">*</span>}</label>
                    <input id={field.name} name={field.name} type={field.type} placeholder={field.placeholder}
                      className="form-input" aria-invalid={errors[field.name] ? "true" : undefined}
                      onChange={() => errors[field.name] && setErrors(e => ({ ...e, [field.name]: false }))} />
                  </div>)}
                </div>
                <div className="flex min-w-0 flex-col">
                  <label className="form-label" htmlFor="story">Tell Us Your Story <span className="text-gold">*</span></label>
                  <textarea id="story" name="story" rows={5} className="form-input resize-none"
                    placeholder="Give us the short version — what makes your journey different. Setbacks, breakthroughs, or key milestones."
                    aria-invalid={errors.story ? "true" : undefined}
                    onChange={() => errors.story && setErrors(e => ({ ...e, story: false }))} />
                </div>
                <div className="flex min-w-0 flex-col">
                  <label className="form-label" htmlFor="social">Instagram / LinkedIn <span className="text-light-muted">(optional)</span></label>
                  <input id="social" name="social" type="url" className="form-input" placeholder="Drop your profile link" />
                </div>
                {Object.keys(errors).length > 0 && <p role="alert" className="text-xs text-red-400">Please complete the highlighted fields.</p>}
                {/* Bots fill every field they find; people never see this one. */}
                <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" aria-hidden="true"
                  className="pointer-events-none absolute left-[-9999px] h-0 w-0 opacity-0" />

                <button type="submit" disabled={status === "sending"}
                  className="group flex w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-gold-light via-gold to-gold-dark px-4 py-4 text-xs font-bold uppercase tracking-[0.25em] text-black shadow-[0_0_30px_rgba(212,175,55,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_45px_rgba(212,175,55,0.55)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0">
                  {status === "sending" ? "Sending…" : <>Share My Story <IconArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" /></>}
                </button>

                {status === "failed" && <p role="alert" className="rounded-xl border border-red-400/30 bg-red-400/5 px-4 py-3 text-center text-xs leading-relaxed text-red-200">
                  We couldn&rsquo;t send that just now. Please try again in a moment — or reach us on{" "}
                  <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-white">Instagram</a>{" "}
                  and we&rsquo;ll pick it up from there.
                </p>}
              </form>
            </>}
          </div>
        </Reveal>
      </div>
    </div>
  </section>;
}
