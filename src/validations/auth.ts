import * as z from "zod"

export const authSchema = z.object({
  email: z.string({required_error: "Digite o seu nome de usuário"}),
  password: z.string({required_error: "Digite a sua senha"})
})