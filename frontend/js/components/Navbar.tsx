import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Package, MapPin, User, Plus, LogOut, Volume2, VolumeX } from "lucide-react";
import { sounds, isMuted, toggleMute } from "@/lib/sounds";
import { useAuth } from "@/lib/AuthContext";
import GlassCard from "./GlassCard";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [muted, setMutedState] = useState(isMuted());

  // Update local state if it changes elsewhere
  useEffect(() => {
    const handleStorage = () => setMutedState(isMuted());
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const links = [
    { to: "/dashboard", label: "Requests", icon: Package },
    { to: "/create", label: "New Request", icon: Plus },
    { to: "/runner", label: "Run", icon: MapPin },
    { to: "/profile", label: "Profile", icon: User },
  ];

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    sounds.pop();

    // If logged in
    if (isLoggedIn) {
      if (location.pathname !== "/dashboard") {
        navigate("/dashboard");
      }
      // If already on dashboard, do nothing
    } else {
      // Not logged in -> go home
      if (location.pathname !== "/") {
        navigate("/");
      }
    }
  };

  const handleMuteToggle = () => {
    const newMuted = toggleMute();
    setMutedState(newMuted);
    if (!newMuted) {
      // Play a sound to confirm it's unmuted
      sounds.click();
    }
  };

  const handleLogoutClick = () => {
    sounds.click();
    setShowLogoutDialog(true);
  };

  const confirmLogout = () => {
    sounds.click();
    logout();
    setShowLogoutDialog(false);
    navigate("/");
  };

  const cancelLogout = () => {
    sounds.click();
    setShowLogoutDialog(false);
  };

  return (
    <>
      <motion.nav
        className="glass-strong fixed top-0 left-0 right-0 z-50 px-4 py-3"
        initial={{ y: -60 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
      >
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <a
            href={isLoggedIn ? "/dashboard" : "/"}
            className="font-display text-xl font-bold tracking-tight text-gradient-coral hover-glow-coral rounded-md px-2 py-1 select-none"
            onClick={handleLogoClick}
          >
            DIANOMY.
          </a>

          <div className="flex items-center gap-1">
            {links.map(({ to, label, icon: Icon }) => {
              const active = location.pathname === to;
              return (
                <motion.div
                  key={to}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative group"
                >
                  <Link
                    to={to}
                    onClick={() => sounds.click()}
                    className={`relative flex items-center gap-1.5 px-3 py-2 rounded-md transition-all ${active ? "text-primary" : "text-muted-foreground hover:text-foreground hover:bg-primary/5"
                      }`}
                  >
                    <Icon size={18} className="sm:size-4" />
                    <span className="hidden sm:inline text-sm font-medium">{label}</span>

                    {/* Tooltip for small screens when text is hidden */}
                    <div className="sm:hidden absolute -bottom-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-secondary text-foreground text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-lg border border-border/50">
                      {label}
                    </div>

                    {active && (
                      <motion.div
                        className="absolute inset-0 rounded-md bg-primary/10"
                        layoutId="navbar-active"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </Link>
                </motion.div>
              );
            })}

            {/* Mute toggle button */}
            <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }} className="relative group ml-1">
              <button
                onClick={handleMuteToggle}
                className="relative flex items-center justify-center w-9 h-9 rounded-md text-muted-foreground hover:text-foreground hover:bg-primary/5 transition-all"
                aria-label={muted ? "Unmute sounds" : "Mute sounds"}
              >
                {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}

                {/* Tooltip */}
                <div className="absolute -bottom-10 right-0 px-2 py-1 bg-secondary text-foreground text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-lg border border-border/50">
                  {muted ? "Unmute" : "Mute"}
                </div>
              </button>
            </motion.div>

            {/* Logout button (only show top-right if logged in, otherwise let user go via profile/logo depending on flow) */}
            {isLoggedIn && (
              <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }} className="relative group ml-1">
                <button
                  onClick={handleLogoutClick}
                  className="relative flex items-center justify-center w-9 h-9 rounded-md text-destructive/80 hover:text-destructive hover:bg-destructive/10 transition-all"
                  aria-label="Log Out"
                >
                  <LogOut size={18} />

                  {/* Tooltip */}
                  <div className="absolute -bottom-10 right-0 px-2 py-1 bg-secondary text-foreground text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-lg border border-border/50">
                    Sign out
                  </div>
                </button>
              </motion.div>
            )}

          </div>
        </div>
      </motion.nav>

      {/* Logout Confirmation Dialog */}
      <AnimatePresence>
        {showLogoutDialog && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={cancelLogout}
            />

            {/* Dialog */}
            <motion.div
              className="relative z-10 w-full max-w-sm"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <GlassCard className="p-6 text-center" variant="strong">
                <motion.div
                  className="w-14 h-14 rounded-2xl bg-destructive/15 flex items-center justify-center mx-auto mb-4"
                  initial={{ rotate: -10, scale: 0.8 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                >
                  <LogOut size={24} className="text-destructive" />
                </motion.div>
                <h2 className="font-display text-lg font-bold text-foreground mb-1">Sign Out?</h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Are you sure you want to log out and return to the landing page?
                </p>
                <div className="flex gap-3">
                  <motion.button
                    onClick={cancelLogout}
                    className="flex-1 py-2.5 rounded-lg glass border border-border font-display font-medium text-sm text-foreground hover:bg-secondary/60 transition-all click-shrink"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    onClick={confirmLogout}
                    className="flex-1 py-2.5 rounded-lg bg-destructive text-destructive-foreground font-display font-semibold text-sm hover:opacity-90 transition-all click-shrink"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Log Out
                  </motion.button>
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
