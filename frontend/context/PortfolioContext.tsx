"use client";

import { createContext, ReactNode, useContext, useEffect, useMemo, useRef, useState } from "react";
import { MediaItem } from "../types/types";
import { useToast } from "./ToastContext";

type PortfolioContextType = {
    mediaItems: MediaItem[];
    hasMediaChanged: boolean;
    canSave: boolean;
    canLoad: boolean;
    addMediaItem: (item: MediaItem) => void;
    setMediaItems: (items: MediaItem[]) => void;
    savePortfolio: () => Promise<void>;
    loadPortfolio: () => Promise<void>;
};

const PortfolioContext = createContext<PortfolioContextType | null>(null);

export const usePortfolio = () => {
    const context = useContext(PortfolioContext);
    if (!context) {
        throw new Error("usePortfolio must be used within PortfolioProvider");
    }

    return context;
}

export const PortfolioProvider = ({ children }: { children: ReactNode }) => {
    const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
    const [existingMediaItems, setExistingMediaItems] = useState<MediaItem[] | null>(null);

    const { showToast } = useToast();

    const userId = "test-user"; // TODO: Replace with actual user ID logic

    useEffect(() => {
        loadPortfolio();
    }, []);

    const hasMediaChanged = useMemo(() => {
        if (!existingMediaItems) return mediaItems.length > 0;
        return JSON.stringify(mediaItems) !== JSON.stringify(existingMediaItems);

    }, [mediaItems, existingMediaItems]);

    const canSave = mediaItems.length > 0 && hasMediaChanged;;
    const canLoad = useMemo(() => {
        if (!existingMediaItems || existingMediaItems.length === 0) return false;

        return hasMediaChanged;
    }, [hasMediaChanged, existingMediaItems]);

    const addMediaItem = (item: MediaItem) => {
        setMediaItems((prev) => [...prev, item]);
    }

    const savePortfolio = async () => {
        await fetch("http://localhost:8000/save-portfolio", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                user_id: userId,
                items: mediaItems,
            }),
        }).then(() => {
            setExistingMediaItems(mediaItems);
            showToast("Portfolio saved successfully", "success");
            console.log("Portfolio saved successfully");
        }).catch((error) => {
            showToast(`Error saving portfolio: ${error.message}`, "error");
            console.error("Error saving portfolio:", error);
        });

    }

    const loadPortfolio = async () => {
        fetch(`http://localhost:8000/load-portfolio/${userId}`)
            .then((res) => res.json())
            .then((data) => {
                setMediaItems(data.items);
                setExistingMediaItems(data.items);
                showToast("Portfolio loaded successfully", "success");

                console.log("Portfolio loaded successfully:", data.items);
            })
            .catch((error) => {
                showToast(`Error loading portfolio: ${error.message}`, "error");
                console.error("Error loading portfolio:", error.message)
            });
    }

    return (
        < PortfolioContext.Provider value={{ mediaItems, addMediaItem, setMediaItems, savePortfolio, loadPortfolio, hasMediaChanged, canSave, canLoad }}>
            {children}
        </PortfolioContext.Provider >
    )
}