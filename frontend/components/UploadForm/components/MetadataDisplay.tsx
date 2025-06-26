import { ImageIcon, FileVideo, FileText, Calendar, Clock3 } from "lucide-react";
import { FileMetadata } from "../utils/types";

export const MetadataDisplay = ({ metadata }: { metadata: FileMetadata }) => {
    if (!metadata || Object.keys(metadata).length === 0) return null;
    return (
        <div className="mt-4 flex flex-col gap-2 text-lg text-gray-700 dark:text-stone-500">
            {metadata.type?.startsWith("image") ? (
                <div className="flex items-center gap-2"><ImageIcon size={16} />Image</div>
            ) : metadata.type?.startsWith("video") ? (
                <div className="flex items-center gap-2"><FileVideo size={16} />Video</div>
            ) : null}
            {metadata.size && <div className="flex items-center gap-2"><FileText size={16} />{metadata.size}</div>}
            {metadata.lastModified && <div className="flex items-center gap-2"><Calendar size={16} />{metadata.lastModified}</div>}
            {metadata.dimensions && <div className="flex items-center gap-2"><ImageIcon size={16} />{metadata.dimensions}</div>}
            {metadata.duration && <div className="flex items-center gap-2"><Clock3 size={16} />{metadata.duration}</div>}
        </div>
    );
};