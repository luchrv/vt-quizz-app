export interface ResponseIF<T extends Object> {
    status: number;
    ok: boolean;
    statusText: string;
    data?: ResponseDataIF<T>;
}

export interface ResponseDataIF<T extends Object> {
    status: string;
    message: string;
    data?: T;
}

export default ResponseIF;
