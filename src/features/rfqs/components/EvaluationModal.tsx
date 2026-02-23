import React, { useState } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import type { Quotation } from '../../../types/rfq';
import { ClipboardCheck } from 'lucide-react';

interface EvaluationModalProps {
    isOpen: boolean;
    onClose: () => void;
    quotation: Quotation | null;
    onEvaluate: (id: string, scores: any) => Promise<void>;
    isSubmitting: boolean;
}

export const EvaluationModal: React.FC<EvaluationModalProps> = ({
    isOpen,
    onClose,
    quotation,
    onEvaluate,
    isSubmitting
}) => {
    const [scores, setScores] = useState({
        price_score: '',
        delivery_score: '',
        financial_score: '',
        performance_score: '',
        compliance_score: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setScores(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!quotation) return;

        const payload = {
            price_score: Number(scores.price_score),
            delivery_score: Number(scores.delivery_score),
            financial_score: Number(scores.financial_score),
            performance_score: Number(scores.performance_score),
            compliance_score: Number(scores.compliance_score)
        };

        await onEvaluate(quotation.id, payload);
        onClose();
        setScores({
            price_score: '',
            delivery_score: '',
            financial_score: '',
            performance_score: '',
            compliance_score: ''
        });
    };

    if (!quotation) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`Evaluate Quotation: ${quotation.quotation_number}`}
            className="max-w-md"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center gap-2 mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                    <ClipboardCheck className="w-5 h-5 text-[#0f172a]" />
                    <div>
                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Supplier</p>
                        <p className="text-sm font-bold text-gray-900 dark:text-white leading-none mt-1">
                            {quotation.supplier.legal_name}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 block">Price Score</label>
                        <Input
                            type="number"
                            name="price_score"
                            value={scores.price_score}
                            onChange={handleChange}
                            required
                            min="0"
                            max="100"
                            placeholder="0-100"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 block">Delivery Score</label>
                        <Input
                            type="number"
                            name="delivery_score"
                            value={scores.delivery_score}
                            onChange={handleChange}
                            required
                            min="0"
                            max="100"
                            placeholder="0-100"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 block">Financial Score</label>
                        <Input
                            type="number"
                            name="financial_score"
                            value={scores.financial_score}
                            onChange={handleChange}
                            required
                            min="0"
                            max="100"
                            placeholder="0-100"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 block">Performance Score</label>
                        <Input
                            type="number"
                            name="performance_score"
                            value={scores.performance_score}
                            onChange={handleChange}
                            required
                            min="0"
                            max="100"
                            placeholder="0-100"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 block">Compliance Score</label>
                        <Input
                            type="number"
                            name="compliance_score"
                            value={scores.compliance_score}
                            onChange={handleChange}
                            required
                            min="0"
                            max="100"
                            placeholder="0-100"
                        />
                    </div>
                </div>

                <div className="flex gap-3 pt-4">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={onClose}
                        className="flex-1"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        className="flex-1 bg-[#0f172a] hover:bg-[#1e293b]"
                        isLoading={isSubmitting}
                    >
                        Submit Evaluation
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
