import Image from 'next/image'
import { useEffect, useRef } from 'react'

function InputDragFile({ handleChangeFile, accept, picturePreview}: Readonly<{ handleChangeFile: (file: any) => void, accept: string, picturePreview: any }>) {
    const drop = useRef(null)
    const listAccept = accept.split(',').map((acceptType) => acceptType.replace('.', ''))

    useEffect(() => {
        function validateAcceptFile(file: any) {
            return listAccept.some((acceptType) => acceptType === file?.name.split('.').slice(-1)[0])
        }

        const handleDrop = (e: any) => {
            e.preventDefault()
            e.stopPropagation()
    
            const { files } = e.dataTransfer
    
            if (files?.length) {
                for (const index of Array.from(Array(files.length).keys())) {
                    if (validateAcceptFile(files[index])) handleChangeFile(files[index])
                }
            }
        }

        drop.current.addEventListener('dragover', handleDragOver)
        drop.current.addEventListener('drop', handleDrop)

        return () => {
            if (drop.current) {
                drop.current.removeEventListener('dragover', handleDragOver)
                drop.current.removeEventListener('drop', handleDrop)
            }
        }
    }, [listAccept, handleChangeFile])

    const handleDragOver = (e: any) => {
        e.preventDefault()
        e.stopPropagation()
    }


    return (
        <>
            <div ref={drop} className='flex flex-col bg-white rounded-md border-dashed border-2 border-gray-200 items-center p-10 space-y-8 text-gray-700'>
                {
                    picturePreview ? (
                        <Image width={150} height={150} src={picturePreview} alt='preview' />
                    ) : (
                        <>
                            <label htmlFor="dragInputFile" className='flex items-center shadow-md outline-gray-200 outline-2 rounded-md p-1 w-24 cursor-pointer' >
                                <span className="material-symbols-outlined">upload</span>Upload
                                <input
                                    type="file"
                                    id="dragInputFile"
                                    onChange={(event) => handleChangeFile(event.target.files[0])}
                                    hidden
                                    accept={accept}
                                    />
                            </label>
                            <div>Arraste o arquivo para cá ou clique no botão</div>
                        </>
                    )
                }
            </div>
            <button type='button' className='text-blue-500' onClick={() => handleChangeFile(null)}>Remover imagem</button>
        </>
    )
}

export default InputDragFile