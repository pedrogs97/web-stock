import prisma from '@/lib/prisma'
import { writeFile, readFile } from 'fs/promises';
import path from 'path';
import { NextApiResponse, NextApiRequest } from 'next';
import { existsSync, mkdirSync } from 'fs';


export default async function handler (req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const { id, filename } = req.query
        const folderPath = path.join(process.cwd(), `public/images/products/${+id}/`)
        if (existsSync(folderPath)) {
            const fileBuffer = await readFile(path.join(folderPath, filename.toString()))
            const extension = filename.toString().split('.').slice(-1)[0]
            res.setHeader("Content-Disposition", `attachment; filename="${filename}"`).setHeader("Content-Type", `image/${extension}`)
            res.status(200).send(fileBuffer)
        }
        res.status(204).send('')
    }

    if (req.method === 'POST') {
        const productId = req.body.productId
        const buffer = req.body.buffer
        const filename = req.body.filename
        try {
            const folderPath = path.join(process.cwd(), `public/images/products/${productId}/`)
            if (!existsSync(folderPath)) {
                mkdirSync(folderPath, { recursive: true })
            }
            const fullPath = path.join(folderPath, filename)
            await writeFile(
                fullPath,
                Buffer.from(buffer.data)
            )
            await prisma.product.update({
                where: {
                    id: +productId,
                },
                data: {
                    picturePath: fullPath,
                }
            })
            res.status(201).send('')
        } catch (err) {
            console.log(err)
            res.status(500).send('')
        }
    }
}