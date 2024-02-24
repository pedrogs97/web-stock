import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query
    try {
        const all = await prisma.historicProduct.findMany({
            where: {
                productId: +id
            },
            orderBy: {
                updatedAt: 'asc'
            }
        })
        const lastEdit = all.slice(-1)[0]
        res.status(200).json(lastEdit ?? '')
    } catch {
        res.status(200).json('')
    }
}