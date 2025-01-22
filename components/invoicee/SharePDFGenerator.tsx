"use client";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Button } from "../ui/button";
import { FaShareSquare } from "react-icons/fa";
import axios from "axios";

interface PDFGeneratorProps {
  invoiceElementId: string;
  fileName: string;
  onShare: (url: string) => void; // Callback to handle the generated link
  onClick: () => void; 
}

export default function SharePDFGenerator({ invoiceElementId, fileName,onClick, onShare }: PDFGeneratorProps) {
  const generateAndSharePDF = async () => {
    const invoiceElement = document.querySelector(`#${invoiceElementId}`);
    if (!invoiceElement) {
      console.error("Invoice element not found.");
      return;
    }

    try {
      // Step 1: Generate the PDF
      const canvas = await html2canvas(invoiceElement as HTMLElement, {
        useCORS: true,
        allowTaint: false,
        logging: true,
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      const pdfBlob = pdf.output("blob");

      // Step 2: Upload the PDF to your server or storage service
      const formData = new FormData();
      formData.append("file", pdfBlob, `${fileName}.pdf`);

      const uploadResponse = await axios.post("http://localhost:8002/api/v1/invoice/uploadInvoice", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (uploadResponse.data && uploadResponse.data.url) {
        const pdfUrl = uploadResponse.data.url;
        onShare(pdfUrl); // Pass the URL back for sharing
      } else {
        console.error("Failed to get URL from upload response.");
      }
    } catch (error) {
      console.error("Error generating or sharing PDF:", error);
    }
  };

  return (
    <Button
      variant="outline"
      className="text-gray-600"
      onClick={() => {
        onClick();
        generateAndSharePDF()}}
    // onClick={generateAndSharePDF}
    >
      <FaShareSquare className="w-4 h-4 mr-2" />
      Share PDF
    </Button>
  );
}
