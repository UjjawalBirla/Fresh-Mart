import { createContext, useContext, useEffect, useMemo, useState } from "react";

import {
  collection,
  doc,
  getDoc,
  runTransaction,
  serverTimestamp,
  addDoc,
} from "firebase/firestore";

import { db } from "../Firebase/Firebase";

import { useAuth } from "./AuthContext";

// =====================================================
// CONTEXT
// =====================================================

const CartContext = createContext(null);

// =====================================================
// STORAGE KEY
// =====================================================

const CART_STORAGE_KEY = "farm_fresh_cart";

// =====================================================
// PROVIDER
// =====================================================

export function CartProvider({ children }) {
  // ===================================================
  // AUTH USER
  // ===================================================

  const { user } = useAuth();

  // ===================================================
  // CART
  // ===================================================

  const [cartItems, setCartItems] = useState([]);

  // ===================================================
  // CART USER
  // ===================================================

  const [cartUserId, setCartUserId] = useState(null);

  // ===================================================
  // CART LOAD STATUS
  // ===================================================

  const [cartInitialized, setCartInitialized] = useState(false);

  // ===================================================
  // STATES
  // ===================================================

  const [cartLoading, setCartLoading] = useState(false);

  const [cartMessage, setCartMessage] = useState("");

  const [cartError, setCartError] = useState("");

  // ===================================================
  // USER-WISE STORAGE KEY
  // ===================================================

  const getUserCartKey = (userId) => {
    if (!userId) {
      return null;
    }

    return `${CART_STORAGE_KEY}_${userId}`;
  };

  // ===================================================
  // LOAD USER CART
  // ===================================================

  useEffect(() => {
    const currentUserId = user?.uid || null;

    // -------------------------------------------------
    // IMPORTANT
    // -------------------------------------------------
    // Pehle old user ka cart memory se remove karo.
    // -------------------------------------------------

    setCartItems([]);

    setCartUserId(currentUserId);

    setCartInitialized(false);

    setCartMessage("");

    setCartError("");

    // -------------------------------------------------
    // USER LOGGED OUT
    // -------------------------------------------------

    if (!currentUserId) {
      setCartInitialized(true);

      return;
    }

    // -------------------------------------------------
    // USER-WISE KEY
    // -------------------------------------------------

    const userCartKey = getUserCartKey(currentUserId);

    try {
      const savedCart = localStorage.getItem(userCartKey);

      if (!savedCart) {
        setCartItems([]);
        setCartInitialized(true);

        return;
      }

      const parsedCart = JSON.parse(savedCart);

      if (Array.isArray(parsedCart)) {
        setCartItems(parsedCart);
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error("User cart load error:", error);

      setCartItems([]);
    } finally {
      setCartInitialized(true);
    }
  }, [user?.uid]);

  // ===================================================
  // SAVE USER CART
  // ===================================================

  useEffect(() => {
    // -------------------------------------------------
    // Cart abhi load nahi hua
    // -------------------------------------------------

    if (!cartInitialized) {
      return;
    }

    // -------------------------------------------------
    // User logged out
    // -------------------------------------------------

    if (!cartUserId) {
      return;
    }

    const userCartKey = getUserCartKey(cartUserId);

    if (!userCartKey) {
      return;
    }

    try {
      localStorage.setItem(userCartKey, JSON.stringify(cartItems));
    } catch (error) {
      console.error("User cart save error:", error);
    }
  }, [cartItems, cartUserId, cartInitialized]);

  // ===================================================
  // CLEAR MESSAGE
  // ===================================================

  const clearCartMessage = () => {
    setCartMessage("");

    setCartError("");
  };

  // ===================================================
  // ADD TO CART
  // ===================================================

  const addToCart = async (product, quantity = 1) => {
    setCartMessage("");

    setCartError("");

    // -------------------------------------------------
    // LOGIN CHECK
    // -------------------------------------------------

    if (!user?.uid) {
      setCartError("Please login before adding products to cart.");

      return false;
    }

    // -------------------------------------------------
    // CART INITIALIZATION CHECK
    // -------------------------------------------------

    if (!cartInitialized || cartUserId !== user.uid) {
      setCartError("Please wait while your cart is loading.");

      return false;
    }

    // -------------------------------------------------
    // PRODUCT CHECK
    // -------------------------------------------------

    if (!product) {
      setCartError("Product not found.");

      return false;
    }

    // -------------------------------------------------
    // QUANTITY
    // -------------------------------------------------

    const requestedQuantity = Number(quantity);

    if (!Number.isInteger(requestedQuantity) || requestedQuantity <= 0) {
      setCartError("Invalid quantity.");

      return false;
    }

    // -------------------------------------------------
    // EXISTING ITEM
    // -------------------------------------------------

    const existingItem = cartItems.find((item) => item.id === product.id);

    const currentQuantity = Number(existingItem?.quantity || 0);

    // -------------------------------------------------
    // STOCK
    // -------------------------------------------------

    const availableStock = Number(product.stock || 0);

    const finalQuantity = currentQuantity + requestedQuantity;

    // =================================================
    // STOCK CHECK
    // =================================================

    if (availableStock <= 0) {
      setCartError(`${product.name} is out of stock.`);

      return false;
    }

    if (finalQuantity > availableStock) {
      setCartError(
        `Only ${availableStock} ${
          product.unit || "units"
        } of ${product.name} are available.`,
      );

      return false;
    }

    // =================================================
    // ADD / UPDATE CART
    // =================================================

    setCartItems((currentCart) => {
      const exists = currentCart.some((item) => item.id === product.id);

      // ------------------------------------------------
      // UPDATE EXISTING
      // ------------------------------------------------

      if (exists) {
        return currentCart.map((item) =>
          item.id === product.id
            ? {
                ...item,

                quantity: Number(item.quantity || 0) + requestedQuantity,

                stock: availableStock,

                unit: product.unit || item.unit || "piece",
              }
            : item,
        );
      }

      // ------------------------------------------------
      // ADD NEW
      // ------------------------------------------------

      return [
        ...currentCart,

        {
          ...product,

          quantity: requestedQuantity,

          stock: availableStock,

          unit: product.unit || "piece",
        },
      ];
    });

    setCartMessage(`${product.name} added to cart 🛒`);

    return true;
  };

  // ===================================================
  // UPDATE QUANTITY
  // ===================================================

  const updateQuantity = (productId, newQuantity) => {
    setCartMessage("");

    setCartError("");

    const quantity = Number(newQuantity);

    if (!Number.isInteger(quantity)) {
      return false;
    }

    // =================================================
    // REMOVE WHEN ZERO
    // =================================================

    if (quantity <= 0) {
      setCartItems((currentCart) =>
        currentCart.filter((item) => item.id !== productId),
      );

      return true;
    }

    // =================================================
    // FIND ITEM
    // =================================================

    const item = cartItems.find((cartItem) => cartItem.id === productId);

    if (!item) {
      return false;
    }

    // =================================================
    // STOCK
    // =================================================

    const stock = Number(item.stock || 0);

    // =================================================
    // STOCK CHECK
    // =================================================

    if (quantity > stock) {
      setCartError(
        `Only ${stock} ${item.unit || "units"} of ${item.name} are available.`,
      );

      return false;
    }

    // =================================================
    // UPDATE
    // =================================================

    setCartItems((currentCart) =>
      currentCart.map((cartItem) =>
        cartItem.id === productId
          ? {
              ...cartItem,
              quantity,
            }
          : cartItem,
      ),
    );

    return true;
  };

  // ===================================================
  // INCREASE QUANTITY
  // ===================================================

  const increaseQuantity = (productId) => {
    const item = cartItems.find((cartItem) => cartItem.id === productId);

    if (!item) {
      return false;
    }

    return updateQuantity(productId, Number(item.quantity || 0) + 1);
  };

  // ===================================================
  // DECREASE QUANTITY
  // ===================================================

  const decreaseQuantity = (productId) => {
    const item = cartItems.find((cartItem) => cartItem.id === productId);

    if (!item) {
      return false;
    }

    return updateQuantity(productId, Number(item.quantity || 0) - 1);
  };

  // ===================================================
  // REMOVE ITEM
  // ===================================================

  const removeFromCart = (productId) => {
    setCartItems((currentCart) =>
      currentCart.filter((item) => item.id !== productId),
    );

    setCartMessage("Product removed from cart.");

    setCartError("");

    return true;
  };

  // ===================================================
  // CLEAR CART
  // ===================================================

  const clearCart = () => {
    setCartItems([]);

    setCartMessage("Cart cleared.");

    setCartError("");

    return true;
  };

  // ===================================================
  // GET CURRENT FIREBASE STOCK
  // ===================================================

  const getCurrentStock = async (productId) => {
    try {
      const productRef = doc(db, "products", productId);

      const productSnapshot = await getDoc(productRef);

      if (!productSnapshot.exists()) {
        return null;
      }

      return {
        id: productSnapshot.id,

        ...productSnapshot.data(),
      };
    } catch (error) {
      console.error("Stock fetch error:", error);

      return null;
    }
  };

  // ===================================================
  // PLACE ORDER
  // ===================================================

  const placeOrder = async ({
    userId = null,
    userEmail = "",
    customer = {},
    paymentMethod = "COD",
    deliveryAddress = {},
  } = {}) => {
    setCartLoading(true);

    setCartMessage("");

    setCartError("");

    try {
      // =================================================
      // LOGIN CHECK
      // =================================================

      if (!user?.uid) {
        throw new Error("Please login before placing your order.");
      }

      // =================================================
      // USER CART CHECK
      // =================================================

      if (userId && userId !== user.uid) {
        throw new Error("Invalid user cart.");
      }

      // =================================================
      // CART EMPTY
      // =================================================

      if (cartItems.length === 0) {
        throw new Error("Your cart is empty.");
      }

      // =================================================
      // ORDER ITEMS
      // =================================================

      const orderItems = cartItems.map((item) => ({
        productId: item.id,

        name: item.name,

        price: Number(item.price || 0),

        quantity: Number(item.quantity || 1),

        unit: item.unit || "piece",

        image: item.imageLarge || item.image || item.originalImage || "",
      }));

      // =================================================
      // TOTAL
      // =================================================

      const subtotal = orderItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0,
      );

      // =================================================
      // STOCK TRANSACTION
      // =================================================

      for (const item of orderItems) {
        const productRef = doc(db, "products", item.productId);

        await runTransaction(db, async (transaction) => {
          const productSnapshot = await transaction.get(productRef);

          // =========================================
          // PRODUCT NOT FOUND
          // =========================================

          if (!productSnapshot.exists()) {
            throw new Error(`${item.name} is no longer available.`);
          }

          const productData = productSnapshot.data();

          const currentStock = Number(productData.stock || 0);

          const requestedQuantity = Number(item.quantity || 0);

          // =========================================
          // STOCK CHECK
          // =========================================

          if (currentStock <= 0) {
            throw new Error(`${item.name} is out of stock.`);
          }

          if (requestedQuantity > currentStock) {
            throw new Error(
              `Only ${currentStock} ${
                productData.unit || "units"
              } of ${item.name} are available.`,
            );
          }

          // =========================================
          // NEW STOCK
          // =========================================

          const newStock = currentStock - requestedQuantity;

          // =========================================
          // UPDATE FIREBASE
          // =========================================

          transaction.update(productRef, {
            stock: newStock,

            updatedAt: serverTimestamp(),

            ...(newStock === 0 && {
              stockNotified: false,
            }),
          });
        });
      }

      // =================================================
      // CREATE ORDER
      // =================================================

      const orderData = {
        // ------------------------------------------------
        // USER
        // ------------------------------------------------

        userId: user.uid,

        userEmail: userEmail || user.email || "",

        // ------------------------------------------------
        // CUSTOMER
        // ------------------------------------------------

        customer,

        // ------------------------------------------------
        // ADDRESS
        // ------------------------------------------------

        deliveryAddress,

        // ------------------------------------------------
        // PAYMENT
        // ------------------------------------------------

        paymentMethod,

        // ------------------------------------------------
        // ITEMS
        // ------------------------------------------------

        items: orderItems,

        // ------------------------------------------------
        // PRICE
        // ------------------------------------------------

        subtotal,

        total: subtotal,

        // ------------------------------------------------
        // STATUS
        // ------------------------------------------------

        status: "pending",

        paymentStatus: "pending",

        // ------------------------------------------------
        // TIMESTAMPS
        // ------------------------------------------------

        createdAt: serverTimestamp(),

        updatedAt: serverTimestamp(),
      };

      // =================================================
      // SAVE ORDER
      // =================================================

      const orderRef = await addDoc(collection(db, "orders"), orderData);

      // =================================================
      // CLEAR ONLY CURRENT USER CART
      // =================================================

      setCartItems([]);

      // ------------------------------------------------
      // Explicitly remove current user's local cart
      // ------------------------------------------------

      const currentUserCartKey = getUserCartKey(user.uid);

      if (currentUserCartKey) {
        localStorage.removeItem(currentUserCartKey);
      }

      setCartMessage("Order placed successfully 🎉");

      return {
        success: true,

        orderId: orderRef.id,
      };
    } catch (error) {
      console.error("Place Order Error:", error);

      setCartError(error.message || "Unable to place order.");

      return {
        success: false,

        error: error.message || "Unable to place order.",
      };
    } finally {
      setCartLoading(false);
    }
  };

  // ===================================================
  // CART COUNT
  // ===================================================

  const cartCount = useMemo(() => {
    return cartItems.reduce(
      (total, item) => total + Number(item.quantity || 0),
      0,
    );
  }, [cartItems]);

  // ===================================================
  // CART TOTAL
  // ===================================================

  const cartTotal = useMemo(() => {
    return cartItems.reduce((total, item) => {
      const price = Number(item.price || 0);

      const quantity = Number(item.quantity || 0);

      return total + price * quantity;
    }, 0);
  }, [cartItems]);

  // ===================================================
  // CONTEXT VALUE
  // ===================================================

  const value = useMemo(
    () => ({
      cartItems,

      cartCount,

      cartTotal,

      addToCart,

      updateQuantity,

      increaseQuantity,

      decreaseQuantity,

      removeFromCart,

      clearCart,

      placeOrder,

      getCurrentStock,

      cartLoading,

      cartMessage,

      cartError,

      clearCartMessage,

      cartInitialized,
    }),
    [
      cartItems,
      cartCount,
      cartTotal,
      cartLoading,
      cartMessage,
      cartError,
      cartInitialized,
    ],
  );

  // ===================================================
  // PROVIDER
  // ===================================================

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// =====================================================
// HOOK
// =====================================================

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider.");
  }

  return context;
}

export default CartContext;
