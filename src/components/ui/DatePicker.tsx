import { forwardRef } from 'react';
import ReactDatePicker from 'react-datepicker';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import "react-datepicker/dist/react-datepicker.css";

interface DatePickerProps {
    value?: string; // ISO format string (YYYY-MM-DD)
    onChange: (date: string) => void;
    label?: string;
    placeholder?: string;
    error?: string;
    className?: string;
    minDate?: Date;
    disabled?: boolean;
    placement?: "top-start" | "top-end" | "bottom-start" | "bottom-end";
}

export const DatePicker = forwardRef<HTMLDivElement, DatePickerProps>(({
    value,
    onChange,
    label,
    placeholder = 'Select date',
    error,
    className = '',
    minDate,
    disabled,
    placement = "bottom-start"
}, ref) => {
    // ... Convert string value to Date object for react-datepicker
    const selectedDate = value ? new Date(value) : null;

    const handleDateChange = (date: Date | null) => {
        if (date) {
            // Format to YYYY-MM-DD
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            onChange(`${year}-${month}-${day}`);
        } else {
            onChange('');
        }
    };

    // Custom input to maintain the existing premium design
    const CustomInput = forwardRef<HTMLDivElement, any>(({ value: displayValue, onClick }, inputRef) => (
        <div
            ref={inputRef}
            onClick={!disabled ? onClick : undefined}
            className={`
                flex items-center justify-between h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm 
                transition-all duration-200
                ${disabled
                    ? 'bg-gray-100 dark:bg-gray-900/50 cursor-not-allowed opacity-70 border-gray-200'
                    : 'cursor-pointer hover:border-primary-400 focus-within:ring-2 focus-within:ring-primary-500/20 focus-within:border-primary-500'
                }
                dark:border-gray-700 dark:text-white
                ${error ? 'border-danger-500' : ''}
            `}
        >
            <div className="flex items-center gap-2 overflow-hidden">
                <CalendarIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className={value ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400'}>
                    {displayValue || placeholder}
                </span>
            </div>
            {value && !disabled && (
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        onChange('');
                    }}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                    <X className="w-3 h-3 text-gray-400" />
                </button>
            )}
        </div>
    ));

    CustomInput.displayName = 'DatePickerCustomInput';

    return (
        <div className={`relative w-full ${className}`} ref={ref}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-200">
                    {label}
                </label>
            )}

            <ReactDatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                minDate={minDate}
                disabled={disabled}
                placeholderText={placeholder}
                customInput={<CustomInput />}
                dateFormat="MM/dd/yyyy"
                popperPlacement={placement}
                popperModifiers={[
                    {
                        name: 'offset',
                        options: {
                            offset: [0, 0],
                        },
                    },
                    {
                        name: 'flip',
                        enabled: false,
                    },
                    {
                        name: 'preventOverflow',
                        options: {
                            boundary: 'viewport',
                            altAxis: true,
                        },
                    },
                ] as any}
                showPopperArrow={false}
            />

            {error && <p className="mt-1 text-sm text-danger-500">{error}</p>}

            {/* Note: Additional Tailwind global CSS might be helpful for full theme consistency 
                but this preserves the core input look.  */}
            <style>{`
                /* Force popper position and remove gaps */
                .react-datepicker-popper {
                    z-index: 9999 !important;
                }
                
                /* Ensure no gap when on top */
                .react-datepicker-popper[data-placement^="top"] {
                    margin-bottom: 0 !important;
                    padding-bottom: 0 !important;
                    transform: translateY(2px) !important; /* Tiny adjustment to overlap slightly and hide border gap */
                }

                .react-datepicker-popper[data-placement^="bottom"] {
                    margin-top: 0 !important;
                    padding-top: 0 !important;
                }

                .react-datepicker {
                    font-family: inherit;
                    border-radius: 1rem;
                    border: 1px solid #e5e7eb;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                    background-color: white;
                }

                /* Hide the default arrow which often causes a gap */
                .react-datepicker__triangle {
                    display: none !important;
                }

                .react-datepicker__header {
                    padding-top: 1rem;
                    background-color: transparent;
                    border-bottom: none;
                }
                .react-datepicker__month {
                    margin: 0.4rem 1rem 1rem;
                }
                .dark .react-datepicker {
                    background-color: #1f2937;
                    border-color: #374151;
                    color: white;
                }
                .dark .react-datepicker__header {
                    background-color: transparent;
                }
                .dark .react-datepicker__current-month, 
                .dark .react-datepicker__day-name,
                .dark .react-datepicker__day {
                    color: #f3f4f6;
                }
                .react-datepicker__day--selected {
                    background-color: var(--color-primary-600, #2563eb) !important;
                    border-radius: 0.75rem;
                }
                .react-datepicker__day:hover {
                    border-radius: 0.75rem;
                }
                .react-datepicker__day--keyboard-selected {
                    background-color: var(--color-primary-50, #eff6ff);
                    color: var(--color-primary-600, #2563eb);
                    border-radius: 0.75rem;
                }
                .dark .react-datepicker__day--keyboard-selected {
                    background-color: rgba(37, 99, 235, 0.2);
                }
            `}</style>
        </div>
    );
});

DatePicker.displayName = 'DatePicker';

