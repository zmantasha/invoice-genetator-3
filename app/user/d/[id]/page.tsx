"use client";
import { useParams, useRouter } from "next/navigation";
import styles from "./view.module.css";
import { FaFacebook, FaInstagram, FaShareSquare, FaTwitter, FaWhatsapp } from "react-icons/fa";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Button } from "../../../../components/ui/button";
import { BadgeInfo, BookMarked, Calendar, ChevronDown, Delete, Dot, Edit, User } from "lucide-react";
import InvoiceGenerator from "../../../../components/invoicee/invoiceGenerator";
import { Modal } from "../../../../components/ui/modal";
import { Input } from "../../../../components/ui/input";
import { MdEmail } from "react-icons/md";
import PDFGenerator from "../../../../components/invoicee/PDFGenerator";
import { useUser } from "../../../../hooks/UserContext";
// import SharePDFGenerator from "@/components/invoicee/SharePDFGenerator";
export default function ViewPage() {
  const { user } = useUser();
  const [invoiceItem, setInvoiceItem] = useState<any>(null); // Use 'any' if the invoiceItem structure is not defined yet
  const { id } = useParams();
  
  const router=useRouter()
  const [showDropdown, setShowDropdown] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
    const dropdownRef = useRef<HTMLDivElement | null>(null); 
  const fetchInvoice = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER}/api/v1/invoice/invoices/${id}`
      );
      const data = response.data;
      setInvoiceItem(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleOpenModal = () => {

      const generatedUrl = `${window.location.protocol}//${window.location.host}/share/${id}`; // Replace with the actual field in your invoice data
      setShareUrl(generatedUrl);
      setModalOpen(true);
  }; 



  const handleShare = (platform: string) => {
    // Make sure the URL is properly encoded and includes the protocol
    const message = `Check out this invoice: ${shareUrl}`;
    const encodedMessage = encodeURIComponent(message);
    const encodedUrl = encodeURIComponent(shareUrl);

    switch (platform) {
      case "whatsapp":
        window.open(`https://wa.me/?text=${encodedMessage}`, "_blank");
        break;
      case "email":
        window.location.href = `mailto:?subject=Invoice Share&body=${encodedMessage}`;
        break;
      case "twitter":
        window.open(`https://twitter.com/intent/tweet?text=${encodedMessage}`, "_blank");
        break;
      case "facebook":
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, "_blank");
        break;
      case "instagram":
        // Note: Instagram doesn't support direct sharing via URL
        break;
    }
  };

  
  

  useEffect(() => {
    if (id) {
      fetchInvoice();
    }
  }, [id]);

  const toggleDropdown = () => {
    setShowDropdown((prev) => (prev ? null : "dropdown"));
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
      setShowDropdown(null); // Close dropdown if clicked outside
    }
  };

  // Attach event listener when dropdown is open
  useEffect(() => {
    if (showDropdown) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showDropdown]);

  if (!invoiceItem) {
    return <div>Loading...</div>; // Display a loading message while data is being fetched
  }

  const handleEditInvoice=()=>{
    
     router.push(`/user/editInvoice/${id}`)
  }

 const handleStatusChange = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "Paid" ? "pending" : "Paid";
    
    // Calculate the total amount
    const total = invoiceItem.totals.total;
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER}/api/v1/invoice/invoices/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
          total,
          // When marking as paid, set amountPaid to total and balanceDue to 0
          amountPaid: newStatus === "Paid" ? total : 0,
          balanceDue: newStatus === "Paid" ? 0 : total,
        }),
      });
  
      if (response.ok) {
        // Update the invoice status locally
        setInvoiceItem((prevInvoice: any) => {
          if (!prevInvoice) return null;
          return {
            ...prevInvoice,
            status: newStatus,
            totals: {
              ...prevInvoice.totals,
              // Update the amounts based on the new status
              amountPaid: newStatus === "Paid" ? total : 0,
              balanceDue: newStatus === "Paid" ? 0 : total,
            },
          };
        });
      } else {
        console.error("Failed to update invoice status.");
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };


  return (
    <>
      <div className={styles.viewPage}>
        <div className={styles.viewContainer}>
          <div className={styles.viewCard}>
            {/* View Invoice Header */}
              <div className={styles.viewHeader}>
                {invoiceItem.invoiceDetails && (
                  <div className={styles.headerTop}>
                    <h1>{invoiceItem.invoiceDetails.number}</h1>
                    <p>
                      <span>
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(
                          invoiceItem.invoiceDetails.date
                        ).toLocaleDateString()}
                      </span>
                      {invoiceItem.status==="Paid" && <span className="text-blue-700 font-bold">
                    <Dot className="w-6 h-4 mr-1 font-bold text-blue-700" />
                        {invoiceItem.status}
                      </span>
                       }
                      <span>
                        <User className="w-4 h-4 mr-1" />
                        {invoiceItem.recipientDetails.billTo.name}
                      </span>
                    </p>
                  </div>
                )}
                <div className={styles.headerButtons}>
                <span className={styles.moreOptionDropdown}>
                {/* <Button onClick={handleOpenModal} className="bg-green-800 hover:bg-green-700">
                    Share
                  </Button> */}
                   <Button
                        variant="outline"
                        className="text-gray-600"
                        onClick={handleOpenModal}
                      // onClick={generateAndSharePDF}
                      >
                        <FaShareSquare className="w-4 h-4 mr-2" />
                        Share
                      </Button>
                   {/* <SharePDFGenerator
                    invoiceElementId="invoice"
                    fileName="Invoice_123"
                    onShare={handleShareUrl}
                    onClick={handleOpenModal}
                  /> */}
                       <PDFGenerator
                    invoiceData={invoiceItem}
                    fileName={invoiceItem?.invoiceDetails?.number || "invoice"}
                  />
                  
                  <Button variant="outline" className="text-gray-600 " onClick={toggleDropdown}>
                    More Options <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                 
                  {showDropdown &&  (
                      <div ref={dropdownRef} className={styles.dropdownMenu}> 
                        <div className={styles.dropdownContent} onClick={handleEditInvoice}>
                          <Edit className="w-4 h-4 mr-2"  />
                          edit</div>
                        <div className={styles.dropdownContent} onClick={() => handleStatusChange(invoiceItem._id, invoiceItem.status)}>
                        <BadgeInfo className="w-4 h-4 mr-2 text-green-700"    />
                        {invoiceItem.status==="Paid" ?"Mark as not Paid":"Mark as Paid"}</div>
                        <div
                          className={styles.dropdownContent}
                        >
                          <Delete className="w-4 h-4 mr-2 text-red-500" />
                          Delete
                        </div>
                      </div>)}
                </span>
              </div>
              </div>
              
            {/* View Invoice/ Main Section */}
            <hr />
            <div id="invoice">
              <InvoiceGenerator invoiceItem={invoiceItem} />
            </div>
          </div>
        </div>
      </div>

        {/* Share Modal */}
        <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <div>
          <h3 className="text-2xl text-green-900 font-bold mb-4">Share Invoice</h3>
          <p>Click the link below to view the invoice:</p>
          <div className="mt-4">
            <label className="text-xl font-semibold">Invoice URL: </label>
            <div className="flex items-center gap-2 mt-2">
              <Input
                type="text"
                value={shareUrl}
                readOnly
                className="border-black hover:border-input focus:border-input"
              />
              <Button
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(shareUrl);
                  alert("URL copied to clipboard!");
                }}
              >
                Copy
              </Button>
            </div>
            <a
              href={shareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline mt-2 inline-block"
            >
              Open invoice in new tab
            </a>
          </div>
          <div className="flex mt-6 mb-6 gap-4">
            <button
              onClick={() => handleShare("whatsapp")}
              className="hover:opacity-80 transition-opacity"
            >
              <FaWhatsapp className="text-green-500 text-4xl" />
            </button>
            <button
              onClick={() => handleShare("email")}
              className="hover:opacity-80 transition-opacity"
            >
              <MdEmail className="text-red-500 text-4xl" />
            </button>
            <button
              onClick={() => handleShare("twitter")}
              className="hover:opacity-80 transition-opacity"
            >
              <FaTwitter className="text-blue-500 text-4xl" />
            </button>
            <button
              onClick={() => handleShare("facebook")}
              className="hover:opacity-80 transition-opacity"
            >
              <FaFacebook className="text-blue-500 text-4xl" />
            </button>
            <button
              onClick={() => handleShare("instagram")}
              className="hover:opacity-80 transition-opacity"
            >
              <FaInstagram className="text-pink-500 text-4xl" />
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
