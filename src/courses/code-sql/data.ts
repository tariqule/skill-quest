/**
 * Tiny in-memory tables shared by the SQL labs and lesson visuals. Nothing here
 * runs real SQL: the labs evaluate each clause in TypeScript so the result
 * re-renders the moment a clause changes.
 */

export type Cell = string | number | null;

export interface Employee {
  id: number;
  name: string;
  dept: string;
  salary: number;
  city: string;
}

/** Salaries are in thousands. */
export const EMPLOYEES: Employee[] = [
  { id: 1, name: "Ada", dept: "Eng", salary: 120, city: "Lisbon" },
  { id: 2, name: "Ben", dept: "Eng", salary: 95, city: "Oslo" },
  { id: 3, name: "Cy", dept: "Sales", salary: 55, city: "Lisbon" },
  { id: 4, name: "Dee", dept: "Sales", salary: 85, city: "Rome" },
  { id: 5, name: "Eli", dept: "Ops", salary: 60, city: "Oslo" },
  { id: 6, name: "Fay", dept: "Eng", salary: 105, city: "Rome" },
];

export interface Customer {
  id: number;
  name: string;
  city: string | null;
}

export const CUSTOMERS: Customer[] = [
  { id: 1, name: "Ana", city: "Lisbon" },
  { id: 2, name: "Bo", city: "Oslo" },
  { id: 3, name: "Cy", city: "Lisbon" },
  { id: 4, name: "Di", city: null },
];

export interface Order {
  id: number;
  /** null = a guest checkout with no customer row. */
  customer_id: number | null;
  total: number;
  status: "paid" | "refunded";
}

export const ORDERS: Order[] = [
  { id: 10, customer_id: 1, total: 30, status: "paid" },
  { id: 11, customer_id: 1, total: 45, status: "paid" },
  { id: 12, customer_id: 2, total: 40, status: "paid" },
  { id: 13, customer_id: 2, total: 25, status: "refunded" },
  { id: 14, customer_id: 3, total: 60, status: "paid" },
  { id: 15, customer_id: null, total: 15, status: "paid" },
];
