import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiSearch,
  FiHeart,
  FiShoppingCart,
  FiStar,
  FiEye,
  FiTag,
} from "react-icons/fi";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import ImageLoader from "../../components/ImageLoader/ImageLoader";
import { db } from "../../Firebase/Firebase";
import { useCart } from "../../contexts/CartContext";

const categories = [
  "All",
  "Apples",
  "Banana",
  "Mango",
  "Citrus",
  "Grapes",
  "Melons",
  "Tropical",
];

function Fruits() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [wishlist, setWishlist] = useState([]);
  const [productErrors, setProductErrors] = useState({});

  const { addToCart, cartItems, cartLoading } = useCart();

  useEffect(() => {
    setLoading(true);
    const fruitsQuery = query(
      collection(db, "products"),
      where("category", "==", "Fruits"),
    );

    const unsubscribe = onSnapshot(
      fruitsQuery,
      (snapshot) => {
        const firebaseProducts = snapshot.docs.map((productDoc) => {
          const data = productDoc.data();
          return {
            id: productDoc.id,
            ...data,
            image:
              data.image ||
              data.imageUrl ||
              data.imageLarge ||
              data.originalImage ||
              "",
            imageLarge:
              data.imageLarge ||
              data.image ||
              data.imageUrl ||
              data.originalImage ||
              "",
            unit: data.unit || "piece",
            stock: Number(data.stock || 0),
            price: Number(data.price || 0),
          };
        });

        setProducts(firebaseProducts);
        setLoading(false);
        setError("");
      },
      (firebaseError) => {
        console.error("Fruits Firebase Error:", firebaseError);
        setError("Unable to load fruits.");
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const productName = String(product.name || "").toLowerCase();
      const searchText = search.toLowerCase().trim();
      const matchesSearch = productName.includes(searchText);

      const productCategory = String(product.subcategory || "");
      const matchesCategory =
        activeCategory === "All" || productCategory === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, activeCategory]);

  const toggleWishlist = (productId) => {
    setWishlist((current) =>
      current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId],
    );
  };

  const handleAddToCart = async (product) => {
    const stock = Number(product.stock || 0);
    const unit = product.unit || "piece";

    setProductErrors((current) => ({ ...current, [product.id]: "" }));

    if (stock <= 0) {
      setProductErrors((current) => ({ ...current, [product.id]: "Out of stock" }));
      return;
    }

    const existingItem = cartItems.find((item) => item.id === product.id);
    const currentQuantity = Number(existingItem?.quantity || 0);

    if (currentQuantity + 1 > stock) {
      setProductErrors((current) => ({
        ...current,
        [product.id]: `Only ${stock} ${unit} available`,
      }));
      return;
    }

    const success = await addToCart({ ...product, unit }, 1);
    if (!success) {
      setProductErrors((current) => ({
        ...current,
        [product.id]: `Only ${stock} ${unit} available`,
      }));
    }
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-market-leaf via-market-leaf-dark to-emerald-950 px-4 py-12 text-white md:px-8 md:py-16 shadow-xl">
        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-market-lime/20 blur-3xl" />
        <div className="absolute -bottom-32 -right-16 h-80 w-80 rounded-full bg-market-sun/20 blur-3xl" />

        <div className="page-container relative z-10 flex flex-col items-center justify-between gap-6 py-0 sm:flex-row">
          <div className="max-w-xl text-center sm:text-left space-y-2 animate-rise">
            <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-market-lime">
              Fresh & Sweet
            </span>
            <h1 className="font-display text-3xl font-black sm:text-4xl md:text-5xl">
              Fresh Fruits 🍎
            </h1>
            <p className="text-sm text-white/80">
              Hand-picked seasonal and tropical fruits delivered fresh daily to your kitchen.
            </p>
          </div>

          <div className="grid h-24 w-24 place-items-center rounded-3xl bg-white/10 text-6xl shadow-xl backdrop-blur-md animate-float sm:h-32 sm:w-32 sm:text-7xl">
            🍎
          </div>
        </div>
      </section>

      {/* Toolbar & Category Chips */}
      <section className="page-container space-y-6">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Search bar */}
          <div className="input-field flex-1 sm:max-w-md">
            <FiSearch className="text-slate-400 shrink-0 text-lg" />
            <input
              type="text"
              placeholder="Search fruits (e.g., Apple, Mango, Grapes)..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <div className="text-xs font-bold text-slate-500 dark:text-slate-400">
            Showing <strong className="text-market-leaf dark:text-market-lime">{filteredProducts.length}</strong> fruits
          </div>
        </div>

        {/* Category Pill Filters */}
        <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all duration-300 active:scale-95 shadow-xs ${
                activeCategory === cat
                  ? "bg-market-leaf text-white shadow-md shadow-market-leaf/30 scale-105"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-market-leaf/40 hover:bg-market-lime/20 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
            {error}
          </div>
        )}

        {/* Products Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-3 border-market-leaf border-t-transparent" />
            <p className="text-sm font-semibold text-slate-500">Loading fresh fruits...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="product-grid">
            {filteredProducts.map((product) => {
              const stock = Number(product.stock || 0);
              const isOutOfStock = stock <= 0;
              const isWishlisted = wishlist.includes(product.id);

              return (
                <article
                  key={product.id}
                  className="product-card flex flex-col justify-between"
                >
                  {/* Media */}
                  <div className="relative aspect-square overflow-hidden bg-market-cream/70 dark:bg-slate-800/80">
                    <ImageLoader
                      src={product.imageLarge || product.image}
                      alt={product.name || "Fruit"}
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    />

                    {/* Wishlist Button */}
                    <button
                      type="button"
                      className={`absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full border shadow-md backdrop-blur-md transition-all duration-300 hover:scale-110 active:scale-95 ${
                        isWishlisted
                          ? "border-market-coral/40 bg-market-coral text-white shadow-market-coral/30"
                          : "border-white/80 bg-white/90 text-slate-500 hover:text-market-coral dark:border-slate-700 dark:bg-slate-900/90 dark:text-slate-400"
                      }`}
                      onClick={() => toggleWishlist(product.id)}
                      aria-label="Wishlist"
                    >
                      <FiHeart className={isWishlisted ? "fill-current" : ""} />
                    </button>

                    {isOutOfStock && (
                      <span className="badge-danger absolute left-3 top-3">
                        Out of stock
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col justify-between p-5 space-y-3">
                    <div>
                      <span className="section-label text-[10px]">
                        {product.subcategory || product.category || "Fresh Fruit"}
                      </span>
                      <h3 className="font-display text-base font-bold text-slate-800 line-clamp-2 dark:text-white">
                        {product.name}
                      </h3>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="inline-flex items-center gap-1 font-bold text-amber-700 dark:text-amber-300">
                        <FiStar className="fill-current text-market-sun" />
                        {product.rating || "4.8"}
                      </span>

                      <span
                        className={isOutOfStock ? "badge-danger" : "badge-success"}
                      >
                        {!isOutOfStock ? `${stock} ${product.unit || "piece"} left` : "Sold out"}
                      </span>
                    </div>

                    {productErrors[product.id] && (
                      <div className="text-[11px] font-bold text-red-600 dark:text-red-400">
                        ⚠️ {productErrors[product.id]}
                      </div>
                    )}

                    {/* Pricing & Actions */}
                    <div className="flex items-center justify-between gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
                      <div className="flex items-baseline gap-1.5">
                        <strong className="font-display text-xl font-black text-market-leaf dark:text-market-lime">
                          ₹{product.price}
                        </strong>
                        {product.oldPrice && (
                          <del className="text-xs text-slate-400">₹{product.oldPrice}</del>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Link
                          to={`/product/${product.id}`}
                          className="btn-ghost h-9 w-9"
                          title="View details"
                        >
                          <FiEye />
                        </Link>
                        <button
                          type="button"
                          className="btn-primary min-h-9 px-3.5 py-1.5 text-xs"
                          disabled={isOutOfStock || cartLoading}
                          onClick={() => handleAddToCart(product)}
                        >
                          <FiShoppingCart />
                          <span>{isOutOfStock ? "Out" : "Add"}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-slate-300 py-16 text-center dark:border-slate-700">
            <span className="text-6xl animate-bounce">🍎</span>
            <h3 className="font-display text-xl font-bold text-slate-800 dark:text-white">
              No fruits found
            </h3>
            <p className="text-sm text-slate-500">
              Try choosing another category or clearing your search.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

export default Fruits;
