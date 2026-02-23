import { motion } from "framer-motion";
import { Clock, MapPin, IndianRupee } from "lucide-react";
import GlassCard from "./GlassCard";
import { sounds } from "@/lib/sounds";

export interface DeliveryRequest {
  id: string;
  requester: string;
  hostel: string;
  room: string;
  description: string;
  reward: number;
  arrivalTime: string;
  status: "pending" | "accepted" | "delivered";
  createdAt: string;
}

interface RequestCardProps {
  request: DeliveryRequest;
  onAccept?: (id: string) => void;
  showAccept?: boolean;
}

const statusColors: Record<string, string> = {
  pending: "bg-primary/15 text-primary",
  accepted: "bg-accent/15 text-accent",
  delivered: "bg-accent/20 text-accent",
};

const RequestCard = ({ request, onAccept, showAccept = false }: RequestCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <GlassCard className="p-5" hover>
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-display font-semibold text-foreground">{request.description}</h3>
            <p className="text-sm text-muted-foreground mt-0.5">by {request.requester}</p>
          </div>
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${statusColors[request.status]}`}>
            {request.status}
          </span>
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
          <span className="flex items-center gap-1.5">
            <MapPin size={14} className="text-primary" />
            {request.hostel}, Room {request.room}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={14} className="text-accent" />
            {request.arrivalTime}
          </span>
          <span className="flex items-center gap-1.5">
            <IndianRupee size={14} className="text-accent" />
            ₹{request.reward}
          </span>
        </div>

        {showAccept && request.status === "pending" && (
          <motion.button
            className="w-full py-2.5 rounded-md bg-primary text-primary-foreground font-medium text-sm hover-glow-coral click-shrink"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => {
              sounds.accept();
              onAccept?.(request.id);
            }}
          >
            Accept & Deliver
          </motion.button>
        )}
      </GlassCard>
    </motion.div>
  );
};

export default RequestCard;
