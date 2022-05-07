interface ResLoginIF {
    token: string;
    user: {
        _id:        string;
        email:      string;
        username:   string;
        fullname:   string;
        status:     number;
        created_at: Date;
        updated_at: Date;
    }
}

export default ResLoginIF;
