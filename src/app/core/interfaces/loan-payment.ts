export interface LoanPayment {
  id:                   number;
  loan_id:              number;
  collector_id:         number;
  payment_date:         Date;
  total_amount:         number;
  active:               number;
  created_at:           Date;
  updated_at:           Date;
  loan_payment_details: LoanPaymentDetail[];
}

export interface LoanPaymentDetail {
  id:              number;
  loan_payment_id: number;
  loan_detail_id:  number;
  amount_applied:  string;
  active:          number;
  created_at:      Date;
  updated_at:      Date;
  loan_detail:     LoanDetail;
}

export interface LoanDetail {
  id:           number;
  loan_id:      number;
  due_date:     Date;
  amount:       string;
  paid:         number;
  active:       number;
  user_id:      null;
  number_quota: number;
  created_at:   Date;
  updated_at:   Date;
  paid_amount:  string;
}
