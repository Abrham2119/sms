import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, type LucideIcon } from 'lucide-react';

interface CustomDropdownOption {
    label: string;
    value: string;
    icon?: LucideIcon;
}

interface CustomDropdownProps {
    options: CustomDropdownOption[];
    value: string;
    onChange: (value: string) => void;
    icon?: LucideIcon;
    labelPrefix?: string;
    className?: string;
}

export const CustomDropdown: React.FC<CustomDropdownProps> = ({
    options,
    value,
    onChange,
    icon: Icon,
    labelPrefix = '',
    className = ''
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(opt => opt.value === value) || options[0];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className={`relative  ${className}`} ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full gap-2 bg-gray-50 dark:bg-gray-800/50 px-4 py-2.5 rounded-2xl border border-gray-100 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 group"
            >
                {Icon && <Icon className="w-4 h-4 text-gray-400 group-hover:text-primary-500 transition-colors" />}
                <span className="text-xs font-bold text-gray-600 dark:text-gray-300">
                    {labelPrefix}{selectedOption.label}
                </span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute  top-full left-0 mt-2 w-56 bg-white/90 dark:bg-gray-900/95 backdrop-blur-2xl border border-gray-100 dark:border-gray-800 rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.1)] py-2 z-[100] animate-in fade-in zoom-in-95 duration-200">
                    {options.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                                onChange(option.value);
                                setIsOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2.5 text-xs font-bold transition-colors flex items-center justify-between
                                ${value === option.value
                                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                                }`}
                        >
                            <span>{option.label}</span>
                            {option.icon && <option.icon className="w-3.5 h-3.5" />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};
