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
  const margin = 20;
  
   // Header Section with Logo and Invoice Number
      if (invoice.senderDetails.logo) {
        const maxWidth = 50;
        const maxHeight = 25;
      
        const logoBase64 = invoice.senderDetails.logo;
        const img = new Image();
        img.src = logoBase64;
      
        // Calculate aspect ratio and dimensions
        const aspectRatio = img.width / img.height;
        let width = maxWidth;
        let height = width / aspectRatio;
      
        if (height > maxHeight) {
          height = maxHeight;
          width = height * aspectRatio;
        }
      
        // Add rounded rectangle for border-radius effect
        // doc.setDrawColor(0); // Black border
        // doc.setLineWidth(0.5);
        // doc.roundedRect(margin, margin, width, height, 3, 3); // Rounded corners with radius 3
      
        // Add the image
        doc.addImage(logoBase64, "JPEG", margin, margin, width, height);
      
        // Add sender name next to the logo
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text(
          invoice.senderDetails.name,
          margin + width + 8,
          margin + height / 2
        );
      } else {
        // If no logo, display the name in column format
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text(invoice.senderDetails.name, margin, margin + 10);
      }

  // Invoice Number (right-aligned)
  doc.setFontSize(24);
  doc.text(invoice.invoiceDetails.number, pageWidth - margin, margin + 10, { align: "right" });

  // Recipient and Invoice Details Grid (3 columns)
  const gridY = margin + 40;
  
  // Bill To Column
  if (invoice.recipientDetails.billTo.name) {
    doc.setFontSize(10);
    doc.setTextColor(128, 128, 128);
    doc.text("Bill To", margin, gridY);
    doc.setTextColor(0, 0, 0);
    doc.text(invoice.recipientDetails.billTo.name, margin, gridY + 7);
  }

  // Ship To Column
  if (invoice.recipientDetails.shipTo.name) {
    const middleX = pageWidth / 2 - 20;
    doc.setFontSize(10);
    doc.setTextColor(128, 128, 128);
    doc.text("Ship To", middleX, gridY);
    doc.setTextColor(0, 0, 0);
    doc.text(invoice.recipientDetails.shipTo.name, middleX, gridY + 7);
  }

  // Invoice Details Box (right column)
  const detailsX = pageWidth - 80;
  const rightMargin = 15;
  // Only include details that have values
  const detailsData = [
    invoice.invoiceDetails.date && {
      label: "Date",
      value: new Date(invoice.invoiceDetails.date).toLocaleDateString()
    },
    invoice.invoiceDetails.paymentTerms && {
      label: "Payment Terms",
      value: invoice.invoiceDetails.paymentTerms
    },
    invoice.invoiceDetails.dueDate && {
      label: "Due Date",
      value: new Date(invoice.invoiceDetails.dueDate).toLocaleDateString()
    },
    invoice.invoiceDetails.poNumber && {
      label: "PO Number",
      value: invoice.invoiceDetails.poNumber
    },
    invoice.totals.balanceDue && {
      label: "Balance",
      value: formatCurrency(invoice.totals.balanceDue, invoice.invoiceDetails.currency),
      color: "#DC2626"
    }
  ].filter(Boolean) as { label: string; value: string }[];

  if (detailsData.length > 0) {
    // Add gray background for details box
    doc.setFillColor(250, 250, 250);
    doc.rect(detailsX - 5, gridY - 5, 85-rightMargin, detailsData.length * 10 + 1, "F");

    detailsData.forEach((detail, index) => {
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      doc.text(detail.label, detailsX, gridY + (index * 10));
      doc.setTextColor(0, 0, 0);
      doc.text(detail.value, pageWidth - margin, gridY + (index * 10), { align: "right" });
    });
  }

  

  // Items Table
  // const tableY = gridY + 60;
  const tableStartY = Math.max(
    gridY + (detailsData.length > 0 ? detailsData.length * 10 + 10 : 10),
    gridY + 30 // Minimum spacing from grid
  );
  const tableData = invoice.items.map((item, index) => [
    (index + 1).toString(),
    item.description,
    item.quantity.toString(),
    formatCurrency(item.rate, invoice.invoiceDetails.currency),
    formatCurrency(item.amount, invoice.invoiceDetails.currency)
  ]);

  (doc as any).autoTable({
    startY:tableStartY ,
    head: [["Sr.No", "Item", "Quantity", "Rate", "Amount"]],
    body: tableData,
    theme: "grid",
    // headStyles: { 
    //   fillColor: [242, 242, 242],
    //   textColor: [0, 0, 0],
    //   fontSize: 10
    // },
    headStyles: { fillColor: [51, 51, 51] },
    columnStyles: {
      0: { cellWidth: 20 },
      1: { cellWidth: "auto" },
      2: { cellWidth: 40, halign: "left" },
      3: { cellWidth: 40, halign: "left" },
      4: { cellWidth: 40, halign: "left" }
    },
    styles: {
      fontSize: 9,
      cellPadding: 2
    },
    alternateRowStyles: {
      fillColor: [250, 250, 250]
    }
  });

  // Totals and Notes Section
 const finalY = (doc as any).lastAutoTable.finalY + 20;
      
  // Fixed heights for sections
  const totalsHeight = 55; // Height for totals box
  // const notesHeight = invoiceData.notes ? 100 : 0; // Fixed height for notes
  const notesHeight = invoice.notes ? doc.getTextDimensions(invoice.notes).h : 0
  const termsHeight = invoice.terms ? doc.getTextDimensions(invoice.terms).h : 0
  // const termsHeight = invoice.terms ? 100 : 0; // Fixed height for terms
  const totalContentHeight = Math.max(totalsHeight, notesHeight + termsHeight);
  
  const pageHeight = doc.internal.pageSize.getHeight();
  const remainingSpace = pageHeight - finalY - 20; // 20px margin
  const totalsX = pageWidth - 80;

  // Check if we need a new page
  if (totalContentHeight > remainingSpace) {
    // Add new page for all sections
    doc.addPage();
    const newPageY = 20;
    
    // Draw totals on new page
    doc.setFillColor(250, 250, 250);
    doc.rect(totalsX - 5, newPageY - 5, 85-rightMargin, totalsHeight, "F");

    const totalsData = [
      { label: "Subtotal", value: formatCurrency(invoice.totals.subtotal, invoice.invoiceDetails.currency) },
      { label: "Discount", value: formatCurrency(invoice.totals.discount, invoice.invoiceDetails.currency) },
      { label: "Shipping", value: formatCurrency(invoice.totals.shipping, invoice.invoiceDetails.currency) },
      { label: "Tax", value: formatCurrency(invoice.totals.tax, invoice.invoiceDetails.currency) },
      { label: "Total", value: formatCurrency(invoice.totals.total, invoice.invoiceDetails.currency), bold: true },
      { label: "Amount Paid", value: formatCurrency(invoice.totals.amountPaid, invoice.invoiceDetails.currency) },
      { label: "Balance Due", value: formatCurrency(invoice.totals.balanceDue, invoice.invoiceDetails.currency), color: "#DC2626" }
    ];

    totalsData.forEach((total, index) => {
      doc.setFontSize(9);
      if (total.bold) {
        doc.setFont("helvetica", "bold");
      } else {
        doc.setFont("helvetica", "normal");
      }
      
      if (total.color) {
        doc.setTextColor(220, 38, 38);
      } else {
        doc.setTextColor(total.bold ? 0 : 128, total.bold ? 0 : 128, total.bold ? 0 : 128);
      }
      
      doc.text(total.label, totalsX, newPageY + (index * 10));
      doc.text(total.value, pageWidth - margin, newPageY + (index * 10), { align: "right" });
    });

    // Draw notes and terms
    if (invoice.notes || invoice.terms) {
      let contentY = newPageY;
      const maxWidth = totalsX - margin - 10;
      
      if (invoice.notes) {
        doc.setFontSize(10);
        doc.setTextColor(128, 128, 128);
        doc.text("Notes", margin, contentY);
        doc.setTextColor(0, 0, 0);
        
        const noteLines = doc.splitTextToSize(invoice.notes, maxWidth);
        doc.text(noteLines, margin, contentY + 7);
        contentY += 10 + (noteLines.length * 5);
        // contentY += notesHeight;
      }
      
      if (invoice.terms) {
        doc.setFontSize(10);
        doc.setTextColor(128, 128, 128);
        doc.text("Terms", margin, contentY + 5);
        doc.setTextColor(0, 0, 0);
        
        const termLines = doc.splitTextToSize(invoice.terms, maxWidth);
        doc.text(termLines, margin, contentY + 12);
      }
    }
  } else {
    // Draw everything on current page
    // Draw totals
    doc.setFillColor(250, 250, 250);
    doc.rect(totalsX - 5, finalY - 5, 85-rightMargin, totalsHeight, "F");

    const totalsData = [
      { label: "Subtotal", value: formatCurrency(invoice.totals.subtotal, invoice.invoiceDetails.currency) },
      { label: "Discount", value: formatCurrency(invoice.totals.discount, invoice.invoiceDetails.currency) },
      { label: "Shipping", value: formatCurrency(invoice.totals.shipping, invoice.invoiceDetails.currency) },
      { label: "Tax", value: formatCurrency(invoice.totals.tax, invoice.invoiceDetails.currency) },
      { label: "Total", value: formatCurrency(invoice.totals.total, invoice.invoiceDetails.currency), bold: true },
      { label: "Amount Paid", value: formatCurrency(invoice.totals.amountPaid, invoice.invoiceDetails.currency) },
      { label: "Balance Due", value: formatCurrency(invoice.totals.balanceDue, invoice.invoiceDetails.currency), color: "#DC2626" }
    ];

    totalsData.forEach((total, index) => {
      doc.setFontSize(9);
      if (total.bold) {
        doc.setFont("helvetica", "bold");
      } else {
        doc.setFont("helvetica", "normal");
      }
      
      if (total.color) {
        doc.setTextColor(220, 38, 38);
      } else {
        doc.setTextColor(total.bold ? 0 : 128, total.bold ? 0 : 128, total.bold ? 0 : 128);
      }
      
      doc.text(total.label, totalsX, finalY + (index * 10));
      doc.text(total.value, pageWidth - margin, finalY + (index * 10), { align: "right" });
    });

    // Draw notes and terms
    if (invoice.notes || invoice.terms) {
      let contentY = finalY;
      const maxWidth = totalsX - margin - 10;
      
      if (invoice.notes) {
        doc.setFontSize(10);
        doc.setTextColor(128, 128, 128);
        doc.text("Notes", margin, contentY);
        doc.setTextColor(0, 0, 0);
        
        const noteLines = doc.splitTextToSize(invoice.notes, maxWidth);
        doc.text(noteLines, margin, contentY + 7);
        // contentY += notesHeight;
        contentY += 10 + (noteLines.length * 5);
      }
      
      if (invoice.terms) {
        doc.setFontSize(10);
        doc.setTextColor(128, 128, 128);
        doc.text("Terms", margin, contentY + 5);
        doc.setTextColor(0, 0, 0);
        
        const termLines = doc.splitTextToSize(invoice.terms, maxWidth);
        doc.text(termLines, margin, contentY + 12);
      }
    }
  }

  return doc.output("blob");
}
