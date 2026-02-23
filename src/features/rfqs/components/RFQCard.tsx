import { Calendar, MapPin } from 'lucide-react';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';

import type { RFQ } from '../../../types/rfq';

interface RFQCardProps {
    rfq: RFQ;
    onViewDetails: (rfq: RFQ) => void;
    onSubmitQuotation: (rfq: RFQ) => void;
}

export const RFQCard = ({ rfq, onViewDetails, onSubmitQuotation }: RFQCardProps) => {
    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
        } catch {
            return dateString;
        }
    };

    const getStatusColorClass = (status: string) => {
        switch (status.toLowerCase()) {
            case 'published': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
            case 'submitted': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
            case 'awarded': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
            default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
        }
    };

    return (
        <div className="group relative bg-white dark:bg-gray-900/50 backdrop-blur-xl border border-gray-200 dark:border-gray-800 rounded-3xl p-6 transition-all duration-300 hover:shadow-[20px_20px_60px_#bebebe,-20px_-20px_60px_#ffffff] dark:hover:shadow-none dark:hover:border-primary-500/50 flex flex-col h-full shadow-sm">
            {/* Card Header */}
            <div className="flex justify-between items-start mb-4">
                <div className="space-y-1">
                    <h3 className="text-[17px] font-bold text-gray-900 dark:text-white tracking-tight group-hover:text-primary-600 transition-colors">
                        {rfq.reference_number}
                    </h3>
                    <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Created {formatDate(rfq.created_at)}
                    </p>
                </div>
                <Badge className={`${getStatusColorClass(rfq.status)} border-none px-3 py-1 rounded-xl font-semibold uppercase tracking-tighter text-[10px]`}>
                    {rfq.status}
                </Badge>
            </div>

            {/* Info Section */}
            <div className="space-y-3 mb-4">
                <div className="bg-gray-50/50 dark:bg-gray-800/30 p-3 rounded-2xl border border-gray-100 dark:border-gray-700/50">
                    <p className="text-sm font-normal text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed italic">
                        "{rfq.description || 'No description provided'}"
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Deadline</label>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                            {formatDate(rfq.submission_deadline)}
                        </p>
                    </div>
                    <div className="space-y-1 text-right">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Location</label>
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center justify-end gap-1">
                            <MapPin className="w-3 h-3 text-primary-500" />
                            {rfq.delivery_location}
                        </p>
                    </div>
                </div>
            </div>

            {/* Embedded Table */}
            <div className="flex-1 overflow-hidden mb-4">
                <div className="bg-gray-50 dark:bg-gray-950/40 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col">
                    <div className="bg-gray-100/50 dark:bg-gray-800/50 flex text-gray-400 font-bold uppercase tracking-widest border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10 text-[10px]">
                        <div className="px-4 py-2 flex-1">Product</div>
                        <div className="px-4 py-2 w-16 text-right">Qty</div>
                    </div>

                    <div className="max-h-40 overflow-y-auto custom-scrollbar">
                        <table className="w-full text-left text-[12px]">
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {rfq.products?.map((product, idx) => (
                                    <tr key={idx} final-idx={idx} className="hover:bg-white/50 dark:hover:bg-white/5 transition-colors">
                                        <td className="px-4 py-2 font-semibold text-gray-700 dark:text-gray-300 truncate max-w-[120px]">
                                            {product.name}
                                        </td>
                                        <td className="px-4 py-2 text-right font-bold text-primary-600 dark:text-primary-400 w-16">
                                            {product.pivot.quantity}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {(!rfq.products || rfq.products.length === 0) && (
                            <div className="px-4 py-6 text-center text-gray-400 text-xs italic">
                                No products found
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex flex-col gap-3">
                {rfq.pivot?.status === 'submitted' && (
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-[17px] font-bold text-success-600">Total: ${Number(rfq.pivot.total_amount).toLocaleString(undefined, { minimumFractionDigits: 2 })} {rfq.pivot.currency}</span>
                    </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                    <Button
                        variant="secondary"
                        size="sm"
                        className="rounded-2xl font-semibold text-xs border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all active:scale-95"
                        onClick={() => onViewDetails(rfq)}
                    >
                        Details
                    </Button>
                    <Button
                        variant="primary"
                        size="sm"
                        className="rounded-2xl font-semibold text-xs shadow-lg shadow-primary-500/20 hover:shadow-primary-500/40 transition-all active:scale-95 bg-gradient-to-br from-primary-600 to-primary-700 border-none disabled:opacity-50 disabled:grayscale disabled:pointer-events-none"
                        onClick={() => onSubmitQuotation(rfq)}
                        disabled={rfq.pivot?.status === 'submitted'}
                    >
                        Submit Quote
                    </Button>
                </div>
            </div>
        </div>
    );
};
