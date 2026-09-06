import { X } from "lucide-react";
import { createPortal } from "react-dom";

type Props = { src: string; alt: string; onClose: () => void };

export default function ImageLightbox({ src, alt, onClose }: Props) {
  return createPortal(
    <div
      className="fixed inset-0 z-[100] bg-black/70 flex items-center justify-center p-6"
      onClick={onClose}
    >
      <div className="relative max-w-3xl max-h-[85vh]" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white text-gray-700 flex items-center justify-center shadow-md hover:bg-gray-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
        <img
          src={src}
          alt={alt}
          className="max-w-full max-h-[85vh] rounded-2xl object-contain shadow-2xl"
        />
      </div>
    </div>,
    document.body
  );
}