import { useState, useRef, useEffect, forwardRef } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from 'lucide-react';

// Note: Logic is implemented manually with native Date object to avoid extra dependencies.

interface DatePickerProps {
    value?: string; // ISO format or string
    onChange: (date: string) => void;
    label?: string;
    placeholder?: string;
    error?: string;
    className?: string;
    minDate?: Date;
    disabled?: boolean;
}

export const DatePicker = forwardRef<HTMLDivElement, DatePickerProps>(({
    value,
    onChange,
    label,
    placeholder = 'Select date',
    error,
    className = '',
    minDate,
    disabled
}, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [viewDate, setViewDate] = useState(value ? new Date(value) : new Date());
    const innerRef = useRef<HTMLDivElement>(null);

    // Sync forwarded ref with innerRef
    useEffect(() => {
        if (!ref) return;
        if (typeof ref === 'function') {
            ref(innerRef.current);
        } else {
            ref.current = innerRef.current;
        }
    }, [ref]);

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (innerRef.current && !innerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedDate = value ? new Date(value) : null;

    const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const generateDays = () => {
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();
        const days = [];

        // Previous month days
        const prevMonthDays = daysInMonth(year, month - 1);
        const firstDay = firstDayOfMonth(year, month);
        for (let i = firstDay - 1; i >= 0; i--) {
            days.push({
                day: prevMonthDays - i,
                month: month - 1,
                year: month === 0 ? year - 1 : year,
                currentMonth: false
            });
        }

        // Current month days
        const count = daysInMonth(year, month);
        for (let i = 1; i <= count; i++) {
            days.push({
                day: i,
                month: month,
                year,
                currentMonth: true
            });
        }

        // Next month days
        const remaining = 42 - days.length;
        for (let i = 1; i <= remaining; i++) {
            days.push({
                day: i,
                month: month + 1,
                year: month === 11 ? year + 1 : year,
                currentMonth: false
            });
        }

        return days;
    };

    const handleDateSelect = (d: { day: number, month: number, year: number }) => {
        const date = new Date(d.year, d.month, d.day);
        const isoString = date.toISOString().split('T')[0];
        onChange(isoString);
        setIsOpen(false);
    };

    const nextMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
    const prevMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const isToday = (d: number, m: number, y: number) => {
        const today = new Date();
        return today.getDate() === d && today.getMonth() === m && today.getFullYear() === y;
    };

    const isSelected = (d: number, m: number, y: number) => {
        return selectedDate?.getDate() === d && selectedDate?.getMonth() === m && selectedDate?.getFullYear() === y;
    };

    const isDisabled = (d: number, m: number, y: number) => {
        if (!minDate) return false;
        const date = new Date(y, m, d);
        // Compare dates ignoring time
        const min = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate());
        return date < min;
    };

    return (
        <div className={`relative w-full ${className}`} ref={innerRef}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-200">
                    {label}
                </label>
            )}

            <div
                onClick={() => !disabled && setIsOpen(!isOpen)}
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
                        {value ? new Date(value).toLocaleDateString() : placeholder}
                    </span>
                </div>
                {value && !disabled && (
                    <button
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

            {error && <p className="mt-1 text-sm text-danger-500">{error}</p>}

            {isOpen && (
                <div className="absolute z-50 mt-2 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 w-[320px] animate-in fade-in zoom-in-95 duration-200 origin-top">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                        <button
                            onClick={(e) => { e.stopPropagation(); prevMonth(); }}
                            className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-colors text-gray-400"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <div className="font-bold text-gray-900 dark:text-white">
                            {monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}
                        </div>
                        <button
                            onClick={(e) => { e.stopPropagation(); nextMonth(); }}
                            className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-colors text-gray-400"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Weekdays */}
                    <div className="grid grid-cols-7 gap-1 mb-2">
                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                            <div key={day} className="text-center text-[10px] font-black text-gray-400 uppercase tracking-tighter">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-1">
                        {generateDays().map((d, i) => {
                            const disabled = d.currentMonth && isDisabled(d.day, d.month, d.year);
                            const selected = d.currentMonth && isSelected(d.day, d.month, d.year);
                            const today = d.currentMonth && isToday(d.day, d.month, d.year);

                            return (
                                <button
                                    key={i}
                                    disabled={disabled}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (d.currentMonth && !disabled) handleDateSelect(d);
                                    }}
                                    className={`
                                        h-9 w-9 flex items-center justify-center rounded-xl text-sm font-medium transition-all
                                        ${!d.currentMonth ? 'text-gray-300 dark:text-gray-600 pointer-events-none' : ''}
                                        ${selected ? 'bg-primary-600 text-white shadow-lg shadow-primary-200' :
                                            today ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20' :
                                                'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}
                                        ${disabled ? 'opacity-30 cursor-not-allowed grayscale' : ''}
                                    `}
                                >
                                    {d.day}
                                </button>
                            );
                        })}
                    </div>

                    {/* Footer */}
                    <div className="mt-4 pt-4 border-t border-gray-50 dark:border-gray-700 flex justify-center">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                const today = new Date();
                                onChange(today.toISOString().split('T')[0]);
                                setIsOpen(false);
                            }}
                            className="text-xs font-bold text-primary-600 hover:text-primary-700 px-3 py-1 bg-primary-50 dark:bg-primary-900/20 rounded-full"
                        >
                            Switch to Today
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
});

DatePicker.displayName = 'DatePicker';
