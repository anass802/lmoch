import type { Appearance } from "../types/Appearance";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { getAppearance, patchAppearance } from "../api/Appearance";
type AppearanceContextType = {
  appearance: Appearance | null;
  loading: boolean;
  updateAppearance: (patch: Partial<Appearance>) => void;
  saveAppearance: () => Promise<Appearance | null>; // updated return type
};

const AppearanceContext = createContext<AppearanceContextType | null>(null);
const CSS_VAR_MAP: Record<keyof Appearance, string> = {
  primary_color: "--color-primary",
  secondary_color: "--color-secondary",
  gradient_from: "--gradient-from",
  gradient_via: "--gradient-via",
  gradient_to: "--gradient-to",
  success_color: "--color-success",
  warning_color: "--color-warning",
  danger_color: "--color-danger",
  page_background: "--page-bg",
  card_background: "--card-bg",
  border_color: "--border-color",
  text_primary: "--text-primary",
  text_muted: "--text-muted",
  chart_palette: "", // handled separately, not a single CSS var
  theme: "",
};

export function AppearanceProvider({ children }: { children: ReactNode }) {  
  const [appearance, setAppearance] = useState<Appearance | null>(null);
  const [loading, setLoading] = useState(true);

  // initial fetch
  useEffect(() => {
      setLoading(true);
      const fetchAppearance=async()=>{
        try{
            const res=await getAppearance();
            setAppearance(res.data.data);
            setLoading(false);
        }
        catch(err){
            console.error(err)
        }
      }
      fetchAppearance();
  }, []);

  // sync CSS vars whenever appearance changes (preset click, save, revert, etc.)
  useEffect(() => {
    if (!appearance) return;
    const root = document.documentElement;
    (Object.keys(CSS_VAR_MAP) as (keyof Appearance)[]).forEach((key) => {
      const varName = CSS_VAR_MAP[key];
      if (!varName) return;
      root.style.setProperty(varName, appearance[key] as string);
    });
    root.setAttribute("data-theme", appearance.theme);
  }, [appearance]);

  const updateAppearance = (patch: Partial<Appearance>) => {
    setAppearance((prev) => (prev ? { ...prev, ...patch } : prev));
  };

  const saveAppearance = async () => {
    if (!appearance) return null;
    const res = await patchAppearance(appearance) // let errors propagate to the caller
    setAppearance(res.data.data);
    return res.data.data;
  };

  return (
    <AppearanceContext.Provider value={{ appearance, loading, updateAppearance, saveAppearance }}>
      {children}
    </AppearanceContext.Provider>
  );
}

export const useAppearance = () => {
  const ctx = useContext(AppearanceContext);
  if (!ctx) throw new Error("useAppearance must be used within an AppearanceProvider");
  return ctx;
};