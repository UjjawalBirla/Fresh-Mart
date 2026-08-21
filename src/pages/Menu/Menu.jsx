import { NavLink } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";

function Menu() {
  const categories = [
    {
      id: 1,
      emoji: "🍎",
      title: "Fresh Fruits",
      description: "Crisp apples, tropical mangoes, sweet bananas & citrus picks.",
      path: "/fruits",
      accent: "from-red-500/10 via-orange-500/5 to-transparent",
      emojiBg: "bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-300",
    },
    {
      id: 2,
      emoji: "🥦",
      title: "Fresh Vegetables",
      description: "Organic greens, root vegetables, salad staples & fresh herbs.",
      path: "/vegetables",
      accent: "from-emerald-500/10 via-market-leaf/5 to-transparent",
      emojiBg: "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-300",
    },
    {
      id: 3,
      emoji: "🛒",
      title: "Daily Groceries",
      description: "Aromatic rice, organic grains, lentils, oils & dairy essentials.",
      path: "/groceries",
      accent: "from-amber-500/10 via-yellow-500/5 to-transparent",
      emojiBg: "bg-amber-100 text-amber-600 dark:bg-amber-950/50 dark:text-amber-300",
    },
    {
      id: 4,
      emoji: "🏷️",
      title: "Special Offers",
      description: "Discounted produce bundles, seasonal offers & family packs.",
      path: "/offers",
      accent: "from-market-coral/15 via-pink-500/5 to-transparent",
      emojiBg: "bg-market-coral/15 text-market-coral dark:bg-market-coral/20 dark:text-market-coral",
    },
  ];

  const benefits = [
    {
      icon: "🌱",
      title: "100% Organic",
      description: "Zero harmful chemicals or ripening accelerators.",
    },
    {
      icon: "🚚",
      title: "Same Day Dispatch",
      description: "Packed fresh upon ordering and dispatched directly.",
    },
    {
      icon: "⭐",
      title: "Top Rated Quality",
      description: "Rated 4.9/5 by more than 15,000 satisfied families.",
    },
    {
      icon: "❤️",
      title: "Dedicated Support",
      description: "Prompt resolution for any order queries or requests.",
    },
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
                Explore Menu
              </span>
            </div>

            <h1 className="font-display text-4xl font-black leading-tight sm:text-5xl md:text-6xl">
              Fresh Choices, <br />
              <span className="bg-gradient-to-r from-market-lime to-white bg-clip-text text-transparent">
                Made For You.
              </span>
            </h1>

            <p className="text-base leading-relaxed text-white/85 sm:text-lg">
              Explore crisp fruits, tender vegetables, premium grocery grains and special weekly deals — all arranged in intuitive categories.
            </p>

            <div className="pt-2">
              <NavLink
                to="/fruits"
                className="btn-primary bg-white text-market-leaf shadow-xl shadow-black/20 hover:bg-market-lime hover:text-market-leaf-dark"
              >
                <span>Start Shopping</span>
                <FiArrowRight />
              </NavLink>
            </div>
          </div>

          <div className="relative grid h-56 w-full max-w-sm place-items-center lg:h-64">
            <div className="absolute left-4 top-2 animate-float text-7xl">🍎</div>
            <div className="absolute right-6 top-8 animate-float text-6xl [animation-delay:1s]">🥦</div>
            <div className="absolute bottom-2 left-1/3 animate-float text-8xl [animation-delay:0.5s]">🛒</div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="page-container space-y-8">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="section-label">Categories</span>
            <h2 className="font-display text-3xl font-black text-slate-800 dark:text-white md:text-4xl">
              Shop by Category
            </h2>
          </div>
          <p className="max-w-md text-sm text-slate-500 dark:text-slate-400">
            Pick a section below to browse seasonal varieties and everyday stock.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {categories.map((category) => (
            <NavLink
              key={category.id}
              to={category.path}
              className={`card group flex flex-col sm:flex-row overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:border-market-leaf/40 hover:shadow-2xl hover:shadow-market-leaf/15 bg-gradient-to-br ${category.accent}`}
            >
              <div
                className={`grid min-h-36 w-full shrink-0 place-items-center text-6xl sm:w-44 ${category.emojiBg}`}
              >
                <span className="transition-transform duration-500 group-hover:scale-125 group-hover:rotate-6">
                  {category.emoji}
                </span>
              </div>

              <div className="flex flex-1 flex-col justify-center gap-2.5 p-6">
                <span className="text-xs font-bold text-market-leaf dark:text-market-lime">
                  CATEGORY 0{category.id}
                </span>

                <h3 className="font-display text-2xl font-black text-slate-800 transition-colors group-hover:text-market-leaf dark:text-white dark:group-hover:text-market-lime">
                  {category.title}
                </h3>

                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {category.description}
                </p>

                <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-bold text-market-leaf transition-all duration-300 group-hover:gap-2.5 dark:text-market-lime">
                  <span>Browse Category</span>
                  <FiArrowRight />
                </span>
              </div>
            </NavLink>
          ))}
        </div>
      </section>

      {/* Value Badges */}
      <section className="page-container">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="card flex items-start gap-4 p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-market-lime/50 text-2xl dark:bg-market-leaf/20">
                {benefit.icon}
              </div>

              <div>
                <h3 className="font-display font-bold text-slate-800 dark:text-white">
                  {benefit.title}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="page-container">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-market-leaf via-market-leaf-dark to-emerald-950 p-8 text-white shadow-2xl md:p-12">
          <div className="relative z-10 flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
            <div className="space-y-2 max-w-xl">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-market-lime">
                Ready to Order?
              </span>
              <h2 className="font-display text-3xl font-black md:text-4xl">
                Fresh produce is <span className="text-market-lime">one click away.</span>
              </h2>
              <p className="text-sm text-white/80">
                Pick your basket and enjoy same-day delivery with 100% satisfaction assurance.
              </p>
            </div>

            <NavLink
              to="/fruits"
              className="inline-flex shrink-0 items-center gap-2 rounded-2xl bg-white px-8 py-3.5 font-display text-base font-black text-market-leaf shadow-xl transition-all duration-300 hover:scale-105 hover:bg-market-lime hover:text-market-leaf-dark hover:shadow-2xl active:scale-95"
            >
              <span>Shop Produce</span>
              <FiArrowRight />
            </NavLink>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Menu;
