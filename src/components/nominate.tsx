"use client";

import { useState } from "react";
import { Reveal } from "./reveal";
import { IconArrowRight, IconCheck } from "./icons";
import { NOMINATE_BENEFITS } from "@/lib/site-content";

const FIELDS = [
  { name: "name", label: "Name", type: "text", placeholder: "Your full name", required: true, half: true },
  { name: "phone", label: "Phone", type: "tel", placeholder: "Your contact number", required: true, half: true },
  { name: "email", label: "Email", type: "email", placeholder: "Your email address", required: true, half: true },
  { name: "business", label: "What Do You Do?", type: "text", placeholder: "Business / craft / role", required: true, half: true },
] as const;

export function Nominate() {
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [sent, setSent] = useState(false);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
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
    setSent(true);
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
              <button type="button" onClick={() => setSent(false)} className="mt-8 text-[11px] font-semibold uppercase tracking-widest text-gold hover:text-gold-light">
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
                <button type="submit"
                  className="group flex w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-gold-light via-gold to-gold-dark px-4 py-4 text-xs font-bold uppercase tracking-[0.25em] text-black shadow-[0_0_30px_rgba(212,175,55,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_45px_rgba(212,175,55,0.55)]">
                  Share My Story <IconArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                </button>
              </form>
            </>}
          </div>
        </Reveal>
      </div>
    </div>
  </section>;
}
