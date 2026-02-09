import { type SelectHTMLAttributes, forwardRef } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options: { value: string; label: string }[];
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(({
    className = '',
    label,
    error,
    id,
    options,
    ...props
}, ref) => {
    return (
        <div className="w-full">
            {label && (
                <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-200">
                    {label}
                </label>
            )}
            <select
                ref={ref}
                id={id}
                className={`
                    flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm 
                    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent 
                    disabled:cursor-not-allowed disabled:opacity-50 
                    dark:bg-gray-800 dark:border-gray-700 dark:text-white
                    ${error ? 'border-danger-500 focus:ring-danger-500' : ''}
                    ${className}
                `}
                {...props}
            >
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
            {error && (
                <p className="mt-1 text-sm text-danger-500">{error}</p>
            )}
        </div>
    );
});

Select.displayName = 'Select';
export { Select };
