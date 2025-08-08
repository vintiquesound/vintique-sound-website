import Link from "next/link"
import Image from "next/image"

export default function Studio() {
  return (
    <div id="page-studio-main" className="flex flex-col">
      <div className="text-center">
        <h1>The Studio</h1>
        <Image
          className="items-center"
          src="/images/page_content/studio/vintique_sound_studio-1080x480.jpg"
          alt="Vintique Sound studio"
          width={1080}
          height={480}
        >
        </Image>
      </div>
      <div className="flex flex-row">
        <div>
          <h3>
            I offer profession{" "}
            <Link href="/mixing_and_mastering"
              className="underline text-accent"
            >
              Mixing & Mastering
            </Link>
            {" "}services. I also offer Editing services such as Drum Editing,
            Time Alignment, Comping, and Tuning.
          </h3>
        </div>
        <div>
          <p>
            My studio is located in Edmonton Alberta Canada, minutes away from
            the downtown core and the beautiful North Saskatchewan River Valley
            (the largest stretch of urban parkland in North America). It&apos;s also
            minutes away from the iconic Whyte Ave strip which plenty of bars,
            restaurants, cafes, stores, and is host to numerous cultural events
            to keep your heart content.
          </p>
          <p>
            The room is acoustically treated with Auralex acoustic foam and bass
            traps, arranged using custom designed wooden panels, and tuned using
            Sonarworks Reference 4 software, which makes it an ideal environment
            for{" "}
            <Link href="/mixing_and_mastering"
              className="underline text-accent"
            >
              Mixing & Mastering.
            </Link>
          </p>
          <p>
            I&apos;m also available for hire as a lead or assistant recording engineer
            at various recording studios around the city.{" "}
            <Link href="/contact"
              className="underline text-accent"
            >
              Contact me via email
            </Link>
            {" "}for more details.
          </p>
        </div>
      </div>
      <div className="flex flex-row">
        <div className="text-left">
          <h2>Equipment</h2>
          <div className="pb-4">
            <h4 className="pb-2">DAW&apos;s</h4>
            <ul>
              <li>Cubase Pro 14</li>
              <li>Wave Lab Pro 12</li>
              <li>Ableton Live 10 Standard</li>
              <li>Bitwig Studio 5</li>
              <li>Spectral Layers Pro 9</li>
              <li>iZotope RX 10 Standard</li>
            </ul>
          </div>
          <div className="pb-4">
            <h4 className="pb-2">Converter/Interface</h4>
            <ul>
              <li>Antelope Audio Zen Studio</li>
              <li>Universal Audio Solo USB</li>
            </ul>
          </div>
          <div className="pb-4">
            <h4 className="pb-2">Monitoring</h4>
            <ul>
              <li>Neumann KH 310 3-Way Studio Monitors</li>
              <li>Avantone Mixcube Studio Monitors</li>
              <li>Focal Spirit Pro Headphones</li>
              <li>Sonarworks Reference 4 Studio Edition</li>
              <li>Mastering the Mix Reference</li>
            </ul>
          </div>
          <div className="pb-4">
            <h4 className="pb-2">Plugins</h4>
            <ul>
              <li>Universal Audio Ultimate 11 Bundle</li>
              <li>SSL Fusion Bundle</li>
              <li>SSL Native Bus Compressor</li>
              <li>Waves Mercury Bundle</li>
              <li>Waves Studio Classics</li>
              <li>Waves Abbey Road Collection</li>
              <li>Waves NX</li>
              <li>Soundtoys 5 Bundle</li>
              <li>Fab Filter Pro Bundle</li>
              <li>iZotope Music Production Suite 3</li>
              <li>(includes: Ozone 9 Advanced</li>
              <li>Neutron 3 Advanced, Tonal Balance,</li>
              <li>and more)</li>
              <li>Plugin Alliance Shadow Hills Mastering Compressor</li>
              <li>Plugin Alliance Black Box Analog Design</li>
              <li>Brainworx bx_townhouse Buss Comp</li>
              <li>Brainworx bx_masterdesk</li>
              <li>SIR Audio Tools Standard Clip</li>
              <li>Audio Thing Outer Space</li>
              <li>Eventide Anthology X Bundle</li>
            </ul>
          </div>
          <div className="pb-4">
            <h4 className="pb-2">Vintage Synths & Samplers</h4>
            <ul>
              <li>Yamaha DX7 FM Synthesizer</li>
              <li>Yamaha TX81Z FM Tone Generator</li>
              <li>Roland MKS-50 Synth Module</li>
              <li>Roland PG-300 Synth Programmer</li>
            </ul>
          </div>
          <div className="pb-4">
            <h4 className="pb-2">Virtual Synths & Samplers</h4>
            <ul>
              <li>NI Komplete 13 Ultimate Collector&apos;s Edition</li>
              <li>Arturia V Collection 8</li>
              <li>UAD Mini Moog</li>
            </ul>
          </div>
          <div className="pb-4">
            <h4 className="pb-2">Microphones</h4>
            <ul>
              <li>AKG C414-XLS Large Diaphragm Condensor</li>
              <li>AKG C1000S Small Diaphragm Condensor</li>
              <li>Audio Technica AT4040 Large Diaphragm Condensor</li>
              <li>Sennheiser MD421 Dynamic</li>
              <li>Shure SM57 Dynamic</li>
              <li>Neat Microphones Beecaster</li>
            </ul>
          </div>
          <div className="pb-4">
            <h4 className="pb-2">Sound Absorption</h4>
            <ul>
              <li>(2x) 6ft x 3ft x 6in Auralex Panels</li>
              <li>(2x) 6ft x 3ft x 3in Auralex Panels</li>
              <li>(4x) 3ft x 3ft x 3in Auralex Panels</li>
              <li>(2x) 3ft x 3ft x 1.5in Auralex Panels</li>
              <li>(8x) Auralex LENRD Bass Traps</li>
              <li>(4x) Auralex CornerFill Cube 12in x 12in x 12in</li>
              <li>(2x) Auralex MoPAD Monitor Pads</li>
            </ul>
          </div>
          <div className="pb-4">
            <h4 className="pb-2">MIDI Controllers</h4>
            <ul>
              <li>NI Komplete Kontrol S25</li>
              <li>Steinberg CMC PD/TP/CH</li>
              <li>Roland UM-ONE USB MIDI</li>
            </ul>
          </div>
          <div className="pb-4">
            <h4 className="pb-2">DJ Equipment</h4>
            <ul>
              <li>NI Traktor Kontrol S4 mkII</li>
              <li>NI Traktor Kontrol F1</li>
              <li>NI Traktor Kontrol S4 Flight Case</li>
              <li>NI Traktor Pro 4</li>
              <li>AKG K181 DJ Headphones</li>
            </ul>
          </div>
          <div className="pb-4">
            <h4 className="pb-2">Desk & Power Units</h4>
            <ul>
              <li>Yorkville SDR Studio Desk Side Rack</li>
              <li>(2x) ART PS4x4 PRO Power Distributor</li>
            </ul>
          </div>
          <div className="pb-4">
            <h4 className="pb-2">Video Software</h4>
            <ul>
              <li>Adobe Elements 2019</li>
              <li>OBS Studio</li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col">
          <Image
            src="/images/page_content/studio/vintage_gear-1280x720.jpg"
            alt="Vintage Gear displayed at Vintique Sound"
            width={853}
            height={480}
          >
          </Image>
        </div>
      </div>
    </div>
  )
}
