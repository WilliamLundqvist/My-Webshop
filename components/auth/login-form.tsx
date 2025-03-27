import { cn } from '@/lib/utils/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { loginAction } from '@/app/(auth)/login/action';
import { useFormState } from 'react-dom';
import Link from 'next/link';

export function LoginForm({ className, ...props }: React.ComponentProps<'div'>) {
  const [state, formAction, isPending] = useFormState(loginAction, {});

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className="py-6">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          {state?.error && (
            <CardDescription className="text-destructive">{state.error}</CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <form action={formAction}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="usernameEmail">Username or Email</Label>
                <Input
                  id="usernameEmail"
                  name="usernameEmail"
                  type="text"
                  placeholder="username or email"
                  required
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input id="password" name="password" type="password" required />
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" disabled={isPending} className="w-full">
                  {isPending ? 'Logging in...' : 'Login'}
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account? <Link href="/sign-up">Sign up</Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
