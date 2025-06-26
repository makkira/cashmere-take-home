import { MediaItem, VideoMetadata } from "@/components/types/types";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

export const Modal = ({ item, isOpen, onClose }: { item: MediaItem; isOpen: boolean; onClose: () => void }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div className="fixed inset-0 bg-stone-900/60 bg-opacity-50 flex items-center justify-center z-50 p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white dark:bg-stone-700 rounded-lg max-w-7xl max-h-[90vh] w-full flex overflow-hidden shadow-2xl border-8 border-stone-200"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-white p-6">
                                {item.media_type.startsWith('image') ? (
                                    <img
                                        src={`http://localhost:8000/uploads/${item.filename}`}
                                        alt={item.title}
                                        className="max-w-full max-h-full object-contain rounded-lg"
                                    />
                                ) : (
                                    <video
                                        src={`http://localhost:8000/uploads/${item.filename}`}
                                        controls
                                        className="max-w-full max-h-full object-contain rounded-lg"
                                        autoPlay={false}
                                    />
                                )}
                            </div>

                            {/* Modal Sidebar */}
                            <div className="w-80 bg-white dark:bg-stone-300 p-6 overflow-y-auto overflow-x-hidden">
                                <div className="flex justify-between items-start mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-stone-900 break-words w-0 flex-1">
                                        {item.title}
                                    </h2>
                                    <button
                                        onClick={onClose}
                                        className="p-2 transition-colors bg-stone-400 hover:bg-stone-500 rounded-lg"
                                    >
                                        <X size={20} className="dark:text-stone-800" />
                                    </button>
                                </div>
                                <div className="mb-2">
                                    <h3 className="text-sm font-semibold text-stone-700 dark:text-stone-700 uppercase tracking-wide ">
                                        Description
                                    </h3>
                                    <p className="text-stone-600 dark:text-stone-500 leading-relaxed">
                                        {item.description || 'No description available'}
                                    </p>
                                </div>

                                <div className="mb-2">
                                    <h3 className="text-sm font-semibold text-stone-700 dark:text-stone-700 uppercase tracking-wide">
                                        Category
                                    </h3>
                                    <p className="text-stone-600 dark:text-stone-500 leading-relaxed">
                                        {item.category || 'No category available'}
                                    </p>
                                </div>

                                <div className="mb-2">
                                    <h3 className="text-sm font-semibold text-stone-700 dark:text-stone-700 uppercase tracking-wide">
                                        Media Type
                                    </h3>
                                    <p className="text-stone-600 dark:text-stone-500 leading-relaxed">
                                        {item.media_type || 'No media type available'}
                                    </p>
                                </div>

                                <div className="mb-2">
                                    <h3 className="text-sm font-semibold text-stone-700 dark:text-stone-700 uppercase tracking-wide">
                                        Filename
                                    </h3>
                                    <p className="text-stone-600 dark:text-stone-500 leading-relaxed">
                                        {item.original_filename || 'No filename'}
                                    </p>
                                </div>

                                <div className="mb-2">
                                    <h3 className="text-sm font-semibold text-stone-700 dark:text-stone-700 uppercase tracking-wide">
                                        Upload Date
                                    </h3>
                                    {item.upload_date ?
                                        < p className="text-stone-600 dark:text-stone-500 leading-relaxed">
                                            {new Date(item.upload_date).toLocaleDateString()}
                                        </p>
                                        :
                                        < p className="text-stone-600 dark:text-stone-500 leading-relaxed">
                                            {new Date().toLocaleDateString()}
                                        </p>
                                    }
                                </div>
                                <div className="mb-2">
                                    <h3 className="text-sm font-semibold text-stone-700 dark:text-stone-700 uppercase tracking-wide">
                                        Created Date
                                    </h3>
                                    <p className="text-stone-600 dark:text-stone-500 leading-relaxed">
                                        {item.technical_metadata?.creation_time ?
                                            < p className="text-stone-600 dark:text-stone-500 leading-relaxed">
                                                {new Date(item.technical_metadata?.creation_time).toLocaleDateString()}
                                            </p>
                                            :
                                            < p className="text-stone-600 dark:text-stone-500 leading-relaxed">
                                                'Unknown'
                                            </p>}
                                    </p>
                                </div>

                                <div className="mb-2">
                                    <h3 className="text-sm font-semibold text-stone-700 dark:text-stone-700 uppercase tracking-wide">
                                        Resolution
                                    </h3>
                                    <p className="text-stone-600 dark:text-stone-500 leading-relaxed">
                                        {item.technical_metadata?.resolution || 'Unknown'}
                                    </p>
                                </div>

                                {item.media_type.startsWith("video/") ?
                                    <>
                                        <div className="mb-2">
                                            <h3 className="text-sm font-semibold text-stone-700 dark:text-stone-700 uppercase tracking-wide">
                                                Duration
                                            </h3>
                                            <p className="text-stone-600 dark:text-stone-500 leading-relaxed">
                                                {(item.technical_metadata as VideoMetadata)?.duration || 'Unknown'}
                                            </p>
                                        </div>

                                        <div className="mb-2">
                                            <h3 className="text-sm font-semibold text-stone-700 dark:text-stone-700 uppercase tracking-wide">
                                                Aspect Ratio
                                            </h3>
                                            <p className="text-stone-600 dark:text-stone-500 leading-relaxed">
                                                {(item.technical_metadata as VideoMetadata)?.aspect_ratio || 'Unknown'}
                                            </p>
                                        </div>

                                        <div className="mb-2">
                                            <h3 className="text-sm font-semibold text-stone-700 dark:text-stone-700 uppercase tracking-wide">
                                                Quality
                                            </h3>
                                            <p className="text-stone-600 dark:text-stone-500 leading-relaxed">
                                                {(item.technical_metadata as VideoMetadata)?.quality || 'Unknown'}
                                            </p>
                                        </div>
                                    </>
                                    :
                                    <></>
                                }



                            </div>

                        </motion.div>
                    </motion.div>

                </>
            )
            }
        </AnimatePresence >
    )
}