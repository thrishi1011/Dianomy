import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import { AnimatedBackground } from "@/components/AnimatedBackground";

const Runner = () => {
    return (
        <div className="min-h-screen pt-20 px-4 pb-10 relative">
            <AnimatedBackground />
            <Navbar />
            <div className="max-w-2xl mx-auto">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
                    <h1 className="font-display text-2xl font-bold text-foreground">Runner Dashboard</h1>
                    <p className="text-sm text-muted-foreground mt-1">Accept and manage delivery runs</p>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="glass rounded-xl p-8 text-center"
                >
                    <p className="text-muted-foreground text-sm">No active runs yet. Check back for available deliveries!</p>
                </motion.div>
            </div>
        </div>
    );
};

export default Runner;
