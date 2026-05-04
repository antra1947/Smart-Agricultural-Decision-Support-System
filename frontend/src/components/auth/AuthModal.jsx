import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Sprout, X } from 'lucide-react';

const AuthModal = ({ isOpen, onClose }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('farmer');
    const [error, setError] = useState('');
    
    const { login, register, user } = useContext(AuthContext);

    // Close modal if user logged in successfully
    useEffect(() => {
        if (user && isOpen) {
            onClose();
        }
    }, [user, isOpen, onClose]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if (isLogin) {
                await login(email, password);
            } else {
                await register(name, email, password, role);
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Authentication failed');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-slate-900 bg-opacity-50 backdrop-blur-sm">
            <div className="relative w-full max-w-md p-4">
                {/* Modal content */}
                <div className="relative bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
                    {/* Close Button */}
                    <button 
                        onClick={onClose} 
                        className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition"
                    >
                        <X size={24} />
                    </button>

                    <div className="flex justify-center text-brand-600 mb-4">
                        <Sprout size={48} />
                    </div>
                    <h2 className="text-center text-2xl font-extrabold text-slate-900 mb-2">
                        {isLogin ? 'Welcome Back' : 'Create an Account'}
                    </h2>
                    <p className="text-center text-sm text-slate-600 mb-6">
                        {isLogin ? (
                            <>Don't have an account? <button type="button" onClick={() => setIsLogin(false)} className="font-medium text-brand-600 hover:text-brand-500">Sign up</button></>
                        ) : (
                            <>Already have an account? <button type="button" onClick={() => setIsLogin(true)} className="font-medium text-brand-600 hover:text-brand-500">Login</button></>
                        )}
                    </p>

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        {error && <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">{error}</div>}
                        
                        {!isLogin && (
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Full Name</label>
                                <input type="text" required className="mt-1 appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm" value={name} onChange={e => setName(e.target.value)} />
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-slate-700">Email address</label>
                            <input type="email" required className="mt-1 appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm" value={email} onChange={e => setEmail(e.target.value)} />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700">Password</label>
                            <input type="password" required className="mt-1 appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm" value={password} onChange={e => setPassword(e.target.value)} />
                        </div>

                        {!isLogin && (
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Role</label>
                                <select className="mt-1 block w-full px-3 py-2 border border-slate-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm" value={role} onChange={e => setRole(e.target.value)}>
                                    <option value="farmer">Farmer</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                        )}

                        <button type="submit" className="w-full flex justify-center py-2 px-4 mt-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition">
                            {isLogin ? 'Log In' : 'Sign Up'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
