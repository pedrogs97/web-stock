import { FullLayout } from '@/components/layout'
import { GetServerSideProps } from 'next/types';
import prisma from '@/lib/prisma';
import { Status } from '@prisma/client';

export const getServerSideProps: GetServerSideProps = async () => {
    const allCategories = await prisma.category.findMany()
    const allProducts = await prisma.product.findMany({
        where: {
            deleted: false
        }
    })
    const total = await prisma.product.count({
        where: {
            deleted: false
        }
    })

    const totalDeleted = await prisma.product.count({
        where: {
            deleted: true
        }
    })

    const allProductsAvailable = await prisma.product.findMany({
        where: {status: Status.AVAILABLE, deleted: false}
    })

    const allProductsUnavailable = await prisma.product.findMany({
        where: {status: Status.UNAVAILABLE, deleted: false}
    })

    const quantityStock = await prisma.product.aggregate({
        where: {
            deleted: false,
            status: Status.AVAILABLE,
        },
        _sum: {
            quantity: true
        }
    })

    const totalProviders = await prisma.provider.count()

return {
    props: {
        totalProducts: allProducts?.length ?? 0,
        availableProducts: allProductsAvailable?.length ?? 0,
        unavailableProducts: allProductsUnavailable?.length ?? 0,
        quantityTotalStock: quantityStock?._sum?.quantity ?? 0,
        allCategories: [{label: 'Todos', value: 0}].concat(...allCategories?.map((category) => ({ label: category.name, value: category.id })) ?? []),
        total: total ?? 0,
        totalDeleted: totalDeleted ?? 0,
        totalProviders: totalProviders ?? 0,
        totalCategory: allCategories.length ?? 0,
    },
}
}

function Reports(props: any) {
    return (
        <FullLayout {...props}>
            <div className='flex flex-wrap justify-center space-x-8 p-10 w-full'>
                <div className='flex flex-col items-center border-2 border-gray-200 rounded-lg bg-white h-fit p-4'>
                    Total de Produtos Existentes: 
                    <span className='text-blue-600'>{props.totalProducts}</span>
                </div>
                <div className='flex flex-col items-center border-2 border-gray-200 rounded-lg bg-white h-fit p-4'>
                    Total de Excluídos:
                    <span className='text-blue-600'>{props.totalDeleted}</span>
                </div>
                <div className='flex flex-col items-center border-2 border-gray-200 rounded-lg bg-white h-fit p-4'>
                    Total de Fornecedores: 
                    <span className='text-blue-600'>{props.totalProviders}</span>
                </div><div className='flex flex-col items-center border-2 border-gray-200 rounded-lg bg-white h-fit p-4'>
                    Total de Categorias: 
                    <span className='text-blue-600'>{props.totalCategory}</span>
                </div>
            </div>
        </FullLayout>
    )
}

export default Reports