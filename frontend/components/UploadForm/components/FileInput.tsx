"use client";

import { motion } from "framer-motion";
import { Upload } from "lucide-react";
import { useCallback } from "react";
import { SUPPORTED_FORMATS } from "../utils/constants";

export const FileInput = ({
    isDragging,
    setIsDragging,
    onFileChange,
    selectedFile,
    fileError,
    fileInputRef,
}: {
    isDragging: boolean;
    setIsDragging: (dragging: boolean) => void;
    onFileChange: (files: FileList) => void;
    selectedFile: File | null;
    fileError: string | null;
    fileInputRef: React.RefObject<HTMLInputElement>;
}) => {
    const handleDragOver = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(true);
        },
        [setIsDragging]
    );

    const handleDragLeave = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                setIsDragging(false);
            }
        },
        [setIsDragging]
    );

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(false);
            const files = e.dataTransfer.files;

            if (files[0] && (files[0].type.startsWith('image/') || files[0].type.startsWith('video/'))) {
                const syntheticEvent = {
                    target: { files }
                } as React.ChangeEvent<HTMLInputElement>;

                handleInputChange(syntheticEvent);
            } else {
                alert("Please drop a valid image or video file.");
            }
        }, [onFileChange, setIsDragging]
    );

    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const files = e.target.files;
            if (files && files.length > 0) {
                onFileChange(files);
            }
        },
        [onFileChange]
    );

    return (
        <div className="space-y-2">
            <label className="text-sm font-medium text-stone-700 dark:text-stone-800">
                Select File
            </label>
            <div
                className={
                    `transition-all relative border-2 border-dashed rounded-md ` +
                    (isDragging ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-stone-300')
                }
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept={SUPPORTED_FORMATS}
                    onChange={handleInputChange}
                    className="absolute inset-0 opacity-0 z-10 cursor-pointer"
                />
                <div className="p-4 min-h-[100px] flex flex-col items-center justify-center">
                    {selectedFile ? (
                        <div className="text-center text-stone-800 dark:text-stone-700 font-medium">
                            {selectedFile.name}
                        </div>
                    ) : (
                        <div className="text-center">
                            <Upload className="mx-auto mb-2 text-stone-400" size={24} />
                            <span className="text-stone-500 dark:text-stone-400 italic">
                                {isDragging ? 'Drop your file here' : 'Choose a file or drag & drop'}
                            </span>
                        </div>
                    )}
                </div>
            </div>
            {fileError && (
                <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-2 rounded"
                >
                    {fileError}
                </motion.span>
            )}
        </div>
    );
};