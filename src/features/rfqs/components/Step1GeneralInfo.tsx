import { useForm, Controller } from 'react-hook-form';
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
        defaultValues: initialData,
        mode: 'onChange'
    });

    return (
        <form onSubmit={handleSubmit(onNext)} className="space-y-6">
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
                            />
                        )}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Delivery Terms (e.g. FOB, CIF)
                    </label>
                    <input
                        type="text"
                        {...register('delivery_terms')}
                        disabled={readOnly}
                        className={`w-full p-2 border rounded-md ${errors.delivery_terms ? 'border-red-500' : 'border-gray-300'
                            } ${readOnly ? 'bg-gray-100 text-gray-500' : ''}`}
                    />
                    {errors.delivery_terms && (
                        <p className="mt-1 text-xs text-red-500">{errors.delivery_terms.message}</p>
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

            <div className="flex justify-end gap-3 pt-4">
                <button
                    type="submit"
                    disabled={(!readOnly && !isValid) || isLoading}
                    className={`px-6 py-2 rounded-md transition-colors ${readOnly
                        ? 'bg-gray-600 text-white hover:bg-gray-700'
                        : 'bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50'
                        }`}
                >
                    {isLoading ? 'Processing...' : 'Next'}
                </button>
            </div>
        </form>
    );
};
