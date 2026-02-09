import { AdvancedTable } from '../../components/ui/AdvancedTable';
import { Badge } from '../../components/ui/Badge';

export const RequestsPage = () => {

    const dummyColumns = Array.from({ length: 10 }, (_, i) => ({
        id: `col_${i + 1}`,
        title: `Column ${i + 1}`,
        accessor: `col_${i + 1}`,
        width: 150,
        render: (row: any) => {

            if (i === 4) {
                const status = row[`col_${i + 1}`] as string;
                const variant = status === 'Active' ? 'default' : status === 'Pending' ? 'secondary' : 'destructive';
                return <Badge variant={variant}>{status}</Badge>;
            }
            return <span>{row[`col_${i + 1}`]}</span>;
        }
    }));


    const dummyData = Array.from({ length: 50 }, (_, rowIdx) => {
        const row: any = { id: `row_${rowIdx}` };
        dummyColumns.forEach((col, colIdx) => {
            if (colIdx === 0) row[col.accessor] = `Item ${rowIdx + 1}`;
            else if (colIdx === 1) row[col.accessor] = `Description ${rowIdx + 1}`;
            else if (colIdx === 2) row[col.accessor] = `Type ${['A', 'B', 'C'][rowIdx % 3]}`;
            else if (colIdx === 3) row[col.accessor] = `2024-02-${String((rowIdx % 28) + 1).padStart(2, '0')}`;
            else if (colIdx === 4) row[col.accessor] = ['Active', 'Pending', 'Inactive'][rowIdx % 3];
            else if (colIdx === 5) row[col.accessor] = `$${(Math.random() * 1000).toFixed(2)}`;
            else row[col.accessor] = `Data ${colIdx + 1}-${rowIdx + 1}`;
        });
        return row;
    });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Requests</h1>
                <p className="text-gray-500 dark:text-gray-400">Manage supplier requests and approvals (Advanced Table Demo)</p>
            </div>

            <div className="h-[600px] border border-gray-200 rounded-xl overflow-hidden">
                <AdvancedTable
                    initialData={dummyData}
                    initialColumns={dummyColumns}
                    title="Request Management (10 Column Demo)"
                />
            </div>
        </div>
    );
};
