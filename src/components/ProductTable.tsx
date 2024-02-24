import { Product, Status } from '@prisma/client'
import { useRouter } from 'next/navigation'
import React from 'react'

interface ProductTableProps {
    productList:Product[],
    columns: {header: string, key: string, hasOrdering: boolean}[]
    total: number
    handleChangeOrdering: (colOrdering: {ordering: string}) => void
    ordering: {ordering: string}
}

function ProductTable({ productList, columns, total, handleChangeOrdering, ordering }: Readonly<ProductTableProps> ) {
    const { push } = useRouter()

    function renderValue(value: string) {
        if (value === Status.AVAILABLE) {
            return (
                <div className='bg-green-300 rounded-2xl text-green-600 w-fit pl-3 pr-3 pt-1 pb-1 text-sm'>
                    Disponível
                </div>
            )
        }

        if (value === Status.UNAVAILABLE) {
            return (
                <div className='bg-red-300 rounded-2xl text-red-600 w-fit pl-3 pr-3 pt-1 pb-1 text-sm'>
                    Indisponível
                </div>
            )
        }

        return value
    }

    function getValue (key: string, item: Product): string {
        if (key.indexOf('.')) {
            const splitedKey = key.split('.')
            let value: any = item
            splitedKey.forEach((key) => {
                value = value[key]
            })
            return value
        }
        
        return item[key]
    }


    function onClickOrdering(key: string) {
        const finalKey = key.split('.')[0]
        if (ordering.ordering?.includes(finalKey) && ordering.ordering?.startsWith('-')) {
            handleChangeOrdering({ordering: finalKey})
        } else if (ordering.ordering?.includes(finalKey) && !ordering.ordering?.startsWith('-')) {
            handleChangeOrdering({ordering: ''})
        } else {
            handleChangeOrdering({ordering: `-${finalKey}`})
        }
    }

    function renderOrderingIcon(orderingKey: string, key: string) {
        const orderingWithoutMinus = orderingKey.split('-').slice(-1)[0]
        if (!orderingKey?.startsWith('-') && orderingKey !== '' && key.includes(orderingWithoutMinus)) {
            return <span className="material-symbols-outlined text-sm">keyboard_arrow_down</span>
        }
        
        if (orderingKey?.startsWith('-') && orderingKey !== '' && key.includes(orderingWithoutMinus)) {
            return <span className="material-symbols-outlined text-sm">keyboard_arrow_up</span>
        }
 
        return <span className="material-symbols-outlined text-sm">unfold_more</span>
    }

    return (
        <div className='ml-10 mr-10 border-gray-200 border-2 rounded-2xl max-h-96 overflow-auto'>
            <table className='w-full bg-white rounded-2xl'>
                <thead>
                    <tr className='border-b-2 border-gray-200'>
                        {
                            columns.map((col) => {
                                return (
                                    <th key={col.key} className='font-normal p-2 text-start'>
                                        <div className='flex items-center'>
                                            {col.hasOrdering && (
                                                <button className='p-0 flex flex-col' onClick={() => onClickOrdering(col.key)}>{renderOrderingIcon(ordering.ordering, col.key)}</button>
                                            )}
                                            {col.header}
                                        </div>
                                    </th>
                                )
                            })
                        }
                    </tr>
                </thead>
                <tbody>
                    {
                        productList?.map((product) => {
                            return (
                                <tr key={product.id} className='border-t-2 border-gray-200'>
                                    {
                                        columns.map((col) => {
                                            if (col.key === 'id') {
                                                return (
                                                    <td key={`${product.id}_${col.key}`}>
                                                        <button className='flex bg-white rounded-md shadow-md items-center hover:bg-gray-100 p-1' onClick={() => push(`/products/${product.id}`)}>
                                                            <span className="material-symbols-outlined">edit</span>
                                                        </button>
                                                    </td>
                                                )
                                            }

                                            return (
                                                    <td key={`${product.id}_${col.key}`} className='p-2'>
                                                        <div className='flex items-center'>
                                                            {col.key === 'name' && (
                                                                <div className='flex items-center rounded-3xl bg-gray-200 p-1 mr-2 text-slate-700'>
                                                                    <span className="material-symbols-outlined ">category</span>
                                                                </div>
                                                            )}
                                                            {renderValue(getValue(col.key, product))}
                                                        </div>
                                                    </td>
                                            )
                                        })
                                    }
                                    </tr>
                                )
                            })
                    }
                </tbody>
                <tfoot className='w-full border-gray-200 border-t-2 rounded-b-2xl'>
                    <tr>
                        <td colSpan={columns.length} className='bg-gray-100 text-center text-gray-500 rounded-b-xl w-full'>
                            {`Mostrando ${productList?.length ?? 0} de ${total} resultados`}    
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>
    )
}

export default ProductTable