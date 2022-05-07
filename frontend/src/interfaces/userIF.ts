export interface UserIF {
    _id: string;
    fullname: string;
    username: string;
    email: string;
    status: number;
    created_at: string;
    updated_at: string;
}

export interface UserRegisterIF {
    fullname: string;
    username: string;
    email: string;
    password: string;
}

export interface UserUpdateIf {
    id: string;
    email: string;
    username: string;
    fullname: string;
    old_password: string;
    new_password: string;
    new_password_confirm: string;
    status: number;
}

export interface UserShowIF {
    id: string;
}
