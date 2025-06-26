import { Upload } from "lucide-react";

export const SubmitButton = ({
    isFormFilled,
    uploading,
    hasValidFile,
}: {
    isFormFilled: boolean;
    uploading: boolean;
    hasValidFile: boolean;
}) => {
    return (
        <div>
            <button
                type="submit"
                disabled={!isFormFilled || uploading || !hasValidFile}
                className={`flex items-center justify-center bg-stone-600 text-white px-4 py-2 rounded-md hover:bg-stone-700 disabled:bg-stone-400 transition-colors`}
            >
                {uploading ? (
                    <span className="animate-pulse">Uploading...</span>
                ) : (
                    <>
                        <Upload className="mr-2" size={16} />
                        Upload File
                    </>
                )}
            </button>
        </div>
    );
};