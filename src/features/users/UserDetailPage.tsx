import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    User as UserIcon,
    Mail,
    Phone,
    Shield,
    Clock,
    Activity,
    Settings,
    CheckCircle,
    AlertCircle,
    Power
} from 'lucide-react';
import { useUser, useDeleteUser } from './hooks/useUser';
import { ActivityLog } from '../../components/common/ActivityLog';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { CustomDropdown } from '../../components/ui/CustomDropdown';
import { Tooltip } from '../../components/ui/Tooltip';
import { UserStatusModal } from './components/UserStatusModal';
import type { User } from '../../types';

// Tab Components
const UserOverviewTab = ({ user, setActiveTab }: { user: User, setActiveTab: (tab: string) => void }) => {
    const formatDate = (dateStr?: string) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Profile Info Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-100 dark:border-gray-700 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <UserIcon className="w-5 h-5 text-primary-600" />
                    Account Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Full Name</label>
                        <p className="font-bold text-gray-900 dark:text-white mt-2 text-lg">{user.name}</p>
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email Address</label>
                        <p className="font-medium text-gray-900 dark:text-white mt-2 flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-400" />
                            {user.email}
                        </p>
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone Number</label>
                        <p className="font-medium text-gray-900 dark:text-white mt-2 flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            {user.phone || 'Not provided'}
                        </p>
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Current Status</label>
                        <div className="mt-2">
                            <Badge variant={user.status === 'active' ? 'success' : 'default'}>
                                {user.status || 'inactive'}
                            </Badge>
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email Verified</label>
                        <p className="font-medium text-gray-900 dark:text-white mt-2 flex items-center gap-2">
                            {user.email_verified_at ? (
                                <>
                                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                                    {formatDate(user.email_verified_at)}
                                </>
                            ) : (
                                <>
                                    <AlertCircle className="w-4 h-4 text-amber-500" />
                                    Pending Verification
                                </>
                            )}
                        </p>
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Roles</label>
                        <div className="mt-2 flex flex-wrap gap-2">
                            {user.roles && user.roles.length > 0 ? (() => {
                                const formattedRoles = user.roles.map((role: any) => {
                                    const name = typeof role === 'string' ? role : role.name;
                                    return name.replace(/_/g, ' ');
                                });

                                return (
                                    <div className="flex items-center gap-2">
                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-100 dark:border-blue-800">
                                            <Shield className="w-3 h-3" />
                                            {formattedRoles[0]}
                                        </span>
                                        {formattedRoles.length > 1 && (
                                            <Tooltip content={formattedRoles.join(', ')}>
                                                <div className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-[10px] font-bold text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-help border border-gray-200 dark:border-gray-700">
                                                    +{formattedRoles.length - 1}
                                                </div>
                                            </Tooltip>
                                        )}
                                    </div>
                                );
                            })() : (
                                <span className="text-xs text-gray-400 italic">No assigned roles</span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-10 pt-8 border-t border-gray-50 dark:border-gray-700/50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
                        <div className="flex items-center gap-3 text-gray-500">
                            <Clock className="w-4 h-4" />
                            <span>Created: {formatDate(user.created_at)}</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-500">
                            <Clock className="w-4 h-4" />
                            <span>Last Updated: {formatDate(user.updated_at)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Account Management Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-100 dark:border-gray-700 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <Settings className="w-5 h-5 text-gray-400" />
                    Account Security & Access
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-5 rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/20">
                        <h4 className="font-bold text-gray-900 dark:text-white mb-2">Password Management</h4>
                        <p className="text-sm text-gray-500 mb-4">Security protocols recommend periodic password updates.</p>
                        <Button variant="outline" size="sm">Reset User Password</Button>
                    </div>
                    <div className="p-5 rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/20">
                        <h4 className="font-bold text-gray-900 dark:text-white mb-2">Access Control</h4>
                        <p className="text-sm text-gray-500 mb-4">Temporarily disable or enable this user account.</p>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setActiveTab('settings')}
                        >
                            Manage Account Access
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SettingsTab = ({ user, onDelete, onStatusChange }: { user: User, onDelete: () => void, onStatusChange: () => void }) => (
    <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-100 dark:border-gray-700 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Settings className="w-5 h-5 text-primary-600" />
                Account Management
            </h3>
            <div className="flex items-center justify-between p-6 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-700">
                <div>
                    <p className="font-bold text-gray-900 dark:text-white mb-1">Status: <span className="capitalize text-primary-600">{user.status || 'inactive'}</span></p>
                    <p className="text-sm text-gray-500">Enable or disable this user's access to the system.</p>
                </div>
                <Button onClick={onStatusChange} variant="outline" className="rounded-xl">
                    Change Status
                </Button>
            </div>
        </div>

        <div className="bg-red-50 dark:bg-red-900/10 rounded-2xl p-8 border border-red-100 dark:border-red-900/20">
            <h3 className="text-lg font-bold text-red-900 dark:text-red-400 mb-4">Danger Zone</h3>
            <div className="flex items-center justify-between">
                <div>
                    <p className="font-bold text-red-800 dark:text-red-300">Delete User Account</p>
                    <p className="text-sm text-red-600 dark:text-red-400/80">
                        Permanently remove this user and all associated data. This action is irreversible.
                    </p>
                </div>
                <Button onClick={onDelete} className="bg-red-600 hover:bg-red-700 text-white border-none rounded-xl px-6 font-bold">
                    Delete User
                </Button>
            </div>
        </div>
    </div>
);

export const UserDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const { data: user, isLoading, error } = useUser(id!);
    const deleteMutation = useDeleteUser();

    const handleDelete = async () => {
        await deleteMutation.mutateAsync(id!);
        navigate('/users');
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                <p className="text-gray-500 font-medium tracking-wide">Loading user data...</p>
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-4">
                <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-6">
                    <AlertCircle className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">User Not Found</h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-sm mb-8">
                    The user you are looking for does not exist or has been removed from the system.
                </p>
                <Button onClick={() => navigate('/users')} className="rounded-full px-8">
                    Return to Users List
                </Button>
            </div>
        );
    }

    const tabs = [
        { id: 'overview', label: 'Overview', icon: UserIcon },
        { id: 'activity', label: 'Activity Logs', icon: Activity },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-gray-50/30 dark:bg-gray-900/30 pb-20">
            {/* Premium Header */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 py-10 lg:px-8 relative z-10">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate('/users')}
                        className="text-gray-500 hover:text-gray-900 dark:hover:text-white -ml-2 mb-6 group transition-all"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to User Management
                    </Button>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div className="flex items-start gap-6">
                            <div className="w-20 h-20 rounded-3xl bg-primary-500 flex items-center justify-center text-black font-black text-3xl shadow-2xl shadow-primary-500/20 animate-in zoom-in duration-500">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="space-y-2">
                                <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                                    {user.name}
                                </h1>
                                <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
                                    <span className="flex items-center gap-1.5 text-gray-500">
                                        <Mail className="w-4 h-4" />
                                        {user.email}
                                    </span>
                                    <span className="text-gray-300 dark:text-gray-700">•</span>
                                    <div className="w-40">
                                        <CustomDropdown
                                            options={[
                                                { label: 'Active', value: 'active', icon: CheckCircle },
                                                { label: 'Inactive', value: 'inactive', icon: Power }
                                            ]}
                                            value={user.status || 'inactive'}
                                            onChange={(val) => {
                                                if (val !== user.status) {
                                                    setIsStatusModalOpen(true);
                                                }
                                            }}
                                            className="h-9"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                onClick={() => setActiveTab('settings')}
                                className="rounded-xl border-gray-200 dark:border-gray-700 shadow-sm"
                            >
                                <Settings className="w-4 h-4 mr-2" /> Manage Account
                            </Button>
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex gap-10 mt-12 border-b border-gray-100 dark:border-gray-700">
                        {tabs.map(tab => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`
                                        flex items-center gap-2.5 pb-4 text-sm font-bold transition-all relative
                                        ${isActive
                                            ? 'text-primary-800 dark:text-primary-400'
                                            : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
                                        }
                                    `}
                                >
                                    <Icon className={`w-4 h-4 ${isActive ? 'animate-pulse' : ''}`} />
                                    {tab.label}
                                    {isActive && (
                                        <div className="absolute bottom-0 left-0 w-full h-1 bg-primary-500 rounded-t-full animate-in slide-in-from-bottom-2" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary-50 dark:bg-primary-900/5 rounded-full blur-3xl opacity-50 pointer-events-none" />
            </div>

            {/* Main Content Area */}
            <div className="max-w-7xl mx-auto px-6 py-10 lg:px-8">
                {activeTab === 'overview' && <UserOverviewTab user={user} setActiveTab={setActiveTab} />}
                {activeTab === 'activity' && <ActivityLog entityType="user" entityId={id!} />}
                {activeTab === 'settings' && (
                    <SettingsTab
                        user={user}
                        onDelete={() => setIsDeleteModalOpen(true)}
                        onStatusChange={() => setIsStatusModalOpen(true)}
                    />
                )}
            </div>

            {/* Modals */}
            <ConfirmDialog
                open={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title="Delete User Account?"
                description={`Are you sure you want to delete "${user.name}"? This action cannot be undone and will permanently remove the user from the system.`}
                confirmText="Yes, Delete User"
                variant="danger"
                isLoading={deleteMutation.isPending}
            />

            <UserStatusModal
                isOpen={isStatusModalOpen}
                onClose={() => setIsStatusModalOpen(false)}
                user={user}
            />
        </div>
    );
};

export default UserDetailPage;
