export interface Prescription {
  id: string;
  name: string;
  quantity: number;
  dateFilled: string;
  refills: number;
  category: string;
  active: boolean;
  instructions: string;
  autoRefill: boolean;
  autoRefillEligible: boolean;
  notifyRefill: boolean;
}
