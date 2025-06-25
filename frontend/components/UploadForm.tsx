"use client";
import { useForm } from "react-hook-form";
import { usePortfolio } from "@/context/PortfolioContext";
import { ChevronDown, ChevronUp, Upload } from "lucide-react";
import React, { useCallback, useEffect, useMemo, useState } from 'react';


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
    "Other"
]

const SUPPORTED_FORMATS = 'image/*, video/mp4, video/webm, video/ogg';

type FormData = {
    file: FileList;
    title: string;
    description: string;
    category: string;
    // metadata: string;
}

type PreviewState = {
    url: string | null;
    type: string | null;
}

const useFilePreview = () => {
    const [preview, setPreview] = useState<PreviewState>({ url: null, type: null });

    const updatePreview = useCallback((file: File | null) => {
        if (preview.url) {
            URL.revokeObjectURL(preview.url);
        }

        if (!file) {
            setPreview({ url: null, type: null });
            return;
        }

        const url = URL.createObjectURL(file);
        setPreview({ url, type: file.type });
    }, [preview.url]);

    const clearPreview = useCallback(() => {
        if (preview.url) {
            URL.revokeObjectURL(preview.url);
        }
        setPreview({ url: null, type: null });
    }, [preview.url]);

    return {
        preview,
        updatePreview,
        clearPreview
    };
}

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
        clearError
    };
}


const getFileValidationMessage = (file: File | null): string | null => {
    if (!file) return null;

    if (file.type.includes("quicktime")) {
        return "Invalid file type. Please upload an image or video.";
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
        return "File size exceeds 10MB limit.";
    }

    return null;
}

const FormHeader = ({
    collapsed,
    onToggle
}: {
    collapsed: boolean;
    onToggle: () => void;
}) => {
    return (
        <div className="flex items-center justify-between mb-2 cursor-pointer" onClick={onToggle}>
            <h2 className="text-xl font-semibold flex items-center">
                <Upload className="mr-2" size={20} />
                Add Media
            </h2>
            {collapsed ? <ChevronDown /> : <ChevronUp />}
        </div>
    )
}

const FileInput = ({
    isDragging,
    setIsDragging,
    onFileChange,
    register,
    selectedFile,
    fileError,
}: {
    isDragging: boolean;
    setIsDragging: (dragging: boolean) => void;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    register: any;
    selectedFile: File | null;
    fileError: string | null;
}) => {

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, [setIsDragging]);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            setIsDragging(false);
        }
    }, [setIsDragging]);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            const syntheticEvent = {
                target: { files }
            } as React.ChangeEvent<HTMLInputElement>;

            onFileChange(syntheticEvent)
        }
    }, [onFileChange, setIsDragging]);

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select File
            </label>
            <div
                className={`relative transition-colors ${isDragging
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-300'}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    accept={SUPPORTED_FORMATS}
                    {...register("file")}
                    onChange={onFileChange}
                    className="absolute inset-0 opacity-0 z-10 cursor-pointer" />
                <div className={`w-full p-4 border-2 border-dashed rounded-md dark:bg-gray-800 text-gray-600 min-h-[80px] flex flex-col items-center justify-center ${isDragging ? 'border-blue-500' : 'border-gray-300'}`}>
                    {selectedFile ? (
                        <div className="text-center">
                            <span className="dark:text-white text-gray-900 font-medium block">
                                {selectedFile.name}
                            </span>
                        </div>
                    ) : (
                        <div className="text-center">
                            <Upload className="mx-auto mb-2 text-gray-400" size={24} />
                            <span className="text-gray-400 italic block">
                                {isDragging ? 'Drop your file here' : 'Choose a file or drag & drop'}
                            </span>
                        </div>
                    )}
                </div>
            </div>
            {fileError && (
                <span className="mt-2 text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-2 rounded">
                    {fileError}
                </span>
            )}
        </div>
    )
}

const FormFields = ({ register }: { register: any; }) => {
    return (
        <>
            {/* title textarea */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Title
                    </label>
                    <input
                        type="text"
                        {...register("title", { required: true })}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
                {/* Categories dropdown */}

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Category
                    </label>
                    <select {...register("category", { required: true })} className="dark:focus:text-black dark:focus:bg-gray-300 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 mt-2">
                    Description
                </label>
                <textarea
                    {...register("description", { required: true })}
                    rows={3}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            </div>
        </>
    )
}

const PreviewMedia = ({ preview }: { preview: PreviewState }) => {
    console.log({ preview });
    if (!preview.url) return null;

    return (
        <div className="mt-4">
            {preview.type?.startsWith("image") ? (
                <img
                    src={preview.url}
                    alt="Preview"
                    className="max-w-full max-h-64 rounded-md"
                />
            ) : preview.type?.startsWith("video") ? (
                <video
                    src={preview.url}
                    controls
                    className="max-w-full max-h-64 rounded-md"
                />
            ) : null}
        </div>
    )
}

const SubmitButton = ({
    isFormFilled,
    uploading,
    hasValidFile,
    error
}: {
    isFormFilled: boolean;
    uploading: boolean;
    hasValidFile: boolean;
    error: string | null
}) => {
    return (
        <div>
            <button
                type="submit"
                disabled={!isFormFilled || uploading || !hasValidFile}
                className={`flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors`}
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
                    <span className="text-red-500 text-sm mt-2 block">{error}</span>)}
            </button>
        </div >
    );
}

export const UploadForm = () => {
    const { register, handleSubmit, reset, watch, setValue } = useForm<FormData>({ mode: 'onChange' });
    const { addMediaItem, mediaItems } = usePortfolio();

    const [collapsed, setCollapsed] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [fileError, setFileError] = useState<string | null>(null);


    const { preview, updatePreview, clearPreview } = useFilePreview();
    const { uploading, setUploading, error, setError, clearError } = useUploadState();

    const watchAll = watch();
    const selectedFile = watchAll.file ? watchAll.file[0] : null;
    const hasValidFile = useMemo(() => {
        if (!selectedFile) return false;
        const validationMessage = getFileValidationMessage(selectedFile);
        return validationMessage === null;
    }, [selectedFile]);

    const isFormFilled = useMemo(() =>
        Boolean(
            watchAll.file?.length &&
            watchAll.title?.trim() &&
            watchAll.description?.trim() &&
            watchAll.category?.trim() &&
            hasValidFile
        ), [watchAll, hasValidFile]);

    const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;;
        if (event.target.files) {
            setValue("file", event.target.files, { shouldValidate: true });
        }
        if (file) {
            const validationMessage = getFileValidationMessage(file);
            setFileError(validationMessage)

            if (!validationMessage) {
                updatePreview(file);
            } else {
                clearPreview();
            }
        } else {
            setFileError(null);
            updatePreview(null);
        }
    }, [setValue, updatePreview, clearPreview]);

    const handleFormSubmit = useCallback(async (data: FormData) => {
        const file = data.file[0];

        const validationMessage = getFileValidationMessage(file);
        if (validationMessage) {
            setError(validationMessage);
            return;
        }

        setUploading(true);
        clearError();
        const formData = new FormData();
        formData.append("file", data.file[0]);
        formData.append("title", data.title);
        formData.append("description", data.description);
        formData.append("category", data.category);

        try {
            const response = await fetch("http://localhost:8000/upload", {
                method: "POST",
                body: formData
            })

            if (!response.ok) {
                throw new Error(`Upload failed: ${response.statusText}`);
            }

            const data = await response.json();

            addMediaItem(data);
            clearPreview();
            setFileError(null);
            reset();
        } catch (err) {
            console.error(err);
            const errorMessage = err instanceof Error ? err.message : "Failed to upload file. Please try again.";
            setError(errorMessage);
        } finally {
            setUploading(false);
        }
    }, [addMediaItem, clearPreview, reset, setUploading, setError, clearError]);

    const toggleCollapsed = useCallback(() => {
        setCollapsed(prev => !prev);
    }, []);

    console.log({ isFormFilled, uploading, hasValidFile });

    return (
        <div className="bg-orange-100 dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 mx-auto">
            {/* <
             */}
            <FormHeader collapsed={collapsed} onToggle={toggleCollapsed} />
            {!collapsed && (
                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                    <FileInput
                        isDragging={isDragging}
                        setIsDragging={setIsDragging}
                        onFileChange={handleFileChange}
                        register={register}
                        selectedFile={selectedFile}
                        fileError={fileError}
                    />
                    <PreviewMedia preview={preview} />
                    <FormFields register={register} />
                    <SubmitButton
                        isFormFilled={isFormFilled}
                        uploading={uploading}
                        hasValidFile={hasValidFile}
                        error={error}
                    />
                </form>
            )}
        </div>
    );
};