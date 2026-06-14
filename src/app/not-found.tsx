import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/logo";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
      <div className="absolute inset-0 eng-grid-fine radial-fade" />
      <div className="relative">
        <Logo className="mb-8 justify-center" />
        <p className="text-6xl font-bold tracking-tight text-navy-900">404</p>
        <h1 className="mt-3 text-lg font-semibold text-navy-800">
          Page not found
        </h1>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          The resource you're looking for doesn't exist or has moved.
        </p>
        <Link href="/dashboard" className="mt-6 inline-block">
          <Button>Back to platform</Button>
        </Link>
      </div>
    </div>
  );
}
