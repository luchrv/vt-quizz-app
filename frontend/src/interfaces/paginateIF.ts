export default interface PaginateResponseIF<T extends Object> {
    total: number;
    data?: T[];
}

export default interface PaginateResponseMovimentsIF<T extends Object> {
    total: number;
    data?: T[];
    summary: {
        in_amount: number;
        out_amount: number;
        total_amount: number;
    };
}

export interface PaginateRequestParamsIF {
    filter_value: string;
    page: number;
    per_page: number;
    sort_field: string;
    sort_type: number;
    from?: string;
    to?: string;
}

export interface PaginateRequestIF<T extends Object> {
    data: PaginateResponseIF<T> | null;
    total: number;
}