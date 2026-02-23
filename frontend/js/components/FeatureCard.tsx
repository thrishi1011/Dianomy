import { motion } from "framer-motion";
import { ReactNode } from "react";
import GlassCard from "./GlassCard";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  index: number;
}

const FeatureCard = ({ icon, title, description, index }: FeatureCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <GlassCard className="p-6 h-full" hover>
        <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center mb-4 text-primary">
          {icon}
        </div>
        <h3 className="font-display font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </GlassCard>
    </motion.div>
  );
};

export default FeatureCard;
