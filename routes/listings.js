import express from 'express'
import { client } from '../db';
import { authenticate } from '../middlewares';

export const listingsRouter = express.Router()

listingsRouter.get('/', async (req, res) => {
    const listings = await client.listing.findMany({
        include: {
            owner: {
                select: {
                    id: true,
                    email: true,
                },
            },
        },
    });

    res.json(listings);
})

listingsRouter.get('/:id', async (req, res) => {
    const id = Number(req.params.id);
    const listing = await client.listing.findUnique({
        where: { id },
        include: {
            owner: {
                select: {
                    id: true,
                    email: true,
                },
            },
        },
    });

    if (!listing) {
        return res.status(404).json({
            message: 'Объявление не найдено',
        });
    }

    res.json(listing);
})

listingsRouter.post('/', authenticate, async (req, res) => {
    const { title, description, price, category } = req.body;

    const listing = await client.listing.create({
        data: {
            title,
            description,
            price: Number(price),
            category,
            ownerId: req.user.id,
        },
    });

    res.status(201).json(listing);
})

listingsRouter.patch('/:id', authenticate, async (req, res) => {
    const id = Number(req.params.id);
    const listing = await client.listing.update({
        where: { id },
        data: req.body,
    });

    res.json(listing);
})

listingsRouter.delete('/:id', authenticate, async (req, res) => {
    const id = Number(req.params.id);
    await client.listing.delete({
        where: { id },
    });

    res.status(204).send();
})