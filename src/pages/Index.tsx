import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Truck, MapPin, Activity, Shield, Users, BarChart3 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { toast } from '@/components/ui/sonner';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const { user, signIn, signUp, loading } = useAuth();
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: '',
    company: ''
  });
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [activeTab, setActiveTab] = useState('login');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If user is already logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      await signIn(loginForm.email, loginForm.password);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    if (signupForm.password !== signupForm.confirmPassword) {
      toast("Passwords do not match");
      return;
    }

    try {
      setIsSubmitting(true);
      await signUp(
        signupForm.email, 
        signupForm.password, 
        signupForm.name,
        signupForm.company
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotPasswordEmail) {
      toast("Please enter your email address");
      return;
    }

    try {
      setIsSubmitting(true);
      const { data, error } = await supabase.auth.resetPasswordForEmail(
        forgotPasswordEmail,
        { redirectTo: window.location.origin + '/reset-password' }
      );

      if (error) throw error;

      toast("Password reset email sent");
      setForgotPasswordEmail('');
    } catch (error: any) {
      toast(error.message || "Failed to send password reset email");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Header */}
      <header className="relative z-10 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-2">
            <Truck className="h-8 w-8 text-blue-400" />
            <span className="text-2xl font-bold text-white">Cartrack</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative px-6 py-12">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Hero content */}
          <div className="text-white space-y-6">
            <h1 className="text-5xl font-bold leading-tight">
              Advanced Fleet Management & Vehicle Tracking
            </h1>
            <p className="text-xl text-blue-100">
              Streamline your fleet operations with real-time GPS tracking, automated maintenance scheduling, 
              and comprehensive performance analytics. Optimize routes, reduce costs, and maximize productivity.
            </p>
            
            {/* Features grid */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="flex items-center space-x-3">
                <MapPin className="h-6 w-6 text-blue-400" />
                <span>Real-time GPS Tracking</span>
              </div>
              <div className="flex items-center space-x-3">
                <Activity className="h-6 w-6 text-blue-400" />
                <span>Performance Analytics</span>
              </div>
              <div className="flex items-center space-x-3">
                <Shield className="h-6 w-6 text-blue-400" />
                <span>Enhanced Security</span>
              </div>
              <div className="flex items-center space-x-3">
                <BarChart3 className="h-6 w-6 text-blue-400" />
                <span>Cost Optimization</span>
              </div>
            </div>
          </div>

          {/* Right side - Auth forms */}
          <div className="flex justify-center">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle className="text-center">Welcome to Cartrack</CardTitle>
                <CardDescription className="text-center">
                  Manage your fleet with confidence
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="signup">Sign Up</TabsTrigger>
                    <TabsTrigger value="forgot">Forgot</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="login" className="space-y-4">
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          value={loginForm.email}
                          onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          placeholder="Enter your password"
                          value={loginForm.password}
                          onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full"
                        disabled={isSubmitting || !loginForm.email || !loginForm.password}
                      >
                        {isSubmitting ? "Signing In..." : "Sign In"}
                      </Button>
                    </form>
                  </TabsContent>
                  
                  <TabsContent value="signup" className="space-y-4">
                    <form onSubmit={handleSignup} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          placeholder="Enter your full name"
                          value={signupForm.name}
                          onChange={(e) => setSignupForm({...signupForm, name: e.target.value})}
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company">Company</Label>
                        <Input
                          id="company"
                          placeholder="Enter your company name"
                          value={signupForm.company}
                          onChange={(e) => setSignupForm({...signupForm, company: e.target.value})}
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-email">Email</Label>
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="Enter your email"
                          value={signupForm.email}
                          onChange={(e) => setSignupForm({...signupForm, email: e.target.value})}
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-password">Password</Label>
                        <Input
                          id="signup-password"
                          type="password"
                          placeholder="Create a password"
                          value={signupForm.password}
                          onChange={(e) => setSignupForm({...signupForm, password: e.target.value})}
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm Password</Label>
                        <Input
                          id="confirm-password"
                          type="password"
                          placeholder="Confirm your password"
                          value={signupForm.confirmPassword}
                          onChange={(e) => setSignupForm({...signupForm, confirmPassword: e.target.value})}
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full"
                        disabled={isSubmitting || !signupForm.email || !signupForm.password || !signupForm.name || !signupForm.company}
                      >
                        {isSubmitting ? "Creating Account..." : "Create Account"}
                      </Button>
                    </form>
                  </TabsContent>
                  
                  <TabsContent value="forgot" className="space-y-4">
                    <form onSubmit={handleForgotPassword} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="forgot-email">Email</Label>
                        <Input
                          id="forgot-email"
                          type="email"
                          placeholder="Enter your email"
                          value={forgotPasswordEmail}
                          onChange={(e) => setForgotPasswordEmail(e.target.value)}
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full"
                        disabled={isSubmitting || !forgotPasswordEmail}
                      >
                        {isSubmitting ? "Sending..." : "Send Reset Link"}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="px-6 py-16 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            Comprehensive Fleet Management Solution
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <MapPin className="h-12 w-12 text-blue-400 mb-4" />
                <CardTitle className="text-white">Real-time Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-blue-100">
                  Monitor your entire fleet with GPS precision. Get instant location updates, 
                  route optimization, and geofencing alerts.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <Activity className="h-12 w-12 text-blue-400 mb-4" />
                <CardTitle className="text-white">Automated Maintenance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-blue-100">
                  Schedule maintenance automatically based on mileage, time, or engine hours. 
                  Prevent breakdowns and extend vehicle life.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <BarChart3 className="h-12 w-12 text-blue-400 mb-4" />
                <CardTitle className="text-white">Performance Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-blue-100">
                  Comprehensive reporting on fuel consumption, driver behavior, 
                  and operational efficiency to reduce costs.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
