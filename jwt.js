import jwt from 'jsonwebtoken'
import "dotenv/config"

export function generateAccessToken(user) {

    const payload = {
        userId: user.id,
        role: user.role
    };

    return jwt.sign(
        payload,
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: '15m' }
    );
}

export function verifyAccessToken(token) {
    return jwt.verify(
        token,
        process.env.JWT_ACCESS_SECRET
    );
}