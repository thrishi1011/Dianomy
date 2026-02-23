import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Mail, ShieldCheck, GraduationCap, AlertCircle, ArrowLeft, KeyRound } from "lucide-react";
import GlassCard from "@/components/GlassCard";
import { sounds } from "@/lib/sounds";
import { useAuth, simulateFetchUserDetails } from "@/lib/AuthContext";

type Step = "email" | "otp";

const OTP_LENGTH = 6;

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [step, setStep] = useState < Step > ("email");
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState < string[] > (new Array(OTP_LENGTH).fill(""));
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [sentOtp, setSentOtp] = useState("");
    const otpRefs = useRef < (HTMLInputElement | null)[] > ([]);

    const generateOtp = () => {
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        setSentOtp(code);
        return code;
    };

    const handleSendOtp = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!email.trim() || !email.includes("@")) {
            setError("Please enter a valid email address.");
            sounds.error();
            return;
        }

        // Accept ANY email. Backend/Firebase will handle the actual validation later.
        // For now, any format is allowed.

        setLoading(true);
        sounds.notification();

        // Simulate sending OTP
        setTimeout(() => {
            const code = generateOtp();
            console.log(`[DIANOMY] OTP for ${email}: ${code}`);
            setLoading(false);
            setStep("otp");
            sounds.success();
            setTimeout(() => otpRefs.current[0]?.focus(), 100);
        }, 1200);
    };

    const handleOtpChange = (index: number, value: string) => {
        if (value.length > 1) value = value.slice(-1);
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        setError("");

        if (value && index < OTP_LENGTH - 1) {
            otpRefs.current[index + 1]?.focus();
        }
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    };

    const handleVerifyOtp = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        const enteredOtp = otp.join("");

        if (enteredOtp.length !== OTP_LENGTH) {
            setError("Please enter the complete 6-digit code.");
            sounds.error();
            return;
        }

        if (enteredOtp !== sentOtp) {
            setError("Invalid OTP. Please check and try again.");
            sounds.error();
            return;
        }

        setLoading(true);
        sounds.success();

        const user = simulateFetchUserDetails(email, "email");
        setTimeout(() => {
            login(user);
            navigate("/dashboard");
        }, 600);
    };

    const handleGoogleSignIn = () => {
        setError("");
        setLoading(true);
        sounds.click();

        setTimeout(() => {
            const mockGoogleUser = simulateFetchUserDetails("user@student.university.edu", "google");
            mockGoogleUser.name = "Google User";
            login(mockGoogleUser);
            navigate("/dashboard");
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-gradient-hero overflow-hidden flex items-center justify-center px-6">
            {/* Decorative orbs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-primary/5 blur-3xl animate-pulse-glow" />
                <div className="absolute bottom-1/4 -left-32 w-80 h-80 rounded-full bg-accent/5 blur-3xl animate-pulse-glow" style={{ animationDelay: "1.5s" }} />
            </div>

            <motion.div
                className="w-full max-w-md relative z-10"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <motion.a
                    href={step === "otp" ? undefined : "/"}
                    onClick={step === "otp" ? (e: React.MouseEvent) => { e.preventDefault(); setStep("email"); setOtp(new Array(OTP_LENGTH).fill("")); setError(""); } : undefined}
                    className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 font-display cursor-pointer"
                    whileHover={{ x: -3 }}
                >
                    <ArrowLeft size={14} />
                    {step === "otp" ? "Change email" : "Back to Home"}
                </motion.a>

                <GlassCard className="p-8" variant="strong">
                    <AnimatePresence mode="wait">
                        {step === "email" ? (
                            <motion.div key="email-step" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
                                <div className="text-center mb-8">
                                    <motion.div
                                        className="w-16 h-16 rounded-2xl bg-primary/15 flex items-center justify-center mx-auto mb-5"
                                        initial={{ scale: 0.8, rotate: -10 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                                    >
                                        <GraduationCap size={30} className="text-primary" />
                                    </motion.div>
                                    <h1 className="font-display text-2xl font-bold text-foreground">Welcome to DIANOMY</h1>
                                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                                        Sign in with your campus email to get started
                                    </p>
                                </div>

                                <motion.div
                                    className="flex items-start gap-3 glass-subtle rounded-lg p-4 mb-6"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    <ShieldCheck size={18} className="text-accent mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-xs font-semibold text-accent mb-0.5">Automated Verification</p>
                                        <p className="text-xs text-muted-foreground leading-relaxed">
                                            If you use an official institution email address, your details will be fetched automatically.
                                        </p>
                                    </div>
                                </motion.div>

                                <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
                                    <div>
                                        <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                                            Email Address
                                        </label>
                                        <div className="relative">
                                            <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                            <input
                                                type="email"
                                                className="w-full pl-10 pr-4 py-3 rounded-lg bg-secondary/60 border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 font-body input-interactive"
                                                placeholder="you@university.edu"
                                                value={email}
                                                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                                                required
                                                autoFocus
                                            />
                                        </div>
                                    </div>

                                    {error && (
                                        <motion.div
                                            className="flex items-center gap-2 text-destructive text-xs bg-destructive/10 rounded-lg px-3 py-2.5"
                                            initial={{ opacity: 0, y: -5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                        >
                                            <AlertCircle size={14} className="flex-shrink-0" />
                                            {error}
                                        </motion.div>
                                    )}

                                    <motion.button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-display font-semibold text-sm glow-coral hover-glow-coral click-shrink disabled:opacity-60 disabled:cursor-not-allowed"
                                        whileHover={!loading ? { scale: 1.02 } : undefined}
                                        whileTap={!loading ? { scale: 0.97 } : undefined}
                                    >
                                        {loading ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <motion.span
                                                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full inline-block"
                                                    animate={{ rotate: 360 }}
                                                    transition={{ repeat: Infinity, duration: 0.6, ease: "linear" }}
                                                />
                                                Sending OTP...
                                            </span>
                                        ) : (
                                            "Send Verification Code"
                                        )}
                                    </motion.button>
                                </form>

                                <div className="flex items-center gap-3 my-5">
                                    <div className="flex-1 h-px bg-border/50" />
                                    <span className="text-xs text-muted-foreground">or</span>
                                    <div className="flex-1 h-px bg-border/50" />
                                </div>

                                <motion.button
                                    onClick={handleGoogleSignIn}
                                    disabled={loading}
                                    className="w-full py-3 rounded-lg glass border border-border font-display font-medium text-sm text-foreground flex items-center justify-center gap-2.5 hover:bg-secondary/60 transition-all click-shrink disabled:opacity-60"
                                    whileHover={!loading ? { scale: 1.02 } : undefined}
                                    whileTap={!loading ? { scale: 0.97 } : undefined}
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                    </svg>
                                    Continue with Google
                                </motion.button>

                                <p className="text-center text-xs text-muted-foreground mt-6">
                                    By signing in, you agree to DIANOMY's community guidelines.
                                </p>
                            </motion.div>
                        ) : (
                            <motion.div key="otp-step" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                                <div className="text-center mb-8">
                                    <motion.div
                                        className="w-16 h-16 rounded-2xl bg-accent/15 flex items-center justify-center mx-auto mb-5"
                                        initial={{ scale: 0.8 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", stiffness: 200 }}
                                    >
                                        <KeyRound size={28} className="text-accent" />
                                    </motion.div>
                                    <h1 className="font-display text-2xl font-bold text-foreground">Verify Your Email</h1>
                                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                                        We've sent a 6-digit code to<br />
                                        <span className="text-foreground font-medium">{email}</span>
                                    </p>
                                </div>

                                <motion.div
                                    className="flex items-center gap-2 glass-subtle rounded-lg p-3 mb-6 text-xs text-accent"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <ShieldCheck size={14} className="flex-shrink-0" />
                                    <span>Demo: Check browser console for OTP (Ctrl+Shift+J)</span>
                                </motion.div>

                                <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
                                    <div>
                                        <label className="text-xs font-medium text-muted-foreground mb-3 block text-center">
                                            Enter 6-digit verification code
                                        </label>
                                        <div className="flex justify-center gap-2.5">
                                            {otp.map((digit, i) => (
                                                <input
                                                    key={i}
                                                    ref={(el) => { otpRefs.current[i] = el; }}
                                                    type="text"
                                                    inputMode="numeric"
                                                    maxLength={1}
                                                    value={digit}
                                                    onChange={(e) => handleOtpChange(i, e.target.value)}
                                                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                                                    className="w-11 h-13 text-center text-lg font-display font-bold rounded-lg bg-secondary/60 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 input-interactive"
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    {error && (
                                        <motion.div
                                            className="flex items-center gap-2 text-destructive text-xs bg-destructive/10 rounded-lg px-3 py-2.5"
                                            initial={{ opacity: 0, y: -5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                        >
                                            <AlertCircle size={14} className="flex-shrink-0" />
                                            {error}
                                        </motion.div>
                                    )}

                                    <motion.button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-display font-semibold text-sm glow-coral hover-glow-coral click-shrink disabled:opacity-60 disabled:cursor-not-allowed"
                                        whileHover={!loading ? { scale: 1.02 } : undefined}
                                        whileTap={!loading ? { scale: 0.97 } : undefined}
                                    >
                                        {loading ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <motion.span
                                                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full inline-block"
                                                    animate={{ rotate: 360 }}
                                                    transition={{ repeat: Infinity, duration: 0.6, ease: "linear" }}
                                                />
                                                Verifying...
                                            </span>
                                        ) : (
                                            "Verify & Sign In"
                                        )}
                                    </motion.button>

                                    <button
                                        type="button"
                                        onClick={() => { handleSendOtp({ preventDefault: () => { } } as React.FormEvent); }}
                                        className="text-xs text-muted-foreground hover:text-accent transition-colors text-center"
                                    >
                                        Didn't receive the code? <span className="underline">Resend</span>
                                    </button>
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </GlassCard>

                <motion.div
                    className="flex items-center justify-center gap-6 mt-6 text-muted-foreground"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                >
                    <span className="flex items-center gap-1.5 text-xs">
                        <ShieldCheck size={12} className="text-accent" /> Verified Platform
                    </span>
                    <span className="flex items-center gap-1.5 text-xs">
                        <GraduationCap size={12} className="text-primary" /> Campus Network
                    </span>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Login;
