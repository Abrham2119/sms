import { ArrowRight, Loader2, Lock, Mail, Phone, User } from 'lucide-react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getRoleRedirectPath } from '../../utils/roleRedirect';

export const RegisterPage = () => {
    const navigate = useNavigate();
    const { register: registerUser } = useAuthStore();
    const [isLoading, setIsLoading] = React.useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data: any) => {
        setIsLoading(true);
        try {


            await registerUser({
                name: data.fullName,
                email: data.email,
                password: data.password,
                password_confirmation: data.password,
                roles: ["Supplier"]
            });

            toast.success("Registration successful");

            const { roles } = useAuthStore.getState();
            const redirectPath = getRoleRedirectPath(roles);
            navigate(redirectPath);

        } catch (error: any) {
            toast.error(error.response?.data?.message || "Registration failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md space-y-8 animate-fade-in">
            <div className="text-center">
                <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                    Create an account
                </h2>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Join the member portal today
                </p>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-4 rounded-md shadow-sm">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            {...register('fullName', { required: 'Full name is required' })}
                            type="text"
                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 sm:text-sm transition-colors"
                            placeholder="Full Name"
                        />
                        {errors.fullName && (
                            <p className="mt-1 text-xs text-red-500">{errors.fullName.message as string}</p>
                        )}
                    </div>

                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            {...register('email', {
                                required: 'Email is required',
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Invalid email address"
                                }
                            })}
                            type="email"
                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 sm:text-sm transition-colors"
                            placeholder="Email address"
                        />
                        {errors.email && (
                            <p className="mt-1 text-xs text-red-500">{errors.email.message as string}</p>
                        )}
                    </div>

                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Phone className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            {...register('phone', { required: 'Phone number is required' })}
                            type="tel"
                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 sm:text-sm transition-colors"
                            placeholder="Phone Number"
                        />
                        {errors.phone && (
                            <p className="mt-1 text-xs text-red-500">{errors.phone.message as string}</p>
                        )}
                    </div>

                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min length is 6' } })}
                            type="password"
                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 sm:text-sm transition-colors"
                            placeholder="Password"
                        />
                        {errors.password && (
                            <p className="mt-1 text-xs text-red-500">{errors.password.message as string}</p>
                        )}
                    </div>
                </div>

                <div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-primary-600/30"
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                    <ArrowRight className="h-5 w-5 text-primary-500 group-hover:text-primary-400" aria-hidden="true" />
                                </span>
                                Create Account
                            </>
                        )}
                    </button>
                </div>

                <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Already have an account?{' '}
                        <Link to="/Login" className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 hover:underline transition-all">
                            Sign in
                        </Link>
                    </p>
                </div>
            </form>
        </div>
    );
};
