interface SelectProps {
    label?: string
    name: string
    required?: boolean
    register: any
    options: {label: string, value: string}[]
    errors: any
}
function Select({ label, register, options, name, errors, required }: Readonly<SelectProps>) {
  return (
    <div className='flex flex-col mt-4'>
        <label className="text-gray-600 font-bold">{label}</label>
        <select required={required} className="text-gray-600 text-sm rounded-md p-2 border-2 border-gray-200 min-w-48 focus:border-blue-500 focus:bg-white focus:outline-none" name={name} {...register(name)} defaultValue=''>
            <option className="text-gray-200 font-thin" disabled value=''>Selecione um opção</option>
            {
                options?.map((option) => {
                    return <option key={option.value} value={option.value}>{option.label}</option>
                })
            }
        </select>
        {errors && <span className="text-red-400 text-sm">{errors[name]?.message}</span>}
    </div>
  )
}

export default Select