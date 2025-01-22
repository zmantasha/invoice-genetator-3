import { formatCurrency } from "../../lib/utils/format-currency";

interface InvoiceItem {
    senderDetails: { name: string;
      logo:string; 
    };
    invoiceDetails: {
      number: string;
      date: string;
      paymentTerms?: string;
      dueDate?: string;
      poNumber?: string;
      currency: string;
    };
    recipientDetails: {
      billTo: { name: string };
      shipTo: { name: string };
    };
    userId:{
      logo:string;
    };
    items: { id: string; description: string; quantity: number; rate: number; amount: number }[];
    totals: {
      balanceDue: number;
      subtotal: number;
      discount: number;
      shipping: number;
      tax: number;
      total: number;
      amountPaid: number;
    };
    notes?: string;
    terms?: string;
  }
  
  export default function InvoiceGenerator({ invoiceItem }: { invoiceItem: InvoiceItem }){
    return (
        <>
        <div className="p-7">
              {/* Add other invoice details dynamically here */}
              {/* For example, you can display items, totals, etc. */}
              {/* <p>Invoice details will go here</p> */}
              <div className="flex items-center justify-between ">
                <div >
                  
                {/* {invoiceItem.userId.logo && <img src={invoiceItem.userId.logo ||"profile"} alt="Profile"  className="w-32 h-15 object-cover rounded-sm"/>} */}
                {invoiceItem.senderDetails.logo && <img src={invoiceItem.senderDetails.logo ||"profile"} alt="Profile"  className="w-32 h-15 object-cover rounded-sm"/>}
                <p className="text-gray-900">
                  {invoiceItem.senderDetails.name}
                </p>
                </div>
                
                <h1 className="text-4xl">
                  {invoiceItem.invoiceDetails.number}
                </h1>
              </div>
              <div className="flex items-center justify-between mt-5">
                {invoiceItem.recipientDetails.billTo.name && (
                  <div>
                    <p className="text-gray-600">Bill To</p>
                    <p>{invoiceItem.recipientDetails.billTo.name}</p>
                  </div>
                )}
                {invoiceItem.recipientDetails.shipTo.name && (
                  <div>
                    <p className="text-gray-600">Ship To</p>
                    <p>{invoiceItem.recipientDetails.shipTo.name}</p>
                  </div>
                )}
                <div className="w-1/3 p-5  shadow-sm">
                  {invoiceItem.invoiceDetails.date && (
                    <div className="flex justify-between py-2">
                      <p className="text-gray-600">Date</p>
                      <p>
                        {new Date(
                          invoiceItem.invoiceDetails.date
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                  {invoiceItem.invoiceDetails.paymentTerms && (
                    <div className="flex justify-between py-2">
                      <p className="text-gray-600">Payment Terms</p>
                      <p>{invoiceItem.invoiceDetails.paymentTerms}</p>
                    </div>
                  )}
                  {invoiceItem.invoiceDetails.dueDate && (
                    <div className="flex justify-between py-2">
                      <p className="text-gray-600">Due Date</p>
                      <p>
                        {new Date(
                          invoiceItem.invoiceDetails.dueDate
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                  {invoiceItem.invoiceDetails.poNumber && (
                    <div className="flex justify-between py-2">
                      <p className="text-gray-600">PO Number</p>
                      <p>{invoiceItem.invoiceDetails.poNumber}</p>
                    </div>
                  )}
                  <div className="flex justify-between py-2 bg-gray-50 hover:bg-gray-200 px-1 rounded-sm">
                    <p className="text-gray-950">Balance</p>
                    <p>
                      {formatCurrency(
                        Number(invoiceItem.totals.balanceDue.toFixed(2)),
                        invoiceItem.invoiceDetails.currency
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* table section */}
              {/* Table Section */}
              <div className="mt-10 overflow-x-auto">
                <table className="min-w-full border-collapse border border-gray-900">
                  <thead>
                    <tr className="bg-gray-400">
                      <th className="border border-gray-300 px-4 py-2 text-left">
                        Sr.No
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-left">
                        Item
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-right">
                        Quantity
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-right">
                        Rate
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-right">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoiceItem?.items &&
                      invoiceItem?.items?.map((item, index) => (
                        <tr
                          key={item.id}
                          className="odd:bg-white even:bg-gray-50"
                        >
                          <td className="border border-gray-300 px-4 py-2">
                            {index + 1}
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            {item.description}
                          </td>
                          <td className="border border-gray-300 px-4 py-2 text-right">
                            {item.quantity}
                          </td>
                          <td className="border border-gray-300 px-4 py-2 text-right">
                            {formatCurrency(
                              item.rate,
                              invoiceItem.invoiceDetails.currency
                            )}
                          </td>
                          <td className="border border-gray-300 px-4 py-2 text-right">
                            {formatCurrency(
                              item.amount,
                              invoiceItem.invoiceDetails.currency
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              {/* total balance */}

              {/* Add subtotal, discount, tax, total, and amount paid */}
              <div className="mt-10 flex justify-between">
                {/* Notes and Terms Section */}
                <div className="w-1/2 pr-5">
                  {invoiceItem.notes && (
                    <div className="mb-4">
                      <p className="text-gray-600 font-bold">Notes</p>
                      <p className="text-gray-800">
                        {invoiceItem.notes}
                      </p>
                    </div>
                  )}
                  {invoiceItem.terms && (
                    <div>
                      <p className="text-gray-600 font-bold">Terms</p>
                      <p className="text-gray-800">
                        {invoiceItem.terms}
                      </p>
                    </div>
                  )}
                </div>

                {/* Summary Section */}
                <div className="w-1/3 bg-gray-50 p-5 rounded shadow-sm">
                  <div className="flex justify-between py-2">
                    <p className="text-gray-600">Subtotal</p>
                    <p>
                      {formatCurrency(
                        invoiceItem.totals.subtotal,
                        invoiceItem.invoiceDetails.currency
                      )}
                    </p>
                  </div>
                  <div className="flex justify-between py-2">
                    <p className="text-gray-600">
                      Discount ({invoiceItem.totals.discount*100/invoiceItem.totals.subtotal}%)
                    </p>
                    <p>
                      {formatCurrency(
                        invoiceItem.totals.discount,
                        invoiceItem.invoiceDetails.currency
                      )}
                    </p>
                  </div>
                  <div className="flex justify-between py-2">
                    <p className="text-gray-600">
                      Shipping ({invoiceItem.totals.subtotal/invoiceItem.totals.shipping}%)
                    </p>
                    <p>
                      {formatCurrency(
                        invoiceItem.totals.shipping,
                        invoiceItem.invoiceDetails.currency
                      )}
                    </p>
                  </div>
                  <div className="flex justify-between py-2">
                    <p className="text-gray-600">
                      Tax ({(invoiceItem.totals.tax*100)/invoiceItem.totals.subtotal}%)
                    </p>
                    <p>
                      {formatCurrency(
                        invoiceItem.totals.tax,
                        invoiceItem.invoiceDetails.currency
                      )}
                    </p>
                  </div>
                  <hr className="my-2" />
                  <div className="flex justify-between font-bold text-gray-800 py-2">
                    <p>Total</p>
                    <p>
                      {formatCurrency(
                        invoiceItem.totals.total,
                        invoiceItem.invoiceDetails.currency
                      )}
                    </p>
                  </div>
                  <div className="flex justify-between py-2">
                    <p className="text-gray-600">Amount Paid</p>
                    <p>
                      {formatCurrency(
                        invoiceItem.totals.amountPaid,
                        invoiceItem.invoiceDetails.currency
                      )}
                    </p>
                  </div>
                  <hr className="my-2" />
                  <div className="flex justify-between font-bold text-red-600 py-2">
                    <p>Balance Due</p>
                    <p>
                      {formatCurrency(
                        invoiceItem.totals.balanceDue,
                        invoiceItem.invoiceDetails.currency
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
        </>
    )
}