import { Modal } from '../../../components/ui/Modal';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import type { Quotation } from '../../../types/rfq';
import { Mail, Calendar, Package, DollarSign, Clock, Truck, Shield, CreditCard } from 'lucide-react';

interface QuotationDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    quotation: Quotation | null;
}

export const QuotationDetailsModal = ({ isOpen, onClose, quotation }: QuotationDetailsModalProps) => {
    if (!quotation) return null;

    const getStatusVariant = (status: string) => {
        switch (status.toLowerCase()) {
            case 'submitted': return 'default';
            case 'accepted': return 'success';
            case 'rejected': return 'danger';
            case 'shortlisted': return 'warning';
            case 'awarded': return 'success';
            default: return 'default';
        }
    };

    const formatDate = (dateString: string) => {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(new Date(dateString));
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`Quotation: ${quotation.quotation_number}`}
            className="max-w-4xl"
        >
            <div className="space-y-6">
                {/* Header Status */}
                <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                    <div>
                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Status</p>
                        <Badge variant={getStatusVariant(quotation.status) as any}>{quotation.status}</Badge>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Submitted At</p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-1 justify-end">
                            <Calendar className="w-3.5 h-3.5" />
                            {formatDate(quotation.submitted_at)}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Supplier Info */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2 border-b pb-2">
                            <Truck className="w-4 h-4 text-[#0f172a]" />
                            Supplier Information
                        </h3>
                        <div className="space-y-2">
                            <p className="text-lg font-black text-[#0f172a] leading-tight">{quotation.supplier.legal_name}</p>
                            <p className="text-sm text-gray-500">{quotation.supplier.trade_name}</p>
                            <div className="flex flex-col gap-1.5 mt-2">
                                {quotation.supplier.email && (
                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                        <Mail className="w-3.5 h-3.5" />
                                        {quotation.supplier.email}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Quotation Summary */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2 border-b pb-2">
                            <DollarSign className="w-4 h-4 text-success-500" />
                            Quotation Summary
                        </h3>
                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Total Amount</span>
                                <span className="text-xl font-black text-gray-900 dark:text-white">
                                    {quotation.total_amount} {quotation.currency}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-500">Min. Order Quantity</span>
                                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{quotation.minimum_order_quantity}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Logistics & Terms */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
                        <div className="flex items-center gap-2 mb-2">
                            <Clock className="w-4 h-4 text-orange-500" />
                            <span className="text-xs font-bold uppercase text-gray-400">Lead Time</span>
                        </div>
                        <p className="text-sm font-semibold">{quotation.lead_time_days} Days</p>
                    </div>
                    <div className="p-4 rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
                        <div className="flex items-center gap-2 mb-2">
                            <Truck className="w-4 h-4 text-blue-500" />
                            <span className="text-xs font-bold uppercase text-gray-400">Delivery</span>
                        </div>
                        <p className="text-sm font-semibold">{quotation.delivery_method}</p>
                    </div>
                    <div className="p-4 rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
                        <div className="flex items-center gap-2 mb-2">
                            <Shield className="w-4 h-4 text-green-500" />
                            <span className="text-xs font-bold uppercase text-gray-400">Availability</span>
                        </div>
                        <p className="text-sm font-semibold capitalize">{quotation.availability_status.replace('_', ' ')}</p>
                    </div>
                </div>

                {/* Financial Terms */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
                        <div className="flex items-center gap-2 mb-2">
                            <CreditCard className="w-4 h-4 text-purple-500" />
                            <span className="text-xs font-bold uppercase text-gray-400">Credit Terms</span>
                        </div>
                        <div className="flex items-center gap-2">
                            {quotation.credit_available === '1' ? (
                                <Badge variant="success" className="text-[10px]">Available</Badge>
                            ) : (
                                <Badge variant="default" className="text-[10px]">No Credit</Badge>
                            )}
                            {quotation.credit_available === '1' && (
                                <span className="text-sm font-medium">{quotation.credit_period_days} Days</span>
                            )}
                        </div>
                    </div>
                    <div className="p-4 rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
                        <div className="flex items-center gap-2 mb-2">
                            <Shield className="w-4 h-4 text-indigo-500" />
                            <span className="text-xs font-bold uppercase text-gray-400">Warranty</span>
                        </div>
                        <p className="text-sm font-medium">{quotation.warranty_details || 'N/A'}</p>
                    </div>
                </div>

                {/* Items Table */}
                <div className="space-y-2">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Package className="w-4 h-4 text-[#0f172a]" />
                        Quoted Items
                    </h3>
                    <div className="border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-sm">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-gray-800/50">
                                    <th className="px-4 py-3 text-xs font-bold uppercase text-gray-400">Product</th>
                                    <th className="px-4 py-3 text-xs font-bold uppercase text-gray-400 text-center">Qty</th>
                                    <th className="px-4 py-3 text-xs font-bold uppercase text-gray-400 text-right">Unit Price</th>
                                    <th className="px-4 py-3 text-xs font-bold uppercase text-gray-400 text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {quotation.items.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="text-sm font-bold text-gray-900 dark:text-white">{item.product.name}</div>
                                            <div className="text-[10px] text-gray-500 max-w-xs truncate">{item.product.description}</div>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-center font-medium">{item.quantity}</td>
                                        <td className="px-4 py-3 text-sm text-right font-mono">{parseFloat(item.unit_price).toFixed(2)}</td>
                                        <td className="px-4 py-3 text-sm text-right font-bold text-[#0f172a] font-mono">{parseFloat(item.total_price).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Additional Terms & Notes */}
                {(quotation.additional_terms || quotation.notes) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {quotation.additional_terms && (
                            <div className="p-4 rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50/50">
                                <span className="text-xs font-bold uppercase text-gray-400 block mb-2">Additional Terms</span>
                                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed italic">"{quotation.additional_terms}"</p>
                            </div>
                        )}
                        {quotation.notes && (
                            <div className="p-4 rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50/50">
                                <span className="text-xs font-bold uppercase text-gray-400 block mb-2">Supplier Notes</span>
                                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed italic">"{quotation.notes}"</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="flex justify-end p-4 border-t gap-3">
                <Button variant="outline" onClick={onClose}>Close</Button>
            </div>
        </Modal>
    );
};
