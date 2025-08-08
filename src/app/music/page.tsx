import Link from "next/link"
import Image from "next/image"

export default function Music() {
  return (
    <div id="page-music-main" className="flex flex-col text-center">
      <h1 id="music-is-life">Music Is Life</h1>
      <h4 className="pb-4">
        From Deep House, to Chill Hip Hop, to Classic Dubstep, to Indie Rock.
        <br></br>
        Kevin is always experimenting with new genres.
      </h4>
      <div className="flex flex-row justify-center">
        <Link href="/music#music-spotify-container">
          <button className="w-[150px] border-2 p-2 m-2 border-secondary cursor-pointer">Booking</button>
        </Link>
        <Link href="/music#music-spotify-container">
          <button className="w-[150px] p-2 m-2 bg-primary cursor-pointer">Listen</button>
        </Link>
      </div>
      <h2>My Music</h2>
      <div className="flex flex-row gap-6">
        <div id="music-antoku-card"
          className="flex-1 min-w-[220px] lg:min-h-[300px]
          rounded-xl shadow-md p-8 bg-secondary-10"
        >
          <h4 className="pb-6">Antoku</h4>
          <ul className="pb-4 text-accent">
            <li>Deep/Tech House</li>
            <li>Nu Disco</li>
          </ul>
          <p className="text-muted">
            Antoku is Kevin&apos;s latest venture into the Deep/Tech House and Nu
            Disco scene, carefully curated grooves for your listening pleasure.
          </p>
        </div>
        <div id="music-rhythm-ace-card"
          className="flex-1 min-w-[220px] lg:min-h-[300px]
          rounded-xl shadow-md p-8 bg-secondary-10"
        >
          <h4 className="pb-6">Rhythm Ace</h4>
          <ul className="pb-4 text-accent">
            <li>Chill Hip Hop</li>
            <li>Boom Bap</li>
          </ul>
          <p className="text-muted">
            Rhythm Ace is the newest DJ/producer project that Kevin established
            in 2020. Chill Hip Hop. An EP is in the works.
          </p>
        </div>
        <div id="music-phantom-limb-card"
          className="flex-1 min-w-[220px] lg:min-h-[300px]
          rounded-xl shadow-md p-8 bg-secondary-10"
        >
          <h4 className="pb-6">Phantom Limb</h4>
          <ul className="pb-4 text-accent">
            <li>Dubstep</li>
            <li>Dub</li>
          </ul>
          <p className="text-muted">
            Phantom Limb is the original DJ/producer project that Kevin established
            in 2012. The focus here is on deep basslines and groovy beats at 140bpm,
            often described as Bass music, Old School Dubstep, and Dub.
          </p>
        </div>
        <div id="music-sirloin-casket-card"
          className="flex-1 min-w-[220px] lg:min-h-[300px]
          rounded-xl shadow-md p-8 bg-secondary-10"
        >
          <h4 className="pb-6">Sirloin Casket</h4>
          <ul className="pb-4 text-accent">
            <li>Post Rock</li>
            <li>Indie Rock</li>
          </ul>
          <p className="text-muted">
            Sirloin Casket is the original music project. Kevin writes, produces,
            performs, records, and mixes/masters everything. The soundscapes vary
            between Indie Rock, Prog/Stoner Rock, and even Acoustic.
          </p>
        </div>
      </div>
      <div id="music-spotify-container">
        <h2>Spotify</h2>
        <iframe
          title="Vintique Sound Spotify playlist"
          src="https://open.spotify.com/embed/playlist/3f7P4hNMvF7GywfXNZ13PC?utm_source=generator&theme=0"
          width="100%" height="360" allow="encrypted-media" loading="lazy"
        >
        </iframe>
      </div>
      <div id="music-soundcloud-container" className="pb-4">
        <h2>SoundCloud</h2>
        <iframe
          title="Vintique Sound SoundCloud playlist"
          src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/1757039928&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"
          width="100%" height="360" allow="encrypted-media" loading="lazy"
        >
        </iframe>
      </div>
      <div id="music-other-links" className="flex flex-row flex-wrap justify-center">
        <Link href="https://open.spotify.com/artist/72BxrDX6O013U2kVJiwnkB">
          <Image
            className="p-4"
            src="/images/page_content/music/spotify_logo-black-360x150.jpg"
            alt="Spotify Logo"
            width={300}
            height={125}
          >
          </Image>
        </Link>
        <Link href="https://www.beatport.com/artist/antoku/741219">
          <Image
            className="p-4"
            src="/images/page_content/music/beatport_logo-black-360x150.jpg"
            alt="Beatport Logo"
            width={300}
            height={125}
          >
          </Image>
        </Link>
        <Link href="https://vintiquesound.bandcamp.com/">
          <Image
            className="p-4"
            src="/images/page_content/music/bandcamp_logo-black-360x150.jpg"
            alt="Bandcamp Logo"
            width={300}
            height={125}
          >
          </Image>
        </Link>
        <Link href="https://www.youtube.com/playlist?list=PL6TmWkJnI_sAJ-vvLaQ59-6ki2uty7GSG">
          <Image
            className="p-4"
            src="/images/page_content/music/youtube_music_logo-black-360x150.jpg"
            alt="YouTube Music Logo"
            width={300}
            height={125}
          >
          </Image>
        </Link>
        <Link href="https://soundcloud.com/vintiquesound">
          <Image
            className="p-4"
            src="/images/page_content/music/soundcloud_logo-black-360x150.jpg"
            alt="SoundCloud Logo"
            width={300}
            height={125}
          >
          </Image>
        </Link>
      </div>
    </div>
  )
}
