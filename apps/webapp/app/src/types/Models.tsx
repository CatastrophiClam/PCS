import { Categories } from "./Data";

export interface Defaults {
  columns: Array<string>;
  tableCategories: Array<string>;
  dataLabels: Array<string>;
  sortTestcasesCategory: string;
  filters: Array<Categories>;
}
