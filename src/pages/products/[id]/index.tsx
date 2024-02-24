import { InputDragFile, InputNumeric, InputText, Select } from '@/components/form'
import { GetServerSideProps } from 'next/types';
import prisma from '@/lib/prisma';
import { Status } from '@prisma/client';
import { FullLayout } from '@/components/layout'
import useProduct from '@/hooks/useProduct'
import React from 'react'
import { useParams, useRouter } from 'next/navigation';
import { formatDateTimeLocale } from '@/lib/utils';

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

function ProductEdit(props: any) {
    const params = useParams()
    const { id } = params
    const { push } = useRouter()

    function renderStatus(value: string) {
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

    function renderInfoLabel(value: string) {
        if (value === Status.AVAILABLE) {
            return 'O produto está visível e contando no estoque'
        }

        if (value === Status.UNAVAILABLE) {
            return 'O produto está visível e não está contando no estoque'
        }

        return ''
    }

    function renderButtonLabel(value: string) {
        if (value === Status.AVAILABLE) {
            return 'Desabilitar'
        }

        if (value === Status.UNAVAILABLE) {
            return 'Habilitar'
        }

        return ''
    }

    const { register, errors, handleSubmit, submitItem, categories, providers, handleChangeFile, picturePreview, lastHistoric, currentProduct, changeStatus, deleteItem } = useProduct({id})

    return (
        <FullLayout {...props}>
            <div className='flex flex-col w-full px-4 py-8'>
                <h1 className='font-extrabold text-3xl'>Editar item</h1>
                <form onSubmit={handleSubmit(submitItem)} className='flex space-x-10'>
                        <div className='w-2/4 space-y-8'>
                            <InputText errors={errors} label='Nome' name='name' register={register} placeholder='Product name' required />
                            <InputText errors={errors} label='Descrição' name='description' register={register} placeholder='Product description' required />
                            <Select errors={errors} label='Fornecedor' name='provider' register={register} options={providers} required  />
                            <Select errors={errors} label='Categoria' name='category' register={register} options={categories} required  />
                            <InputNumeric errors={errors} label='Estoque' name='quantity' register={register} placeholder='' required />
                            <div className='flex flex-col'>
                                <span className='text-sm text-gray-400'>
                                    Última Alteração: {formatDateTimeLocale(lastHistoric?.updatedAt ?? '')}
                                </span>
                                <div className='felx text-sm text-gray-400 items-center'>
                                    Estoque: {lastHistoric?.quantityOld ?? 0} <span className="material-symbols-sharp text-sm">trending_flat</span> {lastHistoric?.quantityNew ?? 0} <span className='text-gray-500'>({lastHistoric?.quantityOld - lastHistoric?.quantityNew})</span>
                                </div>
                            </div>
                            <div className='flex items-center space-x-6'>
                                <button type='button' className='text-blue-500' onClick={() => push('/')}>Cancelar</button>
                                <button type='submit' className='bg-blue-600 hover:bg-blue-700 text-white rounded-xl pr-4 pt-2 pb-2 pl-3'>
                                    <div className='flex items-center space-x-10'>
                                        <span className="material-symbols-sharp">done</span>Salvar alterações
                                    </div>
                                </button>
                            </div>
                        </div>
                        <div className='w-2/4 pr-8 space-y-4'>
                            <h3 className='font-extrabold'>Imagem</h3>
                            <InputDragFile handleChangeFile={handleChangeFile} accept=".png,.jpeg,.jpg" picturePreview={picturePreview} />
                            <div className='flex flex-col bg-white border-2 border-gray-300 p-6 w-fit space-y-4'>
                                <div className='flex space-x-4 items-center'>
                                    <span className='font-semibold'>Status</span>
                                    {renderStatus(currentProduct?.status)}
                                    <span className="material-symbols-sharp">info</span>
                                </div>
                                <span>{renderInfoLabel(currentProduct?.status)}</span>
                                <button type='button' disabled={currentProduct?.deleted} onClick={changeStatus} className='w-2/5 shadow-md bg-white p-2 rounded-lg hover:bg-gray-50 border-2 disabled:bg-gray-200'>{renderButtonLabel(currentProduct?.status)}</button>
                            </div>
                            <div className='flex flex-col space-y-4 w-fit'>
                                <button onClick={deleteItem} disabled={currentProduct?.status === Status.AVAILABLE} type='button' className='flex items-center w-2/6 justify-around shadow-md bg-white p-2 rounded-lg hover:bg-gray-50 border-2 disabled:bg-gray-200'><span className="material-symbols-sharp">delete</span>Excluir item</button>
                                <span className='flex items-center'><span className="material-symbols-sharp">info</span> Para excluir este item, você precisa desabilitá-lo primeiro.</span>
                            </div>
                        </div>
                </form>
            </div>
      </FullLayout>
    )
}

export default ProductEdit