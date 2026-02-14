import { motion } from "framer-motion";
import type { ReactNode } from "react";

const Transition = ({ children }: { children: ReactNode }) => {
    return (
    <motion.div
        initial={{ opacity: 0 }}   // Começa invisível
        animate={{ opacity: 1 }}   // Aparece
        exit={{ opacity: 0 }}      // Some (o segredo da volta suave)
        transition={{ 
        duration: 0.2,           // Reduzi de 0.5 para 0.3 (bem mais rápido)
        ease: [0.4, 0, 0.2, 1]
        }}
    >
        {children}
    </motion.div>
    );
};

export default Transition;