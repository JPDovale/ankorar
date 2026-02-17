import { connection } from "@/services/ankorarApi/axios";

export interface Plan {
  id: string;
  price_id: string;
  name: string;
  amount: number;
  interval: string;
  features: string[];
}

interface ListPlansRequestData {
  plans: Plan[];
}

export async function listPlansRequest() {
  return connection.get<ListPlansRequestData>("/v1/plans");
}
