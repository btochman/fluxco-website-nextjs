"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Zap, Mail, Lock, LogIn, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { z } from 'zod';

const emailSchema = z.string().email('Please enter a valid email address');
const passwordSchema = z.string().min(6, 'Password must be at least 6 characters');

export default function FluxerAuth() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    // Check if user is already logged in
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        checkFluxerAccess(session.user.email);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        checkFluxerAccess(session.user.email);
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const checkFluxerAccess = async (userEmail: string | undefined) => {
    if (!userEmail) return;

    // Check if email is @fluxco.com or in allowlist
    const isFluxcoDomain = userEmail.endsWith('@fluxco.com');

    if (isFluxcoDomain) {
      router.push('/portal');
      return;
    }

    // Check allowlist (cast to any since types haven't been regenerated)
    const { data: allowlistEntry } = await (supabase as any)
      .from('fluxer_allowlist')
      .select('email')
      .eq('email', userEmail)
      .single();

    if (allowlistEntry) {
      router.push('/portal');
    } else {
      toast.error('You do not have Fluxer access. Contact an admin if you believe this is an error.');
      await supabase.auth.signOut();
    }
  };

  const isFluxerEmail = (email: string): boolean => {
    return email.endsWith('@fluxco.com');
  };

  const validateInputs = () => {
    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) {
      toast.error(emailResult.error.issues[0].message);
      return false;
    }

    const passwordResult = passwordSchema.safeParse(password);
    if (!passwordResult.success) {
      toast.error(passwordResult.error.issues[0].message);
      return false;
    }

    return true;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateInputs()) return;

    setIsLoading(true);
    try {
      // First check if this email is allowed
      const trimmedEmail = email.trim().toLowerCase();
      const isFluxco = isFluxerEmail(trimmedEmail);

      if (!isFluxco) {
        // Check allowlist (cast to any since types haven't been regenerated)
        const { data: allowlistEntry } = await (supabase as any)
          .from('fluxer_allowlist')
          .select('email')
          .eq('email', trimmedEmail)
          .single();

        if (!allowlistEntry) {
          toast.error('This email is not authorized for Fluxer access');
          setIsLoading(false);
          return;
        }
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          toast.error('Invalid email or password');
        } else {
          toast.error(error.message);
        }
        return;
      }

      toast.success('Welcome back!');
      router.push('/portal');
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateInputs()) return;

    const trimmedEmail = email.trim().toLowerCase();

    // Check if this email is allowed to sign up
    const isFluxco = isFluxerEmail(trimmedEmail);

    if (!isFluxco) {
      // Check allowlist (cast to any since types haven't been regenerated)
      const { data: allowlistEntry } = await (supabase as any)
        .from('fluxer_allowlist')
        .select('email')
        .eq('email', trimmedEmail)
        .single();

      if (!allowlistEntry) {
        toast.error('Only @fluxco.com emails or pre-approved team members can sign up');
        return;
      }
    }

    setIsLoading(true);
    try {
      const redirectUrl = `${window.location.origin}/portal`;

      const { data, error } = await supabase.auth.signUp({
        email: trimmedEmail,
        password,
        options: {
          emailRedirectTo: redirectUrl,
        },
      });

      if (error) {
        if (error.message.includes('already registered')) {
          toast.error('This email is already registered. Please log in instead.');
        } else {
          toast.error(error.message);
        }
        return;
      }

      // Assign fluxer role (cast to any since 'fluxer' role hasn't been added to enum yet)
      if (data.user) {
        const { error: roleError } = await (supabase as any).from('user_roles').insert({
          user_id: data.user.id,
          role: 'fluxer',
        });

        if (roleError) {
          console.error('Error assigning role:', roleError);
        }

        // Create team member record (cast to any since types haven't been regenerated)
        const { error: teamError } = await (supabase as any).from('team_members').insert({
          user_id: data.user.id,
          email: trimmedEmail,
          name: trimmedEmail.split('@')[0], // Default name from email
        });

        if (teamError && !teamError.message.includes('duplicate')) {
          console.error('Error creating team member:', teamError);
        }
      }

      toast.success('Account created! Check your email to confirm, then log in.');
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary rounded-lg">
              <Zap className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl">Fluxer Portal</CardTitle>
          <CardDescription>
            Co-founder access to project management and company operations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="you@fluxco.com"
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="********"
                      className="pl-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full gap-2" disabled={isLoading}>
                  {isLoading ? 'Logging in...' : (
                    <>
                      <LogIn className="h-4 w-4" />
                      Log In
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="you@fluxco.com"
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="********"
                      className="pl-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full gap-2" disabled={isLoading}>
                  {isLoading ? 'Creating account...' : (
                    <>
                      <UserPlus className="h-4 w-4" />
                      Create Account
                    </>
                  )}
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  Only @fluxco.com emails or pre-approved team members can sign up
                </p>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
