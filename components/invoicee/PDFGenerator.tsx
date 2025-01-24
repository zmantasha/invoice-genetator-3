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
      const canvas = await html2canvas(invoiceElement as HTMLElement, {
        useCORS: true, // Enable cross-origin for images
        allowTaint: false, // Prevent cross-origin issues
        logging: true, // Enable console logs for debugging
        scale: 2, // Higher resolution canvas
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const marginBottom = 10; // Margin at the bottom of each page in mm
      const marginTop = 10; // Margin at the top of each page in mm

      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;

      const imgHeightRatio = pdfWidth / canvasWidth;
      const availablePdfHeight = pdfHeight - marginBottom - marginTop; // Adjust available height for margins

      let currentHeight = 0;

      while (currentHeight < canvasHeight) {
        const sourceY = currentHeight;
        const sectionHeight = Math.min(availablePdfHeight / imgHeightRatio, canvasHeight - currentHeight);

        const sectionCanvas = document.createElement("canvas");
        sectionCanvas.width = canvasWidth;
        sectionCanvas.height = sectionHeight;
        const sectionContext = sectionCanvas.getContext("2d");

        if (sectionContext) {
          sectionContext.drawImage(
            canvas,
            0,
            sourceY,
            canvasWidth,
            sectionHeight,
            0,
            0,
            canvasWidth,
            sectionHeight
          );
        }

        const sectionImgData = sectionCanvas.toDataURL("image/png");

        if (currentHeight > 0) {
          pdf.addPage();
        }

        const yOffset = currentHeight > 0 ? marginTop : 0; // Add top margin for all pages
        pdf.addImage(sectionImgData, "PNG", 0, yOffset, pdfWidth, sectionHeight * imgHeightRatio);

        currentHeight += sectionHeight;
      }

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
