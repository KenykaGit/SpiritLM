import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main
      className="flex w-full items-center justify-center [&_.cl-footerPages]:!hidden [&_a[href*='clerk.com']]:!hidden [&_[aria-label*='Clerk']]:!hidden [&_[alt*='Clerk']]:!hidden"
    >
      <SignUp routing="path" path="/auth/sign-up" />
    </main>
  );
}
