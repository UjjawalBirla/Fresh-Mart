function PageLoader() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-market-cream/95 backdrop-blur-sm dark:bg-slate-950/95">
      <div className="flex flex-col items-center gap-6 animate-rise">
        <div className="grid h-20 w-20 place-items-center rounded-3xl bg-market-lime text-4xl shadow-xl shadow-market-leaf/20 animate-float">
          🍃
        </div>

        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-2.5 w-2.5 rounded-full bg-market-leaf animate-bounce"
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
        </div>

        <p className="text-sm font-semibold tracking-wide text-slate-600 dark:text-slate-300">
          Loading FreshMart...
        </p>
      </div>
    </div>
  );
}

export default PageLoader;
