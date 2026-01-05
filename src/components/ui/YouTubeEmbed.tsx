import React from "react";

type YouTubeEmbedProps = {
  videoId: string;
  title?: string;
};

const YouTubeEmbed: React.FC<YouTubeEmbedProps> = ({ videoId, title = "YouTube video player" }) => (
  <div style={{
    position: "relative",
    paddingBottom: "56.25%",
    height: 0,
    overflow: "hidden",
    maxWidth: "100%",
    margin: "2rem 0"
  }}>
    <iframe
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%"
      }}
      src={`https://www.youtube.com/embed/${videoId}`}
      title={title}
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  </div>
);

export default YouTubeEmbed;
