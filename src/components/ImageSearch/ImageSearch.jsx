import { useState } from "react";
import { FiSearch, FiCheck } from "react-icons/fi";

function ImageSearch({ onSelect }) {
  const [search, setSearch] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || `Pixabay API Error: ${response.status}`);
      }

      if (!data.hits || data.hits.length === 0) {
        setError(`No images found for "${query}".`);
        return;
      }

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
    } catch (err) {
      console.error("Pixabay Search Error:", err);
      setError(err.message || "Unable to load images. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (image) => {
    onSelect(image);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Input and Button */}
      <div className="flex flex-col sm:flex-row items-stretch gap-3">
        <div className="input-field flex-1">
          <FiSearch className="text-slate-400 shrink-0 text-lg" />
          <input
            type="text"
            placeholder="Search Pixabay for product image (e.g. apple, banana)..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <button
          type="button"
          onClick={handleSearch}
          disabled={loading}
          className="btn-primary shrink-0 px-6"
        >
          {loading ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <span>Searching...</span>
            </>
          ) : (
            <>
              <FiSearch />
              <span>Find Images</span>
            </>
          )}
        </button>
      </div>

      {/* Error Notice */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-200 py-10 text-slate-500 dark:border-slate-800 dark:text-slate-400">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-market-leaf border-t-transparent" />
          <span className="text-sm font-medium">Searching Pixabay library...</span>
        </div>
      )}

      {/* Results Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 max-h-72 overflow-y-auto p-1.5 rounded-2xl border border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/50">
          {images.map((image) => (
            <button
              type="button"
              className="group relative aspect-video w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-sm transition-all duration-300 hover:scale-105 hover:border-market-leaf hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-market-leaf dark:border-slate-700 dark:bg-slate-800"
              key={image.id}
              onClick={() => handleSelect(image)}
            >
              <img
                src={image.url}
                alt={image.alt}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />

              {/* Hover overlay with select button */}
              <div className="absolute inset-0 flex items-center justify-center gap-1.5 bg-market-leaf/80 text-white font-bold text-xs opacity-0 backdrop-blur-xs transition-opacity duration-300 group-hover:opacity-100">
                <FiCheck className="text-base" />
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
