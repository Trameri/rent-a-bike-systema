// login.ts

export function checkLogin(username: string, password: string): boolean {
    // Sostituisci con la tua logica di verifica (esempio statico)
    const validUser = "admin";
    const validPass = "password123";
    return username === validUser && password === validPass;
}