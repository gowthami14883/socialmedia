interface PostPreviewProps {
  preview: string[];
}

function PostPreview({ preview }: PostPreviewProps) {
  if (!preview?.length) return null;

  return (
    <div className="preview-container-multiple">
      {preview.map((src, index) => (
        <img
          key={index}
          src={src}
          alt="preview"
          className="preview-image-multiple"
        />
      ))}
    </div>
  );
}

export default PostPreview;