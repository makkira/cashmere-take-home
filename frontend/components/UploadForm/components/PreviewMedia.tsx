import { PreviewState } from "../utils/types";

export const PreviewMedia = ({ preview }: { preview: PreviewState }) => {
    if (!preview.url) return null;

    return (
        <div className="mt-4">
            {preview.type?.startsWith("image/") ? (
                <img
                    src={preview.url}
                    alt="Preview"
                    className="max-w-full max-h-64 rounded-md"
                />
            ) : preview.type?.startsWith("video/") ? (
                <video
                    src={preview.url}
                    controls
                    className="max-w-full max-h-64 rounded-md"
                />
            ) : null}
        </div>
    );
};