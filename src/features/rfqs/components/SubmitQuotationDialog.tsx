import React, { useState, useEffect } from 'react';
import {
    ShieldCheck,
    Package,
    DollarSign,
    Loader2,
    CheckCircle2
} from 'lucide-react';
import { useSubmitQuotation } from '../hooks/useRFQ';
import { toast } from 'react-toastify';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Textarea } from '../../../components/ui/Textarea';
import { Modal } from '../../../components/ui/Modal';

import type { RFQ } from '../../../types/rfq';

interface ItemQuotation {
    product_id: string;
    name: string;
    required_qty: number;
    offered_qty: number;
    unit_price: number;
    discount: number;
    warranty_available: boolean;
    warranty_duration: string;
    warranty_details: string;
}

interface SubmitQuotationDialogProps {
    isOpen: boolean;
    onClose: () => void;
    rfq: RFQ | null;
    onSuccess: () => void;
}

export const SubmitQuotationDialog: React.FC<SubmitQuotationDialogProps> = ({
    isOpen,
    onClose,
    rfq,
    onSuccess
}) => {
    const submitMutation = useSubmitQuotation();

    // Form States
    const [moq, setMoq] = useState(10);
    const [leadTime, setLeadTime] = useState(7);
    const [proformaValidityDate, setProformaValidityDate] = useState('2026-03-15');
    const [deliveryMethod, setDeliveryMethod] = useState('Air');
    const [warranty, setWarranty] = useState('1 year warranty');
    const [creditAmount, setCreditAmount] = useState(200);
    const [creditAvailable, setCreditAvailable] = useState(true);
    const [creditPeriod, setCreditPeriod] = useState(30);
    const [availability, setAvailability] = useState('in_stock');
    const [terms, setTerms] = useState('Free installation');

    // Items state
    const [items, setItems] = useState<ItemQuotation[]>([]);

    useEffect(() => {
        if (rfq && rfq.products) {
            const initialItems = rfq.products.map(p => ({
                product_id: p.id,
                name: p.name,
                required_qty: Number(p.pivot.quantity),
                offered_qty: Number(p.pivot.quantity),
                unit_price: 0,
                discount: 0,
                warranty_available: true,
                warranty_duration: '2026-03-15',
                warranty_details: ''
            }));
            setItems(initialItems);
        }
    }, [rfq]);

    const handleItemChange = (index: number, field: keyof ItemQuotation, value: string | number | boolean) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };
        setItems(newItems);
    };

    const totalAmount = items.reduce((sum, item) => sum + (item.offered_qty * item.unit_price), 0);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Basic Validation
        if (items.some(item => item.unit_price <= 0)) {
            toast.error("Please provide a valid unit price for all items.");
            return;
        }

        const payload = {
            rfq_id: rfq?.id,
            minimum_order_quantity: moq,
            lead_time_days: leadTime,
            proforma_validity_date: proformaValidityDate,
            delivery_method: deliveryMethod,
            warranty_details: warranty,
            credit_amount: creditAmount,
            credit_available: creditAvailable,
            credit_period_days: creditAvailable ? creditPeriod : 0,
            availability_status: availability,
            additional_terms: terms,
            items: items.map(item => ({
                product_id: item.product_id,
                quantity: item.offered_qty,
                unit_price: item.unit_price,
                discount: item.discount,
                warranty_available: item.warranty_available,
                warranty_duration: item.warranty_duration,
                warranty_details: item.warranty_details
            }))
        };

        submitMutation.mutate(payload, {
            onSuccess: () => {
                toast.success("Quotation submitted successfully!");
                onSuccess();
                onClose();
            }
        });
    };

    const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
        event.target.select();
    };

    if (!rfq) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`Submit Quotation for ${rfq.reference_number}`}
            className="max-w-4xl"
        >
            <form onSubmit={handleSubmit} className="space-y-8">
                {/* General Terms Section */}
                <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 space-y-6">
                    <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4" />
                        Commercial Terms
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Input
                            label="Min. Order Qty"
                            type="number"
                            value={moq}
                            onChange={(e) => setMoq(Number(e.target.value))}
                            onFocus={handleFocus}
                            required
                        />
                        <Input
                            label="Lead Time (Days)"
                            type="number"
                            value={leadTime}
                            onChange={(e) => setLeadTime(Number(e.target.value))}
                            onFocus={handleFocus}
                            required
                        />
                        <Input
                            label="Validity Date"
                            type="date"
                            value={proformaValidityDate}
                            onChange={(e) => setProformaValidityDate(e.target.value)}
                            required
                        />
                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Delivery Method</label>
                            <select
                                value={deliveryMethod}
                                onChange={(e) => setDeliveryMethod(e.target.value)}
                                className="w-full h-10 px-3 rounded-md border border-gray-300 dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 text-sm"
                            >
                                <option value="Air">Air</option>
                                <option value="Sea">Sea</option>
                                <option value="Road">Road</option>
                                <option value="Courier">Courier</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Availability</label>
                            <select
                                value={availability}
                                onChange={(e) => setAvailability(e.target.value)}
                                className="w-full h-10 px-3 rounded-md border border-gray-300 dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 text-sm"
                            >
                                <option value="in_stock">In Stock</option>
                                <option value="on_order">On Order</option>
                                <option value="made_to_order">Made to Order</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Warranty (General)"
                            value={warranty}
                            onChange={(e) => setWarranty(e.target.value)}
                            placeholder="e.g. 1 year warranty"
                        />
                        <Input
                            label="Credit Amount"
                            type="number"
                            value={creditAmount}
                            onChange={(e) => setCreditAmount(Number(e.target.value))}
                            onFocus={handleFocus}
                        />
                        <div className="flex flex-col gap-1.5">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Credit Available</label>
                            <div className="flex h-10 p-1 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg w-fit shadow-inner">
                                <button
                                    type="button"
                                    onClick={() => setCreditAvailable(true)}
                                    className={`
                                        px-6 h-full rounded-md text-xs font-black transition-all duration-200 uppercase tracking-wider
                                        ${creditAvailable
                                            ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm'
                                            : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}
                                    `}
                                >
                                    YES
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setCreditAvailable(false)}
                                    className={`
                                        px-6 h-full rounded-md text-xs font-black transition-all duration-200 uppercase tracking-wider
                                        ${!creditAvailable
                                            ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                                            : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}
                                    `}
                                >
                                    NO
                                </button>
                            </div>
                        </div>

                        <div className="flex items-end gap-6 h-full">
                            {creditAvailable && (
                                <div className="flex-1">
                                    <Input
                                        label="Credit Period (Days)"
                                        type="number"
                                        value={creditPeriod}
                                        onChange={(e) => setCreditPeriod(Number(e.target.value))}
                                        onFocus={handleFocus}
                                        required
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <Textarea
                        label="Additional Terms"
                        value={terms}
                        onChange={(e) => setTerms(e.target.value)}
                        placeholder="Free installation, special conditions, etc."
                        rows={2}
                    />
                </div>

                {/* Items Table Section */}
                <div className="space-y-4">
                    <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 px-1">
                        <Package className="w-4 h-4" />
                        Quotation Items
                    </h3>
                    <div className="border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-sm">
                        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700">
                            <table className="w-full text-sm text-left min-w-[800px]">
                                <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-bold border-b border-gray-200 dark:border-gray-700">
                                    <tr>
                                        <th className="px-6 py-4">Product</th>
                                        <th className="px-6 py-4 text-center">Required</th>
                                        <th className="px-6 py-4 text-center">Offered</th>
                                        <th className="px-6 py-4">Unit Price</th>
                                        <th className="px-6 py-4">Discount</th>
                                        <th className="px-6 py-4">Item Warranty</th>
                                        <th className="px-6 py-4 text-right">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-gray-800">
                                    {items.map((item, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors">
                                            <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">
                                                {item.name}
                                            </td>
                                            <td className="px-6 py-4 text-center text-gray-500 font-mono">
                                                {item.required_qty}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <input
                                                    type="number"
                                                    value={item.offered_qty}
                                                    onChange={(e) => handleItemChange(idx, 'offered_qty', Number(e.target.value))}
                                                    onFocus={handleFocus}
                                                    className="w-20 mx-auto block text-center p-1.5 border border-gray-200 dark:border-gray-700 rounded-lg dark:bg-gray-900 text-sm font-bold focus:ring-2 focus:ring-primary-500 transition-all"
                                                />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="relative">
                                                    <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                    <input
                                                        type="number"
                                                        step="any"
                                                        value={item.unit_price}
                                                        onChange={(e) => handleItemChange(idx, 'unit_price', Number(e.target.value))}
                                                        onFocus={handleFocus}
                                                        className={`
                                                        w-32 pl-7 p-1.5 border rounded-lg dark:bg-gray-900 text-sm font-bold focus:ring-2 focus:ring-primary-500 transition-all
                                                        ${item.unit_price <= 0 ? 'border-red-300 ring-4 ring-red-500/10' : 'border-gray-200 dark:border-gray-700'}
                                                    `}
                                                        placeholder="0.00"
                                                    />
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <input
                                                    type="number"
                                                    value={item.discount}
                                                    onChange={(e) => handleItemChange(idx, 'discount', Number(e.target.value))}
                                                    onFocus={handleFocus}
                                                    className="w-20 p-1.5 border border-gray-200 dark:border-gray-700 rounded-lg dark:bg-gray-900 text-sm font-bold focus:ring-2 focus:ring-primary-500 transition-all"
                                                />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-2 min-w-[200px]">
                                                    <label className="flex items-center gap-2 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={item.warranty_available}
                                                            onChange={(e) => handleItemChange(idx, 'warranty_available', e.target.checked)}
                                                            className="w-4 h-4 rounded text-primary-600"
                                                        />
                                                        <span className="text-xs font-semibold">Warranty Available</span>
                                                    </label>
                                                    {item.warranty_available && (
                                                        <>
                                                            <input
                                                                type="date"
                                                                value={item.warranty_duration}
                                                                onChange={(e) => handleItemChange(idx, 'warranty_duration', e.target.value)}
                                                                className="w-full p-1.5 border border-gray-200 dark:border-gray-700 rounded-lg dark:bg-gray-900 text-xs focus:ring-1 focus:ring-primary-500"
                                                            />
                                                            <input
                                                                type="text"
                                                                value={item.warranty_details}
                                                                placeholder="Details"
                                                                onChange={(e) => handleItemChange(idx, 'warranty_details', e.target.value)}
                                                                className="w-full p-1.5 border border-gray-200 dark:border-gray-700 rounded-lg dark:bg-gray-900 text-xs focus:ring-1 focus:ring-primary-500"
                                                            />
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right font-black text-primary-600 dark:text-primary-400">
                                                ${(item.offered_qty * item.unit_price).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot className="bg-gray-50 dark:bg-gray-900/50">
                                    <tr>
                                        <td colSpan={6} className="px-6 py-4 text-right font-bold text-gray-500 uppercase tracking-widest text-xs">
                                            Grand Total Estimate
                                        </td>
                                        <td className="px-6 py-4 text-right text-xl font-black text-gray-900 dark:text-white">
                                            ${totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-4 pt-6 border-t border-gray-100 dark:border-gray-800">
                    <Button variant="ghost" onClick={onClose} disabled={submitMutation.isPending}>
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        className="px-8 shadow-xl shadow-primary-200 dark:shadow-none min-w-[160px]"
                        disabled={submitMutation.isPending}
                    >
                        {submitMutation.isPending ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Submitting...
                            </>
                        ) : (
                            <>
                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                Submit Quotation
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
