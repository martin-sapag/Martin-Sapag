export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
    try {
        const date = new Date(dateString);
         // Adding time zone offset to prevent date from changing
        const userTimezoneOffset = date.getTimezoneOffset() * 60000;
        const adjustedDate = new Date(date.getTime() + userTimezoneOffset);
        return new Intl.DateTimeFormat('es-AR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        }).format(adjustedDate);
    } catch (e) {
        return "Fecha inválida";
    }
}

// New export function
function escapeCsvCell(cell: any): string {
    const cellStr = String(cell ?? ''); // Handle null or undefined
    if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
        // Enclose in double quotes and escape existing double quotes by doubling them
        return `"${cellStr.replace(/"/g, '""')}"`;
    }
    return cellStr;
}

export function exportToCsv(filename: string, headers: string[], data: (string | number)[][]): void {
    const csvRows = [
        headers.map(escapeCsvCell).join(','),
        ...data.map(row => row.map(escapeCsvCell).join(','))
    ];
    const csvContent = csvRows.join('\n');
    
    // BOM for UTF-8 interpretation in Excel
    const blob = new Blob([`\ufeff${csvContent}`], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');

    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}