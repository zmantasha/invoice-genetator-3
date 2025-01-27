"use client";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Button } from "../ui/button";
import { Download } from "lucide-react";

interface PDFGeneratorProps {
  invoiceElementId: string;
  fileName: string;
}

export default function PDFGenerator({ invoiceElementId, fileName }: PDFGeneratorProps) {
  const generatePDF = async () => {
    const invoiceElement = document.querySelector(`#${invoiceElementId}`);
    if (!invoiceElement) {
      console.error("Invoice element not found.");
      return;
    }

    try {
const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 20;

  // Header Section with Logo and Invoice Number
  if (invoiceData.senderDetails.logo) {
    const maxWidth = 60;
    const maxHeight = 30;
  
    const logoBase64 = invoiceData.senderDetails.logo;
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
    pdf.setDrawColor(0); // Black border
    pdf.setLineWidth(0.5);
    pdf.roundedRect(margin, margin, width, height, 3, 3); // Rounded corners with radius 3
  
    // Add the image
    pdf.addImage(logoBase64, "JPEG", margin, margin, width, height);
  
    // Add sender name next to the logo
    pdf.setFontSize(12);
    pdf.text(
      invoiceData.senderDetails.name,
      margin + width + 10,
      margin + height / 2
    );
  } else {
    // If no logo, display the name in column format
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text(invoiceData.senderDetails.name, margin, margin + 10);
  
  
  }
  
  // pdf.setFontSize(12);
  // pdf.text(invoiceData.senderDetails.name, pageWidth - margin, margin + 10, { align: "left" });
  // Invoice Number (right-aligned)
  pdf.setFontSize(24);
  pdf.text(invoiceData.invoiceDetails.number, pageWidth - margin, margin + 10, { align: "right" });

  // Recipient and Invoice Details Grid (3 columns)
  const gridY = margin + 40;
  
  // Bill To Column
  if (invoiceData.recipientDetails.billTo.name) {
    pdf.setFontSize(10);
    pdf.setTextColor(128, 128, 128);
    pdf.text("Bill To", margin, gridY);
    pdf.setTextColor(0, 0, 0);
    pdf.text(invoiceData.recipientDetails.billTo.name, margin, gridY + 7);
  }

  // Ship To Column
  if (invoiceData.recipientDetails.shipTo.name) {
    const middleX = pageWidth / 2 - 20;
    pdf.setFontSize(10);
    pdf.setTextColor(128, 128, 128);
    pdf.text("Ship To", middleX, gridY);
    pdf.setTextColor(0, 0, 0);
    pdf.text(invoiceData.recipientDetails.shipTo.name, middleX, gridY + 7);
  }

  // Invoice Details Box (right column)
  const detailsX = pageWidth - 80;
  const rightMargin = 15;
  // Only include details that have values
  const detailsData = [
    invoiceData.invoiceDetails.date && {
      label: "Date",
      value: new Date(invoiceData.invoiceDetails.date).toLocaleDateString()
    },
    invoiceData.invoiceDetails.paymentTerms && {
      label: "Payment Terms",
      value: invoiceData.invoiceDetails.paymentTerms
    },
    invoiceData.invoiceDetails.dueDate && {
      label: "Due Date",
      value: new Date(invoiceData.invoiceDetails.dueDate).toLocaleDateString()
    },
    invoiceData.invoiceDetails.poNumber && {
      label: "PO Number",
      value: invoiceData.invoiceDetails.poNumber
    },
    invoiceData.totals.balanceDue && {
      label: "Balance",
      value: formatCurrency(invoiceData.totals.balanceDue, invoiceData.invoiceDetails.currency),
      color: "#DC2626"
    }
  ].filter(Boolean) as { label: string; value: string }[];

  if (detailsData.length > 0) {
    // Add gray background for details box
    pdf.setFillColor(250, 250, 250);
    pdf.rect(detailsX - 5, gridY - 5, 85-rightMargin, detailsData.length * 10 + 1, "F");

    detailsData.forEach((detail, index) => {
      pdf.setFontSize(8);
      pdf.setTextColor(128, 128, 128);
      pdf.text(detail.label, detailsX, gridY + (index * 10));
      pdf.setTextColor(0, 0, 0);
      pdf.text(detail.value, pageWidth - margin, gridY + (index * 10), { align: "right" });
    });
  }

  

  // Items Table
  // const tableY = gridY + 60;
  const tableStartY = Math.max(
    gridY + (detailsData.length > 0 ? detailsData.length * 10 + 10 : 10),
    gridY + 30 // Minimum spacing from grid
  );
  const tableData = invoiceData.items.map((item, index) => [
    (index + 1).toString(),
    item.description,
    item.quantity.toString(),
    formatCurrency(item.rate, invoiceData.invoiceDetails.currency),
    formatCurrency(item.amount, invoiceData.invoiceDetails.currency)
  ]);

  (pdf as any).autoTable({
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
  const finalY = (pdf as any).lastAutoTable.finalY + 20;
  
  // Calculate space needed for totals box
  const totalsHeight = 70; // Fixed height for totals box
  const totalsX = pageWidth - 80;
  
  // Notes and Terms (left column)
  if (invoiceData.notes || invoiceData.terms) {
    pdf.setFontSize(10);
    let notesY = finalY;
    const maxWidth = totalsX - margin - 10; // Maximum width for notes/terms
    
    if (invoiceData.notes) {
      pdf.setTextColor(128, 128, 128);
      pdf.text("Notes", margin, notesY);
      pdf.setTextColor(0, 0, 0);
      
      // Split notes into lines that fit within maxWidth
      const noteLines = pdf.splitTextToSize(invoiceData.notes, maxWidth);
      pdf.text(noteLines, margin, notesY + 7);
      notesY += 10 + (noteLines.length * 5); // Adjust Y position based on number of lines
    }
    
    if (invoiceData.terms) {
      pdf.setTextColor(128, 128, 128);
      pdf.text("Terms", margin, notesY + 5);
      pdf.setTextColor(0, 0, 0);
      
      // Split terms into lines that fit within maxWidth
      const termLines = pdf.splitTextToSize(invoiceData.terms, maxWidth);
      pdf.text(termLines, margin, notesY + 12);
    }
  }

  // Totals Box (right column)
  pdf.setFillColor(250, 250, 250);
  pdf.rect(totalsX - 5, finalY - 5, 85-rightMargin, totalsHeight, "F");

  const totalsData = [
    { label: "Subtotal", value: formatCurrency(invoiceData.totals.subtotal, invoiceData.invoiceDetails.currency) },
    { label: "Discount", value: formatCurrency(invoiceData.totals.discount, invoiceData.invoiceDetails.currency) },
    { label: "Shipping", value: formatCurrency(invoiceData.totals.shipping, invoiceData.invoiceDetails.currency) },
    { label: "Tax", value: formatCurrency(invoiceData.totals.tax, invoiceData.invoiceDetails.currency) },
    { label: "Total", value: formatCurrency(invoiceData.totals.total, invoiceData.invoiceDetails.currency), bold: true },
    { label: "Amount Paid", value: formatCurrency(invoiceData.totals.amountPaid, invoiceData.invoiceDetails.currency) },
    { label: "Balance Due", value: formatCurrency(invoiceData.totals.balanceDue, invoiceData.invoiceDetails.currency), color: "#DC2626" }
  ];

  totalsData.forEach((total, index) => {
    pdf.setFontSize(9);
    if (total.bold) {
      pdf.setFont("helvetica", "bold");
    } else {
      pdf.setFont("helvetica", "normal");
    }
    
    if (total.color) {
      pdf.setTextColor(220, 38, 38); // Red color for balance due
    } else {
      pdf.setTextColor(total.bold ? 0 : 128, total.bold ? 0 : 128, total.bold ? 0 : 128);
    }
    
    pdf.text(total.label, totalsX, finalY + (index * 10));
    pdf.text(total.value, pageWidth - margin, finalY + (index * 10), { align: "right" });
  });

  // Check if we need to add a new page for long notes/terms
  const currentY = pdf.internal.getCurrentPageInfo().pageNumber === 1 ? 
    finalY + Math.max(totalsHeight, (invoiceData.notes ? pdf.getTextDimensions(invoiceData.notes).h : 0) + (invoiceData.terms ? pdf.getTextDimensions(invoiceData.terms).h : 0) + 20) :
    pdf.internal.pageSize.height - 20;

  if (currentY > pdf.internal.pageSize.height - 20) {
    pdf.addPage();
    let newPageY = 20;
    
    if (invoiceData.notes) {
      pdf.setTextColor(128, 128, 128);
      pdf.text("Notes", margin, newPageY);
      pdf.setTextColor(0, 0, 0);
      const noteLines = pdf.splitTextToSize(invoiceData.notes, pageWidth - (2 * margin));
      pdf.text(noteLines, margin, newPageY + 7);
      newPageY += 10 + (noteLines.length * 5);
    }
    
    if (invoiceData.terms) {
      pdf.setTextColor(128, 128, 128);
      pdf.text("Terms", margin, newPageY + 5);
      pdf.setTextColor(0, 0, 0);
      const termLines = pdf.splitTextToSize(invoiceData.terms, pageWidth - (2 * margin));
      pdf.text(termLines, margin, newPageY + 12);
    }
  }

  pdf.save(`${fileName}.pdf`);
    } catch (error) {
          console.error("Error generating PDF:", error);
        }
      }
  return (
    <Button
      variant="outline"
      className="text-gray-600"
      onClick={generatePDF}
    >
      <Download className="w-4 h-4 mr-2" />
      Download
    </Button>
  );
}
    
 
