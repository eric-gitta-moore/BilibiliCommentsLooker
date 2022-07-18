import type { Menber } from "./menber";

export interface ReplayContent {
  message: string;
  plat: number;
  device: string;
  members: Menber[];
  jump_url: Object;
  max_line: number;
}
