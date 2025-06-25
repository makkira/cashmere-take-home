"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { MediaItem } from "../types/types";

type PortfolioContextType = {
    mediaItems: MediaItem[];
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
    const userId = "test-user"; // TODO: Replace with actual user ID logic

    useEffect(() => {
        loadPortfolio();
    }, []);

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
        }).catch((error) => {
            console.error("Error saving portfolio:", error);
        });

        console.log("Portfolio saved successfully");
    }

    const loadPortfolio = async () => {
        fetch(`http://localhost:8000/load-portfolio/${userId}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.items) {
                    setMediaItems(data.items);
                    console.log("Loaded items:", data.items);
                    console.log("Portfolio loaded successfully");
                } else {
                    console.warn("No items found in portfolio");
                }
            })
            .catch((error) => {
                console.error("Error loading portfolio:", error.message)
            });

        console.log("Portfolio loaded successfully");
    }

    return (
        < PortfolioContext.Provider value={{ mediaItems, addMediaItem, setMediaItems, savePortfolio, loadPortfolio }}>
            {children}
        </PortfolioContext.Provider >
    )
}