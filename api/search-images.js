export default async function handler(req, res) {
  try {
    // =========================================
    // SEARCH QUERY
    // =========================================

    const query = req.query.q || "fruit";

    // =========================================
    // PIXABAY API KEY
    // =========================================

    const apiKey = process.env.PIXABAY_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "Pixabay API key is missing.",
      });
    }

    // =========================================
    // PIXABAY URL
    // =========================================

    const url =
      "https://pixabay.com/api/" +
      `?key=${apiKey}` +
      `&q=${encodeURIComponent(query)}` +
      "&image_type=photo" +
      "&orientation=horizontal" +
      "&per_page=20" +
      "&safesearch=true";

    // =========================================
    // API REQUEST
    // =========================================

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Pixabay API error: ${response.status}`);
    }

    // =========================================
    // RESPONSE
    // =========================================

    const data = await response.json();

    return res.status(200).json(data);
  } catch (error) {
    console.error("Pixabay Search Error:", error);

    return res.status(500).json({
      error: "Unable to fetch images from Pixabay.",
    });
  }
}
