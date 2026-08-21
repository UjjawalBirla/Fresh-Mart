import { useState } from "react";
import { FiImage } from "react-icons/fi";

function ImageLoader({ src, alt = "", className = "" }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const handleLoad = () => {
    setLoaded(true);
  };

  const handleError = () => {
    setError(true);
    setLoaded(true);
  };

  return (
    <div
      className={`relative h-full min-h-24 overflow-hidden bg-slate-100 dark:bg-slate-800 ${className}`}
    >
      {/* Skeleton shimmer */}
      {!loaded && (
        <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-slate-100 via-white to-slate-100 bg-[length:200%_100%] dark:from-slate-800 dark:via-slate-700 dark:to-slate-800" />
      )}

      {/* Image */}
      {!error ? (
        <img
          src={src}
          alt={alt}
          className={`h-full w-full object-cover transition-opacity duration-500 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={handleLoad}
          onError={handleError}
          loading="lazy"
        />
      ) : (
        <div className="flex h-full min-h-24 flex-col items-center justify-center gap-2 bg-market-cream text-market-leaf dark:bg-slate-900 dark:text-market-lime">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-market-lime/50 text-2xl dark:bg-slate-800">
            🍎
          </span>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <FiImage className="text-market-leaf dark:text-market-lime" />
            Image unavailable
          </div>
        </div>
      )}
    </div>
  );
}

export default ImageLoader;
