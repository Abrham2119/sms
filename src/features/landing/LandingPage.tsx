import { Link, Navigate } from 'react-router-dom';
import { ArrowRight, LayoutDashboard, ShieldCheck, Wallet, RefreshCcw, Building2 } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export const LandingPage = () => {
    const { isAuthenticated } = useAuthStore();


    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    const features = [
        {
            icon: Wallet,
            title: "View Account Balances",
            description: "Check your savings and loan balances instantly from anywhere."
        },
        {
            icon: RefreshCcw,
            title: "Transaction History",
            description: "Track your deposits, withdrawals, and transfers with detailed history."
        },
        {
            icon: ShieldCheck,
            title: "Secure Access",
            description: "Enterprise-grade security to keep your financial data protected."
        },
        {
            icon: Building2,
            title: "Branch Services",
            description: "Find your local branch and access member services easily."
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <div className="flex-1 bg-white">
                <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="bg-primary-600 p-2 rounded-lg">
                            <LayoutDashboard className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-bold text-black">Member Portal</span>
                    </div>
                </nav>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 flex flex-col items-center text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-black tracking-tight mb-6">
                        Smart Banking for <span className="text-primary-600">Smart Members</span>
                    </h1>
                    <p className="text-lg md:text-xl text-black max-w-2xl mb-10">
                        Securely manage your membership, savings, and transactions. Experience the next generation of digital banking services.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                        <Link
                            to="/Login"
                            className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                        >
                            Sign In
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link
                            to="/register"
                            className="px-8 py-4 bg-white hover:bg-gray-50 text-black border border-gray-200 font-semibold rounded-xl transition-all hover:border-gray-300 flex items-center justify-center"
                        >
                            Register
                        </Link>
                    </div>
                </div>
            </div>


            <div className="bg-gray-50 py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <div key={index} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600 mb-6">
                                    <feature.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-black mb-3">{feature.title}</h3>
                                <p className="text-black leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>


            <footer className="bg-white border-t border-gray-200 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="text-black text-sm">
                        © {new Date().getFullYear()} Member Portal. All rights reserved.
                    </div>
                    <div className="flex gap-8 text-black">
                        <a href="#" className="hover:text-primary-600 transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-primary-600 transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-primary-600 transition-colors">Contact Support</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

