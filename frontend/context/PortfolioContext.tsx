"use client";

import { createContext, ReactNode, useContext, useEffect, useMemo, useRef, useState } from "react";
import { MediaItem } from "../components/types/types";
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
    deleteItem: (item: MediaItem) => Promise<void>;
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
    const [existingMediaItems, setExistingMediaItems] = useState<MediaItem[]>([]);

    const { showToast } = useToast();

    const userId = "test-user";

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

    const deleteMediaItem = (item: MediaItem) => {
        setMediaItems((prev) => prev.filter((m) => m.id !== item.id))
        setExistingMediaItems((prev) => prev.filter((m) => m.id !== item.id));
    }

    const deleteItem = async (item: MediaItem) => {
        const isPersisted = existingMediaItems.some((m) => m.id === item.id);

        if (!isPersisted) {
            deleteMediaItem(item);
            showToast(`${item.title} removed (unsaved item)`, "info");
            return;
        }
        try {
            const res = await fetch(`http://localhost:8000/update-portfolio/${userId}/${item.id}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }

            deleteMediaItem(item);
            showToast(`${item.title} deleted successfully`, "success");
        } catch (error: any) {
            showToast(`Error deleting item: ${error.message}`, "error");
            console.error("Error deleting portfolio:", error);
        }
    };


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
        await fetch(`http://localhost:8000/load-portfolio/${userId}`,)
            .then((res) => res.json())
            .then((data) => {
                setMediaItems(data.items);
                setExistingMediaItems(data.items);
                if (mediaItems.length !== 0)
                    showToast("Portfolio loaded successfully", "success");

                console.log("Portfolio loaded successfully:", data.items);
            })
            .catch((error) => {
                showToast(`Error loading portfolio: ${error.message}`, "error");
                console.error("Error loading portfolio:", error.message)
            });
    }

    return (
        < PortfolioContext.Provider value={{ mediaItems, addMediaItem, setMediaItems, savePortfolio, loadPortfolio, deleteItem, hasMediaChanged, canSave, canLoad }}>
            {children}
        </PortfolioContext.Provider >
    )
}