'use client'

import React from 'react'
import { Mail, ArrowRight, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from '@/hooks/use-toast'
import Image from 'next/image'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const EmailVerificationPage = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-background to-secondary/20  flex flex-col items-center justify-center p-4">
      {/* Main Content Container */}
      <div className="w-full max-w-md space-y-8 text-center">
        {/* Icon Container */}
        <div className="relative">
          <div className="w-20 h-20 mx-auto rounded-full bg-blue-50 flex items-center justify-center  shadow-2xl">
            {/* <Mail className="w-10 h-10 text-green-700 " strokeWidth={1.5} /> */}
            <Image
              width="48"
              height="48"
              src="https://img.icons8.com/color/48/gmail-new.png"
              alt="gmail-new"
            />
          </div>
          {/* <div className="absolute -top-1 right-1/2 -translate-x-3 w-8 h-8 bg-green-400 rounded-full border-4 border-white" /> */}
        </div>

        {/* Text Content */}
        <div className="space-y-4">
          <h1 className="text-2xl font-medium text-gray-900 dark:text-white">
            Check your email
          </h1>
          <p className="text-gray-500 text-base max-w-sm mx-auto dark:text-zinc-500">
            We&apos;ve sent a verification link to your email address. Please
            check your inbox to continue.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-4">
          <Button
            className="w-full h-11 bg-purple-600 hover:bg-purple-800 text-white flex items-center justify-center gap-2 rounded-lg transition-colors"
            onClick={() =>
              window.open('https://mail.google.com/mail/u/0/#inbox', '_blank')
            }
          >
            Open mail app
            <ArrowRight className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            className="w-full h-11 text-gray-600 bg-gray-200 hover:text-gray-900  dark:hover:bg-zinc-300 flex items-center justify-center gap-2 rounded-lg"
            onClick={() => {
              // Logic to resend email goes here
              // Show toast notification
              toast({ description: 'Verification email resent successfully!' })
            }}
          >
            Resend email
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>

        {/* Footer */}
        <div className="pt-8 border-t border-gray-100">
          <p className="text-sm text-gray-400">
            Didn&apos;t receive the email? Check your spam folder or contact
            support.
          </p>
        </div>
      </div>
    </div>
  )
}

export default EmailVerificationPage
