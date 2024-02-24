"use client"

function LeftInfoBar({ totalProducts, availableProducts, unavailableProducts, quantityTotalStock }) {
    function getCurrentDate() {
        return new Date().toLocaleDateString('pt-BR')
    }

    return (
        <div className='flex flex-col bg-blue-600 w-1/4 text-white p-7 space-y-4'>
            <span className='text-xs'>Overview</span>
            {getCurrentDate()}
            <h3>Produtos</h3>
            <h1>{totalProducts}</h1>
            <h3>Disponíveis</h3>
            <h1>{availableProducts}</h1>
            <h3>Indisponíveis</h3>
            <h1>{unavailableProducts}</h1>
            <h3>Total em estoque</h3>
            <h1>{quantityTotalStock}</h1>
        </div>
    )
}

export default LeftInfoBar