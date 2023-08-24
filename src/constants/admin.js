import bcrypt from "bcryptjs"

export const adminItem = {
    fullname: "admin",
    email: "admin@gmail.com",
    phone: "0987216425",
    password: bcrypt.hashSync('123456'),
    role: 'admin',
}