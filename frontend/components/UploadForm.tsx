"use client";
import { useForm } from "react-hook-form";
import { usePortfolio } from "@/context/PortfolioContext";
import { Calendar, ChevronDown, ChevronUp, Clock3, FileText, FileVideo, ImageIcon, Upload } from "lucide-react";
import React, { useCallback, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const CATEGORIES = [
    "Photography",
    "Videography",
    "Design",
    "Sport",
    "Fashion",
    "Art",
    "Family",
    "Personal",
    "Travel",
    "Food",
    "Other",
];

const SUPPORTED_FORMATS = "image/*, video/mp4, video/webm, video/ogg";

type FormData = {
    file: FileList;
    title: string;
    description: string;
    category: string;
    // metadata: string;
};

type PreviewState = {
    url: string | null;
    type: string | null;
};

type FileMetadata = {
    size?: string;
    type?: string;
    lastModified?: string;
    duration?: string;
    dimensions?: string;
    isVideo?: boolean;
}

const useFilePreview = () => {
    const [preview, setPreview] = useState<PreviewState>({
        url: null,
        type: null,
    });

    const updatePreview = useCallback(
        (file: File | null) => {
            if (preview.url) {
                URL.revokeObjectURL(preview.url);
            }

            if (!file) {
                setPreview({ url: null, type: null });
                return;
            }

            const url = URL.createObjectURL(file);
            setPreview({ url, type: file.type });
        },
        [preview.url]
    );

    const clearPreview = useCallback(() => {
        if (preview.url) {
            URL.revokeObjectURL(preview.url);
        }
        setPreview({ url: null, type: null });
    }, [preview.url]);

    return {
        preview,
        updatePreview,
        clearPreview,
    };
};

const useUploadState = () => {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    return {
        uploading,
        setUploading,
        error,
        setError,
        clearError,
    };
};

const getFileValidationMessage = (file: File | null): string | null => {
    if (!file) return null;

    if (file.type.includes("quicktime")) {
        return "Invalid file type. Please upload an image or video.";
    }

    if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        return "File size exceeds 10MB limit.";
    }

    return null;
};

const FormHeader = ({
    collapsed,
    onToggle,
}: {
    collapsed: boolean;
    onToggle: () => void;
}) => {
    return (
        <div
            className="flex items-center justify-between mb-4 cursor-pointer "
            onClick={onToggle}
        >
            <motion.h2
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl font-bold text-stone-700 dark:text-stone-950 flex items-center"
            >
                <Upload className="mr-2" size={20} />
                Add Media
            </motion.h2>
            <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: collapsed ? 0 : 180 }}
                transition={{ duration: 0.2 }}
            >
                {collapsed ? <ChevronUp className="text-stone-400" /> : <ChevronDown className="text-stone-400" />}
            </motion.div>
        </div>
    );
};

const FileInput = ({
    isDragging,
    setIsDragging,
    onFileChange,
    register,
    selectedFile,
    fileError,
    fileInputRef,
}: {
    isDragging: boolean;
    setIsDragging: (dragging: boolean) => void;
    onFileChange: (files: FileList) => void;
    register: any;
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

            if (files && files.length > 0) {
                const syntheticEvent = {
                    target: { files }
                } as React.ChangeEvent<HTMLInputElement>;

                handleInputChange(syntheticEvent);
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

const FormFields = ({ register }: { register: any }) => {
    return (
        <>
            {/* title textarea */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-stone-700 mb-2">
                        Title
                    </label>
                    <input
                        type="text"
                        {...register("title", { required: true })}
                        className="w-full p-2 text-stone-800 border border-gray-300 rounded-md focus:ring-2 focus:ring-stone-500 focus:border-transparent"
                    />
                </div>
                {/* Categories dropdown */}

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-stone-800 mb-2">
                        Category
                    </label>
                    <select
                        {...register("category", { required: true })}
                        className="dark:text-stone-800 dark:focus:text-black dark:focus:bg-stone-300 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-stone-500 focus:border-transparent"
                    >
                        <option value="">Select a category</option>
                        {CATEGORIES.map((category) => (
                            <option className="text-black" key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Description textarea */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-stone-700 mb-2 mt-2">
                    Description
                </label>
                <textarea
                    {...register("description", { required: true })}
                    rows={3}
                    className="w-full p-2 border border-gray-300 dark:text-stone-800 rounded-md focus:ring-2 focus:ring-stone-500 focus:border-transparent"
                />
            </div>
        </>
    );
};

const PreviewMedia = ({ preview }: { preview: PreviewState }) => {
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

const MetadataDisplay = ({ metadata }: { metadata: FileMetadata }) => {
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

const SubmitButton = ({
    isFormFilled,
    uploading,
    hasValidFile,
    error,
}: {
    isFormFilled: boolean;
    uploading: boolean;
    hasValidFile: boolean;
    error: string | null;
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
                {error && (
                    <span className="text-red-500 text-sm mt-2 block">{error}</span>
                )}
            </button>
        </div>
    );
};

export const UploadForm = () => {
    const { register, handleSubmit, reset, watch, setValue, trigger } = useForm<FormData>({
        mode: "onChange",
    });
    const { addMediaItem, mediaItems } = usePortfolio();

    const [collapsed, setCollapsed] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [fileError, setFileError] = useState<string | null>(null);
    const [fileMetadata, setFileMetadata] = useState<FileMetadata>({});
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null!);

    const { preview, updatePreview, clearPreview } = useFilePreview();
    const { uploading, setUploading, error, setError, clearError } =
        useUploadState();

    const title = watch("title");
    const description = watch("description");
    const category = watch("category");

    const hasValidFile =
        selectedFile != null && getFileValidationMessage(selectedFile) === null;

    const isFormFilled =
        !!(selectedFile && title?.trim() && description?.trim() && category?.trim() && hasValidFile);

    const handleFileChange = useCallback(
        (files: FileList) => {
            const file = files[0] || null;
            setSelectedFile(file);

            setValue("title", "");
            setValue("description", "");
            setValue("category", "");

            if (file) {
                const validationMessage = getFileValidationMessage(file);
                setFileError(validationMessage);

                if (!validationMessage) {
                    updatePreview(file);
                    const isVideo = file.type.startsWith("video/");
                    const metadata: FileMetadata = {
                        size: (file.size / 1024 / 1024).toFixed(2) + " MB",
                        type: file.type,
                        lastModified: new Date(file.lastModified).toLocaleDateString(),
                        isVideo
                    };

                    if (isVideo) {
                        const tempVideo = document.createElement("video");
                        tempVideo.src = URL.createObjectURL(file);
                        tempVideo.onloadedmetadata = () => {
                            metadata.duration = `${Math.round(tempVideo.duration)} sec`;
                            setFileMetadata(metadata);
                        }
                    } else if (file.type.startsWith("image/")) {
                        const img = new Image();
                        img.onload = () => {
                            metadata.dimensions = `${img.width} x ${img.height}`;
                            setFileMetadata(metadata);
                        };
                        img.src = URL.createObjectURL(file);
                    } else {
                        setFileMetadata(metadata);
                    }
                } else {
                    clearPreview();
                    setFileMetadata({});
                }
            } else {
                setFileError(null);
                updatePreview(null);
                setFileMetadata({});
            }
        },
        [setValue, trigger, updatePreview, clearPreview]
    );

    const handleFormSubmit = useCallback(
        async (data: FormData) => {
            console.log("Form submitted with data:", data);
            const file = selectedFile;

            if (!file) {
                setError("No file selected.");
                return;
            }

            const validationMessage = getFileValidationMessage(file);
            if (validationMessage) {
                setError(validationMessage);
                return;
            }

            setUploading(true);
            clearError();
            const formData = new FormData();
            formData.append("file", file);
            formData.append("title", data.title);
            formData.append("description", data.description);
            formData.append("category", data.category);

            try {
                const response = await fetch("http://localhost:8000/upload", {
                    method: "POST",
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error(`Upload failed: ${response.statusText}`);
                }

                const data = await response.json();

                addMediaItem(data);
                clearPreview();
                setFileError(null);
                setFileMetadata({});
                setSelectedFile(null);
                reset();
            } catch (err) {
                console.error(err);
                const errorMessage =
                    err instanceof Error
                        ? err.message
                        : "Failed to upload file. Please try again.";
                setError(errorMessage);
            } finally {
                setUploading(false);
            }
        },
        [addMediaItem, clearPreview, reset, setUploading, setError, clearError]
    );

    const toggleCollapsed = useCallback(() => {
        setCollapsed((prev) => !prev);
    }, []);

    console.log({ isFormFilled, uploading, hasValidFile });

    return (
        <motion.div className="dark:bg-stone-200 rounded-lg shadow-md p-6 mb-6 mx-auto">
            <FormHeader collapsed={collapsed} onToggle={toggleCollapsed} />
            <AnimatePresence>
                {!collapsed && (
                    <motion.form onSubmit={handleSubmit(handleFormSubmit)} initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.4 }}
                        className="space-y-6 overflow-hidden" >

                        <FileInput
                            isDragging={isDragging}
                            setIsDragging={setIsDragging}
                            onFileChange={handleFileChange}
                            register={register}
                            selectedFile={selectedFile}
                            fileError={fileError}
                            fileInputRef={fileInputRef}
                        />
                        {preview.url &&
                            <div className="flex flex-row items-center gap-20">
                                <PreviewMedia preview={preview} />
                                <MetadataDisplay metadata={fileMetadata} />
                            </div>
                        }
                        <FormFields register={register} />
                        <SubmitButton
                            isFormFilled={isFormFilled}
                            uploading={uploading}
                            hasValidFile={hasValidFile}
                            error={error}
                        />
                    </motion.form>
                )}
            </AnimatePresence>
        </motion.div>
    );
};