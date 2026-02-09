import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { getRoleRedirectPath } from "../../utils/roleRedirect";

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login({ email, password });
      toast.success("Login successful");


      const { roles } = useAuthStore.getState();
      const redirectPath = getRoleRedirectPath(roles);
      navigate(redirectPath);

    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-100 dark:border-gray-700">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-primary-600 dark:text-primary-400">
            SMS Portal
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Sign in to your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
          />

          <Button type="submit" className="w-full" isLoading={isLoading}>
            Sign In
          </Button>

          <div className="text-center mt-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">Don't have an account? </span>
            <Link to="/register" className="text-sm text-primary-600 hover:underline">Register</Link>
          </div>
        </form>
      </div>
    </div>
  );
};
