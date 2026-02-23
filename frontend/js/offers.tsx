import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import RequestCard, { DeliveryRequest } from "@/components/RequestCard";
import { mockRequests } from "@/lib/mockData";
import { sounds } from "@/lib/sounds";

const Runner = () => {
  const [requests, setRequests] = useState < DeliveryRequest[] > (mockRequests);

  const pending = requests.filter((r) => r.status === "pending");

  const handleAccept = (id: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "accepted" as const } : r))
    );
    sounds.accept();
  };

  return (
    <div className="min-h-screen bg-background bg-gradient-mesh pt-20 px-4 pb-10">
      <Navbar />
      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="font-display text-2xl font-bold text-foreground">Runner Mode</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {pending.length} pending {pending.length === 1 ? "request" : "requests"} near you. Accept one to start delivering!
          </p>
        </motion.div>

        {pending.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-muted-foreground text-sm">No pending requests right now. Check back soon!</p>
          </motion.div>
        ) : (
          <div className="flex flex-col gap-4">
            {pending.map((req) => (
              <RequestCard key={req.id} request={req} onAccept={handleAccept} showAccept />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Runner;
