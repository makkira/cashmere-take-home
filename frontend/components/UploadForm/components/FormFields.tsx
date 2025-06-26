import { CATEGORIES } from "../utils/constants";

export const FormFields = ({ register }: { register: any }) => {
    return (
        <>
            {/* title textarea */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <div className="flex gap-2 ">
                        <label className="block text-sm font-medium text-gray-700 dark:text-stone-700 mb-2">
                            Title

                        </label>
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            Max 80 Characters
                        </p>
                    </div>
                    <input
                        maxLength={80}
                        type="text"
                        {...register("title", { required: true, maxLength: 80 })}
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
                <div className="flex gap-2 ">
                    <label className="block text-sm font-medium text-gray-700 dark:text-stone-700 mb-2">
                        Description

                    </label>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Max 150 Characters
                    </p>
                </div>
                <textarea
                    type="text"
                    maxLength={150}
                    {...register("description", { required: true, maxLength: 150 })}
                    rows={3}
                    className="w-full p-2 border border-gray-300 dark:text-stone-800 rounded-md focus:ring-2 focus:ring-stone-500 focus:border-transparent"
                />
            </div>
        </>
    );
};