import {
  FiMinus,
  FiPlus,
  FiTrash2,
  FiShoppingCart,
  FiArrowLeft,
  FiArrowRight,
  FiShield,
  FiTruck,
} from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";

function Cart() {
  const navigate = useNavigate();

  const {
    cartItems,
    cartCount,
    cartTotal,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
    cartLoading,
    cartMessage,
  } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="page-container py-16">
        <div className="card mx-auto flex max-w-lg flex-col items-center gap-6 p-8 sm:p-12 text-center shadow-2xl animate-rise">
          <div className="grid h-24 w-24 place-items-center rounded-3xl bg-market-lime/40 text-5xl text-market-leaf shadow-inner animate-float dark:bg-market-leaf/20 dark:text-market-lime">
            <FiShoppingCart />
          </div>

          <div className="space-y-2">
            <h1 className="font-display text-3xl font-black text-slate-800 dark:text-white">
              Your Cart is Empty
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
              Looks like you haven't added any fresh produce or groceries yet.
            </p>
          </div>

          <Link to="/fruits" className="btn-primary mt-2">
            <FiArrowLeft />
            <span>Start Shopping</span>
          </Link>
        </div>
      </div>
    );
  }

  const handleDecrease = async (id) => {
    if (cartLoading) return;
    await decreaseQuantity(id);
  };

  const handleIncrease = async (item) => {
    if (cartLoading) return;
    const quantity = Number(item.quantity) || 1;
    const stock = Number(item.stock) || 0;
    if (quantity >= stock) return;
    await increaseQuantity(item.id);
  };

  const handleRemove = async (id) => {
    if (cartLoading) return;
    await removeFromCart(id);
  };

  const handleClearCart = async () => {
    if (cartLoading) return;
    const confirmed = window.confirm("Are you sure you want to empty your cart?");
    if (!confirmed) return;
    await clearCart(true);
  };

  const handleCheckout = () => {
    if (cartLoading || cartItems.length === 0) return;
    navigate("/checkout");
  };

  return (
    <div className="page-container space-y-8 pb-16 animate-rise">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-slate-200/80 pb-6 dark:border-slate-800">
        <div>
          <span className="section-label">Basket Review</span>
          <h1 className="font-display text-3xl font-black text-slate-800 dark:text-white md:text-4xl">
            Shopping Cart 🛒
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {cartCount} {cartCount === 1 ? "item" : "items"} ready for fresh delivery
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50/80 px-4 py-2 text-xs font-bold text-red-600 shadow-xs transition-all hover:bg-red-100 hover:shadow-sm self-start sm:self-auto dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300"
          onClick={handleClearCart}
          disabled={cartLoading}
        >
          <FiTrash2 />
          <span>{cartLoading ? "Updating..." : "Clear Cart"}</span>
        </button>
      </div>

      {cartMessage && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-bold text-emerald-800 shadow-xs dark:border-emerald-800/50 dark:bg-emerald-950/40 dark:text-emerald-300">
          {cartMessage}
        </div>
      )}

      {/* Cart Grid Layout */}
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left Column: Cart Line Items */}
        <section className="space-y-4 lg:col-span-8">
          {cartItems.map((item) => {
            const image = item.imageLarge || item.image || item.originalImage;
            const quantity = Number(item.quantity) || 1;
            const price = Number(item.price) || 0;
            const itemTotal = price * quantity;
            const stock = Number(item.stock) || 0;
            const unit = item.unit || "item";
            const stockLimitReached = stock > 0 && quantity >= stock;

            return (
              <article
                className="card flex flex-col sm:flex-row items-center gap-5 p-5 shadow-lg transition-all duration-300 hover:shadow-xl hover:border-market-leaf/30"
                key={item.id}
              >
                {/* Image */}
                <div className="h-28 w-28 shrink-0 overflow-hidden rounded-2xl bg-market-cream/70 shadow-inner dark:bg-slate-800">
                  <img
                    src={image}
                    alt={item.name || "Product"}
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Information */}
                <div className="min-w-0 flex-1 space-y-2 text-center sm:text-left">
                  <div>
                    <span className="section-label text-[10px]">
                      {item.category || "Fresh Produce"}
                    </span>
                    <h3 className="font-display text-lg font-bold text-slate-800 dark:text-white">
                      {item.name}
                    </h3>
                  </div>

                  <div className="flex items-baseline justify-center sm:justify-start gap-2">
                    <strong className="font-display text-xl font-black text-market-leaf dark:text-market-lime">
                      ₹{price}
                    </strong>
                    <span className="text-xs text-slate-400">/ {unit}</span>
                  </div>

                  {/* Quantity & Delete Controls */}
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-1">
                    <div className="inline-flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1 shadow-inner dark:border-slate-700 dark:bg-slate-800">
                      <button
                        type="button"
                        className="grid h-8 w-8 place-items-center rounded-lg text-slate-600 hover:bg-white hover:text-slate-900 active:scale-95 disabled:opacity-40 dark:text-slate-300 dark:hover:bg-slate-700"
                        onClick={() => handleDecrease(item.id)}
                        disabled={cartLoading}
                        aria-label="Decrease quantity"
                      >
                        <FiMinus />
                      </button>

                      <span className="min-w-8 text-center font-display text-sm font-bold">
                        {quantity}
                      </span>

                      <button
                        type="button"
                        className="grid h-8 w-8 place-items-center rounded-lg text-slate-600 hover:bg-white hover:text-slate-900 active:scale-95 disabled:opacity-40 dark:text-slate-300 dark:hover:bg-slate-700"
                        onClick={() => handleIncrease(item)}
                        disabled={cartLoading || stock <= 0 || quantity >= stock}
                        aria-label="Increase quantity"
                      >
                        <FiPlus />
                      </button>
                    </div>

                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-red-500 hover:text-red-700 transition-colors"
                      onClick={() => handleRemove(item.id)}
                      disabled={cartLoading}
                    >
                      <FiTrash2 />
                      <span>Remove</span>
                    </button>
                  </div>

                  {stockLimitReached && (
                    <div className="text-[11px] font-bold text-amber-600 dark:text-amber-400">
                      Max available stock reached ({stock} {unit})
                    </div>
                  )}
                </div>

                {/* Subtotal Item Price */}
                <div className="text-center sm:text-right shrink-0 border-t border-slate-100 sm:border-0 pt-3 sm:pt-0 w-full sm:w-auto">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Total
                  </span>
                  <strong className="font-display text-2xl font-black text-slate-800 dark:text-white">
                    ₹{itemTotal.toFixed(2)}
                  </strong>
                </div>
              </article>
            );
          })}
        </section>

        {/* Right Column: Order Summary Card */}
        <aside className="lg:col-span-4">
          <div className="card space-y-6 p-6 sm:p-8 shadow-2xl sticky top-24">
            <h2 className="font-display text-2xl font-black text-slate-800 dark:text-white">
              Order Summary
            </h2>

            <div className="space-y-3.5 text-sm">
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                <span>Items Subtotal</span>
                <span className="font-bold text-slate-800 dark:text-white">
                  ₹{cartTotal.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                <span>Delivery Charge</span>
                <span className="badge-success">
                  {cartTotal >= 499 ? "FREE" : "₹40.00"}
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                <span>Estimated Tax (5%)</span>
                <span className="font-bold text-slate-800 dark:text-white">
                  ₹{(cartTotal * 0.05).toFixed(2)}
                </span>
              </div>

              <div className="border-t border-slate-200 pt-3.5 dark:border-slate-700">
                <div className="flex items-baseline justify-between">
                  <span className="font-display text-lg font-bold text-slate-800 dark:text-white">
                    Grand Total
                  </span>
                  <strong className="font-display text-3xl font-black text-market-leaf dark:text-market-lime">
                    ₹{(cartTotal + (cartTotal >= 499 ? 0 : 40) + cartTotal * 0.05).toFixed(2)}
                  </strong>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <button
                type="button"
                className="btn-primary w-full py-4 text-base font-bold shadow-xl shadow-market-leaf/30 hover:shadow-2xl hover:shadow-market-leaf/40 active:scale-95"
                onClick={handleCheckout}
                disabled={cartLoading}
              >
                <span>Proceed to Checkout</span>
                <FiArrowRight />
              </button>

              <Link
                to="/fruits"
                className="btn-secondary w-full text-center"
              >
                <FiArrowLeft />
                <span>Continue Shopping</span>
              </Link>
            </div>

            {/* Trust Assurance */}
            <div className="border-t border-slate-100 pt-4 dark:border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <FiTruck className="text-market-leaf text-base shrink-0" />
                <span>Free delivery on orders over ₹499</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <FiShield className="text-market-leaf text-base shrink-0" />
                <span>100% Safe & Secure payment</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default Cart;
