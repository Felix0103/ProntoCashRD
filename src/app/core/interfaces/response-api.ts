export interface ResponseApi {
  current_page: number
  data: any[]
  first_page_url: string
  from: any
  last_page: number
  last_page_url: string
  links: Link[]
  next_page_url: any
  path: string
  per_page: number
  prev_page_url: any
  to: any
  total: number
}

export interface Link {
  url?: string
  label: string
  active: boolean
}

export interface ResponseSimple{
  message: string;
  data: any | any[];
  success: boolean;
}