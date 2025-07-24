'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Terminal, User, Building, Mail, Lock, Eye, EyeOff, ArrowLeft, Shield } from 'lucide-react';
import Link from 'next/link';
import { useAuth, UserType } from '@/contexts/AuthContext';

export default function AuthPage() {
  const { login, register, isLoading, isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [accountType, setAccountType] = useState<'user' | 'vendor'>('user');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const dashboardPath = user.userType === 'vendor' ? '/vendor/dashboard' : '/user/dashboard';
      router.push(dashboardPath);
    }
  }, [isAuthenticated, user, router]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError(''); // Clear error when user starts typing
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (authMode === 'login') {
        await login(formData.email, formData.password, accountType as UserType);
      } else {
        // Validation for registration
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match');
        }

        await register({
          email: formData.email,
          password: formData.password,
          name: formData.fullName,
          confirmPassword: formData.confirmPassword,
          userType: accountType as UserType,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center font-mono">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-8 h-8 border border-white-400 flex items-center justify-center animate-pulse">
              <Terminal className="h-4 w-4 text-white-400" />
            </div>
          </div>
          <div className="text-white-400 text-sm uppercase tracking-wider animate-pulse">
            LOADING...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 font-mono">
      {/* Background Grid */}
      <div className="absolute inset-0 data-grid opacity-10"></div>
      
      <div className="relative w-full max-w-md">
        {/* Back to Home */}
        <Link href="/" className="inline-flex items-center text-zinc-400 hover:text-white transition-colors mb-8 group text-sm uppercase tracking-wider">
          <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          RETURN
        </Link>

        <Card className="bg-zinc-950 border border-zinc-800">
          <CardHeader className="text-center border-b border-zinc-800">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-8 h-8 border border-white-400 flex items-center justify-center">
                <Terminal className="h-4 w-4 text-white-400" />
              </div>
              <span className="text-2xl font-bold tracking-wider">PRINTEASE</span>
            </div>
            <CardTitle className="text-2xl tracking-tighter">
              {authMode === 'login' ? 'ACCESS CONTROL' : 'SYSTEM REGISTRATION'}
            </CardTitle>
            <CardDescription className="text-zinc-400 font-mono text-sm">
              {authMode === 'login' 
                ? 'AUTHENTICATE TO CONTINUE' 
                : 'INITIALIZE NEW USER PROTOCOL'
              }
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 p-6">
            {/* Account Type Toggle */}
            <div className="flex items-center justify-center">
              <div className="bg-black border border-zinc-700 p-1 flex">
                <button
                  onClick={() => setAccountType('user')}
                  className={`flex items-center space-x-2 px-4 py-2 transition-all text-xs uppercase tracking-wider ${
                    accountType === 'user'
                      ? 'bg-white-400 text-black'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <User className="h-3 w-3" />
                  <span>USER</span>
                </button>
                <button
                  onClick={() => setAccountType('vendor')}
                  className={`flex items-center space-x-2 px-4 py-2 transition-all text-xs uppercase tracking-wider ${
                    accountType === 'vendor'
                      ? 'bg-white-400 text-black'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Building className="h-3 w-3" />
                  <span>VENDOR</span>
                </button>
              </div>
            </div>

            {/* Auth Mode Tabs */}
            <Tabs value={authMode} onValueChange={(value) => setAuthMode(value as 'login' | 'register')}>
              <TabsList className="grid w-full grid-cols-2 bg-black border border-zinc-700 p-1">
                <TabsTrigger 
                  value="login" 
                  className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white text-zinc-400 text-xs uppercase tracking-wider"
                >
                  ACCESS
                </TabsTrigger>
                <TabsTrigger 
                  value="register"
                  className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white text-zinc-400 text-xs uppercase tracking-wider"
                >
                  REGISTER
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4 mt-6">
                {error && (
                  <div className="bg-red-950 border border-red-800 text-red-400 px-4 py-3 text-sm font-mono">
                    ERROR: {error}
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs uppercase tracking-wider text-zinc-400">
                      EMAIL ADDRESS
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="user@domain.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="pl-10 bg-black border-zinc-700 focus:border-white-400 font-mono text-sm"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-xs uppercase tracking-wider text-zinc-400">
                      PASSWORD
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className="pl-10 pr-10 bg-black border-zinc-700 focus:border-white-400 font-mono text-sm"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-zinc-500 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Link href="#" className="text-xs text-white-400 hover:text-white-300 uppercase tracking-wider">
                      RESET PASSWORD
                    </Link>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full primary-button h-11 text-xs"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'AUTHENTICATING...' : `AUTHENTICATE ${accountType.toUpperCase()}`}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register" className="space-y-4 mt-6">
                {error && (
                  <div className="bg-red-950 border border-red-800 text-red-400 px-4 py-3 text-sm font-mono">
                    ERROR: {error}
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-xs uppercase tracking-wider text-zinc-400">
                      {accountType === 'user' ? 'FULL NAME' : 'CONTACT NAME'}
                    </Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder={accountType === 'user' ? 'John Doe' : 'Contact Person'}
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className="bg-black border-zinc-700 focus:border-white-400 font-mono text-sm"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs uppercase tracking-wider text-zinc-400">
                      EMAIL ADDRESS
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="user@domain.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="pl-10 bg-black border-zinc-700 focus:border-white-400 font-mono text-sm"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-xs uppercase tracking-wider text-zinc-400">
                      PASSWORD
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className="pl-10 pr-10 bg-black border-zinc-700 focus:border-white-400 font-mono text-sm"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-zinc-500 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-xs uppercase tracking-wider text-zinc-400">
                      CONFIRM PASSWORD
                    </Label>
                    <div className="relative">
                      <Shield className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        className="pl-10 bg-black border-zinc-700 focus:border-white-400 font-mono text-sm"
                        required
                      />
                    </div>
                  </div>

                  <div className="text-xs text-zinc-500 font-mono">
                    BY REGISTERING, YOU AGREE TO OUR{' '}
                    <Link href="#" className="text-white-400 hover:text-white-300">
                      TERMS
                    </Link>{' '}
                    AND{' '}
                    <Link href="#" className="text-white-400 hover:text-white-300">
                      PRIVACY POLICY
                    </Link>
                    .
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full primary-button h-11 text-xs"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'INITIALIZING...' : `INITIALIZE ${accountType.toUpperCase()} ACCOUNT`}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-zinc-700" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-zinc-950 px-2 text-zinc-500 tracking-wider">ALTERNATIVE ACCESS</span>
              </div>
            </div>

            {/* OAuth Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <Button className="cyber-button h-10 text-xs">
                <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                GOOGLE
              </Button>
              <Button className="cyber-button h-10 text-xs">
                <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.024-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.174.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.756-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-12.013C24.007 5.367 18.641.001 12.017.001z"/>
                </svg>
                GITHUB
              </Button>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-zinc-500 mt-6 font-mono uppercase tracking-wider">
          NEED ASSISTANCE? <Link href="#" className="text-white-400 hover:text-white-300">CONTACT SUPPORT</Link>
        </p>
      </div>
    </div>
  );
}