import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-paper dark:bg-ink flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="font-display text-6xl mb-4 text-ink-prose dark:text-prose">404</div>
        <h2 className="font-display text-xl font-bold text-ink-prose dark:text-prose mb-2">Page Not Found</h2>
        <p className="font-body text-sm text-ink-prose-2 dark:text-prose-2 mb-6">The page you&apos;re looking for doesn&apos;t exist.</p>
        <Link href="/dashboard" className="btn-primary">Go to Dashboard</Link>
      </div>
    </div>
  );
}
