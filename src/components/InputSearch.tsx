
interface InputProps {
    label?: string
    name: string
    placeholder?: string
    register: any
}


function InputSearch({ label, register, name, placeholder }: Readonly<InputProps>) {
  return (
    <div className="flex flex-col mt-4 focus:border-blue-500 focus:bg-white focus:outline-none">
        {label && <label className="text-gray-600 font-bold">{label}</label>}
        <div className="flex border-gray-200 border-2 pl-2 pr-2 bg-white rounded-md items-center text-gray-400">
            <span className="material-symbols-outlined">search</span>
            <input
                type='text'
                {...register(name)}
                placeholder={placeholder ?? ""}
                className='text-gray-600 text-sm px-4 py-3 focus:bg-transparent focus:outline-none'
            />
        </div>
    </div>
  )
}

export default InputSearch