import { motion } from 'framer-motion';

const GlassCard = ({ children, className = "" }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
            className={`premium-card ${className}`}
        >
            {children}
        </motion.div>
    );
};

export default GlassCard;
