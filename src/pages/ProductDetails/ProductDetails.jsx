import { useEffect, useState } from "react";
import {
  FiArrowLeft,
  FiMinus,
  FiPlus,
  FiShoppingCart,
  FiStar,
  FiEye,
  FiShield,
  FiTruck,
  FiAward,
} from "react-icons/fi";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import ImageLoader from "../../components/ImageLoader/ImageLoader";
import { useCart } from "../../contexts/CartContext";
import { db } from "../../Firebase/Firebase";

function ProductDetails() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart, cartLoading } = useCart();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadProduct = async () => {
      setLoading(true);
      setError("");

      try {
        const snapshot = await getDoc(doc(db, "products", productId));

        if (!snapshot.exists()) {
          throw new Error("Product not found.");
        }

        if (active) {
          const data = snapshot.data();

          const normalizedProduct = {
            id: snapshot.id,
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
            stock: Number(data.stock || 0),
            price: Number(data.price || 0),
            unit: data.unit || "piece",
          };

          setProduct(normalizedProduct);

          if (data.category) {
            const relatedSnapshot = await getDocs(
              query(
                collection(db, "products"),
                where("category", "==", data.category),
              ),
            );

            if (active) {
              setRelatedProducts(
                relatedSnapshot.docs
                  .filter((relatedDoc) => relatedDoc.id !== snapshot.id)
                  .slice(0, 4)
                  .map((relatedDoc) => {
                    const relatedData = relatedDoc.data();
                    return {
                      id: relatedDoc.id,
                      ...relatedData,
                      image:
                        relatedData.image ||
                        relatedData.imageUrl ||
                        relatedData.imageLarge ||
                        relatedData.originalImage ||
                        "",
                      imageLarge:
                        relatedData.imageLarge ||
                        relatedData.image ||
                        relatedData.imageUrl ||
                        relatedData.originalImage ||
                        "",
                      price: Number(relatedData.price || 0),
                    };
                  }),
              );
            }
          }
        }
      } catch (loadError) {
        if (active) {
          setError(loadError.message || "Unable to load product.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadProduct();

    return () => {
      active = false;
    };
  }, [productId]);

  const changeQuantity = (amount) => {
    setQuantity((currentQuantity) =>
      Math.min(product?.stock || 1, Math.max(1, currentQuantity + amount)),
    );
  };

  const handleAddToCart = async () => {
    const added = await addToCart(product, quantity);
    if (added) {
      navigate("/cart");
    }
  };

  if (loading) {
    return (
      <div className="page-container flex flex-col items-center justify-center py-24">
        <div className="h-10 w-10 animate-spin rounded-full border-3 border-market-leaf border-t-transparent" />
        <p className="mt-4 text-sm font-semibold text-slate-500">Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="page-container flex flex-col items-center justify-center py-24 text-center">
        <span className="text-6xl animate-bounce">🔍</span>
        <h2 className="mt-4 font-display text-2xl font-black text-slate-800 dark:text-white">
          {error || "Product not found"}
        </h2>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="btn-primary mt-6"
        >
          <FiArrowLeft />
          <span>Go Back</span>
        </button>
      </div>
    );
  }

  const outOfStock = product.stock <= 0;

  return (
    <div className="page-container space-y-12 pb-16 animate-rise">
      {/* Back Button */}
      <div>
        <button
          type="button"
          className="group inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold text-slate-600 hover:text-market-leaf hover:bg-white/80 dark:text-slate-300 dark:hover:text-market-lime dark:hover:bg-slate-900 transition-all"
          onClick={() => navigate(-1)}
        >
          <FiArrowLeft className="transition-transform group-hover:-translate-x-1" />
          <span>Back to Products</span>
        </button>
      </div>

      {/* Main Product Showcase Card */}
      <section className="card overflow-hidden grid gap-8 lg:grid-cols-12 p-6 sm:p-10 shadow-2xl">
        {/* Left: Product Image */}
        <div className="relative aspect-square overflow-hidden rounded-3xl bg-market-cream/70 dark:bg-slate-800 lg:col-span-6 shadow-inner">
          <ImageLoader
            src={product.imageLarge || product.image}
            alt={product.name}
            className="h-full w-full object-cover"
          />

          {outOfStock ? (
            <span className="badge-danger absolute left-4 top-4 text-sm shadow-md">
              Out of stock
            </span>
          ) : (
            <span className="badge-success absolute left-4 top-4 text-sm shadow-md">
              In Stock ({product.stock} {product.unit || "left"})
            </span>
          )}
        </div>

        {/* Right: Product Details & Controls */}
        <div className="flex flex-col justify-between space-y-6 lg:col-span-6">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <span className="section-label">
                {product.category || "Fresh Produce"}
              </span>
              <h1 className="font-display text-3xl font-black text-slate-800 dark:text-white sm:text-4xl">
                {product.name}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <div className="inline-flex items-center gap-1.5 rounded-xl bg-amber-50 px-3 py-1 text-sm font-bold text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                <FiStar className="fill-current text-market-sun text-base" />
                <span>{product.rating || "4.8"} (50+ reviews)</span>
              </div>
            </div>

            {/* Price Tag */}
            <div className="flex items-baseline gap-3 pt-2">
              <span className="font-display text-4xl font-black text-market-leaf dark:text-market-lime">
                ₹{product.price}
              </span>
              {product.oldPrice && (
                <del className="text-lg text-slate-400">₹{product.oldPrice}</del>
              )}
              <span className="text-xs text-slate-500 font-semibold">
                / {product.unit || "piece"}
              </span>
            </div>

            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {product.description ||
                `Farm-fresh ${product.name}, hand-picked and cleaned under rigorous quality standards. Great choice for everyday nutrition and natural flavor.`}
            </p>

            {/* Trust Points */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
                <FiTruck className="text-market-leaf text-base shrink-0" />
                <span>Same day dispatch</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
                <FiShield className="text-market-leaf text-base shrink-0" />
                <span>100% Quality checked</span>
              </div>
            </div>
          </div>

          {/* Action Zone */}
          {!outOfStock ? (
            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex flex-wrap items-center gap-4">
                {/* Quantity Stepper */}
                <div className="inline-flex items-center rounded-2xl border border-slate-200 bg-slate-50 p-1 dark:border-slate-700 dark:bg-slate-800 shadow-inner">
                  <button
                    type="button"
                    onClick={() => changeQuantity(-1)}
                    disabled={quantity <= 1}
                    className="grid h-10 w-10 place-items-center rounded-xl text-slate-600 hover:bg-white hover:text-slate-900 active:scale-95 disabled:opacity-40 dark:text-slate-300 dark:hover:bg-slate-700"
                    aria-label="Decrease quantity"
                  >
                    <FiMinus />
                  </button>
                  <strong className="min-w-10 text-center font-display text-base font-bold">
                    {quantity}
                  </strong>
                  <button
                    type="button"
                    onClick={() => changeQuantity(1)}
                    disabled={quantity >= product.stock}
                    className="grid h-10 w-10 place-items-center rounded-xl text-slate-600 hover:bg-white hover:text-slate-900 active:scale-95 disabled:opacity-40 dark:text-slate-300 dark:hover:bg-slate-700"
                    aria-label="Increase quantity"
                  >
                    <FiPlus />
                  </button>
                </div>

                {/* Add to cart */}
                <button
                  type="button"
                  className="btn-primary flex-1 py-3.5 text-base font-bold shadow-xl shadow-market-leaf/30 hover:shadow-2xl hover:shadow-market-leaf/40 active:scale-95"
                  onClick={handleAddToCart}
                  disabled={cartLoading}
                >
                  <FiShoppingCart />
                  <span>Add to Cart (₹{(quantity * product.price).toFixed(2)})</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-center text-sm font-bold text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
              This item is currently sold out. Please check back later!
            </div>
          )}
        </div>
      </section>

      {/* Related Products Grid */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6 pt-6">
          <div className="space-y-1">
            <span className="section-label">Recommendations</span>
            <h2 className="font-display text-2xl font-black text-slate-800 dark:text-white">
              Related Products
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.map((rel) => (
              <article key={rel.id} className="product-card flex flex-col justify-between">
                <div className="relative aspect-square overflow-hidden bg-market-cream/70 dark:bg-slate-800/80">
                  <ImageLoader
                    src={rel.imageLarge || rel.image}
                    alt={rel.name || "Product"}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                </div>

                <div className="p-4 space-y-2">
                  <h3 className="font-display text-sm font-bold text-slate-800 line-clamp-1 dark:text-white">
                    {rel.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <strong className="font-display text-base font-black text-market-leaf dark:text-market-lime">
                      ₹{rel.price}
                    </strong>
                    <Link
                      to={`/product/${rel.id}`}
                      className="btn-ghost h-8 w-8 text-xs"
                      title="View product"
                    >
                      <FiEye />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default ProductDetails;
