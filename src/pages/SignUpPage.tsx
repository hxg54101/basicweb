import { User, Mail, Lock, CheckCircle } from 'lucide-react';
import { useState } from 'react';

interface SignUpPageProps {
  onNavigate: (page: 'login' | 'signup' | 'dlc' | 'song' | 'gamecenter') => void;
}

export default function SignUpPage({ onNavigate }: SignUpPageProps) {
  const [id, setId] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, password, username }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('token', data.token);
        setMessage('Signup successful!');
        setTimeout(() => onNavigate('song'), 500);
      } else {
        setMessage(data.message || 'Signup failed');
      }
    } catch (error) {
      setMessage('Error: Connection failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] flex flex-col">
      <header className="flex justify-end p-6">
        <button
          onClick={() => onNavigate('login')}
          className="text-white text-sm hover:text-gray-300 transition-colors"
        >
          LOGIN
        </button>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <h1 className="text-white text-4xl font-bold mb-12">WELCOME!</h1>

        <div className="bg-[#333333] rounded p-8 w-full max-w-xl">
          <h2 className="text-white text-xl font-semibold mb-6">SIGN UP</h2>

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="flex items-center bg-[#121212] rounded px-4 py-3">
              <User className="text-gray-400 mr-3" size={20} />
              <input
                type="text"
                placeholder="ID"
                value={id}
                onChange={(e) => setId(e.target.value)}
                className="bg-transparent text-white outline-none flex-1 placeholder-gray-500"
                required
              />
            </div>

            <div className="flex items-center bg-[#121212] rounded px-4 py-3">
              <Mail className="text-gray-400 mr-3" size={20} />
              <input
                type="text"
                placeholder="USERNAME"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-transparent text-white outline-none flex-1 placeholder-gray-500"
                required
              />
            </div>

            <div className="flex items-center bg-[#121212] rounded px-4 py-3">
              <Lock className="text-gray-400 mr-3" size={20} />
              <input
                type="password"
                placeholder="PW"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-transparent text-white outline-none flex-1 placeholder-gray-500"
                required
              />
            </div>

            <div className="flex items-center bg-[#121212] rounded px-4 py-3">
              <CheckCircle className="text-gray-400 mr-3" size={20} />
              <input
                type="password"
                placeholder="PW CHECK"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-transparent text-white outline-none flex-1 placeholder-gray-500"
                required
              />
            </div>

            {message && (
              <p className={`text-sm ${message.includes('successful') ? 'text-[#90EE90]' : 'text-red-400'}`}>
                {message}
              </p>
            )}

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="text-white hover:text-gray-300 text-sm font-semibold transition-colors disabled:opacity-50"
              >
                {isLoading ? 'LOADING...' : 'SIGNUP'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
