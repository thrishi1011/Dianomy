import { createContext, useContext, useState, ReactNode, useCallback } from "react";

export interface AuthUser {
    email: string;
    name: string;
    year: string;
    rollNumber: string;
    phone: string;
    department: string;
    hostel: string;
    avatarInitial: string;
    provider: "email" | "google";
}

interface AuthContextType {
    user: AuthUser | null;
    isLoggedIn: boolean;
    login: (user: AuthUser) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Simulate fetching user details from campus systems.
 * In production this would be an API call that returns data from the
 * institution's directory based on the email / Google account.
 */
function simulateFetchUserDetails(email: string, provider: "email" | "google" = "email"): AuthUser {
    const localPart = email.split("@")[0];
    const domain = email.split("@")[1] || "";

    // Try to derive a readable name
    let name = localPart;
    if (localPart.includes(".")) {
        name = localPart.split(".").map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(" ");
    } else if (localPart.includes("_")) {
        name = localPart.split("_").map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(" ");
    } else {
        name = localPart.charAt(0).toUpperCase() + localPart.slice(1);
    }

    // Simulate roll-number-style parsing (e.g. ls25csb1a15 → year 2025, dept CSE)
    const rollMatch = localPart.match(/(\d{2})([a-zA-Z]{2,4})/);
    let year = "2025";
    let department = "Computer Science";
    let rollNumber = localPart.toUpperCase();

    if (rollMatch) {
        const yearDigits = parseInt(rollMatch[1], 10);
        year = (yearDigits < 50 ? 2000 + yearDigits : 1900 + yearDigits).toString();
        const deptCode = rollMatch[2].toUpperCase();
        const deptMap: Record<string, string> = {
            CS: "Computer Science", CSE: "Computer Science", CSB: "Computer Science",
            EC: "Electronics & Communication", ECE: "Electronics & Communication",
            EE: "Electrical Engineering", EEE: "Electrical Engineering",
            ME: "Mechanical Engineering", CE: "Civil Engineering",
            CH: "Chemical Engineering", BT: "Biotechnology",
            MM: "Metallurgical Engineering", IT: "Information Technology",
        };
        department = deptMap[deptCode] || deptCode;
    }

    // Extract institution name from domain
    const domainParts = domain.split(".");
    const institution = domainParts.length >= 2
        ? domainParts.filter((p) => !["com", "edu", "ac", "in", "org", "student", "students"].includes(p)).join(".").toUpperCase()
        : domain.toUpperCase();

    return {
        email,
        name,
        year,
        rollNumber,
        phone: "+91 XXXXX XXXXX",
        department,
        hostel: "Not Set",
        avatarInitial: name.charAt(0).toUpperCase(),
        provider,
    };
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(() => {
        try {
            const stored = sessionStorage.getItem("dianomy_user");
            return stored ? JSON.parse(stored) : null;
        } catch {
            return null;
        }
    });

    const login = useCallback((u: AuthUser) => {
        setUser(u);
        sessionStorage.setItem("dianomy_user", JSON.stringify(u));
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        sessionStorage.removeItem("dianomy_user");
    }, []);

    return (
        <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}

export { simulateFetchUserDetails };
