export interface ServiceIF {
    _id: string;
    code: string;
    service: string;
    price: number;
    discount: number;
    employees_percentage: number;
    employees_payment: number;
    status: number;
    created_at: string;
    updated_at: string;
}

export interface ServiceCreateIF {
    code: string;
    service: string;
    price: number;
    discount: number;
    employees_percentage: number;
    employees_payment: number;
}

export interface ServiceUpdateIf {
    _id: string;
    code: string;
    service: string;
    price: number;
    discount: number;
    employees_percentage: number;
    employees_payment: number;
    status: number;
}

export interface ServiceShowIF {
    id: string;
}

export interface ServiceGetAllIF {
    filter_value: string;
}
