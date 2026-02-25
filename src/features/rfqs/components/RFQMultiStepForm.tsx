import React, { useState } from 'react';
import { Stepper } from './Stepper';
import { Step1GeneralInfo } from './Step1GeneralInfo';
import { Step2Products } from './Step2Products';
import { Step3ReviewPublish } from './Step3ReviewPublish';
import { useProducts } from '../../products/hooks/useProduct';
import { useCreateRFQ, useUpdateRFQ, useAttachProductsRFQ, usePublishRFQ } from '../hooks/useRFQ';
import type { Step1FormData, RFQProductFormData } from '../../../utils/rfqSchemas';
import type { RFQ } from '../../../types/rfq';

const STEPS = ['General Info', 'Attach Products', 'Review & Publish'];

interface RFQMultiStepFormProps {
    initialRFQ?: RFQ;
    onSuccess: () => void;
    isViewOnly?: boolean;
}

export const RFQMultiStepForm: React.FC<RFQMultiStepFormProps> = ({ initialRFQ, onSuccess, isViewOnly }) => {
    const [currentStep, setCurrentStep] = useState(0);

    // Initial Mutation hooks
    const createMut = useCreateRFQ();
    const updateMut = useUpdateRFQ();
    const attachMut = useAttachProductsRFQ();
    const publishMut = usePublishRFQ();

    // Fetch products
    const { data: productsData } = useProducts({ per_page: 100 });
    const products = Array.isArray(productsData?.data) ? productsData.data : (Array.isArray(productsData) ? productsData : []);

    // State for RFQ tracking
    const [rfqId, setRfqId] = useState<string | null>(initialRFQ?.id || null);
    const [referenceNumber, setReferenceNumber] = useState<string>(initialRFQ?.reference_number || '');
    const [status, setStatus] = useState<string>(initialRFQ?.status || 'Draft');

    const isReadOnly = isViewOnly || status.toLowerCase() === 'published' || status.toLowerCase() === 'closed';

    // Helper to format date for HTML5 input
    const formatDateForInput = (dateStr?: string) => {
        if (!dateStr) return '';
        return dateStr.split('T')[0];
    };

    // Form Data State
    const [step1Data, setStep1Data] = useState<Step1FormData | null>(
        initialRFQ ? {
            description: initialRFQ.description || '',
            submission_deadline: formatDateForInput(initialRFQ.submission_deadline),
            delivery_terms: Array.isArray(initialRFQ.delivery_terms)
                ? initialRFQ.delivery_terms.map(t => ({ value: t }))
                : (initialRFQ.delivery_terms ? [{ value: initialRFQ.delivery_terms as any }] : [{ value: '' }]),
            delivery_location: initialRFQ.delivery_location || ''
        } : null
    );

    const [rfqProducts, setRfqProducts] = useState<RFQProductFormData[]>(() => {
        const rawProducts = initialRFQ?.products || (initialRFQ as any)?.rfq_products;
        if (!Array.isArray(rawProducts)) return [];

        return rawProducts.map((p: any) => ({
            product_id: p.id || p.product_id,
            quantity: Number(p.pivot?.quantity || p.quantity || 0),
            specifications: p.pivot?.specifications || p.specifications || ''
        }));
    });

    const [initialProductNames] = useState<Record<string, string>>(() => {
        const rawProducts = initialRFQ?.products || (initialRFQ as any)?.rfq_products;
        if (!Array.isArray(rawProducts)) return {};

        const names: Record<string, string> = {};
        rawProducts.forEach((p: any) => {
            const id = p.id || p.product_id;
            const name = p.name || p.product?.name;
            if (id && name) {
                names[id] = name;
            }
        });
        return names;
    });

    const handleStep1Submit = async (formData: Step1FormData) => {
        try {
            // Transform delivery_terms from {value: string}[] to string[] for backend
            const data = {
                ...formData,
                delivery_terms: formData.delivery_terms.map(t => t.value)
            };

            if (rfqId) {
                await updateMut.mutateAsync({ id: rfqId, data });
                setStep1Data(formData);
                setCurrentStep(1);
            } else {
                const result = await createMut.mutateAsync(data);
                const rfq = result.data;
                setRfqId(rfq.id);
                setReferenceNumber(rfq.reference_number);
                setStep1Data(formData);
                setCurrentStep(1);
            }
        } catch (error) {
            console.error("Step 1 failed", error);
        }
    };

    const handleStep2Submit = async (data: RFQProductFormData[]) => {
        if (!rfqId) return;
        try {
            await attachMut.mutateAsync({ id: rfqId, data: { products: data } });
            setRfqProducts(data);
            setCurrentStep(2);
        } catch (error) {
            console.error("Step 2 failed", error);
        }
    };

    const handlePublish = async () => {
        if (!rfqId) return;
        try {
            await publishMut.mutateAsync(rfqId);
            setStatus('Published');
            onSuccess();
        } catch (error) {
            console.error("Publish failed", error);
        }
    };

    const handleBack = () => {
        setCurrentStep((prev) => prev - 1);
    };

    const isCurrentStepLoading = createMut.isPending || updateMut.isPending || attachMut.isPending || publishMut.isPending;

    return (
        <div className="p-2">
            <div className="flex justify-between items-center mb-6">
                <span className="text-xs font-medium text-gray-400 uppercase">Status: {status}</span>
                {referenceNumber && (
                    <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2 py-1 rounded">
                        {referenceNumber}
                    </span>
                )}
            </div>

            <Stepper steps={STEPS} currentStep={currentStep} />

            <div className="mt-8">
                {currentStep === 0 && (
                    <Step1GeneralInfo
                        initialData={step1Data ?? undefined}
                        onNext={handleStep1Submit}
                        isLoading={isCurrentStepLoading}
                        readOnly={isReadOnly}
                    />
                )}

                {currentStep === 1 && (
                    <Step2Products
                        products={products}
                        initialData={rfqProducts}
                        onNext={handleStep2Submit}
                        onBack={handleBack}
                        isLoading={isCurrentStepLoading}
                        readOnly={isReadOnly}
                        initialProductNames={initialProductNames}
                    />
                )}

                {currentStep === 2 && step1Data && (
                    <Step3ReviewPublish
                        generalInfo={step1Data}
                        rfqProducts={rfqProducts}
                        allProducts={products}
                        referenceNumber={referenceNumber}
                        onPublish={handlePublish}
                        onBack={handleBack}
                        isLoading={isCurrentStepLoading}
                        isViewOnly={isReadOnly}
                    />
                )}
            </div>
        </div>
    );
};
