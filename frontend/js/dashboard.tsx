import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import RequestCard, { DeliveryRequest } from "@/components/RequestCard";
import { mockRequests } from "@/lib/mockData";
import { sounds } from "@/lib/sounds";

const tabs = ["All", "Pending", "Accepted", "Delivered"] as const;

const Dashboard = () => {
  const [requests, setRequests] = useState < DeliveryRequest[] > (mockRequests);
  const [activeTab, setActiveTab] = useState < string > ("All");

  const filtered = activeTab === "All" ? requests : requests.filter((r) => r.status === activeTab.toLowerCase());

  const counts = {
    All: requests.length,
    Pending: requests.filter((r) => r.status === "pending").length,
    Accepted: requests.filter((r) => r.status === "accepted").length,
    Delivered: requests.filter((r) => r.status === "delivered").length,
  };

  return (
    <div className="min-h-screen bg-background bg-gradient-mesh pt-20 px-4 pb-10">
      <Navbar />
      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="font-display text-2xl font-bold text-foreground">Delivery Requests</h1>
          <p className="text-sm text-muted-foreground mt-1">Browse and manage campus deliveries</p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); sounds.click(); }}
              className={`relative px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap hover:scale-105 active:scale-95 ${activeTab === tab ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
            >
              {activeTab === tab && (
                <motion.div
                  className="absolute inset-0 rounded-md glass"
                  layoutId="tab-bg"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10">{tab} ({counts[tab]})</span>
            </button>
          ))}
        </div>

        {/* Request List */}
        <div className="flex flex-col gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((req) => (
              <RequestCard key={req.id} request={req} />
            ))}
          </AnimatePresence>
          {filtered.length === 0 && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-muted-foreground py-12 text-sm">
              No requests in this category yet.
            </motion.p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
