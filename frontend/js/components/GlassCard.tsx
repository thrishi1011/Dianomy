import { motion } from "framer-motion";
import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "strong" | "subtle";
  hover?: boolean;
  onClick?: () => void;
}

const GlassCard = ({ children, className = "", variant = "default", hover = false, onClick }: GlassCardProps) => {
  const variantClass = variant === "strong" ? "glass-strong" : variant === "subtle" ? "glass-subtle" : "glass";

  return (
    <motion.div
      className={`${variantClass} rounded-lg ${hover ? "interactive-card" : ""} ${className}`}
      whileHover={hover ? { scale: 1.02, y: -3 } : undefined}
      whileTap={onClick ? { scale: 0.97 } : undefined}
      onClick={onClick}
      style={{ cursor: onClick || hover ? "pointer" : undefined }}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;
