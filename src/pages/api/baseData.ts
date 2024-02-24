import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma';
import { Status } from '@prisma/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const user = await prisma.user.findUnique({
        where: {
            email: "admin@email.com",
        },
    })

    const provider1 = await prisma.provider.findUnique({
        where: {
            name: "Fornecedor 1",
        },
    })

    const provider2 = await prisma.provider.findUnique({
        where: {
            name: "Fornecedor 2",
        },
    })

    if (!provider1) {
        await prisma.provider.create({
            data: {
                name: "Fornecedor 1",
            }
        })
    }

    if (!provider2) {
        await prisma.provider.create({
            data: {
                name: "Fornecedor 2",
            }
        })
    }

    const category1 = await prisma.category.findUnique({
        where: {
            name: "Categoria 1",
        },
    })

    const category2 = await prisma.provider.findUnique({
        where: {
            name: "Categoria 2",
        },
    })

    const category3 = await prisma.provider.findUnique({
        where: {
            name: "Categoria 3",
        },
    })

    if (!category1) {
        await prisma.category.create({
            data: {
                name: "Categoria 1",
            }
        })
    }

    if (!category2) {
        await prisma.category.create({
            data: {
                name: "Categoria 2",
            }
        })
    }

    if (!category3) {
        await prisma.category.create({
            data: {
                name: "Categoria 3",
            }
        })
    }


    const product1 = await prisma.product.findUnique({
        where: {
            name: "Produto 1",
        },
    })

    const product2 = await prisma.product.findUnique({
        where: {
            name: "Produto 2",
        },
    })

    if (!product1) {
        await prisma.product.create({
            data: {
                name: "Produto 1",
                description: "Este é o produto 1",
                quantity: 10,
                status: Status.AVAILABLE,
                categoryId: 1,
                providerId: 2,
            }
        })
    }

    if (!product2) {
        await prisma.product.create({
            data: {
                name: "Produto 2",
                description: "Este é o produto 2",
                quantity: 2,
                status: Status.AVAILABLE,
                categoryId: 1,
                providerId: 1,
            }
        })
    }


    if (!user) {
        await prisma.user.create({
            data: {
                email: 'admin@email.com',
                fullName: 'Usuário Administrativo',
                password: 'admin@123!',
                username: 'admin.test'
            },
        })
    }
  res.status(200).send('');
}