import React, { useState } from 'react';

interface TooltipProps {
    content: string;
    children: React.ReactNode;
    position?: 'top' | 'bottom' | 'left' | 'right';
    delay?: number;
}
export const Tooltip: React.FC<TooltipProps> = ({
    content,
    children,
    position = 'top',
    delay = 200
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [timeoutId, setTimeoutId] = useState<ReturnType<typeof setTimeout> | null>(null);

    const showTooltip = () => {
        const id = setTimeout(() => setIsVisible(true), delay);
        setTimeoutId(id);
    };

    const hideTooltip = () => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        setIsVisible(false);
    };

    const positionClasses = {
        top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
        bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
        left: 'right-full top-1/2 -translate-y-1/2 mr-2',
        right: 'left-full top-1/2 -translate-y-1/2 ml-2'
    };

    const arrowClasses = {
        top: 'bottom-[-6px] left-1/2 -translate-x-1/2 border-t-gray-900',
        bottom: 'top-[-6px] left-1/2 -translate-x-1/2 border-b-gray-900',
        left: 'right-[-6px] top-1/2 -translate-y-1/2 border-l-gray-900',
        right: 'left-[-6px] top-1/2 -translate-y-1/2 border-r-gray-900'
    };

    return (
        <div className="relative inline-block">
            <div
                onMouseEnter={showTooltip}
                onMouseLeave={hideTooltip}
                onFocus={showTooltip}
                onBlur={hideTooltip}
                className="inline-block"
            >
                {children}
            </div>

            {isVisible && (
                <div
                    className={`absolute z-50 ${positionClasses[position]} whitespace-nowrap animate-fade-in`}
                    role="tooltip"
                >
                    <div className="bg-gray-900 text-white text-xs font-medium px-3 py-2 rounded-lg shadow-lg">
                        {content}
                        <div className={`absolute w-0 h-0 border-4 border-transparent ${arrowClasses[position]}`} />
                    </div>
                </div>
            )}
        </div>
    );
};
