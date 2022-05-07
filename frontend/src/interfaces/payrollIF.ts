import { MovimentIF } from "./movimentIF";

export interface PayrollIF {
    _id: string;
    from_date: string;
    to_date: string;
    in_amount: number;
    out_amount: number;
    total: number;
    pay_sheets: PaySheetIF[];
    status: number;
    created_at: string;
    updated_at: string;
}

export interface PaySheetIF {
    employee_id: string;
    employee: string;
    in_amount: number;
    out_amount: number;
    total: number;
    daily_summary: DailySummaryIF[];
}

export interface DailySummaryIF {
    in_amount: number;
    out_amount: number;
    total: number;
    date: string;
    moviments: MovimentIF[];
}

export interface PayrollCreateIF {
    from_date: string;
    to_date: string;
}

export interface PayrollShowIF {
    id: string;
}
