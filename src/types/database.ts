export interface User {
  id: string;
  user_id: string;
  email: string;
  name: string;
  college_name?: string;
  phone?: string;
  year_of_study?: string;
  branch?: string;
  avatar_url?: string;
  role: "user" | "admin";
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Hackathon {
  id: string;
  title: string;
  slug: string;
  description: string;
  short_description?: string;
  banner_url?: string;
  location_type: "online" | "offline" | "hybrid";
  location_details?: string;
  venue_address?: string;
  start_date: string;
  end_date: string;
  registration_start: string;
  registration_end: string;
  prize_pool: number;
  first_prize?: number;
  second_prize?: number;
  third_prize?: number;
  participation_fee: number;
  max_participants?: number;
  current_participants: number;
  min_team_size: number;
  max_team_size: number;
  status: "draft" | "published" | "ongoing" | "completed" | "cancelled";
  themes?: string[];
  requirements?: string;
  rules?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Participant {
  id: string;
  user_id: string;
  hackathon_id: string;
  team_name?: string;
  team_members?: any;
  payment_status: "pending" | "paid" | "failed" | "refunded";
  payment_id?: string;
  submission_url?: string;
  submission_description?: string;
  submitted_at?: string;
  rank?: number;
  prize_won?: number;
  registered_at: string;
}

export interface Payment {
  id: string;
  user_id: string;
  hackathon_id: string;
  participant_id: string;
  order_id: string;
  payment_id?: string;
  amount: number;
  currency: string;
  status: "initiated" | "pending" | "success" | "failed" | "refunded";
  payment_method?: string;
  payment_gateway: string;
  gateway_response?: any;
  created_at: string;
  updated_at: string;
}

// Placeholder Supabase database typing. Replace with generated types (`supabase gen types`)
// when available to unlock full end-to-end typing.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Database = Record<string, any>;
