import Link from "next/link";

export default function NotFound() {
  return <main className="container not-found"><span className="eyebrow">404 / A DIFFERENT PATH</span><h1>Still figuring<br/>this one out.</h1><p>This page doesn’t exist. Let’s get you back to the conversations.</p><Link className="button gold" href="/">Return home ↗</Link></main>;
}
