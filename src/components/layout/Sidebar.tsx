import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { PERMISSIONS, type Permission } from '../../types';
import {
    Truck,
    ClipboardList,
    Users,
    LogOut,
    X,
    LayoutDashboard
} from 'lucide-react';
import { Button } from '../ui/Button';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

interface SidebarLink {
    name: string;
    path: string;
    icon: any;
    roles?: string[];
    permission?: Permission;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
    const { user, roles, logout, hasPermission } = useAuthStore();
    const location = useLocation();

    const isActive = (path: string) => location.pathname.startsWith(path);

    const links: SidebarLink[] = [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: [] },
        { name: 'Suppliers', path: '/suppliers', icon: Truck, roles: ['admin', 'supplier'] },
        { name: 'Requests', path: '/requests', icon: ClipboardList, roles: ['admin', 'supplier'] },
        { name: 'Admins', path: '/admins', icon: Users, roles: ['admin'] },

        { name: 'Users', path: '/users', icon: Users, permission: PERMISSIONS.READ_USER },
        { name: 'Roles', path: '/roles', icon: ClipboardList, permission: PERMISSIONS.READ_ROLES },
        { name: 'Permissions', path: '/permissions', icon: ClipboardList, permission: PERMISSIONS.READ_PERMISSION },
    ];

    const filteredLinks = links.filter(link => {
        // If permission required, check it
        if (link.permission) {
            return hasPermission(link.permission);
        }

        // Fallback to Role checks (legacy)
        if (!link.roles || link.roles.length === 0) return true;
        return roles.some(role => link.roles!.includes(role.name.toLowerCase()));
    });

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed top-0 left-0 z-50 h-full bg-[var(--color-sidebar-bg)] text-white border-r border-gray-800
                transition-all duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:translate-x-0
                group w-64 lg:w-20 lg:hover:w-64
            `}>
                <div className="h-full flex flex-col overflow-hidden">
                    {/* Header */}
                    <div className="h-16 flex items-center justify-between px-6 border-b border-gray-800 whitespace-nowrap">
                        <div className="flex items-center gap-2 min-w-max">
                            {/* Placeholder Logo Icon */}
                            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center shrink-0">
                                <span className="font-bold text-white">A</span>
                            </div>
                            <span className="text-xl font-bold text-white opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300">
                                SMS Portal
                            </span>
                        </div>
                        <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-white">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Nav Links */}
                    <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto overflow-x-hidden">
                        <div className="mb-6">
                            <div className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                                Menu
                            </div>
                            {filteredLinks.map((link) => {
                                const Icon = link.icon;
                                const active = isActive(link.path);
                                return (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        onClick={() => onClose()}
                                        className={`
                                            flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                                            ${active
                                                ? 'bg-blue-600/20 text-blue-400 border-l-4 border-blue-500' // Active state style
                                                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                            }
                                        `}
                                        title={link.name}
                                    >
                                        <Icon className="w-5 h-5 shrink-0" />
                                        <span className="opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                                            {link.name}
                                        </span>
                                    </Link>
                                );
                            })}
                        </div>
                    </nav>

                    {/* Footer */}
                    <div className="p-4 border-t border-gray-800 bg-[var(--color-sidebar-bg)] overflow-hidden">
                        <div className="mb-4 px-2 flex items-center gap-3 whitespace-nowrap">
                            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold shrink-0">
                                {user?.name?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div className="overflow-hidden opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300">
                                <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                                <p className="text-xs text-gray-400 capitalize">{roles.map(r => r.name).join(', ')}</p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-900/20"
                            onClick={() => logout()}
                        >
                            <LogOut className="w-4 h-4 mr-2 shrink-0" />
                            <span className="opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                                Log out
                            </span>
                        </Button>
                    </div>
                </div>
            </aside>
        </>
    );
};
