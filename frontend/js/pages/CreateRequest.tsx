import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import GlassCard from "@/components/GlassCard";
import { sounds } from "@/lib/sounds";

const CreateRequest = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ description: "", hostel: "", room: "", arrivalTime: "", reward: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.success();
    navigate("/dashboard");
  };

  const inputClass =
    "w-full px-4 py-3 rounded-lg bg-secondary/60 border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 font-body input-interactive";

  return (
    <div className="min-h-screen bg-background bg-gradient-mesh pt-20 px-4 pb-10">
      <Navbar />
      <motion.div
        className="max-w-lg mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-display text-2xl font-bold text-foreground mb-1">New Delivery Request</h1>
        <p className="text-sm text-muted-foreground mb-6">Post your order details and a runner will pick it up.</p>

        <GlassCard className="p-6" variant="strong">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">What's being delivered?</label>
              <input
                className={inputClass}
                placeholder="e.g. Swiggy food order — 2 biryanis"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Hostel</label>
                <input
                  className={inputClass}
                  placeholder="Hostel A"
                  value={form.hostel}
                  onChange={(e) => setForm({ ...form, hostel: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Room Number</label>
                <input
                  className={inputClass}
                  placeholder="304"
                  value={form.room}
                  onChange={(e) => setForm({ ...form, room: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Expected Arrival</label>
                <input
                  className={inputClass}
                  placeholder="1:30 PM"
                  value={form.arrivalTime}
                  onChange={(e) => setForm({ ...form, arrivalTime: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Reward (₹)</label>
                <input
                  className={inputClass}
                  type="number"
                  placeholder="30"
                  value={form.reward}
                  onChange={(e) => setForm({ ...form, reward: e.target.value })}
                  required
                />
              </div>
            </div>
            <motion.button
              type="submit"
              className="mt-2 w-full py-3 rounded-lg bg-primary text-primary-foreground font-display font-semibold text-sm glow-coral hover-glow-coral click-shrink"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => sounds.click()}
            >
              Post Request
            </motion.button>
          </form>
        </GlassCard>
      </motion.div>
    </div>
  );
};

export default CreateRequest;
