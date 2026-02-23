
import { useAuthStore } from "../../store/authStore";
import { UserCircle, Shield } from "lucide-react";

const DashboardPage = () => {
    const { user, roles } = useAuthStore();

    return (
        <div className="max-w-[1400px] mx-auto pb-8 animate-in fade-in duration-500">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-2">
                    Dashboard
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Welcome back, {user?.name || 'User'}!
                </p>
            </div>

            {/* User Info Card */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm p-8 mb-6">
                <div className="flex items-start gap-6">
                    <div className="w-20 h-20 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                        <UserCircle className="w-12 h-12 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            {user?.name || 'User'}
                        </h2>
                        <div className="flex items-center gap-2 mb-4">
                            <Shield className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                            <span className="text-gray-600 dark:text-gray-400 font-medium">
                                Role{roles.length > 1 ? 's' : ''}:
                            </span>
                            <div className="flex gap-2 flex-wrap">
                                {roles.map((role) => (
                                    <span
                                        key={role.uuid}
                                        className="px-3 py-1 text-sm font-semibold rounded-full bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 border border-primary-200 dark:border-primary-800"
                                    >
                                        {role.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                        {user?.email && (
                            <p className="text-gray-600 dark:text-gray-400">
                                <span className="font-medium">Email:</span> {user.email}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Additional dashboard content can go here */}
        </div>
    );
};

export default DashboardPage;
