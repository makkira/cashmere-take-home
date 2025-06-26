"use client";

import { createContext, ReactNode, useContext, useEffect, useRef, useState } from "react";
import { MediaItem } from "../types/types";
import { useToast } from "./ToastContext";

type PortfolioContextType = {
    mediaItems: MediaItem[];
    hasMediaChanged: boolean;
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
    const originalMediaItems = useRef<MediaItem[]>([]);

    const { showToast } = useToast();

    const userId = "test-user"; // TODO: Replace with actual user ID logic
    const hasMediaChanged = JSON.stringify(mediaItems) !== JSON.stringify(originalMediaItems.current);

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
                if (data.items > 0) {
                    setMediaItems(data.items);
                    originalMediaItems.current = data.items; // Store the original items
                    showToast("Portfolio loaded successfully", "success");

                    console.log("Loaded items:", data.items);
                    console.log("Portfolio loaded successfully");
                } else {
                    showToast("Please upload media first", "info");
                    console.warn("No items found in portfolio");
                }
                console.log("Portfolio loaded successfully");

            })
            .catch((error) => {
                showToast(`Error loading portfolio: ${error.message}`, "error");
                console.error("Error loading portfolio:", error.message)
            });
    }

    return (
        < PortfolioContext.Provider value={{ mediaItems, addMediaItem, setMediaItems, savePortfolio, loadPortfolio, hasMediaChanged }}>
            {children}
        </PortfolioContext.Provider >
    )
}