import { InputText } from "@/components/form"
import useLogin from "@/hooks/useLogin"

export default function Autenticacao() {
    const { register, handleSubmit, submit, errors } = useLogin()

    return (
        <div className="flex h-screen items-center justify-center">
            <div className="m-10 w-full md:w-1/2 lg:w-1/3">
                <h1 className={`text-3xl font-bold mb-5`}>
                    Bem vindo o WebStock
                </h1>
                
                <InputText 
                    errors={errors}
                    label="E-mail"
                    name="email"
                    register={register}
                    required
                    placeholder="Informe seu e-mail"
                />
                <InputText 
                    errors={errors}
                    label="Senha"
                    type="password"
                    name="password"
                    register={register}
                    required
                    placeholder="Informe sua senha"
                />

                <button type="submit" onClick={handleSubmit(submit)} className={`
                    w-full bg-blue-500 hover:bg-blue-600
                    text-white rounded-lg px-4 py-3 mt-6
                `}>
                    Entrar
                </button>

                <hr className="my-6 border-gray-300 w-full" />
            </div>
        </div>
    )
}