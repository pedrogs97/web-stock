import type { NextApiRequest, NextApiResponse,  } from 'next'
import prisma from '@/lib/prisma';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

async function createProducts (req: NextApiRequest) {
    const data = req.body
    const createProduct = await prisma.product.create({data})
    await prisma.historicProduct.create({
        data: {
            quantityNew: createProduct.quantity,
            quantityOld: 0,
            productId: createProduct.id,
        }
    })
    return createProduct
}

async function getProducts(req: NextApiRequest) {
    const queryParams = req.query
    const search = queryParams['search']
    const category = queryParams['category']
    const orderingParam = queryParams['ordering']
    const orderByObj = {}
    if (orderingParam) {
        const desc = typeof orderingParam === 'string' && orderingParam.includes('-') ? 'desc' : 'asc'
        const ordering = typeof orderingParam === 'string' && orderingParam.includes('-') ? orderingParam.split('-')[1] : orderingParam.toString()
        if (ordering === 'category' || ordering === 'provider') {
            orderByObj[ordering] = { name: desc }
        } else {
            orderByObj[ordering] = desc
        }
    }
    
    if (typeof search === 'string' && search) {
        const filtreds = await prisma.product.findMany({
            where: {
                OR: [{
                        name: { contains: search , },
                    },
                    { 
                        description: { contains: search  } },
                    {
                        provider: {
                            name: { contains: search }
                        }
                    }
                ],
                AND: [
                    {
                        deleted: false
                    }
                ]
            },
            relationLoadStrategy: 'join',
            include: { category: true, provider: true },
            orderBy: orderByObj
        })
        return filtreds
    } else if (typeof category === 'string' && category) {
        const filtreds = await prisma.product.findMany({
            relationLoadStrategy: 'join',
            where: {
                category: {
                    id: +category
                },
                deleted: false,
            },
            include: {
                category: true,
                provider: true
            },
            orderBy: orderByObj
        })
        return filtreds
    } else {
        const all = await prisma.product.findMany({
            where:
            {
                deleted: false,
            },
            relationLoadStrategy: 'join',
            include: { category: true, provider: true },
            orderBy: orderByObj
        })
        return all
    }
}


export default async function handler (req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const result = await getProducts(req)
        res.status(200).json(result)
    }

    if(req.method === 'POST') {
        try {
            const result = await createProducts(req)
            res.status(201).json(result)
        } catch (err){
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
}