import React from 'react';
import type { RFQ } from '../../../types/rfq';
import { Badge } from '../../../components/ui/Badge';
import { Pencil, Eye, Trash2 } from 'lucide-react';

interface RFQListTableProps {
    rfqs: RFQ[];
    onEdit: (rfq: RFQ) => void;
    onView: (rfq: RFQ) => void;
    onDelete?: (rfqId: string) => void;
}

export const RFQListTable: React.FC<RFQListTableProps> = ({ rfqs, onEdit, onView, onDelete }) => {
    const getStatusVariant = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'draft': return 'warning';
            case 'published': return 'success';
            case 'closed': return 'danger';
            default: return 'default';
        }
    };

    const rfqList = Array.isArray(rfqs) ? rfqs : [];

    return (
        <div className="overflow-x-auto bg-white rounded-lg border border-gray-200 shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Reference</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Deadline</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {rfqList.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="px-6 py-10 text-center text-sm text-gray-500">
                                No RFQs found. Create your first RFQ using the button above.
                            </td>
                        </tr>
                    ) : (
                        rfqList.map((rfq) => (
                            <tr
                                key={rfq.id}
                                className="hover:bg-gray-50 transition-colors cursor-pointer"
                                onClick={() => onView(rfq)}
                            >
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="text-sm font-bold text-primary-800">{rfq.reference_number}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm text-gray-900 max-w-xs truncate">{rfq.description}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-500">{rfq.submission_deadline}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <Badge variant={getStatusVariant(rfq.status) as any}>
                                        {rfq.status}
                                    </Badge>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                                        <button
                                            onClick={() => onView(rfq)}
                                            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                                            title="View Details"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        {rfq.status?.toLowerCase() === 'draft' && (
                                            <button
                                                onClick={() => onEdit(rfq)}
                                                className="p-1 text-gray-400 hover:text-indigo-600 transition-colors"
                                                title="Edit Draft"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                        )}
                                        {onDelete && (
                                            <button
                                                onClick={() => onDelete(rfq.id)}
                                                className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                                title="Delete RFQ"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};
