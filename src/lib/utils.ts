export function formatDateTimeLocale (stringData: string): string {
    if (stringData === '') return ''
    const date = new Date(stringData)
    return `${date.toLocaleDateString('pt-BR')} ${date.toLocaleTimeString('pt-BR')}`
}