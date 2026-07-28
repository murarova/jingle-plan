import { albumScreenmMonthOrder } from "../constants/months";
import { TextImageData } from "./task";

export type AlbumScreenMonth = (typeof albumScreenmMonthOrder)[number];

export interface MonthlyData extends TextImageData {
  month: AlbumScreenMonth;
}

export type MonthlyTasks = Record<AlbumScreenMonth, TextImageData>;
