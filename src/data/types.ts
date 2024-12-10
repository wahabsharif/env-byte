export interface Project {
  id: number;
  project_name: string;
  client_id: string | number;
  currency_id: string | number;
  quoted_amount: number;
  description: string;
  project_type: string;
  deal_amount: number;
  paid_amount?: string | number[];
  project_note: string;
  created_at: string;
  updated_at: string;
}

export interface Client {
  id: number;
  title: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  mobile: string;
  country_id: number;
}

export interface Currency {
  id: string | number;
  currency_name: string;
  currency_symbol: string;
}

export interface Country {
  id: number;
  country_name: string;
}
