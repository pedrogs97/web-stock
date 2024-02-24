import { Product } from "@prisma/client"
import { QueryFunctionContext, useQuery } from "@tanstack/react-query"
import { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"

function useDashboard() {
    const [filters, setFilters] = useState({})
    const [ordering, setOrdering] = useState({ordering: ''})

    const { register, watch } = useForm()
    const fields = watch()
    const timer = useRef<NodeJS.Timeout>()

    const columns = [
        {
            header: 'Produto',
            key: 'name',
            hasOrdering: false,
        },
        {
            header: 'Descrição',
            key: 'description',
            hasOrdering: false,
        },
        {
            header: 'Fonecedor',
            key: 'provider.name',
            hasOrdering: true,
        },
        {
            header: 'Categoria',
            key: 'category.name',
            hasOrdering: true,
        },
        {
            header: 'Estoque',
            key: 'quantity',
            hasOrdering: true,
        },
        {
            header: 'Status',
            key: 'status',
            hasOrdering: false,
        },
        {
            header: '',
            key: 'id',
            hasOrdering: false,
        }
    ]

    async function getData({ queryKey }: QueryFunctionContext<[string, {search: string, category: string}]>) {
        const [_, filters] = queryKey

        if (filters?.category === '0') {
            delete filters.category
        }
        const filterParams = {
            ...filters,
            ...ordering
        }

        const respFiltredProducts = await fetch(`/api/products/?${new URLSearchParams(filterParams)}`)
        const data = await respFiltredProducts.json()
        return data ?? []
    }
    const { data: productList } = useQuery<Product[]>({
        queryKey: ['fetchProducts', filters, ordering],
        queryFn: getData
    })

    
    useEffect(() => {
        clearTimeout(timer.current)

        timer.current = setTimeout(() => setFilters(fields), 300)
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fields])

    function handleChangeOrdering(colOrdering: {ordering: string}) {
        setOrdering(colOrdering)
    }

    return {
        productList,
        columns,
        ordering,
        register,
        handleChangeOrdering,
    }
}

export default useDashboard