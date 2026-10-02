import Link from "next/link";
import { Flame, CheckCircle, Mail } from "lucide-react";

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
          <CheckCircle className="h-7 w-7 text-green-600" />
        </div>
        <h1 className="mt-4 text-2xl font-bold text-gray-900">
          Check Your Email
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          We&apos;ve sent you a confirmation link. Please check your inbox and
          click the link to verify your email address.
        </p>
        <div className="mt-6 rounded-lg bg-brand-50 p-4">
          <div className="flex items-center justify-center gap-2 text-sm text-brand-800">
            <Mail className="h-4 w-4" />
            <span>Didn&apos;t receive the email? Check your spam folder.</span>
          </div>
        </div>
        <Link
          href="/auth/login"
          className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-brand-600 hover:text-brand-700"
        >
          Back to Sign In
        </Link>
      </div>
    </div>
  );
}
