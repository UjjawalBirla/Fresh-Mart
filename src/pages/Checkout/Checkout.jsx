import { useMemo, useState } from "react";
import {
  FiArrowLeft,
  FiArrowRight,
  FiCheckCircle,
  FiCreditCard,
  FiMapPin,
  FiPhone,
  FiShoppingBag,
  FiTruck,
  FiUser,
  FiShield,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext";

function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, cartCount, cartTotal, placeOrder, cartLoading, cartError } =
    useCart();

  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");

  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState("");
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");

  const deliveryCharge = cartTotal >= 499 ? 0 : 40;
  const tax = cartTotal * 0.05;

  const finalTotal = useMemo(() => {
    return cartTotal + deliveryCharge + tax;
  }, [cartTotal, deliveryCharge, tax]);

  const handlePlaceOrder = async (event) => {
    event.preventDefault();
    setError("");

    if (!user?.uid) {
      setError("Please login before placing your order.");
      return;
    }

    if (!cartItems.length) {
      setError("Your cart is empty.");
      return;
    }

    const cleanName = name.trim();
    if (!cleanName) {
      setError("Please enter your name.");
      return;
    }

    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length !== 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    const cleanAddress = address.trim();
    if (!cleanAddress) {
      setError("Please enter your delivery address.");
      return;
    }

    const cleanCity = city.trim();
    if (!cleanCity) {
      setError("Please enter your city.");
      return;
    }

    const cleanState = state.trim();
    if (!cleanState) {
      setError("Please enter your state.");
      return;
    }

    const cleanPincode = pincode.replace(/\D/g, "");
    if (cleanPincode.length !== 6) {
      setError("Please enter a valid 6-digit pincode.");
      return;
    }

    if (!paymentMethod) {
      setError("Please select a payment method.");
      return;
    }

    setPlacingOrder(true);

    try {
      const result = await placeOrder({
        userId: user.uid,
        userEmail: user.email || "",
        customer: {
          name: cleanName,
          phone: cleanPhone,
          email: user.email || "",
        },
        paymentMethod,
        deliveryAddress: {
          name: cleanName,
          phone: cleanPhone,
          address: cleanAddress,
          city: cleanCity,
          state: cleanState,
          pincode: cleanPincode,
        },
      });

      if (!result?.success) {
        setError(result?.error || cartError || "Unable to place order.");
        return;
      }

      setOrderId(result.orderId || "");
      setOrderSuccess(true);
    } catch (orderErr) {
      console.error("Place Order Error:", orderErr);
      setError(orderErr.message || "Unable to place order.");
    } finally {
      setPlacingOrder(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="page-container py-16 animate-rise">
        <div className="card mx-auto max-w-lg p-8 sm:p-12 text-center shadow-2xl space-y-6">
          <div className="grid h-24 w-24 place-items-center rounded-3xl bg-emerald-100 text-5xl text-emerald-600 shadow-inner animate-float mx-auto dark:bg-emerald-950/60 dark:text-emerald-400">
            <FiCheckCircle />
          </div>

          <div className="space-y-2">
            <span className="section-label text-emerald-600 dark:text-emerald-400">
              Order Confirmed
            </span>
            <h1 className="font-display text-3xl font-black text-slate-800 dark:text-white">
              Thank You for Ordering! 🎉
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Your order has been received and sent to our farm dispatch center.
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200 dark:bg-slate-800/60 dark:border-slate-700">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Order Identifier
            </span>
            <strong className="font-display text-lg font-mono font-black text-slate-800 dark:text-white">
              {orderId}
            </strong>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              className="btn-primary flex-1"
              onClick={() => navigate("/orders")}
            >
              <span>View My Orders</span>
              <FiArrowRight />
            </button>
            <button
              type="button"
              className="btn-secondary flex-1"
              onClick={() => navigate("/")}
            >
              <span>Continue Shopping</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!cartItems.length) {
    return (
      <div className="page-container py-16 animate-rise">
        <div className="card mx-auto max-w-md p-8 text-center space-y-4 shadow-xl">
          <div className="grid h-20 w-20 place-items-center rounded-2xl bg-market-lime/40 text-4xl text-market-leaf mx-auto dark:bg-market-leaf/20">
            <FiShoppingBag />
          </div>
          <h2 className="font-display text-2xl font-black text-slate-800 dark:text-white">
            Your Cart is Empty
          </h2>
          <p className="text-xs text-slate-500">
            Add items to your cart before proceeding to checkout.
          </p>
          <button
            type="button"
            className="btn-primary"
            onClick={() => navigate("/fruits")}
          >
            <FiArrowLeft />
            <span>Browse Products</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container space-y-8 pb-16 animate-rise">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/80 pb-6 dark:border-slate-800">
        <div>
          <button
            type="button"
            className="group inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-market-leaf mb-2 dark:text-slate-400 dark:hover:text-market-lime transition-colors"
            onClick={() => navigate("/cart")}
          >
            <FiArrowLeft className="transition-transform group-hover:-translate-x-1" />
            <span>Back to Shopping Cart</span>
          </button>

          <h1 className="font-display text-3xl font-black text-slate-800 dark:text-white md:text-4xl">
            Checkout & Delivery 🚚
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Provide your address and select your preferred payment mode.
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-bold text-red-700 shadow-xs dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </div>
      )}

      {/* Checkout Form & Summary Grid */}
      <form onSubmit={handlePlaceOrder} className="grid gap-8 lg:grid-cols-12">
        {/* Left Column: Input Forms */}
        <div className="space-y-6 lg:col-span-8">
          {/* Customer Details Card */}
          <section className="card p-6 sm:p-8 space-y-5 shadow-lg">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3.5 dark:border-slate-800">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-market-lime/60 text-market-leaf text-lg dark:bg-market-leaf/30 dark:text-market-lime">
                <FiUser />
              </div>
              <div>
                <h2 className="font-display text-xl font-black text-slate-800 dark:text-white">
                  Customer Information
                </h2>
                <span className="text-xs text-slate-400">
                  Recipient name and contact number
                </span>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Full Name
                </label>
                <div className="input-field">
                  <FiUser className="text-slate-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    disabled={placingOrder}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Mobile Number (10 Digits)
                </label>
                <div className="input-field">
                  <FiPhone className="text-slate-400 shrink-0" />
                  <input
                    type="tel"
                    placeholder="e.g. 9876543210"
                    maxLength={10}
                    value={phone}
                    onChange={(event) =>
                      setPhone(event.target.value.replace(/\D/g, ""))
                    }
                    disabled={placingOrder}
                    required
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Delivery Address Card */}
          <section className="card p-6 sm:p-8 space-y-5 shadow-lg">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3.5 dark:border-slate-800">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-market-lime/60 text-market-leaf text-lg dark:bg-market-leaf/30 dark:text-market-lime">
                <FiMapPin />
              </div>
              <div>
                <h2 className="font-display text-xl font-black text-slate-800 dark:text-white">
                  Delivery Address
                </h2>
                <span className="text-xs text-slate-400">
                  Where should we bring your fresh groceries?
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Street Address / House No. / Flat
                </label>
                <textarea
                  rows={3}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 p-3.5 text-sm outline-none transition-all focus:border-market-leaf focus:bg-white focus:ring-2 focus:ring-market-leaf/20 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100"
                  placeholder="e.g. Flat 302, Green Valley Apartments, Main Street"
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                  disabled={placingOrder}
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    City
                  </label>
                  <div className="input-field">
                    <input
                      type="text"
                      placeholder="e.g. New Delhi"
                      value={city}
                      onChange={(event) => setCity(event.target.value)}
                      disabled={placingOrder}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    State
                  </label>
                  <div className="input-field">
                    <input
                      type="text"
                      placeholder="e.g. Delhi"
                      value={state}
                      onChange={(event) => setState(event.target.value)}
                      disabled={placingOrder}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Pincode (6 Digits)
                  </label>
                  <div className="input-field">
                    <input
                      type="text"
                      placeholder="e.g. 110001"
                      maxLength={6}
                      value={pincode}
                      onChange={(event) =>
                        setPincode(event.target.value.replace(/\D/g, ""))
                      }
                      disabled={placingOrder}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Payment Method Card */}
          <section className="card p-6 sm:p-8 space-y-5 shadow-lg">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3.5 dark:border-slate-800">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-market-lime/60 text-market-leaf text-lg dark:bg-market-leaf/30 dark:text-market-lime">
                <FiCreditCard />
              </div>
              <div>
                <h2 className="font-display text-xl font-black text-slate-800 dark:text-white">
                  Payment Method
                </h2>
                <span className="text-xs text-slate-400">
                  Select payment mode for this order
                </span>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label
                className={`flex cursor-pointer items-center gap-3.5 rounded-2xl border-2 p-4 transition-all duration-300 ${
                  paymentMethod === "COD"
                    ? "border-market-leaf bg-market-lime/20 shadow-md dark:bg-market-leaf/20"
                    : "border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="COD"
                  checked={paymentMethod === "COD"}
                  onChange={() => setPaymentMethod("COD")}
                  className="h-4 w-4 text-market-leaf"
                />
                <div>
                  <strong className="block text-sm font-bold text-slate-800 dark:text-white">
                    Cash on Delivery
                  </strong>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Pay upon arrival at doorstep
                  </span>
                </div>
              </label>

              <label
                className={`flex cursor-pointer items-center gap-3.5 rounded-2xl border-2 p-4 transition-all duration-300 ${
                  paymentMethod === "ONLINE"
                    ? "border-market-leaf bg-market-lime/20 shadow-md dark:bg-market-leaf/20"
                    : "border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="ONLINE"
                  checked={paymentMethod === "ONLINE"}
                  onChange={() => setPaymentMethod("ONLINE")}
                  className="h-4 w-4 text-market-leaf"
                />
                <div>
                  <strong className="block text-sm font-bold text-slate-800 dark:text-white">
                    UPI / Online Pay
                  </strong>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    UPI, Cards & Netbanking
                  </span>
                </div>
              </label>
            </div>
          </section>
        </div>

        {/* Right Column: Checkout Summary Sticky Card */}
        <aside className="lg:col-span-4">
          <div className="card p-6 sm:p-8 space-y-6 shadow-2xl sticky top-24">
            <h2 className="font-display text-2xl font-black text-slate-800 dark:text-white">
              Order Review
            </h2>

            {/* Items Mini List */}
            <div className="max-h-56 overflow-y-auto space-y-3 p-1">
              {cartItems.map((prod) => (
                <div key={prod.id} className="flex items-center gap-3">
                  <img
                    src={prod.imageLarge || prod.image || prod.originalImage}
                    alt={prod.name}
                    className="h-12 w-12 rounded-xl object-cover bg-market-cream shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <strong className="block truncate text-xs font-bold text-slate-800 dark:text-white">
                      {prod.name}
                    </strong>
                    <span className="text-[11px] text-slate-400">
                      {prod.quantity} × ₹{prod.price}
                    </span>
                  </div>
                  <span className="text-xs font-black text-slate-800 dark:text-white">
                    ₹{(prod.quantity * prod.price).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-3 border-t border-slate-200 pt-4 text-sm dark:border-slate-700">
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                <span>Subtotal</span>
                <span className="font-bold text-slate-800 dark:text-white">
                  ₹{cartTotal.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                <span>Delivery</span>
                <span className="badge-success">
                  {deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge}`}
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                <span>Tax (5%)</span>
                <span className="font-bold text-slate-800 dark:text-white">
                  ₹{tax.toFixed(2)}
                </span>
              </div>

              <div className="border-t border-slate-200 pt-3 dark:border-slate-700">
                <div className="flex items-baseline justify-between">
                  <span className="font-display text-lg font-bold text-slate-800 dark:text-white">
                    Total
                  </span>
                  <strong className="font-display text-3xl font-black text-market-leaf dark:text-market-lime">
                    ₹{finalTotal.toFixed(2)}
                  </strong>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary w-full py-4 text-base font-bold shadow-xl shadow-market-leaf/30 hover:shadow-2xl hover:shadow-market-leaf/40 active:scale-95 disabled:opacity-50"
              disabled={placingOrder || cartLoading}
            >
              {placingOrder ? (
                <>
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Placing Order...</span>
                </>
              ) : (
                <>
                  <span>Place Order</span>
                  <FiArrowRight />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 text-center">
              <FiShield className="text-market-leaf" />
              <span>Encrypted & secure checkout</span>
            </div>
          </div>
        </aside>
      </form>
    </div>
  );
}

export default Checkout;
