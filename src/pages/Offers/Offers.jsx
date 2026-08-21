import { useEffect, useMemo, useState } from "react";
import {
  FiSearch,
  FiHeart,
  FiShoppingCart,
  FiStar,
  FiTag,
  FiEye,
  FiPercent,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../Firebase/Firebase";
import ImageLoader from "../../components/ImageLoader/ImageLoader";
import { useCart } from "../../contexts/CartContext";

function Offers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [wishlist, setWishlist] = useState([]);
  const [productErrors, setProductErrors] = useState({});

  const { addToCart, cartItems, cartLoading } = useCart();

  useEffect(() => {
    setLoading(true);
    const offersQuery = query(
      collection(db, "products"),
      where("category", "==", "Offers"),
    );

    const unsubscribe = onSnapshot(
      offersQuery,
      (snapshot) => {
        const offerList = snapshot.docs
          .map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
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
              price: Number(data.price || 0),
              oldPrice: Number(data.oldPrice || 0),
              stock: Number(data.stock || 0),
              unit: data.unit || "piece",
            };
          })
          .sort((a, b) => {
            const dateA = a.createdAt?.toMillis?.() || 0;
            const dateB = b.createdAt?.toMillis?.() || 0;
            return dateB - dateA;
          });

        setOffers(offerList);
        setLoading(false);
        setError("");
      },
      (firebaseError) => {
        console.error("Offers Firebase Error:", firebaseError);
        setError("Unable to load offers.");
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  const filteredOffers = useMemo(() => {
    return offers.filter((offer) => {
      const productName = offer.name?.toLowerCase() || "";
      const category =
        offer.subcategory?.toLowerCase() || offer.category?.toLowerCase() || "";
      const searchText = search.toLowerCase().trim();

      return productName.includes(searchText) || category.includes(searchText);
    });
  }, [offers, search]);

  const toggleWishlist = (id) => {
    setWishlist((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  };

  const handleAddToCart = async (offer) => {
    const stock = Number(offer.stock || 0);
    const unit = offer.unit || "piece";

    setProductErrors((current) => ({ ...current, [offer.id]: "" }));

    if (stock <= 0) {
      setProductErrors((current) => ({ ...current, [offer.id]: "Out of stock" }));
      return;
    }

    const existingItem = cartItems.find((item) => item.id === offer.id);
    const currentQuantity = Number(existingItem?.quantity || 0);

    if (currentQuantity + 1 > stock) {
      setProductErrors((current) => ({
        ...current,
        [offer.id]: `Only ${stock} ${unit} available`,
      }));
      return;
    }

    const success = await addToCart(
      {
        ...offer,
        id: offer.id,
        name: offer.name,
        price: Number(offer.price || 0),
        oldPrice: Number(offer.oldPrice || 0),
        stock,
        unit,
        image: offer.imageLarge || offer.image || offer.originalImage,
        imageLarge: offer.imageLarge || offer.image || offer.originalImage,
      },
      1,
    );

    if (!success) {
      setProductErrors((current) => ({
        ...current,
        [offer.id]: `Only ${stock} ${unit} available`,
      }));
    }
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-market-leaf via-market-leaf-dark to-emerald-950 px-4 py-12 text-white md:px-8 md:py-16 shadow-xl">
        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-market-coral/20 blur-3xl" />
        <div className="absolute -bottom-32 -right-16 h-80 w-80 rounded-full bg-market-sun/20 blur-3xl" />

        <div className="page-container relative z-10 flex flex-col items-center justify-between gap-6 py-0 sm:flex-row">
          <div className="max-w-xl text-center sm:text-left space-y-2 animate-rise">
            <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-market-coral">
              Exclusive Discounts
            </span>
            <h1 className="font-display text-3xl font-black sm:text-4xl md:text-5xl">
              Special Offers 🏷️
            </h1>
            <p className="text-sm text-white/80">
              Big savings on fresh bundles, seasonal specials and wholesale organic essentials.
            </p>
          </div>

          <div className="grid h-24 w-24 place-items-center rounded-3xl bg-white/10 text-6xl shadow-xl backdrop-blur-md animate-float sm:h-32 sm:w-32 sm:text-7xl">
            🏷️
          </div>
        </div>
      </section>

      {/* Toolbar */}
      <section className="page-container space-y-6">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="input-field flex-1 sm:max-w-md">
            <FiSearch className="text-slate-400 shrink-0 text-lg" />
            <input
              type="text"
              placeholder="Search special deals & discounts..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
            <FiPercent className="text-market-coral text-base" />
            <span>
              <strong className="text-market-leaf dark:text-market-lime">{filteredOffers.length}</strong> active offers
            </span>
          </div>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
            {error}
          </div>
        )}

        {/* Offers Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-3 border-market-leaf border-t-transparent" />
            <p className="text-sm font-semibold text-slate-500">Loading special offers...</p>
          </div>
        ) : filteredOffers.length > 0 ? (
          <div className="product-grid">
            {filteredOffers.map((offer) => {
              const stock = Number(offer.stock || 0);
              const isOutOfStock = stock <= 0;
              const isWishlisted = wishlist.includes(offer.id);
              const discountPercent =
                offer.oldPrice > offer.price
                  ? Math.round(((offer.oldPrice - offer.price) / offer.oldPrice) * 100)
                  : null;

              return (
                <article
                  key={offer.id}
                  className="product-card flex flex-col justify-between border-market-coral/20"
                >
                  <div className="relative aspect-square overflow-hidden bg-market-cream/70 dark:bg-slate-800/80">
                    <ImageLoader
                      src={offer.imageLarge || offer.image || offer.originalImage}
                      alt={offer.name || "Offer"}
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    />

                    {/* Offer Discount Badge */}
                    <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-xl bg-market-coral px-2.5 py-1 text-[11px] font-black text-white shadow-md animate-pulse">
                      <FiTag />
                      <span>{discountPercent ? `${discountPercent}% OFF` : "DEAL"}</span>
                    </div>

                    <button
                      type="button"
                      className={`absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full border shadow-md backdrop-blur-md transition-all duration-300 hover:scale-110 active:scale-95 ${
                        isWishlisted
                          ? "border-market-coral/40 bg-market-coral text-white shadow-market-coral/30"
                          : "border-white/80 bg-white/90 text-slate-500 hover:text-market-coral dark:border-slate-700 dark:bg-slate-900/90 dark:text-slate-400"
                      }`}
                      onClick={() => toggleWishlist(offer.id)}
                      aria-label="Wishlist"
                    >
                      <FiHeart className={isWishlisted ? "fill-current" : ""} />
                    </button>

                    {isOutOfStock && (
                      <span className="badge-danger absolute left-3 bottom-3">
                        Out of stock
                      </span>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col justify-between p-5 space-y-3">
                    <div>
                      <span className="section-label text-[10px] text-market-coral dark:text-market-coral">
                        {offer.subcategory || offer.category || "Special Deal"}
                      </span>
                      <h3 className="font-display text-base font-bold text-slate-800 line-clamp-2 dark:text-white">
                        {offer.name}
                      </h3>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="inline-flex items-center gap-1 font-bold text-amber-700 dark:text-amber-300">
                        <FiStar className="fill-current text-market-sun" />
                        {offer.rating || "4.9"}
                      </span>

                      <span
                        className={isOutOfStock ? "badge-danger" : "badge-success"}
                      >
                        {!isOutOfStock ? `${stock} ${offer.unit || "piece"} left` : "Sold out"}
                      </span>
                    </div>

                    {productErrors[offer.id] && (
                      <div className="text-[11px] font-bold text-red-600 dark:text-red-400">
                        ⚠️ {productErrors[offer.id]}
                      </div>
                    )}

                    <div className="flex items-center justify-between gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
                      <div className="flex items-baseline gap-1.5">
                        <strong className="font-display text-xl font-black text-market-coral">
                          ₹{offer.price}
                        </strong>
                        {offer.oldPrice > 0 && (
                          <del className="text-xs text-slate-400">₹{offer.oldPrice}</del>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Link
                          to={`/product/${offer.id}`}
                          className="btn-ghost h-9 w-9"
                          title="View details"
                        >
                          <FiEye />
                        </Link>
                        <button
                          type="button"
                          className="btn-primary min-h-9 bg-market-coral px-3.5 py-1.5 text-xs shadow-market-coral/25 hover:bg-red-600 hover:shadow-market-coral/35"
                          disabled={isOutOfStock || cartLoading}
                          onClick={() => handleAddToCart(offer)}
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
            <span className="text-6xl animate-bounce">🏷️</span>
            <h3 className="font-display text-xl font-bold text-slate-800 dark:text-white">
              No offers available
            </h3>
            <p className="text-sm text-slate-500">
              New deals posted by store manager will appear here.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

export default Offers;
