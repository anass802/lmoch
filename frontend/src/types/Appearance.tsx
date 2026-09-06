export type Appearance = {
  primary_color: string;
  secondary_color: string;
  gradient_from: string;
  gradient_via: string;
  gradient_to: string;
  success_color: string;
  warning_color: string;
  danger_color: string;
  page_background: string;
  card_background: string;
  border_color: string;
  text_primary: string;
  text_muted: string;
  chart_palette: string[] | null;
  theme: "light" | "dark";
};