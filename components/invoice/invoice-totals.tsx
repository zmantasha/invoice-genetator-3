"use client";

import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import { Plus } from "lucide-react";
import { formatCurrency } from "../../lib/utils/format-currency";
import { useState } from "react";
import { RxCross2 } from "react-icons/rx";
import React, { memo, useCallback } from 'react';
interface InvoiceTotalsProps {
  totals: {
    subtotal: number;
    tax: number;
    taxRate: number;
    shipping: number;
    discount: number;
    discountType: string,
    shippingType: string,
    total: number;
    amountPaid: number;
    balanceDue: number;
  };
  currency: string;
  onUpdate: (totals: any) => void;
}

const InvoiceTotals = memo(({
  totals,
  currency,
  onUpdate,
}: InvoiceTotalsProps) =>{
  const [discountfield, setDiscountField] = useState(false);
  const [shippingfield, setShippingField] = useState(false);
  const handleDiscount = useCallback(() => {
    setDiscountField(true);
  }, []);

  const handleShipping = useCallback(() => {
    setShippingField(true);
  }, []);

  const handleCloseDiscount = useCallback(() => {
    setDiscountField(false);
    onUpdate({ ...totals, discount: 0 });
  }, [totals, onUpdate]);

  const handleCloseShipping = useCallback(() => {
    setShippingField(false);
    onUpdate({ ...totals, shipping: 0 });
  }, [totals, onUpdate]);
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-600">Subtotal</span>
        <span>{formatCurrency(totals.subtotal, currency)}</span>
      </div>

      <div className="flex items-center gap-2">
        <Input
          type="number"
          value={totals.taxRate}
          onChange={(e) =>
            onUpdate({ ...totals, taxRate: Number(e.target.value) })
          }
          className="w-20 text-right"
        />
        <span className="text-gray-600">% Tax</span>
        <span className="ml-auto">{formatCurrency(totals.tax, currency)}</span>
      </div>

      {/* discount and Shipping */}

      <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
        {/* <div className="flex items-center space-x-2">
          <Button variant="outline" className="text-green-600" onClick={handleDiscount}>
            <Plus className="w-4 h-4 mr-2" />
            Discount
          </Button>
          {discountfield?<Input type="number" placeholder="discount %"  onChange={(e) =>
            onUpdate({ ...totals, discount: Number(e.target.value) })
          } className="w-[120px] text-right" />:""}
        </div> */}
        <div className="flex items-center space-x-2">
        {discountfield? <RxCross2  onClick={handleCloseDiscount} className="cursor-pointer" />  :  ( <Button
            variant="outline"
            className="text-green-600"
            onClick={handleDiscount}
          >
            <Plus className="w-4 h-4 mr-2" />
            Discount
          </Button>
        )}
          {discountfield && (
            <Input
              type="number"
              placeholder="Discount % or Fixed"
              onChange={(e) =>
                onUpdate({
                  ...totals,
                  discount: Number(e.target.value),
                  discountType: "percentage", // Adjust as per your design
                })
              }
              className="w-[120px]"
            />
          )}
        </div>

        <div className="flex items-center space-x-2">
        {shippingfield? <RxCross2  onClick={handleCloseShipping} className="cursor-pointer" />  :  (<Button
            variant="outline"
            className="text-green-600"
            onClick={handleShipping}
          >
            <Plus className="w-4 h-4 mr-2" />
            Shipping
          </Button>)
               }
          {shippingfield && (
            <Input
              type="number"
              placeholder="Shipping % or Fixed"
              onChange={(e) =>
                onUpdate({
                  ...totals,
                  shipping: Number(e.target.value),
                  shippingType: "percentage", // Adjust as per your design
                })
              }
              className="w-[120px]"
            />
          )}
        </div>
      </div>

      <div className="pt-4 border-t">
        <div className="flex justify-between items-center font-medium">
          <span>Total</span>
          <span className="text-xl">
            {formatCurrency(totals.total, currency)}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label>Amount Paid</Label>
          <div className="flex items-center flex-1">
            <span className="text-gray-500">{currency}</span>
            <Input
              type="number"
              value={totals.amountPaid}
              onChange={(e) =>
                onUpdate({ ...totals, amountPaid: Number(e.target.value) })
              }
              className="flex-1 text-right"
            />
          </div>
        </div>

        <div className="flex justify-between items-center pt-2 border-t">
          <span className="font-medium">Balance Due</span>
          <span className="text-xl font-bold">
            {formatCurrency(totals.balanceDue, currency)}
          </span>
        </div>
      </div>
    </div>
  );
});

InvoiceTotals.displayName = 'InvoiceTotals';
export { InvoiceTotals };
