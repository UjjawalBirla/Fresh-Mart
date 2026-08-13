import { useRef, useState } from "react";

import "./ImageUpload.css";

function ImageUpload({ onUpload }) {
  const inputRef = useRef(null);

  const [uploading, setUploading] = useState(false);

  const [error, setError] = useState("");

  const [preview, setPreview] = useState("");

  // =====================================================
  // SELECT IMAGE
  // =====================================================

  const handleChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setError("");

    // FILE TYPE
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");

      return;
    }

    // FILE SIZE
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be less than 5MB.");

      return;
    }

    // LOCAL PREVIEW
    const localPreview = URL.createObjectURL(file);

    setPreview(localPreview);

    try {
      setUploading(true);

      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

      const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

      if (!cloudName) {
        throw new Error("Cloudinary cloud name is missing.");
      }

      if (!uploadPreset) {
        throw new Error("Cloudinary upload preset is missing.");
      }

      // =================================================
      // CLOUDINARY
      // =================================================

      const formData = new FormData();

      formData.append("file", file);

      formData.append("upload_preset", uploadPreset);

      formData.append("folder", "farm-fresh/products");

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || "Image upload failed.");
      }

      // =================================================
      // IMAGE DATA
      // =================================================

      const imageData = {
        url: data.secure_url,

        largeUrl: data.secure_url,

        originalUrl: data.secure_url,

        imageLarge: data.secure_url,

        imageUrl: data.secure_url,

        originalImage: data.secure_url,

        publicId: data.public_id,

        format: data.format,

        width: data.width,

        height: data.height,

        alt: file.name.replace(/\.[^/.]+$/, ""),

        photographer: "Farm Fresh",

        photographerUrl: "",
      };

      // SEND TO DASHBOARD
      if (onUpload) {
        onUpload(imageData);
      }
    } catch (uploadError) {
      console.error("Cloudinary Upload Error:", uploadError);

      setError(uploadError.message || "Image upload failed.");

      setPreview("");
    } finally {
      setUploading(false);

      event.target.value = "";
    }
  };

  // =====================================================
  // REMOVE
  // =====================================================

  const removeImage = () => {
    setPreview("");

    setError("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }

    if (onUpload) {
      onUpload(null);
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="image-upload">
      {!preview ? (
        <div className="image-upload-box">
          <div className="image-upload-empty">
            <div className="image-upload-icon">🖼️</div>

            <div className="image-upload-content">
              <h3>Choose an image for your product</h3>

              <p>JPG, PNG or WebP • Max size 5MB</p>

              <button
                type="button"
                className="image-upload-button"
                onClick={() => inputRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? "Uploading..." : "Choose Image"}
              </button>

              <input
                ref={inputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleChange}
                hidden
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="image-upload-box">
          <div className="image-upload-preview">
            <img src={preview} alt="Product preview" />

            <div className="image-upload-preview-info">
              <p className="image-upload-success">
                {uploading
                  ? "Uploading image..."
                  : "✓ Image uploaded successfully"}
              </p>

              {!uploading && (
                <button
                  type="button"
                  className="image-upload-remove"
                  onClick={removeImage}
                >
                  Remove Image
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {error && <div className="image-upload-error">{error}</div>}
    </div>
  );
}

export default ImageUpload;
