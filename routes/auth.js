import express from 'express'
import { client } from '../db';
import bcrypt from 'bcrypt'
import { authenticate } from '../middlewares';

export const authRouter = express.Router()


authRouter.post('/register', async (req, res) => {
    const { email, password } = req.body;

    const existingUser = await client.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        return res.status(409).json({
            message: 'Email занят',
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await client.user.create({
        data: {
            email,
            password: hashedPassword,
        },
        select: {
            id: true,
            email: true,
            role: true,
        },
    });

    res.status(201).json(user);
})

authRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await client.user.findUnique({
        where: { email },
    });
    if (!user) {
        return res.status(401).json({
            message: 'Неверный email',
        });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return res.status(401).json({
            message: 'Неверный пароль',
        });
    }

    res.json({ accessToken });

})

authRouter.get('/me', authenticate, async (req, res) => {
    const user = await client.user.findUnique({
        where: {
            id: req.user.id,
        },
        select: {
            id: true,
            email: true,
            role: true,
        },
    });

    if (!user) {
        return res.status(404).json({
            message: 'Пользователь не найден',
        });
    }

    res.json(user);

})
