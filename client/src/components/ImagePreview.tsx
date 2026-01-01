import Image from "next/image";
import React from "react";

interface ImagePreviewProps {
  src: string;
  alt: string;
  onRemove: () => void;
  className?: string;
  width?: number;
  height?: number;
  rounded?: "none" | "lg" | "full";
}

const ImagePreview: React.FC<ImagePreviewProps> = ({
  src,
  alt,
  onRemove,
  className = "",
  width = 160,
  height = 160,
  rounded = "lg",
}) => {
  const roundedClass =
    rounded === "full"
      ? "rounded-full"
      : rounded === "lg"
      ? "rounded-lg"
      : "rounded-none";

  return (
    <div className="relative inline-block group">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        unoptimized
        className={`object-cover border-2 border-solid border-gray-300 dark:border-gray-600 ${roundedClass} ${className}`}
      />
      <button
        type="button"
        onClick={onRemove}
        className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-lg transition-all opacity-80 group-hover:opacity-100"
        title="Remove image"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
};

export default ImagePreview;
