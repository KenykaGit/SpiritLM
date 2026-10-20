import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main
      className="flex w-full items-center justify-center [&_.cl-footerPages]:!hidden [&_a[href*='clerk.com']]:!hidden [&_[aria-label*='Clerk']]:!hidden [&_[alt*='Clerk']]:!hidden"
    >
      <SignIn routing="path" path="/auth/sign-in" />
    </main>
  );
}
