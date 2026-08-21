import { FiHeart, FiShoppingCart, FiStar } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";
import ImageLoader from "../ImageLoader/ImageLoader";

function ProductCards({ products = [], wishlist = [], onWishlist }) {
  const { addToCart, cartLoading } = useCart();

  const handleAddToCart = (product) => {
    if (Number(product.stock) <= 0) return;
    addToCart(product);
  };

  if (products.length === 0) {
    return (
      <div className="col-span-full flex flex-col items-center justify-center gap-4 rounded-3xl border-2 border-dashed border-market-leaf/20 bg-market-cream/50 px-6 py-20 text-center backdrop-blur-sm animate-rise dark:border-market-leaf/30 dark:bg-slate-900/40">
        <div className="grid h-20 w-20 place-items-center rounded-3xl bg-market-lime/40 text-4xl shadow-md animate-float dark:bg-market-leaf/20">
          🛒
        </div>
        <div className="space-y-1">
          <h3 className="font-display text-xl font-bold text-slate-800 dark:text-white">
            No products found
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Try adjusting your search or category filter.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="product-grid">
      {products.map((product) => {
        const isOutOfStock = Number(product.stock) <= 0;
        const isWishlisted = wishlist.includes(product.id);

        return (
          <article
            className="product-card flex flex-col justify-between"
            key={product.id}
          >
            {/* Top Media Section */}
            <div className="relative aspect-square overflow-hidden bg-market-cream/70 dark:bg-slate-800/80">
              <ImageLoader
                src={product.imageLarge || product.image}
                alt={product.name || "Product"}
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />

              {/* Wishlist Button */}
              <button
                type="button"
                className={`absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full border shadow-md backdrop-blur-md transition-all duration-300 hover:scale-110 active:scale-95 ${
                  isWishlisted
                    ? "border-market-coral/40 bg-market-coral text-white shadow-market-coral/30"
                    : "border-white/80 bg-white/90 text-slate-500 hover:text-market-coral hover:border-market-coral/40 dark:border-slate-700 dark:bg-slate-900/90 dark:text-slate-400 dark:hover:text-market-coral"
                }`}
                onClick={() => onWishlist?.(product.id)}
                aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              >
                <FiHeart
                  className={`text-lg transition-transform duration-300 ${
                    isWishlisted ? "fill-current scale-110" : ""
                  }`}
                />
              </button>

              {/* Stock Status Badge */}
              {isOutOfStock ? (
                <span className="badge-danger absolute left-3 top-3 shadow-md">
                  Out of Stock
                </span>
              ) : (
                product.discount && (
                  <span className="badge-warning absolute left-3 top-3 shadow-md">
                    {product.discount}% OFF
                  </span>
                )
              )}
            </div>

            {/* Bottom Info Section */}
            <div className="flex flex-1 flex-col justify-between p-5 space-y-3">
              <div className="space-y-1.5">
                <span className="section-label text-[10px]">
                  {product.category || "Fresh Product"}
                </span>

                <Link
                  to={`/product/${product.id}`}
                  className="block font-display text-base font-bold leading-snug text-slate-800 line-clamp-2 transition-colors duration-300 hover:text-market-leaf dark:text-white dark:hover:text-market-lime"
                >
                  {product.name}
                </Link>
              </div>

              {/* Rating + Availability */}
              <div className="flex items-center justify-between gap-2 text-xs">
                <div className="inline-flex items-center gap-1 rounded-lg bg-amber-50 px-2 py-1 font-bold text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                  <FiStar className="fill-current text-market-sun" />
                  <span>{product.rating || "4.8"}</span>
                </div>

                <span
                  className={isOutOfStock ? "badge-danger" : "badge-success"}
                >
                  {!isOutOfStock ? `${product.stock} ${product.unit || "left"}` : "Sold out"}
                </span>
              </div>

              {/* Price + Action Button */}
              <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-3 dark:border-slate-800/80">
                <div className="flex items-baseline gap-2">
                  <strong className="font-display text-xl font-black text-market-leaf dark:text-market-lime">
                    ₹{product.price}
                  </strong>
                  {product.oldPrice && (
                    <del className="text-xs text-slate-400">₹{product.oldPrice}</del>
                  )}
                </div>

                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-market-leaf px-3.5 py-2 text-xs font-bold text-white shadow-md shadow-market-leaf/25 transition-all duration-300 hover:bg-market-leaf-dark hover:shadow-lg hover:shadow-market-leaf/35 hover:-translate-y-0.5 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none disabled:hover:translate-y-0"
                  disabled={isOutOfStock || cartLoading}
                  onClick={() => handleAddToCart(product)}
                >
                  <FiShoppingCart />
                  <span>{isOutOfStock ? "Out" : "Add"}</span>
                </button>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

export default ProductCards;
