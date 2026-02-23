import { X, Info } from 'lucide-react';
import { RFQDetails } from './RFQDetails';
import { Button } from '../../../components/ui/Button';
import type { RFQ } from '../../../types/rfq';

interface RFQDetailsDialogProps {
    isOpen: boolean;
    onClose: () => void;
    rfq: RFQ | null;
}

export const RFQDetailsDialog = ({ isOpen, onClose, rfq }: RFQDetailsDialogProps) => {
    if (!isOpen || !rfq) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div
                className="bg-white dark:bg-gray-900 w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800 flex flex-col animate-in zoom-in-95 duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/50">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center">
                            <Info className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">RFQ Details</h2>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{rfq.reference_number}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Modal Content */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    <RFQDetails rfq={rfq} />
                </div>

                {/* Modal Footer */}
                <div className="px-8 py-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 flex justify-end gap-3">
                    <Button
                        variant="secondary"
                        className="rounded-2xl px-8 font-bold border-gray-200 dark:border-gray-700"
                        onClick={onClose}
                    >
                        Close
                    </Button>
                </div>
            </div>
        </div>
    );
};
