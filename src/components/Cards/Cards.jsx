import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";

function Cards({
  title,
  description,
  image,
  icon,
  link = "#",
  className = "",
}) {
  return (
    <article
      className={`group relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/90 shadow-lg shadow-slate-200/50 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:border-market-leaf/30 hover:shadow-2xl hover:shadow-market-leaf/20 dark:border-slate-800/80 dark:bg-slate-900/90 dark:shadow-slate-950/50 dark:hover:border-market-leaf/40 ${className}`}
    >
      {/* Glow accent */}
      <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-market-leaf/10 blur-2xl transition-all duration-500 group-hover:scale-150 group-hover:bg-market-leaf/20" />

      {/* Image / Header Media */}
      <div className="relative h-52 overflow-hidden bg-market-cream/60 dark:bg-slate-800/60">
        {image ? (
          <img
            src={image}
            alt={title || "FreshMart"}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
        ) : (
          <div className="grid h-full place-items-center bg-gradient-to-br from-market-lime/60 via-market-cream to-market-lime/30 text-6xl transition-transform duration-500 group-hover:scale-110 dark:from-market-leaf/20 dark:via-slate-800 dark:to-slate-900">
            {icon || "🍃"}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="relative space-y-3.5 p-6">
        {icon && (
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-market-lime/60 text-2xl shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-md dark:bg-market-leaf/30 dark:text-market-lime">
            {icon}
          </div>
        )}

        {title && (
          <h3 className="font-display text-xl font-bold tracking-tight text-slate-800 transition-colors duration-300 group-hover:text-market-leaf dark:text-white dark:group-hover:text-market-lime">
            {title}
          </h3>
        )}

        {description && (
          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            {description}
          </p>
        )}

        {/* Action Link */}
        {link && link !== "#" && (
          <div className="pt-2">
            <Link
              to={link}
              className="inline-flex items-center gap-2 rounded-xl bg-market-leaf px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-market-leaf/20 transition-all duration-300 hover:gap-3 hover:bg-market-leaf-dark hover:shadow-lg hover:shadow-market-leaf/30 active:scale-95"
            >
              <span>Explore</span>
              <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        )}
      </div>
    </article>
  );
}

export default Cards;
