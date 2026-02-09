import { Button } from '../ui/Button';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
    onItemsPerPageChange: (items: number) => void;
}

export const Pagination = ({
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    onPageChange,
    onItemsPerPageChange
}: PaginationProps) => {
    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-3 px-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="text-sm text-gray-500 dark:text-gray-400">
                Showing <span className="font-medium">{Math.min(totalItems, (currentPage - 1) * itemsPerPage + 1)}</span> to{' '}
                <span className="font-medium">{Math.min(totalItems, currentPage * itemsPerPage)}</span> of{' '}
                <span className="font-medium">{totalItems}</span> results
            </div>

            <div className="flex items-center gap-2">
                <select
                    className="h-9 rounded-md border border-gray-300 dark:border-gray-600 bg-transparent px-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-gray-200"
                    value={itemsPerPage}
                    onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
                >
                    {[5, 10, 20, 50].map(size => (
                        <option key={size} value={size}>{size} per page</option>
                    ))}
                </select>

                <div className="flex items-center gap-1">
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => onPageChange(1)}
                        disabled={currentPage === 1}
                    >
                        <ChevronsLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm font-medium px-2 text-gray-700 dark:text-gray-200">
                        Page {currentPage} of {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages || totalPages === 0}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => onPageChange(totalPages)}
                        disabled={currentPage === totalPages || totalPages === 0}
                    >
                        <ChevronsRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
};
