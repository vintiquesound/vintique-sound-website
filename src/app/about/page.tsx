import Image from "next/image"

export default function About() {
  return (
    <div id="page-about-main" className="flex flex-col text-center">
      <h1 id="about">My Story</h1>
      <Image
        className="items-center"
        src="/images/page_content/about/mixer_black_and_white-1080x480.jpg"
        alt="Vintage mixer in black and white at Vintique Sound Studio"
        width={1080}
        height={480}
      />
      <div className="flex flex-row">
        <div className="flex flex-col">
          <p className="text-left">
            I help Bands & Electronic Music Producers turn their raw recordings
            into professional quality Mixes & Masters. I also teach fundamentals
            of Mixing & Mastering, and provide Cubase specific training.
          </p>
          <Image
            className="items-center"
            src="/images/page_content/about/kevin_at_steinberg_in_hamburg-480x480.jpg"
            alt="Kevin at Steinberg headquarters in Hamburg Germany."
            width={320}
            height={320}
          />
        </div>
        <div>
          <p className="text-left">
            The primary focus of Vintique Sound is to help Rock & Indie Bands and
            Electronic Music Producers turn their raw recordings into professional
            quality Mixes & Masters. I also provide Cubase specific training & teach
            the fundamentals of Mixing & Mastering. The goal of my YouTube Channel
            is to help you learn more about your DAW, to provide you with insightful
            Mixing and Mastering tutorials, and tips & tricks that will help elevate
            your music productions skills.
          </p>
          <p className="text-left">
            Music has always been an important part of my life. I remember when I was
            a tiny human and used to bang away on a homemade drum kit made out of
            strategically placed margarine containers and ice cream pales. The faux
            drum set was quickly replaced with a novice sized orange sparkle drum kit
            bought at a garage sale and an electric guitar & amp kit from Costco (and
            thankfully I&apos;ve upgraded all of that gear as the years went by).
          </p>
          <p className="text-left">
            My first band was called &quot;Doofeye.&quot; We were a cover band and played our
            first concert called &quot;Doofest 2002.&quot; I switched out between drummer and
            guitarist. I was the drummer in two other bands &quot;Lacewing&quot; & &quot;The Equation&quot;
            (all originals this time). And I even started my own 1-piece band called
            &quot;Sirloin Casket&quot; which was my creative outlet to experiment with different
            genres.
          </p>
          <p className="text-left">
            I was experimenting with Recording/Mixing/Mastering as of about 2002. My
            first DAW was Cool Edit Pro, then Adobe Audition once they bought them out
            in 2003. I bought myself a Korg D4 portable recorder, then later a Zoom R16.
            It wasn&apos;t until about 2012 when I decide to get serious with Audio
            Engineering. I bought Cubase Pro 6.5 and an audio interface and some studio
            monitors. I started producing Electronic Music under the alias Phantom Limb
            (dubstep) & a few years later as Antoku (deep house/nu disco) and more
            recently as Rhythm Ace (chill hip hop). I also started providing services
            to bands and started a YouTube Channel.
          </p>
          <p className="text-left">
            I&apos;ve since had the pleasure of working with talented artists such as Ante
            Svircic, Leonard, Gypsy Mobile, Stephanie Harpe, Manobra de Massa, Gernot
            Gabriel, Timmy James, Mindwiser, & Cataclysm. Some of my recordings and
            mixes have found their way to Howie Weinberg Mastering & various radio
            stations.
          </p>
          <p className="text-left">
            Fun Fact: you might be surprised to learn that I have a Bachelor of Science
            in Computer Science, a Bachelor of Arts in Philosophy and Psychology, and
            an Automotive Mechanic Certificate. Not only am I addicted to music, but I&apos;m
            also proud of my technical and academic background.
          </p>
        </div>
      </div>
      <h2>Kevin</h2>
      <div className="flex flex-row">
        <div className="flex flex-col">
          <Image
            className="items-center"
            src="/images/page_content/about/kevin_at_steinberg_in_hamburg-480x480.jpg"
            alt="Kevin at Steinberg headquarters in Hamburg Germany."
            width={320}
            height={320}
          />
          <h4>studio nerd</h4>
          <p>
            I&apos;m addicted to music, so naturally I spend most of my spare time mixing and
            mastering music and fiddling around with gear.
          </p>
        </div>
        <div className="flex flex-col">
          <Image
            className="items-center"
            src="/images/page_content/about/kevin_at_steinberg_in_hamburg-480x480.jpg"
            alt="Kevin at Steinberg headquarters in Hamburg Germany."
            width={320}
            height={320}
          />
          <h4>festival dancer</h4>
          <p>
            If I&apos;m not in the studio, I&apos;m probably dancing up a storm in an astronaut
            costume at a music festival.
          </p>
        </div>
        <div className="flex flex-col">
          <Image
            className="items-center"
            src="/images/page_content/about/kevin_at_steinberg_in_hamburg-480x480.jpg"
            alt="Kevin at Steinberg headquarters in Hamburg Germany."
            width={320}
            height={320}
          />
          <h4>mountain dweller</h4>
          <p>
            Or you&apos;ll catch me hiking in the summer or hittin that sweet pow at the
            tippy top of the mountain in the winter.
          </p>
        </div>
      </div>
    </div>
  )
}
