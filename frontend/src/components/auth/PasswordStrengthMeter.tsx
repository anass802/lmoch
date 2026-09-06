import { useMemo } from "react";

export interface PasswordRules {
  hasMinLength: boolean;
  hasUpper: boolean;
  hasNumber: boolean;
}

export function getPasswordRules(password: string): PasswordRules {
  return {
    hasMinLength: password.length >= 8,
    hasUpper: /[A-Z]/.test(password),
    hasNumber: /[0-9]/.test(password),
  };
}

export function isPasswordValid(password: string): boolean {
  const r = getPasswordRules(password);
  return r.hasMinLength && r.hasUpper && r.hasNumber;
}

const LEVELS = [
  { color: "#E5E7EB", label: "" }, // 0 filled - neutral
  { color: "#EF4444", label: "Faible" }, // red
  { color: "#F97316", label: "Moyen" }, // orange
  { color: "#22C55E", label: "Fort" }, // green
];

export default function PasswordStrengthMeter({ password }: { password: string }) {
  const score = useMemo(() => {
    if (!password) return 0;
    const r = getPasswordRules(password);
    return [r.hasMinLength, r.hasUpper, r.hasNumber].filter(Boolean).length;
  }, [password]);

  const level = LEVELS[score];
  const rules = getPasswordRules(password);

  if (!password) return null;

  return (
    <div className="mt-2">
      <div className="flex gap-1.5">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-1.5 flex-1 rounded-full transition-colors duration-200"
            style={{ backgroundColor: i <= score ? level.color : "#E5E7EB" }}
          />
        ))}
      </div>
      <div className="mt-1.5 flex items-center justify-between">
        <span className="text-xs font-medium" style={{ color: score ? level.color : "#9CA3AF" }}>
          {level.label}
        </span>
        <ul className="flex gap-3 text-[11px] text-gray-500">
          <li className={rules.hasMinLength ? "text-green-600" : ""}>8+ car.</li>
          <li className={rules.hasUpper ? "text-green-600" : ""}>Maj.</li>
          <li className={rules.hasNumber ? "text-green-600" : ""}>Chiffre</li>
        </ul>
      </div>
    </div>
  );
}