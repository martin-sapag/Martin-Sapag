// @ts-nocheck
// Since jspdf and jspdf-autotable are loaded from CDN, we need to tell TypeScript to ignore the missing types.
import { Program, Transaction, TransactionType } from '../types';
import { formatCurrency, formatDate } from './formatter';

// Access global objects from CDN
const { jsPDF } = window.jspdf;

// Helper to draw header.
const drawHeader = (doc, title, foundationName) => {
    doc.setFontSize(16);
    doc.setTextColor(44, 122, 123); // Teal color
    doc.text(title, 14, 22);
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text(foundationName, 14, 28);

    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Generado el: ${new Date().toLocaleDateString('es-AR')}`, doc.internal.pageSize.getWidth() - 14, 22, { align: 'right' });
};

// Helper to add footers with page numbers to all pages after rendering.
const addFooters = (doc) => {
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(`Página ${i} de ${pageCount}`, doc.internal.pageSize.getWidth() / 2, 287, {
            align: 'center'
        });
    }
};


export const exportProgramPdf = (
  program: Program,
  transactions: Transaction[],
  summary: { income: number; expenses: number; adminFee: number; balance: number }
) => {
  const doc = new jsPDF();
  const foundationName = "Fundación Salud Para Todos";
  const title = `Informe del Programa: ${program.name}`;

  drawHeader(doc, title, foundationName);

  // Summary Cards
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text("Ingresos:", 14, 40);
  doc.setFontSize(12);
  doc.setTextColor(34, 197, 94); // Green
  doc.text(formatCurrency(summary.income), 45, 40);

  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text("Costo Admin.:", 14, 48);
  doc.setFontSize(12);
  doc.setTextColor(234, 179, 8); // Yellow
  doc.text(formatCurrency(summary.adminFee), 45, 48);

  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text("Egresos:", 90, 40);
  doc.setFontSize(12);
  doc.setTextColor(239, 68, 68); // Red
  doc.text(formatCurrency(summary.expenses), 115, 40);

  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text("Balance Disp.:", 90, 48);
  doc.setFontSize(12);
  if (summary.balance >= 0) {
    doc.setTextColor(6, 182, 212); // Cyan
  } else {
    doc.setTextColor(239, 68, 68); // Red
  }
  doc.text(formatCurrency(summary.balance), 115, 48);
  
  const tableData = transactions
    .filter(t => !t.isGhosted)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(tx => {
      if (tx.type === TransactionType.INCOME) {
        return [formatDate(tx.date), 'Ingreso', tx.source, '', formatCurrency(tx.amount)];
      } else {
        return [formatDate(tx.date), 'Egreso', tx.expenseType, tx.invoiceNumber, formatCurrency(tx.amount)];
      }
    });

  doc.autoTable({
    startY: 60,
    head: [['Fecha', 'Tipo', 'Detalle', 'N° Factura', 'Monto']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [45, 55, 72], // slate-700
      textColor: [203, 213, 225] // slate-300
    },
    styles: {
        font: 'helvetica'
    },
    didDrawPage: (data) => {
      // Draw header on each page the table spans
      if (data.pageNumber > 1) {
          drawHeader(doc, title, foundationName);
      }
    }
  });
  
  addFooters(doc);

  const safeFilename = program.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  doc.save(`Informe_${safeFilename}.pdf`);
};


export const exportGeneralPdf = (
  programs: Program[],
  transactions: Transaction[],
  summary: { totalIncome: number; totalExpenses: number; totalAdminFees: number; balance: number }
) => {
    const doc = new jsPDF();
    const foundationName = "Fundación Salud Para Todos";
    const title = 'Informe General de Ejecución';
    
    drawHeader(doc, title, foundationName);

    // Summary Cards similar to Program PDF
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("Ingresos Totales:", 14, 40);
    doc.setFontSize(12);
    doc.setTextColor(34, 197, 94); // Green
    doc.text(formatCurrency(summary.totalIncome), 50, 40);

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("Costos Admin.:", 14, 48);
    doc.setFontSize(12);
    doc.setTextColor(234, 179, 8); // Yellow
    doc.text(formatCurrency(summary.totalAdminFees), 50, 48);

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("Egresos Totales:", 100, 40);
    doc.setFontSize(12);
    doc.setTextColor(239, 68, 68); // Red
    doc.text(formatCurrency(summary.totalExpenses), 135, 40);

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("Balance General:", 100, 48);
    doc.setFontSize(12);
    if (summary.balance >= 0) {
        doc.setTextColor(6, 182, 212); // Cyan
    } else {
        doc.setTextColor(239, 68, 68); // Red
    }
    doc.text(formatCurrency(summary.balance), 135, 48);


    const activeTransactions = transactions.filter(t => !t.isGhosted)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const tableData = activeTransactions.map(tx => {
        const programName = programs.find(p => p.id === tx.programId)?.name || 'N/A';
        const date = formatDate(tx.date);
        
        if (tx.type === TransactionType.INCOME) {
            return [
                programName,
                date,
                'Ingreso',
                tx.source,
                '',
                formatCurrency(tx.amount),
            ];
        } else {
            return [
                programName,
                date,
                'Egreso',
                tx.expenseType,
                tx.invoiceNumber,
                formatCurrency(tx.amount),
            ];
        }
    });

    doc.autoTable({
        startY: 60,
        head: [['Programa', 'Fecha', 'Tipo', 'Detalle', 'N° Factura', 'Monto']],
        body: tableData,
        theme: 'grid',
        headStyles: {
            fillColor: [45, 55, 72], // slate-700
            textColor: [203, 213, 225] // slate-300
        },
        styles: {
            font: 'helvetica'
        },
        didDrawPage: (data) => {
          if (data.pageNumber > 1) {
              drawHeader(doc, title, foundationName);
          }
        }
    });

    addFooters(doc);

    doc.save('Informe_General_Fundacion.pdf');
};