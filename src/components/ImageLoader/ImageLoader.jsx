import { useState } from "react";

import "./ImageLoader.css";

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
    <div className={`image-loader ${className}`}>
      {/* =========================================
          SKELETON
      ========================================= */}

      {!loaded && (
        <div className="image-skeleton">
          <div className="skeleton-shimmer"></div>
        </div>
      )}

      {/* =========================================
          IMAGE
      ========================================= */}

      {!error ? (
        <img
          src={src}
          alt={alt}
          className={loaded ? "loader-image loaded" : "loader-image"}
          onLoad={handleLoad}
          onError={handleError}
          loading="lazy"
        />
      ) : (
        <div className="image-error">
          <span>🍎</span>

          <small>Image unavailable</small>
        </div>
      )}
    </div>
  );
}

export default ImageLoader;
