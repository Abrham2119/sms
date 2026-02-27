import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { step1Schema, type Step1FormData } from '../../../utils/rfqSchemas';
import { DatePicker } from '../../../components/ui/DatePicker';

interface Step1GeneralInfoProps {
    initialData?: Partial<Step1FormData>;
    onNext: (data: Step1FormData) => Promise<void>;
    isLoading: boolean;
    readOnly?: boolean;
}

export const Step1GeneralInfo: React.FC<Step1GeneralInfoProps> = ({
    initialData,
    onNext,
    isLoading,
    readOnly
}) => {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isValid },
    } = useForm<Step1FormData>({
        resolver: zodResolver(step1Schema),
        defaultValues: {
            for: 'local',
            ...initialData,
            delivery_terms: Array.isArray(initialData?.delivery_terms)
                ? initialData.delivery_terms.map(t => typeof t === 'string' ? { value: t } : t)
                : [{ value: '' }]
        },
        mode: 'onChange'
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "delivery_terms"
    });

    const onSubmit = (data: Step1FormData) => {
        onNext(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                </label>
                <textarea
                    {...register('description')}
                    disabled={readOnly}
                    className={`w-full p-2 border rounded-md h-32 ${errors.description ? 'border-red-500' : 'border-gray-300'
                        } ${readOnly ? 'bg-gray-100 text-gray-500' : ''}`}
                    placeholder="Detailed description of the RFQ requirements..."
                />
                {errors.description && (
                    <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Controller
                        name="submission_deadline"
                        control={control}
                        render={({ field }) => (
                            <DatePicker
                                label="Submission Deadline"
                                value={field.value}
                                onChange={field.onChange}
                                error={errors.submission_deadline?.message}
                                minDate={new Date()}
                                disabled={readOnly}
                                placement="top-start"
                            />
                        )}
                    />
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <label className="block text-sm font-medium text-gray-700">
                            Delivery Terms (e.g. FOB, CIF)
                        </label>
                        {!readOnly && (
                            <button
                                type="button"
                                onClick={() => append({ value: '' })}
                                className="text-black hover:text-primary-700 text-xs font-bold flex items-center gap-1 bg-primary-50 px-2 py-1 rounded-lg transition-colors"
                            >
                                <Plus className="w-3 h-3" /> Add Term
                            </button>
                        )}
                    </div>

                    <div className="space-y-2">
                        {fields.map((field, index) => (
                            <div key={field.id} className="flex gap-2 animate-in fade-in slide-in-from-left-2 duration-300">
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        {...register(`delivery_terms.${index}.value` as any)}
                                        disabled={readOnly}
                                        className={`w-full p-2 border rounded-md ${(errors.delivery_terms as any)?.[index]?.value ? 'border-red-500' : 'border-gray-300'
                                            } ${readOnly ? 'bg-gray-100 text-gray-500' : ''}`}
                                        placeholder={`Term ${index + 1}`}
                                    />
                                    {(errors.delivery_terms as any)?.[index]?.value && (
                                        <p className="mt-1 text-[10px] text-red-500">{(errors.delivery_terms as any)[index].value.message}</p>
                                    )}
                                </div>
                                {!readOnly && fields.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => remove(index)}
                                        className="p-2.5 text-red-500 hover:bg-red-50 rounded-md border border-red-100 transition-colors self-start"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                    {errors.delivery_terms && !Array.isArray(errors.delivery_terms) && (
                        <p className="mt-1 text-xs text-red-500">{(errors.delivery_terms as any).message}</p>
                    )}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Delivery Location
                </label>
                <input
                    type="text"
                    {...register('delivery_location')}
                    disabled={readOnly}
                    className={`w-full p-2 border rounded-md ${errors.delivery_location ? 'border-red-500' : 'border-gray-300'
                        } ${readOnly ? 'bg-gray-100 text-gray-500' : ''}`}
                    placeholder="e.g. Addis Ababa"
                />
                {errors.delivery_location && (
                    <p className="mt-1 text-xs text-red-500">{errors.delivery_location.message}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Order Type
                </label>
                <select
                    {...register('for')}
                    disabled={readOnly}
                    className={`w-full p-2 border rounded-md ${errors.for ? 'border-red-500' : 'border-gray-300'
                        } ${readOnly ? 'bg-gray-100 text-gray-500' : ''}`}
                >
                    <option value="local">Local</option>
                    <option value="foreign">Foreign</option>
                </select>
                {errors.for && (
                    <p className="mt-1 text-xs text-red-500">{errors.for.message}</p>
                )}
            </div>

            <div className="flex justify-end gap-3 pt-4">
                <button
                    type="submit"
                    disabled={(!readOnly && !isValid) || isLoading}
                    className={`px-6 py-2 rounded-md transition-colors ${readOnly
                        ? 'bg-gray-600 text-black hover:bg-gray-700'
                        : 'bg-primary-500 text-black hover:bg-primary-600 disabled:opacity-50'
                        }`}
                >
                    {isLoading ? 'Processing...' : 'Next'}
                </button>
            </div>
        </form>
    );
};
