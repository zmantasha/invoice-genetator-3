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
      const canvas = await html2canvas(invoiceElement as HTMLElement,{
        useCORS: true, // Enable cross-origin for images
      allowTaint: false, // Prevent cross-origin issues
      logging: true, // Enable console logs for debugging
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${fileName}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };
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
