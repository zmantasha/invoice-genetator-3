// import { jsPDF } from "jspdf";
// import "jspdf-autotable";
// import { InvoiceData } from "@/types/invoice";
// import { formatCurrency } from "./format-currency";

// export async function generateInvoicePDF(invoice: InvoiceData): Promise<Blob> {
//   const doc = new jsPDF();

//   const pageWidth = doc.internal.pageSize.getWidth();
  
//   // Add company logo if exists
//   if (invoice.senderDetails.logo) {
//     const maxWidth = 60;
//     const maxHeight = 30;
    
//     // Create a temporary image to get dimensions
//     const img = new Image();
//     img.src = invoice.senderDetails.logo;
    
//     // Calculate aspect ratio
//     const aspectRatio = img.width / img.height;
//     let width = maxWidth;
//     let height = width / aspectRatio;
    
//     if (height > maxHeight) {
//       height = maxHeight;
//       width = height * aspectRatio;
//     }
    
//     doc.addImage(invoice.senderDetails.logo, "JPEG", 20, 20, width, height);
//   }

//   // Add invoice header
//   doc.setFontSize(24);
//   doc.text("INVOICE", pageWidth - 20, 30, { align: "right" });
  
//   // Add invoice details
//   doc.setFontSize(10);
//   doc.text(`Invoice #: ${invoice.invoiceDetails.number}`, pageWidth - 20, 40, { align: "right" });
//   doc.text(`Date: ${invoice.invoiceDetails.date}`, pageWidth - 20, 45, { align: "right" });
//   doc.text(`Due Date: ${invoice.invoiceDetails.dueDate}`, pageWidth - 20, 50, { align: "right" });

//   // Add sender details
//   doc.setFontSize(12); 
//   doc.text("From:", 20, 70);
//   doc.setFontSize(10);
//   doc.text(invoice.senderDetails.name || "", 20, 80);
//   if (invoice.senderDetails.address) {
//     doc.text(invoice.senderDetails.address.split("\n"), 20, 85);
//   }

//   // Add recipient details
//   doc.setFontSize(12);
//   doc.text("Bill To:", pageWidth - 20, 70, { align: "right" });
//   // doc.text("Bill To:", 20, 100);
//   doc.setFontSize(10);
//   doc.text(invoice.recipientDetails.billTo.name || "",pageWidth - 20, 80, { align: "right" });
//   if (invoice.recipientDetails.billTo.address) {
//     doc.text(invoice.recipientDetails.billTo.address.split("\n"), pageWidth - 20, 85, { align: "right" });
//   }

//   // Add items table
//   const tableData = invoice.items.map(item => [
//     item.description,
//     item.quantity.toString(),
//     formatCurrency(item.rate, invoice.invoiceDetails.currency),
//     formatCurrency(item.amount, invoice.invoiceDetails.currency)
//   ]);

//   (doc as any).autoTable({
//     startY: 100,
//     head: [["Description", "Quantity", "Rate", "Amount"]],
//     body: tableData,
//     theme: "grid",
//     headStyles: { fillColor: [51, 51, 51] },
//     columnStyles: {
//       0: { cellWidth: 'auto' },
//       1: { cellWidth: 30, halign: 'right' },
//       2: { cellWidth: 40, halign: 'right' },
//       3: { cellWidth: 40, halign: 'right' },
//     },
//   });

//   // Add totals
//   const finalY = (doc as any).lastAutoTable.finalY + 10;
  
//   // Right-aligned totals
//   const totalsX = pageWidth - 20;
//   doc.text(`Subtotal: ${formatCurrency(invoice.totals.subtotal, invoice.invoiceDetails.currency)}`, totalsX, finalY, { align: "right" });
//   doc.text(`Tax (${invoice.totals.taxRate}%): ${formatCurrency(invoice.totals.tax, invoice.invoiceDetails.currency)}`, totalsX, finalY + 7, { align: "right" });
//   doc.text(`Discount: ${formatCurrency(invoice.totals.discount, invoice.invoiceDetails.currency)}`, totalsX, finalY + 14, { align: "right" });
  
//   // Final total
//   doc.setFontSize(12);
//   doc.setFont("Roboto", "normal");
//   doc.text(`Total: ${formatCurrency(invoice.totals.total, invoice.invoiceDetails.currency)}`, totalsX, finalY + 25, { align: "right" });

//   // Add notes and terms if they exist
//   if (invoice.notes || invoice.terms) {
//     doc.addPage();
    
//     if (invoice.notes) {
//       doc.setFontSize(12);
//       doc.setFont("Roboto", "normal");
//       doc.text("Notes:", 20, 20);
//       doc.setFont(undefined, 'normal');
//       doc.setFontSize(10);
//       doc.text(invoice.notes.split("\n"), 20, 30);
//     }
    
//     if (invoice.terms) {
//       doc.setFontSize(12);
//       doc.setFont(undefined, 'bold');
//       doc.text("Terms & Conditions:", 20, invoice.notes ? 80 : 20);
//       doc.setFont(undefined, 'normal');
//       doc.setFontSize(10);
//       doc.text(invoice.terms.split("\n"), 20, invoice.notes ? 90 : 30);
//     }
//   }

//   return doc.output("blob");
// }

// import { jsPDF } from "jspdf";
// import "jspdf-autotable";
// import { InvoiceData } from "@/types/invoice";
// import { formatCurrency } from "./format-currency";

// export async function generateInvoicePDF(invoice: InvoiceData): Promise<Blob> {
//   const doc = new jsPDF();
//   const pageWidth = doc.internal.pageSize.getWidth();

//   // Add Invoice Header
//   doc.setFontSize(22);
//   doc.setFont("helvetica", "bold");
//   doc.text("INVOICE", 20, 30);

//   // Add Balance Due Section
//   doc.setFontSize(12);
//   doc.setTextColor(0, 0, 0);
//   doc.text(`Balance Due: ${formatCurrency(invoice.totals.balanceDue, invoice.invoiceDetails.currency)}`, pageWidth - 20, 30, { align: "right" });

//   // Invoice Details (Right-aligned)
//   doc.setFontSize(10);
//   doc.setFont("helvetica", "normal");
//   doc.text(`Invoice #: ${invoice.invoiceDetails.number}`, pageWidth - 20, 40, { align: "right" });
//   doc.text(`Invoice Date: ${invoice.invoiceDetails.date}`, pageWidth - 20, 45, { align: "right" });
//   doc.text(`Payment Terms: ${invoice.invoiceDetails.paymentTerms}`, pageWidth - 20, 50, { align: "right" });
//   doc.text(`Due Date: ${invoice.invoiceDetails.dueDate}`, pageWidth - 20, 55, { align: "right" });
//   doc.text(`PO Number: ${invoice.invoiceDetails.poNumber}`, pageWidth - 20, 60, { align: "right" });

//   // Sender and Recipient Details
//   doc.setFontSize(10);
//   doc.setFont("helvetica", "bold");
//   doc.text("From:", 20, 80);
//   doc.setFont("helvetica", "normal");
//   doc.text(invoice.senderDetails.name || "", 20, 85);
//   if (invoice.senderDetails.address) {
//     doc.text(invoice.senderDetails.address.split("\n"), 20, 90);
//   }

//   doc.setFont("helvetica", "bold");
//   doc.text("Bill To:", 20, 110);
//   doc.setFont("helvetica", "normal");
//   doc.text(invoice.recipientDetails.billTo.name || "", 20, 115);
//   if (invoice.recipientDetails.billTo.address) {
//     doc.text(invoice.recipientDetails.billTo.address.split("\n"), 20, 120);
//   }

//   // Table for Items
//   const tableData = invoice.items.map((item) => [
//     item.description,
//     item.quantity.toString(),
//     formatCurrency(item.rate, invoice.invoiceDetails.currency),
//     formatCurrency(item.amount, invoice.invoiceDetails.currency),
//   ]);

//   (doc as any).autoTable({
//     startY: 140,
//     head: [["Item", "Quantity", "Rate", "Amount"]],
//     body: tableData,
//     theme: "grid",
//     styles: { lineColor: 200, lineWidth: 0.2 },
//     headStyles: { fillColor: [51, 51, 51], textColor: 255 },
//     columnStyles: {
//       0: { cellWidth: "auto", valign: "middle" },
//       1: { cellWidth: 30, halign: "right" },
//       2: { cellWidth: 40, halign: "right" },
//       3: { cellWidth: 40, halign: "right" },
//     },
//     margin: { top: 10 },
//   });

//   // Totals Section
//   const finalY = (doc as any).lastAutoTable.finalY + 10;

//   doc.setFont("helvetica", "normal");
//   doc.text(`Subtotal: ${formatCurrency(invoice.totals.subtotal, invoice.invoiceDetails.currency)}`, pageWidth - 20, finalY, { align: "right" });
//   doc.text(`Tax (${invoice.totals.taxRate}%): ${formatCurrency(invoice.totals.tax, invoice.invoiceDetails.currency)}`, pageWidth - 20, finalY + 7, { align: "right" });
//   doc.text(`Amount Paid: ${formatCurrency(invoice.totals.amountPaid, invoice.invoiceDetails.currency)}`, pageWidth - 20, finalY + 14, { align: "right" });

//   doc.setFont("helvetica", "bold");
//   doc.text(`Total: ${formatCurrency(invoice.totals.total, invoice.invoiceDetails.currency)}`, pageWidth - 20, finalY + 25, { align: "right" });

//   return doc.output("blob");
// }


import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { InvoiceData } from "../../types/invoice";
import { formatCurrency } from "./format-currency";

export async function generateInvoicePDF(invoice: Omit<InvoiceData, "_id">): Promise<Blob> {
  const doc = new jsPDF();

  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Add company logo if exists and is a valid URL
  if (invoice.senderDetails.logo) {
    const maxWidth = 60;
    const maxHeight = 30;
    
    const logoBase64 = await loadImage(invoice.senderDetails.logo);
    
    // Calculate aspect ratio
    const img = new Image();
    img.src = logoBase64;
    const aspectRatio = img.width / img.height;
    let width = maxWidth;
    let height = width / aspectRatio;
    
    if (height > maxHeight) {
      height = maxHeight;
      width = height * aspectRatio;
    }
    
    // Add image to PDF
    doc.addImage(logoBase64, "JPEG", 20, 20, width, height);
  }

  // Add invoice header
  doc.setFontSize(24);
  doc.text("INVOICE", pageWidth - 20, 30, { align: "right" });
  
  // Add invoice details
  doc.setFontSize(10);
  doc.text(`Invoice #: ${invoice.invoiceDetails.number}`, pageWidth - 20, 40, { align: "right" });
  doc.text(`Date: ${invoice.invoiceDetails.date}`, pageWidth - 20, 45, { align: "right" });
  doc.text(`Due Date: ${invoice.invoiceDetails.dueDate}`, pageWidth - 20, 50, { align: "right" });

  // Add sender details
  doc.setFontSize(14); 
  doc.setFont("Arial", "normal");
  doc.text("From:", 20, 70);
  doc.setFontSize(12);
  doc.text(invoice.senderDetails.name || "", 20, 80);
  if (invoice.senderDetails.address) {
    doc.text(invoice.senderDetails.address.split("\n"), 20, 85);
  }

  // Add recipient details
  doc.setFontSize(14);
  doc.setFont("Arial", "normal");
  doc.text("Bill To:", pageWidth - 20, 70, { align: "right" });
  doc.setFontSize(12);
  doc.text(invoice.recipientDetails.billTo.name || "",pageWidth - 20, 80, { align: "right" });
  if (invoice.recipientDetails.billTo.address) {
    doc.text(invoice.recipientDetails.billTo.address.split("\n"), pageWidth - 20, 85, { align: "right" });
  }

  // Add items table
  const tableData = invoice.items.map(item => [
    item.description,
    item.quantity.toString(),
    formatCurrency(item.rate, invoice.invoiceDetails.currency),
    formatCurrency(item.amount, invoice.invoiceDetails.currency)
  ]);

  (doc as any).autoTable({
    startY: 100,
    head: [["Description", "Quantity", "Rate", "Amount"]],
    body: tableData,
    theme: "grid",
    headStyles: { fillColor: [51, 51, 51] },
    columnStyles: {
      0: { cellWidth: 'auto' },
      1: { cellWidth: 30, halign: 'right' },
      2: { cellWidth: 40, halign: 'right' },
      3: { cellWidth: 40, halign: 'right' },
    },
  });

  // Add totals
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  
  // Right-aligned totals
  const totalsX = pageWidth - 20;
  doc.text(`Subtotal: ${formatCurrency(invoice.totals.subtotal, invoice.invoiceDetails.currency)}`, totalsX, finalY, { align: "right" });
  doc.text(`Tax (${invoice.totals.taxRate}%): ${formatCurrency(invoice.totals.tax, invoice.invoiceDetails.currency)}`, totalsX, finalY + 7, { align: "right" });
  doc.text(`Discount: ${formatCurrency(invoice.totals.discount, invoice.invoiceDetails.currency)}`, totalsX, finalY + 14, { align: "right" });
  doc.text("INR: ₹1000", 20, 20);
  // Final total
  doc.setFontSize(12);
  doc.setFont("Arial", "normal");
  doc.text(`Total: ${formatCurrency(invoice.totals.total, invoice.invoiceDetails.currency)}`, totalsX, finalY + 25, { align: "right" });

  // Add notes and terms if they exist
  if (invoice.notes || invoice.terms) {
    doc.addPage();
    
    if (invoice.notes) {
      doc.setFontSize(12);
      doc.setFont("Roboto", "normal");
      doc.text("Notes:", 20, 20);
      doc.setFont("Roboto", "normal");
      doc.setFontSize(10);
      doc.text(invoice.notes.split("\n"), 20, 30);
    }
    
    if (invoice.terms) {
      doc.setFontSize(12);
      doc.setFont("Roboto", "normal");
      doc.text("Terms & Conditions:", 20, invoice.notes ? 80 : 20);
      doc.setFont("Roboto", "normal");
      doc.setFontSize(10);
      doc.text(invoice.terms.split("\n"), 20, invoice.notes ? 90 : 30);
    }
  }

  return doc.output("blob");
}

// Helper function to load an image as base64
async function loadImage(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/jpeg"));
      } else {
        reject(new Error("Failed to load image."));
      }
    };
    img.onerror = reject;
    img.src = url;
  });
}

