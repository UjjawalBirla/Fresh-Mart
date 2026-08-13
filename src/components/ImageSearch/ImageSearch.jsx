import { useState } from "react";

import { FiSearch, FiCheck } from "react-icons/fi";

import "./ImageSearch.css";

function ImageSearch({ onSelect }) {
  const [search, setSearch] = useState("");

  const [images, setImages] = useState([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  // =========================================
  // SEARCH PIXABAY
  // =========================================

  const handleSearch = async () => {
    const query = search.trim();

    if (!query) {
      setError("Please enter something to search.");

      return;
    }

    try {
      setLoading(true);

      setError("");

      const apiKey = import.meta.env.VITE_PIXABAY_API_KEY;

      if (!apiKey) {
        setError("Pixabay API key is missing.");

        return;
      }

      const url =
        "https://pixabay.com/api/" +
        `?key=${apiKey}` +
        `&q=${encodeURIComponent(query)}` +
        "&image_type=photo" +
        "&orientation=horizontal" +
        "&per_page=20" +
        "&safesearch=true";

      console.log("Searching Pixabay:", query);

      const response = await fetch(url);

      console.log("Pixabay Status:", response.status);

      const data = await response.json();

      console.log("Pixabay Response:", data);

      if (!response.ok) {
        throw new Error(
          data?.message || `Pixabay API Error: ${response.status}`,
        );
      }

      if (!data.hits || data.hits.length === 0) {
        setError(`No images found for "${query}".`);

        return;
      }

      // =========================================
      // FORMAT RESULTS
      // =========================================

      const formattedImages = data.hits.map((image) => ({
        id: image.id,

        url: image.webformatURL,

        largeUrl: image.largeImageURL,

        originalUrl: image.largeImageURL,

        alt: image.tags || query,

        photographer: image.user || "",

        photographerUrl: image.pageURL || "",
      }));

      setImages(formattedImages);
    } catch (error) {
      console.error("Pixabay Search Error:", error);

      setError(error.message || "Unable to load images. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // SELECT IMAGE
  // =========================================

  const handleSelect = (image) => {
    onSelect(image);
  };

  // =========================================
  // ENTER KEY
  // =========================================

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();

      handleSearch();
    }
  };

  // =========================================
  // UI
  // =========================================

  return (
    <div className="image-search">
      {/* =====================================
          SEARCH
      ====================================== */}

      <div className="image-search-form">
        <div className="image-search-input">
          <FiSearch />

          <input
            type="text"
            placeholder="Search product image..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <button type="button" onClick={handleSearch} disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {/* =====================================
          ERROR
      ====================================== */}

      {error && <div className="image-search-error">{error}</div>}

      {/* =====================================
          LOADING
      ====================================== */}

      {loading && (
        <div className="image-search-loading">Searching Pixabay...</div>
      )}

      {/* =====================================
          RESULTS
      ====================================== */}

      {images.length > 0 && (
        <div className="image-results">
          {images.map((image) => (
            <button
              type="button"
              className="image-result-card"
              key={image.id}
              onClick={() => handleSelect(image)}
            >
              <img src={image.url} alt={image.alt} />

              <div className="image-result-overlay">
                <FiCheck />

                <span>Select</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ImageSearch;
