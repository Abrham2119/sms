import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useMyProfile, useUpdateMyProfile } from './hooks/useSupplier';
import { Loader2, Save, Building2, Mail, Phone, Globe, ShieldCheck, UserCog } from 'lucide-react';

interface ProfileFormData {
    trade_name: string;
    website: string;
}

const ProfilePage = () => {
    const { data: profileData, isLoading } = useMyProfile();
    const updateMutation = useUpdateMyProfile();

    const { register, handleSubmit, reset, formState: { isDirty } } = useForm<ProfileFormData>();

    const supplierProfile = profileData?.supplier_profile;
    const user = profileData;

    useEffect(() => {
        if (supplierProfile) {
            reset({
                trade_name: supplierProfile.trade_name || '',
                website: supplierProfile.website || '',
            });
        }
    }, [supplierProfile, reset]);

    const onSubmit = async (data: ProfileFormData) => {
        try {
            await updateMutation.mutateAsync(data);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            // Error handling is done in the hook
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            </div>
        );
    }

    if (!supplierProfile) {
        return (
            <div className="p-6 text-center text-gray-500">
                Failed to load profile data.
            </div>
        );
    }

    return (
        <div className="p-6 max-w-4xl mx-auto animate-in fade-in duration-700">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-2">
                    My Profile
                </h1>
                <p className="text-gray-500 text-sm font-medium">
                    Manage your supplier profile information
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Main Profile Card - Left Column */}
                <div className="md:col-span-1 space-y-6">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                        <div className="flex flex-col items-center">
                            <div className="w-24 h-24 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mb-4">
                                <Building2 className="w-10 h-10 text-primary-600 dark:text-primary-400" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-1">
                                {supplierProfile.legal_name}
                            </h2>
                            <p className="text-sm text-gray-500 text-center mb-4">
                                {supplierProfile.status}
                            </p>
                            <div className={`px-3 py-1 rounded-full text-xs font-semibold
                                ${supplierProfile.is_active === '1'
                                    ? 'bg-success-100 text-success-700'
                                    : 'bg-gray-100 text-gray-700'
                                }`}>
                                {supplierProfile.is_active === '1' ? 'Active' : 'Inactive'}
                            </div>
                        </div>

                        <div className="mt-8 space-y-4">
                            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                                <Mail className="w-4 h-4" />
                                <span className="truncate" title={user?.email}>{user?.email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                                <Phone className="w-4 h-4" />
                                <span>{supplierProfile.phone || 'No phone'}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                                <Globe className="w-4 h-4" />
                                <a href={supplierProfile.website || '#'} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline truncate">
                                    {supplierProfile.website || 'No website'}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Edit Form & Details - Right Column */}
                <div className="md:col-span-2 space-y-6">
                    {/* Editable Information */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <UserCog className="w-5 h-5 text-primary-600" />
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                Edit Information
                            </h3>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Trade Name
                                    </label>
                                    <Input
                                        className="bg-transparent border-gray-200 dark:border-gray-700"
                                        placeholder="Enter trade name"
                                        {...register('trade_name')}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Website
                                    </label>
                                    <Input
                                        className="bg-transparent border-gray-200 dark:border-gray-700"
                                        placeholder="https://example.com"
                                        {...register('website')}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <Button
                                    type="submit"
                                    disabled={!isDirty || updateMutation.isPending}
                                    className="bg-primary-600 hover:bg-primary-700"
                                >
                                    {updateMutation.isPending ? (
                                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                    ) : (
                                        <Save className="w-4 h-4 mr-2" />
                                    )}
                                    Save Changes
                                </Button>
                            </div>
                        </form>
                    </div>

                    {/* Read-only Legal Information */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <ShieldCheck className="w-5 h-5 text-primary-600" />
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                Legal Information
                            </h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                                    Legal Name
                                </h4>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {supplierProfile.legal_name}
                                </p>
                            </div>
                            <div>
                                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                                    TIN
                                </h4>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {supplierProfile.tin || '-'}
                                </p>
                            </div>
                            <div>
                                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                                    VAT Number
                                </h4>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {supplierProfile.vat_number || '-'}
                                </p>
                            </div>
                            <div>
                                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                                    License Number
                                </h4>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {supplierProfile.license_number || '-'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
