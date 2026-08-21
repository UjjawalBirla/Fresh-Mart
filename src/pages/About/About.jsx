import { FiAward, FiShield, FiTruck, FiHeart, FiCheckCircle } from "react-icons/fi";

function About() {
  const features = [
    {
      icon: "🌱",
      title: "100% Farm Fresh",
      description: "Directly harvested from certified local farms every morning.",
    },
    {
      icon: "🚚",
      title: "Express Delivery",
      description: "Temperature-controlled vehicles keeping your produce crisp.",
    },
    {
      icon: "❤️",
      title: "Customer Satisfaction",
      description: "Hassle-free replacement if freshness doesn't meet your mark.",
    },
    {
      icon: "✨",
      title: "Grade A Selection",
      description: "Carefully sorted and cleaned following highest food safety norms.",
    },
  ];

  const stats = [
    { value: "15,000+", label: "Happy Households" },
    { value: "100+", label: "Daily Fresh Products" },
    { value: "99.8%", label: "On-Time Delivery" },
    { value: "10+", label: "Years of Trust" },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-market-leaf via-market-leaf-dark to-emerald-950 px-4 py-16 text-white md:px-8 md:py-24 shadow-2xl">
        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-market-lime/20 blur-3xl" />
        <div className="absolute -bottom-32 -right-16 h-80 w-80 rounded-full bg-market-sun/20 blur-3xl" />

        <div className="page-container relative z-10 flex flex-col items-center justify-between gap-10 py-0 lg:flex-row">
          <div className="max-w-xl text-center lg:text-left space-y-4 animate-rise">
            <div className="inline-flex items-center gap-2 rounded-full border border-market-lime/30 bg-white/10 px-4 py-1.5 backdrop-blur-md">
              <span className="text-xs font-bold tracking-[0.2em] text-market-lime uppercase">
                About FreshMart
              </span>
            </div>

            <h1 className="font-display text-4xl font-black leading-tight sm:text-5xl md:text-6xl">
              Fresh Food, <br />
              <span className="bg-gradient-to-r from-market-lime to-white bg-clip-text text-transparent">
                Healthy Family.
              </span>
            </h1>

            <p className="text-base leading-relaxed text-white/85 sm:text-lg">
              FreshMart was founded with a singular mission: to bring farm-fresh organic produce directly from growers to your doorstep with total transparency, fair pricing, and pure quality.
            </p>
          </div>

          <div className="grid h-36 w-36 place-items-center rounded-3xl bg-white/10 text-8xl shadow-2xl backdrop-blur-md animate-float lg:h-48 lg:w-48">
            🍃
          </div>
        </div>
      </section>

      {/* Brand Story Section */}
      <section className="page-container">
        <div className="card overflow-hidden grid lg:grid-cols-12 shadow-2xl">
          <div className="grid place-items-center bg-gradient-to-br from-market-lime/60 via-market-cream to-market-lime/30 p-10 lg:col-span-5 dark:from-market-leaf/20 dark:to-slate-900">
            <span className="animate-float text-9xl">🥬</span>
          </div>

          <div className="space-y-6 p-8 sm:p-12 lg:col-span-7">
            <div className="space-y-1.5">
              <span className="section-label">Our Journey</span>
              <h2 className="font-display text-3xl font-black text-slate-800 dark:text-white">
                Freshness you can always <span className="text-market-leaf dark:text-market-lime">count on.</span>
              </h2>
            </div>

            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              In a world full of artificial additives and cold-storage produce, FreshMart stands out by establishing direct daily supply chains with verified organic agriculturalists. We cut out warehouses and long freight times so you taste fruits and vegetables the way nature intended.
            </p>

            <div className="grid gap-4 sm:grid-cols-2 pt-2">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="flex items-start gap-3 rounded-2xl border border-market-leaf/15 bg-market-cream/40 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-market-leaf/30 hover:shadow-md dark:border-market-leaf/20 dark:bg-slate-800/40"
                >
                  <span className="text-2xl shrink-0">{feature.icon}</span>
                  <div>
                    <h3 className="font-display text-sm font-bold text-slate-800 dark:text-white">
                      {feature.title}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* KPI Stats Counter Strip */}
      <section className="page-container">
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="card flex flex-col items-center justify-center p-6 text-center shadow-lg transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl hover:border-market-leaf/40 dark:hover:shadow-market-leaf/10"
            >
              <strong className="font-display text-3xl font-black text-market-leaf sm:text-4xl dark:text-market-lime">
                {stat.value}
              </strong>
              <span className="mt-1 text-xs font-semibold text-slate-500 sm:text-sm dark:text-slate-400">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default About;
