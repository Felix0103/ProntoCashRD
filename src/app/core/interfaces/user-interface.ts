import { Warehouse } from "./warehouse";

export interface User {
  id: number
  first_name?: string;
  last_name?: string;
  email?: string
  email_verified_at: any
  created_at: string
  updated_at: string;
  roles? : Role[],
  user_configuration?: UserConfiguration;
  permissions: string[];
}


export interface Role {
  id: number
  name: string
  guard_name: string
  created_at: string
  updated_at: string
  pivot: Pivot
}

export interface Pivot {
  model_type: string
  model_id: number
  role_id: number
}

export interface UserConfiguration{
  commission_percentage: number,
  user_id: number,
  commission_type: number,
  ware_house_id: number
  warehouse: Warehouse
}