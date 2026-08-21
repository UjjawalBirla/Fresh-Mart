import { useRef, useState } from "react";
import { FiUploadCloud, FiTrash2, FiCheckCircle } from "react-icons/fi";

function ImageUpload({ onUpload }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState("");

  const handleChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError("");

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be less than 5MB.");
      return;
    }

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

  return (
    <div className="space-y-3">
      {!preview ? (
        <div
          onClick={() => inputRef.current?.click()}
          className="group flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/50 p-8 text-center transition-all duration-300 hover:border-market-leaf hover:bg-market-lime/10 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900/50 dark:hover:border-market-leaf-light"
        >
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-market-lime/40 text-market-leaf text-2xl shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:bg-market-lime dark:bg-market-leaf/20 dark:text-market-lime">
            <FiUploadCloud />
          </div>

          <div className="space-y-1">
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Click to upload a custom product image
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              JPG, PNG or WebP • Max file size 5MB
            </p>
          </div>

          <button
            type="button"
            className="btn-secondary min-h-9 px-4 py-1.5 text-xs pointer-events-none"
            disabled={uploading}
          >
            {uploading ? "Uploading to Cloud..." : "Select File"}
          </button>

          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={handleChange}
            hidden
          />
        </div>
      ) : (
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-md dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
              <img
                src={preview}
                alt="Product preview"
                className="h-full w-full object-cover"
              />
            </div>

            <div className="min-w-0 flex-1 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <FiCheckCircle className="text-base" />
                <span>
                  {uploading ? "Uploading image..." : "Image uploaded successfully"}
                </span>
              </div>

              {!uploading && (
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 shadow-xs transition-all duration-300 hover:bg-red-100 hover:shadow-sm active:scale-95 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300"
                  onClick={removeImage}
                >
                  <FiTrash2 />
                  <span>Remove Image</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </div>
      )}
    </div>
  );
}

export default ImageUpload;
