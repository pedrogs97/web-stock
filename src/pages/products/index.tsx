import { InputDragFile, InputNumeric, InputText, Select } from '@/components/form'
import { GetServerSideProps } from 'next/types';
import prisma from '@/lib/prisma';
import { Status } from '@prisma/client';
import { FullLayout } from '@/components/layout'
import useProduct from '@/hooks/useProduct'
import React from 'react'

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

  return {
      props: {
          totalProducts: allProducts?.length ?? 0,
          availableProducts: allProductsAvailable?.length ?? 0,
          unavailableProducts: allProductsUnavailable?.length ?? 0,
          quantityTotalStock: quantityStock?._sum?.quantity ?? 0,
          allCategories: [{label: 'Todos', value: 0}].concat(...allCategories?.map((category) => ({ label: category.name, value: category.id })) ?? []),
          total: total ?? 0
      },
  }
}

function Product(props: any) {
    const { register, errors, handleSubmit, submitItem, categories, providers, handleChangeFile, picturePreview } = useProduct({ id: ''})

    return (
        <FullLayout {...props}>
            <div className='flex flex-col w-full px-4 py-8'>
                <h1 className='font-extrabold text-3xl'>Cadastrar novo item</h1>
                <form onSubmit={handleSubmit(submitItem)} className='flex space-x-10'>
                        <div className='w-2/4 space-y-8'>
                            <InputText errors={errors} label='Nome' name='name' register={register} placeholder='Product name' required />
                            <InputText errors={errors} label='Descrição' name='description' register={register} placeholder='Product description' required />
                            <Select errors={errors} label='Fornecedor' name='provider' register={register} options={providers} required  />
                            <Select errors={errors} label='Categoria' name='category' register={register} options={categories} required  />
                            <InputNumeric errors={errors} label='Estoque' name='quantity' register={register} placeholder='' required />
                            <button type='submit' className='bg-blue-600 hover:bg-blue-700 text-white rounded-xl pr-4 pt-2 pb-2 pl-3'>
                                <div className='flex items-center'>
                                    <span className="material-symbols-outlined">add</span>Cadastrar
                                </div>
                            </button>
                        </div>
                        <div className='w-2/4 pr-8 space-y-4'>
                            <h3 className='font-extrabold'>Imagem</h3>
                            <InputDragFile handleChangeFile={handleChangeFile} accept=".png,.jpeg,.jpg" picturePreview={picturePreview} />
                        </div>
                </form>
            </div>
      </FullLayout>
    )
}

export default Product