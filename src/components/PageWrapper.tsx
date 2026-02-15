import { motion } from "framer-motion";
import type { ReactNode } from "react";

const Transition = ({ children }: { children: ReactNode }) => {
    return (
    <motion.div
        initial={{ opacity: 0 }}   
        animate={{ opacity: 1 }}   
        exit={{ opacity: 0 }}     
        transition={{ 
        duration: 0.2,           
        ease: [0.4, 0, 0.4, 1]
        }}
    >
        {children}
    </motion.div>
    );
};

export default Transition;