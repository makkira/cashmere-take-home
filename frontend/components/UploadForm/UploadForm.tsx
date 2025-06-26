"use client";
import { useForm } from "react-hook-form";
import { usePortfolio } from "@/context/PortfolioContext";
import React, { useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useToast } from "@/context/ToastContext";
import { FormHeader } from "./components/FormHeader";
import { FileMetadata, MyFormData } from "./utils/types";
import { useFilePreview, useUploadState } from "./utils/hooks";
import { getFileValidationMessage } from "@/components/utils/helper";
import { FileInput } from "./components/FileInput";
import { FormFields } from "./components/FormFields";
import { PreviewMedia } from "./components/PreviewMedia";
import { MetadataDisplay } from "./components/MetadataDisplay";
import { SubmitButton } from "./components/SubmitButton";

export const UploadForm = () => {
    const { register, handleSubmit, reset, watch, setValue, trigger } = useForm<MyFormData>({
        mode: "onChange",
    });

    const { addMediaItem } = usePortfolio();
    const { showToast } = useToast();

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
        async (data: MyFormData) => {
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
                showToast("File uploaded successfully!", "success");
                reset();
            } catch (err) {
                console.error(err);
                const errorMessage =
                    err instanceof Error
                        ? err.message
                        : "Failed to upload file. Please try again.";
                setError(errorMessage);
                showToast(`Error Uploading File: ${errorMessage}`, "error");
            } finally {
                setUploading(false);
            }
        },
        [addMediaItem, clearPreview, reset, setUploading, setError, clearError]
    );

    const toggleCollapsed = useCallback(() => {
        setCollapsed((prev) => !prev);
    }, []);

    return (
        <>
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
                            />
                        </motion.form>
                    )}
                </AnimatePresence>
            </motion.div>
        </>
    );
};