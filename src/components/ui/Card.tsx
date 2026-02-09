import React from 'react';

export const Card = ({ children, className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.01] ${className}`}
        {...props}
    >
        {children}
    </div>
);

export const CardHeader = ({ children, className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={`p-6 border-b border-gray-200 dark:border-gray-700 ${className}`} {...props}>
        {children}
    </div>
);

export const CardTitle = ({ children, className = "", ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className={`text-lg font-semibold text-gray-800 dark:text-gray-100 ${className}`} {...props}>
        {children}
    </h3>
);

export const CardContent = ({ children, className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={`p-6 ${className}`} {...props}>
        {children}
    </div>
);
