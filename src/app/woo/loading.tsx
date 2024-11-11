'use client';

export default function Loading(): JSX.Element {
  return (
    <div className="flex justify-center">
      <div className="flex min-h-screen w-full max-w-[480px] flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl">WOO X</h1>
          {/* <nav className="flex flex-col gap-1">
          <Link className="underline underline-offset-2" href="/config">
            Config
          </Link>
        </nav> */}
        </div>
      </div>
    </div>
  );
}
