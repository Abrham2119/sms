import React from 'react';
import type { Step1FormData, RFQProductFormData } from '../../../utils/rfqSchemas';
import type { Product } from '../../../types';

interface Step3ReviewPublishProps {
    generalInfo: Step1FormData;
    rfqProducts: RFQProductFormData[];
    allProducts: Product[];
    referenceNumber: string;
    onPublish: () => Promise<void>;
    onBack: () => void;
    isLoading: boolean;
    isViewOnly?: boolean;
}

export const Step3ReviewPublish: React.FC<Step3ReviewPublishProps> = ({
    generalInfo,
    rfqProducts,
    allProducts,
    referenceNumber,
    onPublish,
    onBack,
    isLoading,
    isViewOnly
}) => {
    const getProductName = (id: string) => {
        return allProducts.find(p => p.id === id)?.name || 'Unknown Product';
    };

    return (
        <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">RFQ Summary</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                    <div>
                        <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Reference Number</span>
                        <span className="text-sm font-medium text-primary-700 bg-primary-50 px-2 py-0.5 rounded italic">{referenceNumber || 'DRAFT'}</span>
                    </div>
                    <div>
                        <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Submission Deadline</span>
                        <span className="text-sm text-gray-800">{generalInfo.submission_deadline}</span>
                    </div>
                    <div>
                        <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Delivery Terms</span>
                        <span className="text-sm text-gray-800">{generalInfo.delivery_terms}</span>
                    </div>
                    <div>
                        <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Delivery Location</span>
                        <span className="text-sm text-gray-800">{generalInfo.delivery_location}</span>
                    </div>
                    <div className="md:col-span-2">
                        <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</span>
                        <p className="text-sm text-gray-800 mt-1 whitespace-pre-wrap">{generalInfo.description}</p>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">Attached Products</h3>
                <div className="overflow-hidden">
                    <table className="min-w-full">
                        <thead>
                            <tr className="border-b">
                                <th className="py-2 text-left text-xs font-semibold text-gray-500 uppercase">Product</th>
                                <th className="py-2 text-left text-xs font-semibold text-gray-500 uppercase">Qty</th>
                                <th className="py-2 text-left text-xs font-semibold text-gray-500 uppercase">Specifications</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {rfqProducts.map((p) => (
                                <tr key={p.product_id}>
                                    <td className="py-3 text-sm font-medium text-gray-900">{getProductName(p.product_id)}</td>
                                    <td className="py-3 text-sm text-gray-600">{p.quantity}</td>
                                    <td className="py-3 text-sm text-gray-500 italic max-w-sm">{p.specifications || '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="flex justify-between gap-3 pt-4">
                <button
                    onClick={onBack}
                    disabled={isLoading}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                    Previous
                </button>
                {!isViewOnly && (
                    <button
                        onClick={onPublish}
                        disabled={isLoading}
                        className="px-8 py-2 bg-green-600 text-white font-bold rounded-md hover:bg-green-700 transition-all shadow-md active:scale-95 disabled:opacity-50"
                    >
                        {isLoading ? 'Publishing...' : 'Publish RFQ'}
                    </button>
                )}
            </div>
        </div>
    );
};
