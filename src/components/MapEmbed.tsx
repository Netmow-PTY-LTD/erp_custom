import type React from "react";

interface MapEmbedProps {
  /** Location query for Google Maps (e.g., "Cyberjaya, Selangor, Malaysia") */
  location?: string;
  /** Zoom level for the map */
  zoom?: number;
  /** Optional width and height (not required for responsive) */
  width?: number;
  height?: number;
}


export const MapEmbed: React.FC<MapEmbedProps> = ({
  location = "Cyberjaya, Selangor, Malaysia",
  zoom = 14,
  width = 600,
  height = 400,
}) => {
  const src = `https://maps.google.com/maps?width=${width}&height=${height}&hl=en&q=${encodeURIComponent(
    location
  )}&t=&z=${zoom}&ie=UTF8&iwloc=B&output=embed`;

  return (
    <div className="embed-map-responsive">
      <div className="embed-map-container">
        <iframe
          className="w-full h-[400px]"
          src={src}
          title={`Google Map: ${location}`}
          frameBorder={0}
          scrolling="no"
          marginHeight={0}
          marginWidth={0}
        />
      </div>
    </div>
  );
};
