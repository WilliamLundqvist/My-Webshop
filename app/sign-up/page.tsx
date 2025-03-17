import SignUpForm from '@/components/sign-up-form';
import React from 'react'

const SignUp = () => {
    return (
        <div className="flex min-h-[calc(100vh-100px)] w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm md:max-w-2xl">
                <SignUpForm />
            </div>
        </div>
    )
}

export default SignUp;