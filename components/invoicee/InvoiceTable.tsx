"use client";

import { useEffect, useRef, useState } from "react";
import styles from "../../app/user/myinvoice/myinvoice.module.css";
import { FcPaid } from "react-icons/fc";
import {MdDelete,MdEdit } from "react-icons/md";
import { formatCurrency } from "../../lib/utils/format-currency";
import { useRouter } from "next/navigation";


interface InvoiceItem {
  _id: string;
  invoiceDetails: {
    number: string;
    date: string;
    dueDate: string;
    currency:string;
  };
  recipientDetails: {
    billTo: {
      name: string;
    };
  };
  totals: {
    total: number;
  };
  status: string;
}

interface InvoiceTableProps {
  invoiceItem: InvoiceItem[];
  handleNavigation: (path: string) => void;
  handleDelete: (id: string) => void;
}

export default function InvoiceTable({
  invoiceItem,
  handleNavigation,
  handleDelete,
}: InvoiceTableProps) {
  const headers = [
    "customer",
    "reference",
    "date",
    "due date",
    "status",
    "total",
    "Action",
  ];
  const [invoices, setInvoices] = useState<InvoiceItem[]>(invoiceItem);
  const [showDropdown, setShowDropdown] = useState<string | null>(null);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const router=useRouter()
   // Use ref to detect clicks outside of the dropdown
   const dropdownRef = useRef<HTMLDivElement | null>(null);
  const toggleDropdown = (id: string) => {
    setShowDropdown((prevId) => (prevId === id ? null : id));
  };

  const confirmDelete = () => {
    if (deleteItemId) {
      handleDelete(deleteItemId);
      setDeleteItemId(null); // Reset after deletion
    }
  };

  const handleCancelDelete = () => {
    setDeleteItemId(null); // Cancel deletion
  };

  const handleEditInvoice=(id:string)=>{
    router.push(`/user/editInvoice/${id}`)
  }

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

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showDropdown]);

  const handleStatusChange = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "Paid" ? "pending" : "Paid";

    try {
        const response = await fetch(`http://localhost:8002/api/v1/invoice/invoices/${id}/status`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ status: newStatus }),
        });

        if (response.ok) {
            // Update the local state to reflect the new status
            setInvoices((prevInvoices) =>
                prevInvoices.map((invoice) =>
                    invoice._id === id ? { ...invoice, status: newStatus } : invoice
                )
            );
        } else {
            console.error("Failed to update invoice status.");
        }
    } catch (error) {
        console.error("Error updating status:", error);
    }
};


  return (
    <>
      <div className={styles.tableContainer}>
        <table className={styles.invoiceTable}>
          <thead>
            <tr>
              {headers.map((item, i) => (
                <th key={i}>{item}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {invoices.map((item) => (
              <tr key={item._id}>
                <td>{item?.recipientDetails.billTo.name}</td>
                <td>{item.invoiceDetails.number}</td>
                <td>
                  {new Date(item.invoiceDetails.date).toLocaleDateString()}
                </td>
                <td>
                  {new Date(item.invoiceDetails.dueDate).toLocaleDateString()}
                </td>
                <td>{item.status || "Pending"}</td>
                {/* <td>{item.invoiceDetails.currency}{item.totals.total.toFixed(2)}</td>
                 */}
                 <td>{formatCurrency(Number(item.totals.total.toFixed(2)), item.invoiceDetails.currency)}</td>
                <td>
                  <div className={styles.invoicedropdown}>
                    <button
                      className={styles.viewButton}
                      onClick={() => handleNavigation(`/user/d/${item._id}`)}
                    >
                      View
                    </button>
                    <div
                      className={styles.dropdownbutton}
                      onClick={() => toggleDropdown(item._id)}
                    ></div>
                    {showDropdown === item._id && (
                      <div ref={dropdownRef} className={styles.dropdownMenu}>
                        {/* <div className={styles.dropdownContent}>
                          <MdDownloadForOffline size={20}/>
                          Download</div> */}
                        
                        <div className={styles.dropdownContent} onClick={()=>handleEditInvoice(item._id)}>
                          <MdEdit size={20}/>
                          edit</div>
                          <div
                            className={styles.dropdownContent}
                            onClick={() => handleStatusChange(item._id, item.status)}
                        >
                            <FcPaid size={20} />
                            {item.status === "Paid" ? "Mark as Not Paid" : "Mark as Paid"}
                        </div>

                        <div
                          onClick={() => setDeleteItemId(item._id)}
                          className={styles.dropdownContent}
                        >
                          <MdDelete color="#e65050" size={20}/>
                          Delete
                        </div>
                      </div>
                    )}

                    {deleteItemId === item._id && (
                      <div className={styles.popupOverlay}>
                        <div className={styles.popup}>
                          <h3>
                            Are you sure you want to delete  {item?.recipientDetails.billTo.name} invoice?
                          </h3>
                          <div className={styles.popupButtons}>
                            <button
                              className={styles.confirmButton}
                              onClick={confirmDelete}
                            >
                              Confirm
                            </button>
                            <button
                              className={styles.cancelButton}
                              onClick={handleCancelDelete}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
