interface InputProps {
    label: string
    name: string
    required?: boolean
    type?: 'text' | 'email' | 'password'
    placeholder?: string
    register: any
    errors: any
}


function InputText({ label, type, register, required, name, errors, placeholder }: Readonly<InputProps>) {
  return (
    <div className="flex flex-col mt-4">
        <label className="text-gray-600 font-bold">{label}</label>
        <input
            type={type ?? 'text'}
            {...register(name)}
            required={required}
            placeholder={placeholder ?? ""}
            className='text-gray-600 text-sm px-4 py-3 rounded-lg mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none h-10'
        />
        {errors && <span className="text-red-400 text-sm">{errors[name]?.message}</span>}
    </div>
  )
}

export default InputText