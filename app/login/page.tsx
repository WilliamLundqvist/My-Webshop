'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { loginAction } from './action';
import { Button } from '@/components/ui/button';

function SubmitButton() {
  const status = useFormStatus();
  return (
    <Button type="submit" disabled={status.pending}>
      {status.pending ? 'Loading...' : 'Login'}
    </Button>
  );
}

export default function Page() {
  const [state, formAction] = useFormState(loginAction, {});

  return (
    <div className="container mx-auto py-xl px-md">
      <div className="max-w-md mx-auto">
        <div className="bg-surface p-lg rounded-lg">
          <h2 className="text-2xl font-bold mb-lg">Login</h2>

          <form action={formAction} className="space-y-md">
            <div>
              <label htmlFor="usernameEmail" className="block text-sm font-medium mb-sm">
                Username or Email
              </label>
              <input 
                type="text" 
                name="usernameEmail" 
                id="usernameEmail"
                className="w-full p-md border border-border rounded bg-background"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-sm">
                Password
              </label>
              <input 
                type="password" 
                name="password" 
                id="password"
                className="w-full p-md border border-border rounded bg-background"
              />
            </div>

            <div className="pt-sm">
              <SubmitButton />
            </div>

            {state.error && (
              <div className="p-md rounded bg-error/10 text-error border border-error/30 text-sm mt-md">
                <div dangerouslySetInnerHTML={{ __html: state.error }}></div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}