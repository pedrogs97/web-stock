import route from 'next/router'
import useAuth from "@/hooks/useAuth"
import { useForm } from "react-hook-form"
import { authSchema } from "@/validations/auth"
import { zodResolver } from "@hookform/resolvers/zod";

function useLogin () {
    const { login } = useAuth()

    const { register, handleSubmit, formState: { errors }, setError } = useForm({
        resolver: zodResolver(authSchema),
        defaultValues: {
          email: '',
          password: '',
        },
    })

    async function submit(data: any) {
        const resp = await fetch('/api/login/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({email: data?.email, password: data?.password})
        })
        const userResp = await resp.json()
        if (resp.ok) {
            login(userResp)
            route.push('/')
        } else if (userResp.field) {
            setError(userResp.field, { message: userResp.message })
            setTimeout(() => setError(userResp.field, {}), 1500)
        }
    }

    return {
        errors,
        register,
        handleSubmit,
        submit,
    }
}

export default useLogin