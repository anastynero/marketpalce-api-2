import { verifyAccessToken, generateAccessToken } from './jwt.js';

export function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;
    const [type, token] = authHeader.split(' ');

    if (type !== 'Bearer' || !token) {
        return res.status(401).json({
            message: 'Нет токена',
        });
    }

    const payload = verifyAccessToken(token);

    req.user = {
        id: payload.userId,
        role: payload.role
    };


    next();
}