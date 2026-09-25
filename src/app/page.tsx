import Image from "next/image";
import { HeroLogo } from "@/components/hero-logo";
import { KaratsHero } from "@/components/karats-hero";
import { Host } from "@/components/host";
import { Journey } from "@/components/journey";
import { Episodes } from "@/components/episodes";
import { Nominate } from "@/components/nominate";
import { SiteFooter } from "@/components/site-footer";
import SpiralGallery from "@/components/SpiralGallery";
import { GroupWave } from "@/components/group-wave";

export default function Home() {
  return <>
    <main id="main">
      {/* Title-film banner */}
      <section className="reference-hero" aria-labelledby="hero-title">
        <HeroLogo />
        <div className="reference-stars" aria-hidden="true">{Array.from({length:180}, (_,i)=><i key={i} style={{left:`${(i * 61.80339887) % 100}%`,top:`${(i * 37.137) % 100}%`,opacity:.15+(i%5)*.06}} />)}</div>
        <h1 id="hero-title" className="hero-accessible-title">Behind the Karats — ft. Vikas Singhvi</h1>
        <Image className="reference-portrait" src="/images/vikas.webp" alt="Vikas Singhvi" width={620} height={1122} priority sizes="(max-width: 700px) 24vw, 20vw" />
        <Image className="reference-mic" src="/images/mic.webp" alt="" width={1500} height={968} priority sizes="(max-width: 700px) 44vw, 38vw" />
      </section>

      <KaratsHero />
      <GroupWave />
      <Host />
      <SpiralGallery />
      <Journey />
      <Episodes />
      <Nominate />
    </main>
    <SiteFooter />
  </>;
}
