import type { NextApiRequest, NextApiResponse,  } from 'next'
import prisma from '@/lib/prisma';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export default async function handler (req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const { id } = req.query
        const product = await prisma.product.findUnique({
            where: {
                id: +id
            },
            include: { category: true, provider: true },
        })
        res.status(200).json(product)
    }

    if (req.method === 'PATCH') {
        const { id } = req.query
        const data = req.body
        try {
            const currentProduct = await prisma.product.findUnique({
                where: {
                    id: +id,
                },
            })
            const editedProduct = await prisma.product.update({
                where: {
                    id: +id,
                },
                data
            })
            await prisma.historicProduct.create({
                data: {
                    quantityNew: editedProduct.quantity,
                    quantityOld: currentProduct.quantity,
                    productId: editedProduct.id,
                }
            })
            res.status(200).json(editedProduct)
        } catch (err){
            console.log(err)
            if (err instanceof PrismaClientKnownRequestError) {
                // The .code property can be accessed in a type-safe manner
                if (err.code === 'P2002') {
                  const respError = {
                      message: "Nome já existe",
                      field: 'name'
                  }
                  res.status(400).json(respError)
                }
            } else {    
                res.status(500).send('')
            }
        } 
    }

    if (req.method === 'DELETE') {
        const { id } = req.query
        await prisma.product.update({
            where: {
                id: +id,
            },
            data: {
                deleted: true
            }
        })
        res.status(204).send('')
    }
}