import crypto from 'crypto'

export function generateResetCode() {
    return crypto.randomInt(100000, 1000000).toString();
}

export function hashResetCode(code: string) {
    return crypto
            .createHash("sha256")
            .update(code)
            .digest("hex");
}

export function getResetCodeExpiration() {
    return new Date(Date.now() + 15 * 60 * 1000)
}