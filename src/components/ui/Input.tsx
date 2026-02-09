import { type InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
    className = '',
    label,
    error,
    id,
    ...props
}, ref) => {
    return (
        <div className="w-full">
            {label && (
                <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-200">
                    {label}
                </label>
            )}
            <input
                ref={ref}
                id={id}
                className={`
                    flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 
                    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent 
                    disabled:cursor-not-allowed disabled:opacity-50 
                    dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:ring-primary-400
                    ${error ? 'border-danger-500 focus:ring-danger-500' : ''}
                    ${className}
                `}
                {...props}
            />
            {error && (
                <p className="mt-1 text-sm text-danger-500">{error}</p>
            )}
        </div>
    );
});

Input.displayName = 'Input';
export { Input };
