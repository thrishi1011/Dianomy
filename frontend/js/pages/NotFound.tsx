import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background bg-gradient-mesh flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
            >
                <h1 className="font-display text-6xl font-bold text-primary mb-4">404</h1>
                <p className="text-muted-foreground text-sm mb-6">The page you're looking for doesn't exist.</p>
                <button
                    onClick={() => navigate("/")}
                    className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-display font-semibold text-sm glow-coral hover-glow-coral click-shrink"
                >
                    Back to Home
                </button>
            </motion.div>
        </div>
    );
};

export default NotFound;
