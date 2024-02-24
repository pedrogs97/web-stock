import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { email, password } = req.body;
    let status = 200
    let jsonResp: any
    const user = await prisma.user.findUnique({
        where: {
            email: email,
        },
    })

    if (!user) {
        status = 400
        jsonResp = {field: "email", message: "Usuário não encontrado"}
    } else if (user.password !== password) {
        status = 400
        jsonResp = {field: "password", message: "Credenciais inválidas"}
    } else {
        jsonResp = user
    }
    
    res.status(status).json(jsonResp);
}