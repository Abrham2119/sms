
export const Badge = ({ children, variant = "default", className = "", ...props }: any) => {
    const variantClasses: Record<string, string> = {
        default: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
        secondary: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
        outline: "border border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300",
        destructive: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
    };

    return (
        <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${variantClasses[variant] || variantClasses.default} ${className}`}
            {...props}
        >
            {children}
        </span>
    );
};
