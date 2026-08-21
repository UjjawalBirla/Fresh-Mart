import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import {
  FiBox,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiDollarSign,
  FiCheck,
  FiX,
  FiAlertTriangle,
  FiLayers,
  FiTrendingUp,
} from "react-icons/fi";
import { db } from "../../Firebase/Firebase";
import ImageSearch from "../../components/ImageSearch/ImageSearch";

function Dashboard() {
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("Fruits");
  const [subcategory, setSubcategory] = useState("");
  const [price, setPrice] = useState("");
  const [oldPrice, setOldPrice] = useState("");
  const [stock, setStock] = useState("");
  const [unit, setUnit] = useState("piece");
  const [selectedImage, setSelectedImage] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [searchProduct, setSearchProduct] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  const [editingProduct, setEditingProduct] = useState(null);
  const [editName, setEditName] = useState("");
  const [editCategory, setEditCategory] = useState("Fruits");
  const [editSubcategory, setEditSubcategory] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editOldPrice, setEditOldPrice] = useState("");
  const [editStock, setEditStock] = useState("");
  const [editUnit, setEditUnit] = useState("piece");
  const [editImage, setEditImage] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "products"),
      (snapshot) => {
        const productList = snapshot.docs.map((productDoc) => ({
          id: productDoc.id,
          ...productDoc.data(),
        }));

        productList.sort((a, b) => {
          const dateA = a.createdAt?.toMillis?.() || 0;
          const dateB = b.createdAt?.toMillis?.() || 0;
          return dateB - dateA;
        });

        setProducts(productList);
        setProductsLoading(false);
      },
      (firebaseError) => {
        console.error("Products Fetch Error:", firebaseError);
        setProductsLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  const handleImageSelect = (image) => {
    setSelectedImage(image);
    setError("");
    setMessage("Image selected from Pixabay ✓");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    const cleanName = productName.trim();
    if (!cleanName) {
      setError("Please enter a product name.");
      return;
    }

    const productPrice = Number(price);
    if (price === "" || !Number.isFinite(productPrice) || productPrice <= 0) {
      setError("Please enter a valid price greater than ₹0.");
      return;
    }

    let productOldPrice = 0;
    if (oldPrice !== "") {
      productOldPrice = Number(oldPrice);
      if (!Number.isFinite(productOldPrice) || productOldPrice < 0) {
        setError("Please enter a valid old price.");
        return;
      }
      if (productOldPrice > 0 && productOldPrice <= productPrice) {
        setError("Old price must be greater than current price.");
        return;
      }
    }

    const productStock = Number(stock);
    if (stock === "" || !Number.isInteger(productStock) || productStock < 0) {
      setError("Please enter a valid stock integer quantity.");
      return;
    }

    if (!selectedImage) {
      setError("Please select a product image using the search tool.");
      return;
    }

    try {
      setSaving(true);
      const productData = {
        name: cleanName,
        category: category,
        subcategory: subcategory.trim(),
        price: productPrice,
        oldPrice: productOldPrice,
        stock: productStock,
        unit: unit || "piece",
        image: selectedImage.url,
        imageLarge: selectedImage.largeUrl || selectedImage.url,
        originalImage: selectedImage.originalUrl || selectedImage.url,
        photographer: selectedImage.photographer || "",
        photographerUrl: selectedImage.photographerUrl || "",
        imageAlt: selectedImage.alt || cleanName,
        isAdminProduct: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await addDoc(collection(db, "products"), productData);
      setMessage("Product added successfully 🎉");

      setProductName("");
      setCategory("Fruits");
      setSubcategory("");
      setPrice("");
      setOldPrice("");
      setStock("");
      setUnit("piece");
      setSelectedImage(null);
    } catch (firebaseError) {
      console.error("Firebase Error:", firebaseError);
      setError("Unable to save product. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    const product = products.find((item) => item.id === productId);
    if (!product) return;

    const confirmDelete = window.confirm(`Delete product "${product.name}"?`);
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "products", productId));
      setMessage("Product deleted successfully ✓");
    } catch (firebaseError) {
      console.error("Delete Error:", firebaseError);
      setError("Unable to delete product.");
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setEditName(product.name || "");
    setEditCategory(product.category || "Fruits");
    setEditSubcategory(product.subcategory || "");
    setEditPrice(product.price ?? "");
    setEditOldPrice(product.oldPrice ?? "");
    setEditStock(product.stock ?? "");
    setEditUnit(product.unit || "piece");
    setEditImage(product.imageLarge || product.image || null);
    setError("");
    setMessage("");
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct) return;
    const cleanName = editName.trim();
    if (!cleanName) {
      setError("Product name is required.");
      return;
    }

    const updatedPrice = Number(editPrice);
    if (editPrice === "" || !Number.isFinite(updatedPrice) || updatedPrice <= 0) {
      setError("Please enter a valid price.");
      return;
    }

    let updatedOldPrice = 0;
    if (editOldPrice !== "") {
      updatedOldPrice = Number(editOldPrice);
      if (!Number.isFinite(updatedOldPrice) || updatedOldPrice < 0) {
        setError("Please enter a valid old price.");
        return;
      }
      if (updatedOldPrice > 0 && updatedOldPrice <= updatedPrice) {
        setError("Old price should be greater than current price.");
        return;
      }
    }

    const updatedStock = Number(editStock);
    if (editStock === "" || !Number.isInteger(updatedStock) || updatedStock < 0) {
      setError("Please enter a valid stock integer.");
      return;
    }

    try {
      setUpdating(true);
      setError("");

      const updateData = {
        name: cleanName,
        category: editCategory,
        subcategory: editSubcategory.trim(),
        price: updatedPrice,
        oldPrice: updatedOldPrice,
        stock: updatedStock,
        unit: editUnit || "piece",
        updatedAt: serverTimestamp(),
      };

      if (
        editImage &&
        editImage !== editingProduct.imageLarge &&
        editImage !== editingProduct.image
      ) {
        updateData.image = editImage;
        updateData.imageLarge = editImage;
        updateData.originalImage = editImage;
      }

      await updateDoc(doc(db, "products", editingProduct.id), updateData);
      setMessage("Product updated successfully ✨");
      setEditingProduct(null);
    } catch (firebaseError) {
      console.error("Update Error:", firebaseError);
      setError("Unable to update product.");
    } finally {
      setUpdating(false);
    }
  };

  const filteredProducts = products.filter((product) => {
    const name = product.name?.toLowerCase() || "";
    const matchesSearch = name.includes(searchProduct.toLowerCase());
    const matchesCategory =
      filterCategory === "All" || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const totalProducts = products.length;
  const totalStock = products.reduce((acc, p) => acc + Number(p.stock || 0), 0);
  const lowStock = products.filter((p) => Number(p.stock || 0) > 0 && Number(p.stock || 0) <= 10).length;
  const outOfStock = products.filter((p) => Number(p.stock || 0) <= 0).length;

  return (
    <div className="space-y-10 pb-16 animate-rise">
      {/* Top Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/80 pb-6 dark:border-slate-800">
        <div>
          <span className="section-label ml-5">Management Overview</span>
          <h1 className="font-display text-3xl font-black text-slate-800 dark:text-white ml-5 md:text-4xl">
            Store Dashboard 📊
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 ml-5">
            Monitor inventory, upload new produce, and manage catalog items.
          </p>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <section className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        <div className="card flex items-center gap-4 p-5 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-market-leaf/30">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-market-lime/60 text-market-leaf text-2xl dark:bg-market-leaf/30 dark:text-market-lime">
            <FiBox />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400">Total Products</span>
            <strong className="font-display text-2xl font-black text-slate-800 dark:text-white block">
              {totalProducts}
            </strong>
          </div>
        </div>

        <div className="card flex items-center gap-4 p-5 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-market-leaf/30">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-emerald-100 text-emerald-600 text-2xl dark:bg-emerald-950/50 dark:text-emerald-400">
            <FiLayers />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400">Total Stock</span>
            <strong className="font-display text-2xl font-black text-slate-800 dark:text-white block">
              {totalStock} units
            </strong>
          </div>
        </div>

        <div className="card flex items-center gap-4 p-5 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-market-leaf/30">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-amber-100 text-amber-600 text-2xl dark:bg-amber-950/50 dark:text-amber-400">
            <FiAlertTriangle />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400">Low Stock (≤10)</span>
            <strong className="font-display text-2xl font-black text-amber-600 dark:text-amber-400 block">
              {lowStock} items
            </strong>
          </div>
        </div>

        <div className="card flex items-center gap-4 p-5 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-market-leaf/30">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-red-100 text-red-600 text-2xl dark:bg-red-950/50 dark:text-red-400">
            <FiX />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400">Out of Stock</span>
            <strong className="font-display text-2xl font-black text-red-600 dark:text-red-400 block">
              {outOfStock} items
            </strong>
          </div>
        </div>
      </section>

      {/* Messages */}
      {message && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-bold text-emerald-800 shadow-xs dark:border-emerald-800/50 dark:bg-emerald-950/40 dark:text-emerald-300">
          {message}
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-bold text-red-700 shadow-xs dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </div>
      )}

      {/* Add Product Form Section */}
      <section className="card p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-market-leaf text-white text-xl shadow-md">
            <FiPlus />
          </div>
          <div>
            <h2 className="font-display text-2xl font-black text-slate-800 dark:text-white">
              Add New Product
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Input product information, set inventory stock and pick an image.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Product Name
              </label>
              <div className="input-field">
                <input
                  type="text"
                  placeholder="e.g. Alphonso Mango"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Main Category
              </label>
              <select
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition-all focus:border-market-leaf focus:bg-white focus:ring-2 focus:ring-market-leaf/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Fruits">Fruits</option>
                <option value="Vegetables">Vegetables</option>
                <option value="Groceries">Groceries</option>
                <option value="Offers">Offers</option>
              </select>
            </div>

            {/* Subcategory */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Subcategory / Tag
              </label>
              <div className="input-field">
                <input
                  type="text"
                  placeholder="e.g. Tropical, Organic"
                  value={subcategory}
                  onChange={(e) => setSubcategory(e.target.value)}
                />
              </div>
            </div>

            {/* Price */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Selling Price (₹)
              </label>
              <div className="input-field">
                <input
                  type="number"
                  placeholder="e.g. 150"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  min="0.01"
                  step="0.01"
                  required
                />
              </div>
            </div>

            {/* Old Price */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Original Price (₹) (Optional)
              </label>
              <div className="input-field">
                <input
                  type="number"
                  placeholder="e.g. 180"
                  value={oldPrice}
                  onChange={(e) => setOldPrice(e.target.value)}
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            {/* Stock Quantity */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Stock Quantity
              </label>
              <div className="input-field">
                <input
                  type="number"
                  placeholder="e.g. 50"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  min="0"
                  required
                />
              </div>
            </div>

            {/* Unit */}
            <div className="space-y-1.5 sm:col-span-2 lg:col-span-3">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Unit of Measure
              </label>
              <select
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition-all focus:border-market-leaf focus:bg-white focus:ring-2 focus:ring-market-leaf/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
              >
                <option value="piece">Piece (pc)</option>
                <option value="kg">Kilogram (kg)</option>
                <option value="gram">Gram (g)</option>
                <option value="litre">Litre (L)</option>
                <option value="dozen">Dozen</option>
                <option value="packet">Packet (pkt)</option>
                <option value="box">Box</option>
              </select>
            </div>
          </div>

          {/* Pixabay Search Component */}
          <div className="space-y-2 border-t border-slate-100 pt-5 dark:border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Product Image Library (Pixabay)
            </span>
            <ImageSearch onSelect={handleImageSelect} />
          </div>

          {/* Selected Image Preview */}
          {selectedImage && (
            <div className="flex items-center gap-4 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 dark:border-emerald-800/50 dark:bg-emerald-950/40">
              <img
                src={selectedImage.url}
                alt="Selected preview"
                className="h-16 w-16 rounded-xl object-cover shadow-sm bg-white"
              />
              <div>
                <span className="badge-success text-xs">
                  <FiCheck /> Image Selected
                </span>
                <strong className="block text-xs font-bold text-slate-800 dark:text-white mt-1">
                  Photo by {selectedImage.photographer || "Pixabay"}
                </strong>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="btn-primary w-full py-4 text-base font-bold shadow-xl shadow-market-leaf/30 hover:shadow-2xl hover:shadow-market-leaf/40 active:scale-95"
            disabled={saving}
          >
            {saving ? "Saving Produce to Catalog..." : "Add Product to Store"}
          </button>
        </form>
      </section>

      {/* Inventory & Product Management Table */}
      <section className="card p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
          <div>
            <h2 className="font-display text-2xl font-black text-slate-800 dark:text-white">
              Inventory Catalog ({products.length})
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Search and update price, stock and metadata across all items.
            </p>
          </div>

          {/* Search + Filter toolbar */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="input-field min-h-10 py-1 px-3">
              <FiSearch className="text-slate-400" />
              <input
                type="text"
                placeholder="Search inventory..."
                value={searchProduct}
                onChange={(e) => setSearchProduct(e.target.value)}
                className="text-xs"
              />
            </div>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold outline-none dark:border-slate-700 dark:bg-slate-900"
            >
              <option value="All">All Categories</option>
              <option value="Fruits">Fruits</option>
              <option value="Vegetables">Vegetables</option>
              <option value="Groceries">Groceries</option>
              <option value="Offers">Offers</option>
            </select>
          </div>
        </div>

        {/* Product Cards List */}
        {productsLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-3 border-market-leaf border-t-transparent" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-sm">
            No products matching current filter.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((p) => {
              const stock = Number(p.stock || 0);
              return (
                <div
                  key={p.id}
                  className="card flex flex-col justify-between p-4 shadow-md transition-all duration-300 hover:shadow-xl hover:border-market-leaf/40"
                >
                  <div className="space-y-3">
                    <div className="relative aspect-video overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
                      <img
                        src={p.imageLarge || p.image}
                        alt={p.name}
                        className="h-full w-full object-cover"
                      />
                      <span className="badge-info absolute left-2 top-2 text-[10px]">
                        {p.category}
                      </span>
                    </div>

                    <div>
                      <strong className="block text-sm font-bold text-slate-800 line-clamp-1 dark:text-white">
                        {p.name}
                      </strong>
                      <span className="text-[11px] text-slate-400">
                        {p.subcategory || "Standard"} · ₹{p.price} / {p.unit || "piece"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-500">Stock:</span>
                      <span
                        className={
                          stock > 10
                            ? "badge-success"
                            : stock > 0
                              ? "badge-warning"
                              : "badge-danger"
                        }
                      >
                        {stock > 0 ? `${stock} left` : "Out of stock"}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 border-t border-slate-100 pt-3 mt-3 dark:border-slate-800">
                    <button
                      type="button"
                      className="btn-secondary flex-1 py-1.5 min-h-8 text-xs font-bold"
                      onClick={() => handleEditProduct(p)}
                    >
                      <FiEdit2 />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      className="grid h-8 w-8 place-items-center rounded-xl bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950/40 dark:text-red-400"
                      onClick={() => handleDeleteProduct(p.id)}
                      title="Delete product"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-rise">
          <div className="card w-full max-w-lg p-6 sm:p-8 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <h2 className="font-display text-xl font-black text-slate-800 dark:text-white">
                Edit Product: {editingProduct.name}
              </h2>
              <button
                type="button"
                className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                onClick={() => setEditingProduct(null)}
              >
                <FiX />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Name</label>
                <div className="input-field">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Category</label>
                  <select
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 outline-none dark:border-slate-700 dark:bg-slate-900"
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                  >
                    <option value="Fruits">Fruits</option>
                    <option value="Vegetables">Vegetables</option>
                    <option value="Groceries">Groceries</option>
                    <option value="Offers">Offers</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Subcategory</label>
                  <div className="input-field">
                    <input
                      type="text"
                      value={editSubcategory}
                      onChange={(e) => setEditSubcategory(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Price (₹)</label>
                  <div className="input-field">
                    <input
                      type="number"
                      value={editPrice}
                      onChange={(e) => setEditPrice(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Old Price (₹)</label>
                  <div className="input-field">
                    <input
                      type="number"
                      value={editOldPrice}
                      onChange={(e) => setEditOldPrice(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Stock</label>
                  <div className="input-field">
                    <input
                      type="number"
                      value={editStock}
                      onChange={(e) => setEditStock(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                className="btn-secondary px-4 py-2 text-xs"
                onClick={() => setEditingProduct(null)}
                disabled={updating}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-primary px-5 py-2 text-xs"
                onClick={handleUpdateProduct}
                disabled={updating}
              >
                {updating ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
