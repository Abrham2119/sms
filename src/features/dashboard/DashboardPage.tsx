import { useAuthStore } from "../../store/authStore";
import {
    Users,
    Truck,
    FileText,
    DollarSign,
    TrendingUp,
    Package,
    AlertTriangle,
    CheckCircle2,
    Clock,
    ArrowRight
} from "lucide-react";
import { LineChart, BarChart, DonutChart } from './components/DashboardCharts';

// Mock Data for the 2026 UI showcase
const ADMIN_KPIS = [
    { label: 'Total Users', value: '4,667', icon: Users, glow: 'shadow-primary-500/20' },
    { label: 'Total Suppliers', value: '120', icon: Truck, glow: 'shadow-primary-500/20' },
    { label: 'Total Orders', value: '10,408', icon: FileText, glow: 'shadow-primary-500/20' },
    { label: 'Total Revenue', value: '$626,732', icon: DollarSign, glow: 'shadow-primary-500/20' },
];

const SUPPLIER_KPIS = [
    { label: 'Pending Orders', value: '66', icon: Clock, alert: true },
    { label: 'Completed Orders', value: '322', icon: CheckCircle2 },
    { label: 'Inventory Items', value: '146', icon: Package },
    { label: 'Low Stock Items', value: '5', icon: AlertTriangle, alert: true },
    { label: 'Revenue (Month)', value: '$9,529', icon: DollarSign },
];

const REVENUE_DATA = [45000, 52000, 48000, 61000, 55000, 72000, 68000];
const REVENUE_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];

const SUPPLIER_PERFORMANCE = [85, 92, 78, 95, 88];
const SUPPLIER_LABELS = ['S1', 'S2', 'S3', 'S4', 'S5'];

const INVENTORY_HEALTH = [
    { label: 'In Stock', value: 120, color: '#ffff00' },
    { label: 'Low Stock', value: 21, color: '#eaea00' },
    { label: 'Out of Stock', value: 5, color: '#333' },
];

const DashboardPage = () => {
    const { user, roles } = useAuthStore();
    const isSupplier = roles.some(r => r.name.toLowerCase() === 'supplier');

    return (
        <div className="max-w-[1600px] mx-auto pb-12 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase mb-2">
                        Control <span className="text-primary-600">Center</span>
                    </h1>
                    <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
                        System Live: Welcome back, {user?.name || 'Operator'}
                    </p>
                </div>
                <div className="px-4 py-2 bg-white border border-gray-200 rounded-xl flex items-center gap-3 shadow-sm">
                    <TrendingUp className="w-4 h-4 text-primary-600" />
                    <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Global Status: Optimal</span>
                </div>
            </div>

            {isSupplier ? <SupplierDashboardView /> : <AdminDashboardView />}
        </div>
    );
};

const AdminDashboardView = () => (
    <div className="space-y-8">
        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ADMIN_KPIS.map((kpi, i) => (
                <div key={i} className={`bg-white border border-gray-200 p-6 rounded-3xl group hover:border-primary-500 transition-all duration-500 shadow-sm`}>
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-gray-50 rounded-2xl group-hover:bg-primary-500 transition-colors">
                            <kpi.icon className="w-5 h-5 text-gray-600 group-hover:text-black" />
                        </div>
                    </div>
                    <h3 className="text-3xl font-black text-gray-900 mb-1 tracking-tight">{kpi.value}</h3>
                    <p className="text-[10px] font-black text-primary-800 uppercase tracking-widest">{kpi.label}</p>
                </div>
            ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white border border-gray-200 p-8 rounded-[32px] shadow-sm relative overflow-hidden group">
                <div className="flex justify-between items-center mb-10">
                    <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Revenue Trend</h3>
                    <div className="flex gap-2">
                        <span className="px-3 py-1 bg-primary-500 text-black text-[10px] font-black rounded-full uppercase">Live</span>
                    </div>
                </div>
                <div className="h-[300px] w-full">
                    <LineChart data={REVENUE_DATA} labels={REVENUE_LABELS} />
                </div>
            </div>

            <div className="bg-white border border-gray-200 p-8 rounded-[32px] shadow-sm group">
                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-10">Top Suppliers</h3>
                <div className="h-[300px] w-full">
                    <BarChart data={SUPPLIER_PERFORMANCE} labels={SUPPLIER_LABELS} />
                </div>
            </div>
        </div>

        {/* Table Section */}
        <div className="bg-white border border-gray-200 rounded-[32px] overflow-hidden shadow-sm">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Recent Activity</h3>
                <button className="text-[10px] font-black text-primary-800 hover:text-black transition-colors uppercase tracking-widest flex items-center gap-2">
                    View All <ArrowRight className="w-4 h-4" />
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Operator</th>
                            <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Action</th>
                            <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Timestamp</th>
                            <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Value</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {[1, 2, 3, 4].map((_, i) => (
                            <tr key={i} className="hover:bg-gray-50 transition-colors cursor-pointer group">
                                <td className="px-8 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-black text-gray-900 group-hover:bg-primary-500 transition-colors">JD</div>
                                        <span className="text-sm font-bold text-gray-900">John Doe</span>
                                    </div>
                                </td>
                                <td className="px-8 py-5 text-sm text-gray-500">Order Approval #4492</td>
                                <td className="px-8 py-5 text-sm text-gray-400 font-mono">2 mins ago</td>
                                <td className="px-8 py-5 text-right font-black text-gray-900">$12,450</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
);

const SupplierDashboardView = () => (
    <div className="space-y-8">
        {/* KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {SUPPLIER_KPIS.map((kpi, i) => (
                <div key={i} className={`bg-white border ${kpi.alert ? 'border-primary-500 bg-primary-50/10' : 'border-gray-200'} p-5 rounded-3xl group transition-all shadow-sm`}>
                    <div className="flex justify-between items-start mb-3">
                        <kpi.icon className={`w-4 h-4 ${kpi.alert ? 'text-primary-600 animate-pulse' : 'text-gray-400'}`} />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 tracking-tight">{kpi.value}</h3>
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-tighter">{kpi.label}</p>
                </div>
            ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-white border border-gray-200 p-8 rounded-[32px] shadow-sm">
                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-10">Inventory Health</h3>
                <div className="h-[250px] w-full">
                    <DonutChart data={INVENTORY_HEALTH} />
                </div>
                <div className="mt-8 space-y-3">
                    {INVENTORY_HEALTH.map((item, i) => (
                        <div key={i} className="flex justify-between items-center group cursor-pointer">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-wide group-hover:text-gray-900 transition-colors">{item.label}</span>
                            </div>
                            <span className="text-sm font-black text-gray-900">{item.value}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="lg:col-span-2 bg-white border border-gray-200 p-8 rounded-[32px] shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center mb-6">
                    <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Active Orders</h3>
                    <span className="px-3 py-1 bg-primary-500 text-black text-[10px] font-black rounded-lg uppercase">Action Required</span>
                </div>
                <div className="space-y-4">
                    {[1, 2, 3, 4].map((_, i) => (
                        <div key={i} className="bg-gray-50/50 border border-gray-100 p-5 rounded-2xl flex items-center justify-between group hover:border-primary-500/50 transition-all">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center font-black text-primary-600 uppercase">ORD</div>
                                <div>
                                    <h4 className="text-gray-900 font-bold tracking-tight">Order #P-8821</h4>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">3 Items • 2h left</p>
                                </div>
                            </div>
                            <button className="px-4 py-2 bg-primary-500 text-black text-[10px] font-black rounded-xl uppercase hover:bg-black hover:text-white transition-all">
                                Restock
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

export default DashboardPage;
