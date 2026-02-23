import { motion } from "framer-motion";
import { User, MapPin, Star, Package, Clock, LogOut, Phone, Building, Briefcase, GraduationCap } from "lucide-react";
import GlassCard from "@/components/GlassCard";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/lib/AuthContext";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // If not logged in, redirect to login
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center px-6">
        <GlassCard className="p-8 text-center max-w-sm" variant="strong">
          <User size={40} className="text-muted-foreground mx-auto mb-4" />
          <h2 className="font-display text-lg font-bold text-foreground mb-2">Not signed in</h2>
          <p className="text-sm text-muted-foreground mb-4">Please log in to view your profile.</p>
          <motion.button
            className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-display font-semibold text-sm glow-coral hover-glow-coral click-shrink"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/login")}
          >
            Sign In
          </motion.button>
        </GlassCard>
      </div>
    );
  }

  const stats = [
    { icon: Package, label: "Deliveries", value: "0" },
    { icon: Star, label: "Rating", value: "—" },
    { icon: Clock, label: "Avg. Time", value: "—" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navbar />
      <div className="pt-24 px-6 pb-12 max-w-xl mx-auto space-y-5">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <GlassCard className="p-8 text-center relative overflow-hidden" variant="strong" hover>
            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-br from-primary/20 to-accent/20 z-0" />
            <motion.div
              className="w-24 h-24 rounded-full bg-background border-4 border-card flex items-center justify-center mx-auto mb-4 hover-glow-coral relative z-10 shadow-xl"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <span className="font-display text-4xl font-bold text-primary">{user.avatarInitial}</span>
            </motion.div>
            <h1 className="font-display text-2xl font-bold text-foreground relative z-10">{user.name}</h1>
            <p className="text-sm text-muted-foreground font-mono mt-1 mb-4 flex items-center justify-center gap-1.5 relative z-10">
              {user.rollNumber}
            </p>

            {/* Simulated fetched details */}
            <div className="grid grid-cols-2 gap-3 mt-6 relative z-10 text-left">
              <div className="glass-subtle rounded-lg p-3">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-1 mb-1">
                  <GraduationCap size={10} /> Class Of
                </span>
                <p className="text-sm font-medium">{user.year}</p>
              </div>
              <div className="glass-subtle rounded-lg p-3">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-1 mb-1">
                  <Briefcase size={10} /> Department
                </span>
                <p className="text-sm font-medium truncate" title={user.department}>{user.department}</p>
              </div>
              <div className="glass-subtle rounded-lg p-3">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-1 mb-1">
                  <Phone size={10} /> Phone
                </span>
                <p className="text-sm font-medium">{user.phone}</p>
              </div>
              <div className="glass-subtle rounded-lg p-3">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-1 mb-1">
                  <Building size={10} /> Hostel
                </span>
                <p className="text-sm font-medium">{user.hostel}</p>
              </div>
            </div>

            {user.provider === "google" && (
              <span className="inline-flex items-center gap-1 mt-6 text-xs glass-subtle rounded-full px-3 py-1 text-accent relative z-10">
                <svg width="12" height="12" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                Signed in with Google
              </span>
            )}
          </GlassCard>
        </motion.div>

        <motion.div
          className="grid grid-cols-3 gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
        >
          {stats.map(({ icon: Icon, label, value }) => (
            <GlassCard key={label} className="p-4 text-center" hover>
              <Icon size={18} className="text-primary mx-auto mb-2" />
              <p className="font-display font-bold text-foreground">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </GlassCard>
          ))}
        </motion.div>

        {/* Logout button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <motion.button
            onClick={handleLogout}
            className="w-full py-3 mt-4 rounded-lg glass border border-destructive/20 text-destructive font-display font-medium text-sm flex items-center justify-center gap-2 hover:bg-destructive/10 transition-all click-shrink"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            <LogOut size={16} />
            Sign Out
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
