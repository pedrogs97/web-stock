import { Status } from "@prisma/client"
import { useQueries, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/router"
import { useState } from "react"
import { useForm } from "react-hook-form"


function useAdd({ id }: {id: string | string[]}) {
    const [picturePreview, setPicturePreview] = useState(null)
    const [currentFile, setCurrentFile] = useState(null)
    const { register, formState: { errors }, handleSubmit, setError, reset } = useForm({
        defaultValues: {
            name: '',
            description: '',
            provider: '',
            category: '',
            quantity: 1,
        }
    })
    const { push, replace, asPath } = useRouter()
    const queryClient = useQueryClient()

    async function fetchCategories() {
        const respCategories = await fetch('/api/categories/')
        const data = await respCategories.json()
        return data?.map((d: any) => ({label: d.name, value: d.id})) ?? []
    }

    async function fetchProviders() {
        const respProviders = await fetch('/api/providers/')
        const data = await respProviders.json()
        return data?.map((d: any) => ({label: d.name, value: d.id})) ?? []
    }

    
    async function fetchProduct() {
        if (typeof id === 'string') {
            const respProduct = await fetch(`/api/products/${id}/`)
            const data = await respProduct.json()
            reset({
                name: data.name,
                description: data.description,
                provider: data.provider.id.toString(),
                category: data.category.id.toString(),
                quantity: data.quantity
            })
            if (data.picturePath) {
                const fileName = data.picturePath.split('/').slice(-1)[0]
                const respPicture = await fetch(`/api/pictures/?id=${id}&filename=${fileName}`)
                const dataPicture = await respPicture.blob()
                setPicturePreview(URL.createObjectURL(dataPicture))
            }
            return data
        }
    }

    async function fetchHistoric() {
        try {
            const respProductHistoric = await fetch(`/api/historic/${id}/`)
            return await respProductHistoric.json()
        } catch {
            return null
        }
    }

    const [ {data: categories}, {data: providers}, {data: lastHistoric}, {data: currentProduct} ] = useQueries({
        queries: [
            {
                queryKey: ['fetchCategories'],
                queryFn: fetchCategories
            },
            {
                queryKey: ['fetchProvider'],
                queryFn: fetchProviders
            },
            {
                queryKey: ['fetchHistoric'],
                queryFn: fetchHistoric
            },
            {
                queryKey: ['fetchProduct'],
                queryFn: fetchProduct
            }
        ]
    })

    async function uploadFile(productId: string) {
        const file: File | null = currentFile as File

        if (!file) {
        throw new Error('No file uploaded')
        }

        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        const respPicture = await fetch('/api/pictures/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({productId: productId, buffer, filename: file.name}),
        })
        if (respPicture.ok) push(`/products/${productId}`)
    }

    async function submitItem(data: any) {
        let responseOk = false
        let productId = id.toString()
        if (productId) {
            const respProduct = await fetch(`/api/products/${productId}/`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({name: data.name, description: data.description, quantity: +data.quantity, status: currentProduct.status, providerId: +data.provider, categoryId: +data.category})
            })
            const productEdited = await respProduct.json()
            responseOk = respProduct.ok
            if (responseOk) {
                productId = productEdited.id
                queryClient.invalidateQueries({ queryKey: ['fetchHistoric']})
                queryClient.invalidateQueries({ queryKey: ['fetchProduct']})
            } else {
                setError(productEdited.field, {message: productEdited.message})
                setTimeout(() => setError(productEdited.field, {}), 1500)
            }
        } else {
            const respProduct = await fetch('/api/products/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({name: data.name, description: data.description, quantity: +data.quantity, status: Status.AVAILABLE, providerId: +data.provider, categoryId: +data.category})
            })
            const newProduct = await respProduct.json()
            responseOk = respProduct.ok
            if (responseOk) {
                productId = newProduct.id
            } else {
                setError(newProduct.field, {message: newProduct.message})
                setTimeout(() => setError(newProduct.field, {}), 1500)
            }
        }

        if (responseOk) {
            if (currentFile) {
                uploadFile(productId)
            } else {
                push(`/products/${productId}`)
            }
        }
    }

    function handleChangeFile(file: any) {
        if (file) {
            setPicturePreview(URL.createObjectURL(file))
        } else {
            setPicturePreview(file)
        }
        setCurrentFile(file)
    }

    async function changeStatus() {
        const newStatus =  currentProduct?.status === Status.AVAILABLE ? Status.UNAVAILABLE : Status.AVAILABLE
        const respProduct = await fetch(`/api/products/${currentProduct?.id}/`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({name: currentProduct.name, description: currentProduct.description, quantity: +currentProduct.quantity, status: newStatus, providerId: currentProduct.provider.id, categoryId: currentProduct.category.id})
        })
        if (respProduct.ok) {
            queryClient.invalidateQueries({ queryKey: ['fetchHistoric']})
            queryClient.invalidateQueries({ queryKey: ['fetchProduct']})
            replace(asPath)
        }
    }

    async function deleteItem() {
        const respDelete = await fetch(`/api/products/${currentProduct?.id}/`, {method: 'DELETE'})
        if (respDelete.ok) {
            queryClient.invalidateQueries({ queryKey: ['fetchHistoric']})
            queryClient.invalidateQueries({ queryKey: ['fetchProduct']})
            replace(asPath)
        }
    }

    return {
        errors,
        categories,
        providers,
        picturePreview,
        lastHistoric,
        currentProduct,
        register,
        handleSubmit,
        submitItem,
        handleChangeFile,
        changeStatus,
        deleteItem,
    }
}

export default useAdd