import { useRef, useState } from "react";
import { Camera, ImagePlus, Trash2 } from "lucide-react";
import "./ProfilePhotoPicker.css";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_IMAGE_SIZE = 450 * 1024;
const MAX_IMAGE_DIMENSION = 720;

const loadImage = (source) => new Promise((resolve, reject) => {
  const image = new Image();
  image.onload = () => resolve(image);
  image.onerror = () => reject(new Error("This photo could not be opened."));
  image.src = source;
});

const createJpeg = async (file) => {
  const objectUrl = URL.createObjectURL(file);
  try {
    const image = await loadImage(objectUrl);
    const scale = Math.min(1, MAX_IMAGE_DIMENSION / Math.max(image.naturalWidth, image.naturalHeight));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
    canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height);

    for (const quality of [0.82, 0.72, 0.62, 0.52]) {
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
      if (blob && blob.size <= MAX_IMAGE_SIZE) {
        return await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = () => reject(new Error("This photo could not be prepared."));
          reader.readAsDataURL(blob);
        });
      }
    }

    throw new Error("This photo is too large to save. Choose a smaller image.");
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
};

const ProfilePhotoPicker = ({ image, name, onChange }) => {
  const inputRef = useRef(null);
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);

  const selectPhoto = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Choose a JPG, PNG, or WebP photo.");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError("Choose a photo smaller than 10 MB.");
      return;
    }

    setError("");
    setProcessing(true);
    try {
      onChange(await createJpeg(file));
    } catch (photoError) {
      setError(photoError.message || "Unable to prepare this photo.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="profile-photo-picker">
      <div className="profile-photo-preview">
        {image
          ? <img src={image} alt={`${name || "Profile"} photo preview`} />
          : <span aria-hidden="true">{name?.charAt(0)?.toUpperCase() || "?"}</span>}
      </div>
      <div className="profile-photo-actions">
        <input
          ref={inputRef}
          className="profile-photo-input"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          aria-label="Choose a profile photo"
          onChange={selectPhoto}
        />
        <button
          type="button"
          className="profile-photo-button"
          disabled={processing}
          onClick={() => inputRef.current?.click()}
        >
          {processing ? <ImagePlus size={16} /> : <Camera size={16} />}
          {processing ? "Preparing photo…" : image ? "Change photo" : "Upload photo"}
        </button>
        {image && (
          <button type="button" className="profile-photo-remove" onClick={() => { onChange(""); setError(""); }}>
            <Trash2 size={14} /> Remove photo
          </button>
        )}
        <small>JPG, PNG, or WebP · up to 10 MB</small>
        {error && <span className="profile-photo-error" role="alert">{error}</span>}
      </div>
    </div>
  );
};

export default ProfilePhotoPicker;
