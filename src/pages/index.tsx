import { FullLayout } from '@/components/layout';
import { GetServerSideProps } from 'next/types';
import { Status } from '@prisma/client';
import prisma from '@/lib/prisma';
import useDashboard from '@/hooks/useDashboard';
import { InputSearch, SelectSearch } from '@/components';
import ProductTable from '@/components/ProductTable';
import { useRouter } from 'next/navigation';

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

function Home(props: any) {
    const { register, productList, columns, handleChangeOrdering, ordering } = useDashboard()
    const { push } = useRouter()

    return (
        <FullLayout {...props}>
            <div className='flex flex-col w-full'>
                <div className='flex items-center space-x-16 p-5'>
                    <h1 className='font-extrabold text-3xl'>Em estoque</h1>
                    <InputSearch name='search' register={register} placeholder='Pesquisar...' />
                    <SelectSearch labelPosition='left' name='category' options={props.allCategories} register={register} label='Filtrar por:' />
                    <button type='button' onClick={() => push('/products')} className='bg-blue-600 hover:bg-blue-700 text-white rounded-xl pr-4 pt-2 pb-2 pl-3'>
                        <div className='flex items-center'>
                            <span className="material-symbols-outlined">add</span>Novo Item
                        </div>
                    </button>
                </div>
                <ProductTable productList={productList} columns={columns} total={props.total} handleChangeOrdering={handleChangeOrdering} ordering={ordering} />
            </div>
        </FullLayout>
    )
}

export default Home