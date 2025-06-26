"use client";

import { useState } from 'react';
import { usePortfolio } from "@/context/PortfolioContext";
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MediaItem } from '@/components/types/types';
import { Modal } from './components/Modal';

export const PortfolioPreview = () => {
    const { mediaItems } = usePortfolio();
    const [openSection, setOpenSection] = useState<Record<string, boolean>>({});
    const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (mediaItems.length === 0) {
        return (
            <div className="text-center text-gray-500 italic mt-10">
                No media uploaded yet.
            </div>
        );
    }

    const toggleSection = (category: string) => {
        setOpenSection((prev) => ({
            ...prev,
            [category]: !prev[category],
        }));
    };

    const handleItemClick = (item: MediaItem) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    }

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedItem(null);
    }


    const groupedMediaItems = mediaItems.reduce<Record<string, MediaItem[]>>(
        (groups, item) => {
            const category = item.category || 'Uncategorized';
            if (!groups[category]) {
                groups[category] = [];
            }
            groups[category].push(item);
            return groups;
        },
        {}
    );

    const sortedCategories = Object.keys(groupedMediaItems).sort((a, b) =>
        a.localeCompare(b)
    );

    return (
        <>
            <div className="max-w-6xl mx-auto mt-12 px-4">
                <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
                    Live Portfolio Preview
                </h2>

                {sortedCategories.map((category) => {
                    const items = groupedMediaItems[category];
                    const isOpen = openSection[category] ?? true;

                    return (
                        <section key={category} className="mb-6">
                            <button
                                onClick={() => toggleSection(category)}
                                className="w-full bg-gray-100 dark:bg-stone-700 px-5 py-3 rounded-xl flex justify-between items-center hover:bg-stone-200 dark:hover:bg-stone-950 transition-colors"
                            >
                                <span className="text-lg font-semibold text-gray-800 dark:text-stone-100">
                                    {category} |  {items.length} items
                                </span>
                                <motion.div
                                    animate={{ rotate: isOpen ? 180 : 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <ChevronDown size={20} />
                                </motion.div>
                            </button>

                            <AnimatePresence initial={false}>
                                {isOpen && (
                                    <motion.div
                                        key="content"
                                        initial="collapsed"
                                        animate="open"
                                        exit="collapsed"
                                        variants={{
                                            open: { opacity: 1, height: 'auto' },
                                            collapsed: { opacity: 0, height: 0 },
                                        }}
                                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                                        className="overflow-hidden"
                                    >
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
                                            {items.map((item) => (
                                                <motion.div
                                                    key={item.id}
                                                    className="bg-white dark:bg-stone-100 p-4 rounded-xl shadow-md border hover:shadow-lg transition-shadow cursor-pointer"
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.05 }}
                                                    onClick={() => handleItemClick(item)}
                                                >
                                                    <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-600 mb-2 break-words">
                                                        {item.title}
                                                    </h3>

                                                    {item.media_type.startsWith('image') ? (
                                                        <img
                                                            src={`http://localhost:8000/uploads/${item.filename}`}
                                                            alt={item.title}
                                                            className="w-full h-64 object-contain rounded-md mb-3"
                                                        />
                                                    ) : (
                                                        <video
                                                            src={`http://localhost:8000/uploads/${item.filename}`}
                                                            className="w-full h-64 object-cover rounded-md mb-3"
                                                            controls
                                                        />
                                                    )}

                                                    <p className="text-sm text-stone-600 dark:text-stone-600 italic">
                                                        {item.description}
                                                    </p>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </section>
                    );
                })}
            </div >
            {
                selectedItem &&
                <Modal item={selectedItem} isOpen={isModalOpen} onClose={handleCloseModal} />
            }
        </>
    );
};



