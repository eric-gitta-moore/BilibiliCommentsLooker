import type { Menber } from "./menber";

export interface ReplyContent {
  message: string;
  plat: number;
  device: string;
  members: Menber[];
  jump_url: Record<string, unknown>;
  max_line: number;
}
