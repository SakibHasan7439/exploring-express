export interface IUser {
    name: string,
    age: number,
    department: string,
    email: string,
    password: string,
    is_active: boolean,
    role: "admin" | "agent" | "user"
}