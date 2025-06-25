"use client";

import { usePortfolio } from "@/context/PortfolioContext";
import { MediaItem } from "@/types/types";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

export const PortfolioPreview = () => {
    const { mediaItems } = usePortfolio();
    const [openSection, setOpenSection] = useState<Record<string, boolean>>({});

    if (mediaItems.length === 0)
        return (<div className="text-center text-gray-500 italic mt-6"> No media uploaded yet.</div>)

    const toggleSection = (category: string) => {
        setOpenSection((prev) => ({
            ...prev,
            [category]: !prev[category],
        }));
    }
    const groupedMediaItems = mediaItems.reduce<Record<string, MediaItem[]>>((groups, item) => {
        const category = item.category || "Uncategorized";
        if (!groups[category]) {
            groups[category] = [];
        }
        groups[category].push(item);
        return groups;
    }, {});

    const sortedCategories = Object.keys(groupedMediaItems).sort((a, b) => a.localeCompare(b));

    return (
        <div className="max-w-6xl mx-auto mt-10">
            <h2 className="text-2xl font-semibold mb-6">Live Portfolio Preview</h2>

            {sortedCategories.map((category) => {
                const items = groupedMediaItems[category];
                const isOpen = openSection[category] ?? true; // default open
                console.log({ items })
                return (
                    <section key={category} className="mb-8">
                        <button
                            onClick={() => toggleSection(category)}
                            className="w-full text-left bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-md flex justify-between items-center font-semibold"
                        >
                            {category}
                            {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                        </button>

                        {isOpen && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
                                {items.map(item => (
                                    <div
                                        key={item.id}
                                        className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700"
                                    >
                                        <p className="text-lg font-semibold mb-2">{item.title}</p>

                                        {item.media_type.startsWith("image") ? (
                                            <img
                                                src={`http://localhost:8000/uploads/${item.filename}`}
                                                alt={item.title}
                                                className="w-full h-64 object-cover rounded-md mb-2"
                                            />
                                        ) : (
                                            <video
                                                src={`http://localhost:8000/uploads/${item.filename}`}
                                                controls
                                                className="w-full h-64 object-cover rounded-md mb-2"
                                            />
                                        )}

                                        <p className="text-sm text-gray-600 dark:text-gray-300">{item.description}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                );
            })}
        </div>
    );

    // return (
    //     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
    //         {mediaItems.map((item) => (item.media_type.startsWith("image") ? (
    //             <div key={item.id} className="bg-white dark:bg-gray-800 p-4 rounded-md shadow border border-gray-200 dark:border-gray-700">
    //                 <p className="text-lg font-semibold mb-2">{item.title}</p>
    //                 <img key={item.id} src={item.file_path} alt={item.title} width={300} height={200} className="w-full h-64 object-cover rounded-md mb-2" />
    //                 <p className="text-md italic mb-2">{item.description}</p>

    //             </div>
    //         ) : (
    //             <div key={item.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">

    //                 <p className="text-lg font-semibold mb-2">{item.title}</p>
    //                 <video className="w-full h-64 object-cover rounded-md mb-2" src={item.file_path} key={item.id} controls />
    //                 <p className="text-md italic mb-2">{item.description}</p>
    //             </div>

    //         )
    //         ))}
    //     </div>
    // )
};