import { FaTimes, FaImage } from "react-icons/fa";
import PostPreview from "./PostPreview";

interface PostPopupProps {
  active: boolean;
  setActivePopup: React.Dispatch<React.SetStateAction<string | null>>;
  mediaFiles: File[];
  setMediaFiles: React.Dispatch<React.SetStateAction<File[]>>;
  preview: string[];
  setPreview: React.Dispatch<React.SetStateAction<string[]>>;
  caption: string;
  setCaption: React.Dispatch<React.SetStateAction<string>>;
  uploading: boolean;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePostSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

function PostPopup({
  active,
  setActivePopup,
  mediaFiles,
  setMediaFiles,
  preview,
  setPreview,
  caption,
  setCaption,
  uploading,
  handleFileChange,
  handlePostSubmit
}: PostPopupProps) {

  if (!active) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-box-modern">

        <div className="popup-header">
          <h3>Create Post</h3>

          <button
            className="close-btn"
            onClick={() => {
              setActivePopup(null);
              setCaption("");
              setMediaFiles([]);
              setPreview([]);
            }}
          >
            <FaTimes size={20} />
          </button>

        </div>

        <form onSubmit={handlePostSubmit} className="popup-body">

          <textarea
            placeholder="What's on your mind?"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />

          <label className="file-upload-label">
            <FaImage size={22} />
            <span>Upload</span>

            <input
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={handleFileChange}
              hidden
            />
          </label>

          <PostPreview preview={preview} />

          <button
            type="submit"
            disabled={uploading || (!caption.trim() && !mediaFiles.length)}
          >
            {uploading ? "Uploading..." : "Post"}
          </button>

        </form>

      </div>
    </div>
  );
}

export default PostPopup;