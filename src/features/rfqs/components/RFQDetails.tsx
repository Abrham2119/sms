import React from 'react';
import type { RFQ } from '../../../types/rfq';


interface RFQDetailsProps {
    rfq: RFQ;
}

export const RFQDetails: React.FC<RFQDetailsProps> = ({ rfq }) => {
    // Helper to format date
    const formatDate = (dateStr?: string) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString();
    };

    return (
        <div className="space-y-8 p-2">
            {/* Header / Status Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                        {rfq.reference_number}
                        <span className={`text-sm px-3 py-1 rounded-full font-medium ${rfq.status.toLowerCase() === 'published' ? 'bg-green-100 text-green-800' :
                            rfq.status.toLowerCase() === 'draft' ? 'bg-gray-100 text-gray-800' :
                                'bg-blue-100 text-blue-800'
                            }`}>
                            {rfq.status}
                        </span>
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">Created on {formatDate(rfq.created_at)}</p>
                </div>
            </div>

            {/* General Information */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">General Information</h3>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                    <div>
                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Submission Deadline</label>
                        <p className="text-gray-900 font-medium">{formatDate(rfq.submission_deadline)}</p>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Delivery Location</label>
                        <p className="text-gray-900 font-medium">{rfq.delivery_location || '-'}</p>
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Delivery Terms</label>
                        <p className="text-gray-900">{rfq.delivery_terms || '-'}</p>
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Description</label>
                        <p className="text-gray-900 whitespace-pre-wrap bg-gray-50 p-4 rounded-md border border-gray-100 mt-1">
                            {rfq.description || 'No description provided.'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Products List */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-6 py-3 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Requested Products</h3>
                    <span className="text-xs font-medium text-gray-500 bg-white px-2 py-1 rounded border">
                        {rfq.products?.length || 0} Items
                    </span>
                </div>

                <div className="overflow-x-auto">
                    <div className="bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-bold border-b border-gray-200 dark:border-gray-700">
                                <tr>
                                    <th className="px-6 py-4">Product Name</th>
                                    <th className="px-6 py-4">Category</th>
                                    <th className="px-6 py-4 text-center">Required Qty</th>
                                    <th className="px-6 py-4">Specifications</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {(!rfq.products || rfq.products.length === 0) ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-500 italic">
                                            No products attached to this RFQ.
                                        </td>
                                    </tr>
                                ) : (
                                    rfq.products.map((item, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors">
                                            <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">
                                                {item.name}
                                            </td>
                                            <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                                                ID: {item.category_id.substring(0, 8)}...
                                            </td>
                                            <td className="px-6 py-4 text-center font-mono font-bold text-primary-600">
                                                {item.pivot.quantity}
                                            </td>
                                            <td className="px-6 py-4 text-gray-500 dark:text-gray-400 italic text-xs">
                                                {item.pivot.specifications || 'No specific requirements'}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};
