import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Package, MapPin, Star, Zap, Shield, Clock } from "lucide-react";
import FeatureCard from "@/components/FeatureCard";
import GlassCard from "@/components/GlassCard";
import { sounds } from "@/lib/sounds";

const features = [
  { icon: <Package size={20} />, title: "Post a Request", description: "Got an order stuck at the gate? Post it in seconds and a fellow student will bring it to your door." },
  { icon: <MapPin size={20} />, title: "Run & Earn", description: "Heading towards the gate anyway? Pick up a delivery and earn small rewards on the way." },
  { icon: <Shield size={20} />, title: "Verified Students Only", description: "College email login ensures only verified campus students can use the platform." },
  { icon: <Star size={20} />, title: "Trust & Ratings", description: "Rate every delivery. Build your reputation and trust within the campus community." },
  { icon: <Clock size={20} />, title: "Real-Time Status", description: "Track your request from pending to accepted to delivered — all live updates." },
  { icon: <Zap size={20} />, title: "Lightning Fast", description: "Most deliveries completed in under 10 minutes. No more 25-minute walks to the gate." },
];

const stats = [
  { value: "24/7", label: "Gate Pickups" },
  { value: "<10 min", label: "Avg. Delivery" },
  { value: "100%", label: "Campus Trust" },
];

const Index = () => {
  useEffect(() => {
    // Play the landing sound once after a short delay for a satisfying entrance
    const timer = setTimeout(() => sounds.landing(), 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-hero overflow-hidden">
      {/* Decorative orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary/5 blur-3xl animate-pulse-glow" />
        <div className="absolute top-1/3 -right-48 w-[500px] h-[500px] rounded-full bg-accent/5 blur-3xl animate-pulse-glow" style={{ animationDelay: "1s" }} />
        <div className="absolute -bottom-32 left-1/3 w-80 h-80 rounded-full bg-primary/5 blur-3xl animate-pulse-glow" style={{ animationDelay: "2s" }} />
      </div>

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-2xl"
        >
          <motion.div
            className="inline-flex items-center gap-2 glass-subtle rounded-full px-4 py-1.5 text-xs font-medium text-muted-foreground mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            Live on campus now
          </motion.div>

          <h1 className="font-display text-5xl sm:text-7xl font-bold tracking-tight mb-2">
            <span className="text-gradient-coral">DIANOMY.</span>
          </h1>
          <p className="font-display text-lg sm:text-xl text-muted-foreground mt-4 mb-8 max-w-lg mx-auto leading-relaxed">
            Gate to hostel, delivered by students. The last-mile campus delivery network.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/login">
              <motion.button
                className="px-8 py-3.5 rounded-lg bg-primary text-primary-foreground font-display font-semibold text-sm glow-coral hover-glow-coral click-shrink"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => sounds.whoosh()}
              >
                Get Started
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Stats row */}
        <motion.div
          className="flex gap-8 mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          {stats.map((s) => (
            <motion.div
              key={s.label}
              className="text-center glass-subtle rounded-lg px-5 py-3 hover-lift cursor-default"
              whileHover={{ scale: 1.08 }}
            >
              <p className="font-display text-2xl font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 flex flex-col items-center gap-2 text-muted-foreground"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <span className="text-xs">Scroll</span>
          <div className="w-px h-6 bg-muted-foreground/30" />
        </motion.div>
      </section>

      {/* Features */}
      <section className="relative z-10 px-6 py-24 max-w-5xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">How it works</h2>
          <p className="text-muted-foreground mt-3 max-w-md mx-auto">A peer-to-peer helping ecosystem, built for campus life.</p>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <FeatureCard key={f.title} icon={f.icon} title={f.title} description={f.description} index={i} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-6 py-24">
        <motion.div
          className="max-w-xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <GlassCard className="p-10" variant="strong" hover>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-3">Ready to skip the walk?</h2>
            <p className="text-muted-foreground mb-6 text-sm">Join hundreds of students already saving time on campus.</p>
            <Link to="/login">
              <motion.button
                className="px-8 py-3 rounded-lg bg-primary text-primary-foreground font-display font-semibold text-sm glow-coral"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => sounds.success()}
              >
                Start Now — It's Free
              </motion.button>
            </Link>
          </GlassCard>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/30 py-8 text-center text-xs text-muted-foreground">
        <p className="font-display">© 2026 DIANOMY. Built by students, for students.</p>
      </footer>
    </div>
  );
};

export default Index;
