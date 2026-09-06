import api from "./api";
import type { Appearance } from "../types/Appearance";


export const getAppearance=()=>api.get<{data:Appearance}>('get-appearance');
export const patchAppearance=(appearance:Partial<Appearance>)=>api.patch<{data:Appearance}>('update-appearance', appearance)