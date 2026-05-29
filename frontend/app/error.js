"use client";

export default function Error({ error, reset }) {
  return (
    <div className="min-h-screen bg-paper dark:bg-ink flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 mx-auto mb-6 rounded-[12px] bg-card dark:bg-sheet border border-rule-light dark:border-rule flex items-center justify-center">
          <svg className="w-8 h-8 text-ink-ghost dark:text-ghost" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>
        <h2 className="font-display text-xl font-bold text-ink-prose dark:text-prose mb-2">Something went wrong</h2>
        <p className="font-body text-sm text-ink-prose-2 dark:text-prose-2 mb-6">{error?.message || "An unexpected error occurred."}</p>
        <button onClick={reset} className="btn-primary">Try again</button>
      </div>
    </div>
  );
}
