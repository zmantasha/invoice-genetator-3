import { useCallback, useEffect, useState, useMemo } from "react";
import { InvoiceData } from "../types/invoice";
import { generateInvoicePDF } from "../lib/utils/pdf-generator";
import { toast } from "react-toastify";
import {
  calculateSubtotal,
  calculateTax,
  calculateDiscount,
  calculateTotal,
  calculateShipping,
} from "../lib/utils/invoice-calculations";
import axios from "axios";
import { useUser } from "./UserContext";
import { useFormik } from 'formik';
import * as Yup from "yup";
import { useRouter } from "next/navigation";

const initialInvoiceData: Omit<InvoiceData, '_id'> = {
  userId: "",
  senderDetails: {
    logo: "",
    name: "",
    address: "",
  },
  recipientDetails: {
    billTo: {
      name: "",
      address: "",
    },
    shipTo: {
      name: "",
      address: "",
    },
  },
  invoiceDetails: {
    number: "",
    date: new Date().toISOString().split('T')[0],
    dueDate: "",
    paymentTerms: "",
    poNumber: "",
    currency: "",
  },
  items: [],
  totals: {
    subtotal: 0,
    tax: 0,
    taxRate: 0,
    shipping: 0,
    discount: 0,
    discountType: "percentage",
    shippingType: "percentage",
    total: 0,
    amountPaid: 0,
    balanceDue: 0,
  },
  notes: "",
  terms: "",
};



const cleanMongoFields = (data: any): any => {
  const cleaned = { ...data };
  delete cleaned._id;
  delete cleaned.__v;
  
  if (Array.isArray(cleaned.items)) {
    cleaned.items = cleaned.items.map((item: any) => {
      const cleanedItem = { ...item };
      delete cleanedItem._id;
      delete cleanedItem.__v;
      return cleanedItem;
    });
  }
  return cleaned;
};

export function useInvoice(initialData?: InvoiceData) {
  // const [serverErrorMessage, setServerErrorMessage] = useState('');
  // const [serverSuccessMessage, setServerSuccessMessage] = useState('');
  const { user } = useUser();
  const router = useRouter();
  

  // Modify initial values to use initialData if available
  const getInitialValues = useMemo(() => {
    if (!initialData) return initialInvoiceData;
    
    return {
      ...initialInvoiceData,
      ...initialData,
      invoiceDetails: {
        ...initialData.invoiceDetails,
        number: initialData.invoiceDetails.number,
        date: new Date(initialData.invoiceDetails.date).toISOString().split('T')[0],
        dueDate: new Date(initialData.invoiceDetails.dueDate).toISOString().split('T')[0]
      }
    };
  }, [initialData]);;

  const validationSchema =  useMemo(() =>Yup.object({
    senderDetails: Yup.object({
      name: Yup.string().required("Business name is required"),
      address: Yup.string().required("Business address is required"),
    }),
    recipientDetails: Yup.object({
      billTo: Yup.object({
        name: Yup.string().required("Recipient name is required"),
        address: Yup.string().required("Billing address is required"),
      }),
    }),
    invoiceDetails: Yup.object({
      number: Yup.string().required("Invoice number is required"),
      date: Yup.date().required("Invoice date is required"),
      dueDate: Yup.date().required("Due date is required"),
    }),
    items: Yup.array()
      .of(
        Yup.object({
          description: Yup.string().required("Item description is required"),
          quantity: Yup.number().min(1, "Quantity must be at least 1").required("Quantity is required"),
          rate: Yup.number().min(0, "Rate must be positive").required("Rate is required"),
        })
      )
  }), []);
  //  console.log("initial:",initialData)
  const formik = useFormik({
    initialValues: getInitialValues,
    validationSchema,
    enableReinitialize: true,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const isEditing = !!initialData;
        const url = isEditing 
          ? `${process.env.NEXT_PUBLIC_SERVER}/api/v1/invoice/invoices/${initialData._id}`
          : `${process.env.NEXT_PUBLIC_SERVER}/api/v1/invoice/invoices`;
        
        const method = isEditing ? 'put' : 'post';

        // Calculate final totals
        const calculatedTotals = {
          ...values.totals,
          subtotal: calculateSubtotal(values.items),
          tax: calculateTax(calculateSubtotal(values.items), values.totals.taxRate),
          discount: calculateDiscount(
            calculateSubtotal(values.items),
            values.totals.discount,
            values.totals.discountType
          ),
          shipping: calculateShipping(
            calculateSubtotal(values.items),
            values.totals.shipping,
            values.totals.shippingType
          ),
        };
        
        calculatedTotals.total = calculateTotal(
          calculatedTotals.subtotal,
          calculatedTotals.tax,
          calculatedTotals.discount,
          calculatedTotals.shipping
        );
 
        calculatedTotals.balanceDue = calculatedTotals.total - calculatedTotals.amountPaid;

        // Prepare the final values
        let finalValues = {
          ...values,
          userId: user?.user?._id,
          totals: calculatedTotals,
        };

        if (isEditing) {
          // For updates, ensure we keep the original invoice details
          finalValues = {
            ...finalValues,
            invoiceDetails: {
              ...finalValues.invoiceDetails,
              number: initialData.invoiceDetails.number,
              date: initialData.invoiceDetails.date,
              dueDate: initialData.invoiceDetails.dueDate,
            }
          };
        }

        // Clean MongoDB fields
        finalValues = cleanMongoFields(finalValues);

        const response = await axios[method](url, finalValues, { withCredentials: true });

        if (response.data) {
          toast.success(isEditing ? 'Invoice updated successfully' : 'Invoice saved successfully',{
            position:"bottom-right"
          });
          
          if (!isEditing) {
            resetForm();
            await generateInvoiceNumber();
          }
          router.push("/user/myinvoice");
        }
      } catch (error) {
        console.error("Operation failed:", error);
       toast.error(
          axios.isAxiosError(error)
            ? error.response?.data?.message || error.message
            : 'Something went wrong. Please try again.',{
              position:"bottom-right"
            }
        );
        // setTimeout(() => setServerErrorMessage(''), 5000);
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    // Only generate invoice number for new invoices
    if (user?.user._id && !initialData) {
      generateInvoiceNumber();
    }
  }, [user, initialData]);

  const generateInvoiceNumber = useCallback(async () => {
    if (!user?.user._id) return;

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER}/api/v1/invoice/invoices/userId/${user.user._id}`
      );
      const invoices = response.data;
      let newInvoiceNumber = "INV-0001";
      
      if (invoices?.length > 0) {
        const latestInvoice = invoices[invoices.length - 1];
        if (latestInvoice.invoiceDetails?.number) {
          const lastNumber = parseInt(
            latestInvoice.invoiceDetails.number.replace("INV-", ""),
            10
          );
          newInvoiceNumber = `INV-${String(lastNumber + 1).padStart(4, "0")}`;
        }
      }

      formik.setFieldValue("invoiceDetails.number", newInvoiceNumber);
      formik.setFieldValue("senderDetails.name", user.user.firstName || "");
      formik.setFieldValue("senderDetails.address", user.user.address || "");
      formik.setFieldValue("senderDetails.logo", user.user.logo || "");
    } catch (error) {
      console.error("Error fetching invoices:", error);
    }
  }, [user?.user._id, formik.setFieldValue]);

  const generatePDF = useCallback(async () => {
    try {
      const invoiceDataWithId = {
        ...formik.values,
        _id: initialData?._id || 'dummy-id', // Add a dummy or real _id here
      };
      const pdfBlob = await generateInvoicePDF(invoiceDataWithId);
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${formik.values.invoiceDetails.number || 'draft'}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  }, [formik.values, initialData]);
  

  // Update functions that work with formik
  const updateSenderDetails = useCallback((details: typeof initialInvoiceData.senderDetails) => {
    formik.setFieldValue("senderDetails", details);
  }, [formik.setFieldValue]);

  const updateRecipientDetails = useCallback((details: typeof initialInvoiceData.recipientDetails) => {
    formik.setFieldValue("recipientDetails", details);
  }, [formik.setFieldValue]);

  const updateInvoiceDetails = useCallback((details: typeof initialInvoiceData.invoiceDetails) => {
    formik.setFieldValue("invoiceDetails", details);
  }, [formik.setFieldValue]);

  const updateItems = useCallback((items: typeof initialInvoiceData.items) => {
    formik.setFieldValue("items", items);
    
    // Recalculate totals
    const subtotal = calculateSubtotal(items);
    const tax = calculateTax(subtotal, formik.values.totals.taxRate);
    const discount = calculateDiscount(
      subtotal,
      formik.values.totals.discount,
      formik.values.totals.discountType
    );
    const shipping = calculateShipping(
      subtotal,
      formik.values.totals.shipping,
      formik.values.totals.shippingType
    );
    const total = calculateTotal(subtotal, tax, discount, shipping);
    const balanceDue = total - formik.values.totals.amountPaid;
// console.log(balanceDue)
    formik.setFieldValue("totals", {
      ...formik.values.totals,
      subtotal,
      tax,
      total,
      balanceDue,
    });
  }, [formik.setFieldValue, formik.values.totals]);

  const updateTotals = (totals: typeof initialInvoiceData.totals) => {
    // Recalculate subtotal, tax, discount, and shipping based on the items
    const subtotal = calculateSubtotal(formik.values.items);
    const tax = calculateTax(subtotal, totals.taxRate);
    const discount = calculateDiscount(subtotal, totals.discount, totals.discountType);
    const shipping = calculateShipping(subtotal, totals.shipping, totals.shippingType);
    
    // Keep the total as the calculated value, don't modify it based on the amountPaid
    const total = calculateTotal(subtotal, tax, discount, shipping);
  
    // Only update the balance due, subtracting the amount paid from the total
    const balanceDue = total - totals.amountPaid;
  
    // Update formik with the new totals
    formik.setFieldValue("totals", {
      ...totals,
      subtotal,
      tax,
      total,  // Keep total unchanged
      balanceDue,  // Update balance due
    });
  };
  

  const updateNotes = (notes: string) => {
    formik.setFieldValue("notes", notes);
  };

  const updateTerms = (terms: string) => {
    formik.setFieldValue("terms", terms);
  };

  const saveInvoice = () => {
    formik.handleSubmit();
  };

  return {
    invoiceData: formik.values,
    updateSenderDetails,
    updateRecipientDetails,
    updateInvoiceDetails,
    updateItems,
    updateTotals,
    updateNotes,
    updateTerms,
    generatePDF,
    saveInvoice,
    formErrors: formik.errors,
    formTouched: formik.touched,
    formik,
  };
}



