import { motion } from "framer-motion";
import { Upload, ChevronUp, ChevronDown } from "lucide-react";

export const FormHeader = ({
    collapsed,
    onToggle,
}: {
    collapsed: boolean;
    onToggle: () => void;
}) => {
    return (
        <div
            className="flex items-center justify-between mb-4 cursor-pointer "
            onClick={onToggle}
        >
            <motion.h2
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl font-bold text-stone-700 dark:text-stone-950 flex items-center"
            >
                <Upload className="mr-2" size={20} />
                Add Media
            </motion.h2>
            <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: collapsed ? 0 : 180 }}
                transition={{ duration: 0.2 }}
            >
                {collapsed ? <ChevronUp className="text-stone-400" /> : <ChevronDown className="text-stone-400" />}
            </motion.div>
        </div>
    );
};
