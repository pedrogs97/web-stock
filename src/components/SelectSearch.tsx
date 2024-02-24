interface SelectSearchProps {
    label?: string
    labelPosition: 'left' | 'top'
    name: string
    register: any
    options: {label: string, value: string}[]
}
function SelectSearch({ label, labelPosition, register, options, name }: Readonly<SelectSearchProps>) {
  return (
    <div className={`flex ${labelPosition === 'top' ? 'flex-col' : ''} items-center space-x-8`}>
      {label && <label>{label}</label>}
      <select className="text-gray-600 text-sm rounded-md p-2 border-2 border-gray-200 min-w-48 focus:border-blue-500 focus:bg-white focus:outline-none" name={name} {...register(name)} defaultValue=''>
        <option className="text-gray-200 text-sm" disabled value=''>Selecione um opção</option>
        {
          options?.map((option) => {
            return <option key={option.value} value={option.value}>{option.label}</option>
          })
        }
      </select>
    </div>
  )
}

export default SelectSearch