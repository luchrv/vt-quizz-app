export interface MovimentIF {
    _id: string;
    mdate_time: string;
    employee: string;
    employee_id: string;
    mtype: string;
    service: string;
    service_id: string;
    service_price: number;
    service_discount: number;
    employee_percentage: number;
    employee_payment: number;
    in_amount: number;
    out_description: string;
    out_amount: number;
    status: number;
    created_at: string;
    updated_at: string;
}

export interface MovimentCreateIF {
    mdate_time: string;
    employee_id: string;
    mtype: string;
    service_id: string;
    service_price: number;
    service_discount: number;
    employee_percentage: number;
    employee_payment: number;
    out_description: string;
    out_amount: number;
}

export interface MovimentUpdateIf {
    _id: string;
    mdate_time: string;
    employee_id: string;
    mtype: string;
    service_id: string;
    service_price: number;
    service_discount: number;
    employee_percentage: number;
    employee_payment: number;
    out_description: string;
    out_amount: number;
    status: number;
}

export interface MovimentShowIF {
    id: string;
}

export interface MovimentGetAllIF {
    from: string;
    to: string;
    filter_value: string;
}

export interface MovimentsDashbordIF {
    in_amount: number;
    out_amount: number;
    total_amount: number;
    month: number;
    year: number;
}
