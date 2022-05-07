export interface EmployeeIF {
    _id: string;
    identity: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    address: string;
    birthday: string;
    work_position: string;
    status: number;
    created_at: string;
    updated_at: string;
}

export interface EmployeeCreateIF {
    identity: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    address: string;
    birthday: string;
    work_position: string;
}

export interface EmployeeUpdateIf {
    _id: string;
    identity: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    address: string;
    birthday: string;
    work_position: string;
    status: number;
}

export interface EmployeeShowIF {
    id: string;
}

export interface EmployeeGetAllIF {
    filter_value: string;
}
