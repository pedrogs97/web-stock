interface InputNumericProps {
    label: string
    name: string
    required?: boolean
    placeholder?: string
    register: any
    errors: any
}


function InputNumeric({ label, register, required, name, errors, placeholder }: Readonly<InputNumericProps>) {
    const { onChange, onBlur, ref } = register(name)

    return (
        <div className="flex flex-col mt-4">
            <label className="text-gray-600 font-bold">{label}</label>
            <input
                type='number'
                min={0}
                name={name}
                ref={ref}
                onBlur={onBlur}
                onChange={(e) => {
                    const value = parseInt(e.target.value.split('-').slice(-1)[0])
                    e.target.value = value.toString()
                    onChange(e)
                }}
                required={required}
                placeholder={placeholder ?? ""}
                defaultValue={1}
                className='text-gray-600 text-sm px-4 py-3 rounded-lg mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none h-10'
            />
            {errors && <span className="text-red-400 text-sm">{errors[name]?.message}</span>}
        </div>
    )
}

export default InputNumeric