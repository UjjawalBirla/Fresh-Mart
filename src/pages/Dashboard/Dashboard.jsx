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

import { db } from "../../Firebase/Firebase";

import ImageSearch from "../../components/ImageSearch/ImageSearch";

import "./Dashboard.css";

function Dashboard() {
  // =========================================
  // ADD PRODUCT STATES
  // =========================================

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

  // =========================================
  // PRODUCTS
  // =========================================

  const [products, setProducts] = useState([]);

  const [productsLoading, setProductsLoading] = useState(true);

  const [searchProduct, setSearchProduct] = useState("");

  const [filterCategory, setFilterCategory] = useState("All");

  // =========================================
  // EDIT STATES
  // =========================================

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

  // =========================================
  // FETCH PRODUCTS
  // =========================================

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "products"),

      (snapshot) => {
        const productList = snapshot.docs.map((productDoc) => ({
          id: productDoc.id,
          ...productDoc.data(),
        }));

        // Latest products first
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

  // =========================================
  // IMAGE SELECT
  // =========================================

  const handleImageSelect = (image) => {
    setSelectedImage(image);

    setError("");

    setMessage("Image selected successfully ✅");
  };

  // =========================================
  // ADD PRODUCT
  // =========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");

    // -----------------------------------------
    // NAME
    // -----------------------------------------

    const cleanName = productName.trim();

    if (!cleanName) {
      setError("Please enter product name.");

      return;
    }

    // -----------------------------------------
    // PRICE
    // -----------------------------------------

    const productPrice = Number(price);

    if (price === "" || !Number.isFinite(productPrice) || productPrice <= 0) {
      setError("Please enter a valid price greater than ₹0.");

      return;
    }

    // -----------------------------------------
    // OLD PRICE
    // -----------------------------------------

    let productOldPrice = 0;

    if (oldPrice !== "") {
      productOldPrice = Number(oldPrice);

      if (!Number.isFinite(productOldPrice) || productOldPrice < 0) {
        setError("Please enter a valid old price.");

        return;
      }

      if (productOldPrice > 0 && productOldPrice <= productPrice) {
        setError("Old price should be greater than current price.");

        return;
      }
    }

    // -----------------------------------------
    // STOCK
    // -----------------------------------------

    const productStock = Number(stock);

    if (stock === "" || !Number.isInteger(productStock) || productStock < 0) {
      setError("Please enter a valid stock quantity.");

      return;
    }

    // -----------------------------------------
    // IMAGE
    // -----------------------------------------

    if (!selectedImage) {
      setError("Please select a product image.");

      return;
    }

    // -----------------------------------------
    // SAVE
    // -----------------------------------------

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

      const docRef = await addDoc(collection(db, "products"), productData);

      console.log("Product saved:", docRef.id);

      setMessage("Product added successfully 🎉");

      // ---------------------------------------
      // RESET
      // ---------------------------------------

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

      setError("Product save nahi hua. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // =========================================
  // DELETE PRODUCT
  // =========================================

  const handleDeleteProduct = async (productId) => {
    const product = products.find((item) => item.id === productId);

    if (!product) {
      return;
    }

    const confirmDelete = window.confirm(`Delete "${product.name}"?`);

    if (!confirmDelete) {
      return;
    }

    try {
      await deleteDoc(doc(db, "products", productId));

      setMessage("Product deleted successfully 🗑️");
    } catch (firebaseError) {
      console.error("Delete Error:", firebaseError);

      setError("Unable to delete product.");
    }
  };

  // =========================================
  // OPEN EDIT MODAL
  // =========================================

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

  // =========================================
  // UPDATE PRODUCT
  // =========================================

  const handleUpdateProduct = async () => {
    if (!editingProduct) {
      return;
    }

    // ---------------------------------------
    // NAME
    // ---------------------------------------

    const cleanName = editName.trim();

    if (!cleanName) {
      setError("Product name is required.");

      return;
    }

    // ---------------------------------------
    // PRICE
    // ---------------------------------------

    const updatedPrice = Number(editPrice);

    if (
      editPrice === "" ||
      !Number.isFinite(updatedPrice) ||
      updatedPrice <= 0
    ) {
      setError("Please enter a valid price.");

      return;
    }

    // ---------------------------------------
    // OLD PRICE
    // ---------------------------------------

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

    // ---------------------------------------
    // STOCK
    // ---------------------------------------

    const updatedStock = Number(editStock);

    if (
      editStock === "" ||
      !Number.isInteger(updatedStock) ||
      updatedStock < 0
    ) {
      setError("Please enter a valid stock.");

      return;
    }

    // ---------------------------------------
    // UPDATE
    // ---------------------------------------

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

      // -------------------------------------
      // IMAGE UPDATE
      // -------------------------------------

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

  // =========================================
  // FILTER PRODUCTS
  // =========================================

  const filteredProducts = products.filter((product) => {
    const name = product.name?.toLowerCase() || "";

    const matchesSearch = name.includes(searchProduct.toLowerCase());

    const matchesCategory =
      filterCategory === "All" || product.category === filterCategory;

    return matchesSearch && matchesCategory;
  });

  // =========================================
  // STATS
  // =========================================

  const totalProducts = products.length;

  const totalStock = products.reduce((total, product) => {
    return total + Number(product.stock || 0);
  }, 0);

  const lowStock = products.filter(
    (product) =>
      Number(product.stock || 0) > 0 && Number(product.stock || 0) <= 10,
  ).length;

  const outOfStock = products.filter(
    (product) => Number(product.stock || 0) <= 0,
  ).length;

  // =========================================
  // UI
  // =========================================

  return (
    <div className="dashboard-page">
      {/* =====================================
          HEADER
      ====================================== */}

      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>

          <p>Welcome back, Admin 👋</p>
        </div>
      </div>

      {/* =====================================
          STATS
      ====================================== */}

      <div className="stats-grid">
        {/* SALES */}

        <div className="stat-card">
          <span>Total Sales</span>

          <h2>₹0</h2>

          <small>No orders yet</small>
        </div>

        {/* ORDERS */}

        <div className="stat-card">
          <span>Total Orders</span>

          <h2>0</h2>

          <small>No orders yet</small>
        </div>

        {/* CUSTOMERS */}

        <div className="stat-card">
          <span>Customers</span>

          <h2>0</h2>

          <small>No customers yet</small>
        </div>

        {/* PRODUCTS */}

        <div className="stat-card">
          <span>Total Products</span>

          <h2>{totalProducts}</h2>

          <small>{lowStock} low stock</small>
        </div>
      </div>

      {/* =====================================
          ADD PRODUCT
      ====================================== */}

      <section className="add-product-section">
        <div className="section-heading">
          <h2>Add Product</h2>

          <p>Add a new product to FreshMart.</p>
        </div>

        <form className="add-product-form" onSubmit={handleSubmit}>
          <div className="product-details-grid">
            {/* NAME */}

            <div className="form-group">
              <label>Product Name</label>

              <input
                type="text"
                placeholder="Example: Dragon Fruit"
                value={productName}
                onChange={(event) => setProductName(event.target.value)}
              />
            </div>

            {/* CATEGORY */}

            <div className="form-group">
              <label>Category</label>

              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                <option value="Fruits">Fruits</option>

                <option value="Vegetables">Vegetables</option>

                <option value="Groceries">Groceries</option>

                <option value="Offers">Offers</option>
              </select>
            </div>

            {/* SUBCATEGORY */}

            <div className="form-group">
              <label>Subcategory</label>

              <input
                type="text"
                placeholder="Example: Tropical"
                value={subcategory}
                onChange={(event) => setSubcategory(event.target.value)}
              />
            </div>

            {/* PRICE */}

            <div className="form-group">
              <label>Price (₹)</label>

              <input
                type="number"
                placeholder="Example: 150"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                min="0.01"
                step="0.01"
              />
            </div>

            {/* OLD PRICE */}

            <div className="form-group">
              <label>Old Price (₹)</label>

              <input
                type="number"
                placeholder="Example: 200"
                value={oldPrice}
                onChange={(event) => setOldPrice(event.target.value)}
                min="0"
                step="0.01"
              />
            </div>

            {/* STOCK */}

            <div className="form-group">
              <label>Stock Quantity</label>

              <input
                type="number"
                placeholder="Example: 50"
                value={stock}
                onChange={(event) => setStock(event.target.value)}
                min="0"
                step="1"
              />
            </div>

            {/* UNIT */}

            <div className="form-group">
              <label>Unit</label>

              <select
                value={unit}
                onChange={(event) => setUnit(event.target.value)}
              >
                <option value="piece">Piece</option>

                <option value="kg">Kilogram (kg)</option>

                <option value="gram">Gram (g)</option>

                <option value="litre">Litre (L)</option>

                <option value="dozen">Dozen</option>

                <option value="packet">Packet</option>

                <option value="box">Box</option>
              </select>
            </div>
          </div>

          {/* IMAGE SEARCH */}

          <div className="product-image-section">
            <ImageSearch onSelect={handleImageSelect} />
          </div>

          {/* SELECTED IMAGE */}

          {selectedImage && (
            <div className="selected-product-image">
              <div className="selected-image-preview">
                <img
                  src={selectedImage.url}
                  alt={selectedImage.alt || productName || "Selected product"}
                />
              </div>

              <div className="selected-image-info">
                <span>✓ Image Selected</span>

                <strong>{selectedImage.photographer}</strong>

                <small>{selectedImage.alt || "Product image selected"}</small>
              </div>
            </div>
          )}

          {/* MESSAGE */}

          {message && <div className="product-success-message">{message}</div>}

          {error && <div className="product-error-message">{error}</div>}

          {/* BUTTON */}

          <div className="product-form-actions">
            <button
              type="submit"
              className="save-product-btn"
              disabled={saving}
            >
              {saving ? "Saving..." : "Add Product"}
            </button>
          </div>
        </form>
      </section>

      {/* =====================================
          PRODUCT MANAGEMENT
      ====================================== */}

      <section className="admin-products-section">
        <div className="admin-products-header">
          <div>
            <h2>Product Management</h2>

            <p>View, update and delete products.</p>
          </div>

          <div className="admin-product-summary">
            <span>{products.length} Products</span>

            <span>{totalStock} Total Stock</span>

            <span>{outOfStock} Out of Stock</span>
          </div>
        </div>

        {/* SEARCH + FILTER */}

        <div className="admin-product-tools">
          <input
            type="text"
            placeholder="🔍 Search products..."
            value={searchProduct}
            onChange={(event) => setSearchProduct(event.target.value)}
          />

          <select
            value={filterCategory}
            onChange={(event) => setFilterCategory(event.target.value)}
          >
            <option value="All">All Categories</option>

            <option value="Fruits">Fruits</option>

            <option value="Vegetables">Vegetables</option>

            <option value="Groceries">Groceries</option>

            <option value="Offers">Offers</option>
          </select>
        </div>

        {/* LOADING */}

        {productsLoading ? (
          <div className="admin-products-loading">Loading products...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="admin-products-empty">
            <span>📦</span>

            <h3>No products found</h3>

            <p>Add a product from the form above.</p>
          </div>
        ) : (
          <div className="admin-products-table-wrapper">
            <table className="admin-products-table">
              <thead>
                <tr>
                  <th>Product</th>

                  <th>Category</th>

                  <th>Price</th>

                  <th>Stock</th>

                  <th>Status</th>

                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id}>
                    {/* PRODUCT */}

                    <td>
                      <div className="admin-product-info">
                        <img
                          src={product.imageLarge || product.image}
                          alt={product.name}
                        />

                        <div>
                          <strong>{product.name}</strong>

                          <small>
                            {product.subcategory || product.category}
                          </small>
                        </div>
                      </div>
                    </td>

                    {/* CATEGORY */}

                    <td>
                      <span className="category-badge">{product.category}</span>
                    </td>

                    {/* PRICE */}

                    <td>
                      <strong>₹{product.price}</strong>

                      {Number(product.oldPrice) > 0 && (
                        <del
                          style={{
                            marginLeft: "6px",
                            opacity: 0.6,
                          }}
                        >
                          ₹{product.oldPrice}
                        </del>
                      )}
                    </td>

                    {/* STOCK */}

                    <td>
                      {product.stock} {product.unit || "piece"}
                    </td>

                    {/* STATUS */}

                    <td>
                      {Number(product.stock) > 10 ? (
                        <span className="status-active">In Stock</span>
                      ) : Number(product.stock) > 0 ? (
                        <span className="status-warning">Low Stock</span>
                      ) : (
                        <span className="status-out">Out of Stock</span>
                      )}
                    </td>

                    {/* ACTIONS */}

                    <td>
                      <div className="admin-actions">
                        <button
                          type="button"
                          className="edit-btn"
                          onClick={() => handleEditProduct(product)}
                        >
                          ✏️ Edit
                        </button>

                        <button
                          type="button"
                          className="delete-btn"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* =====================================
          EDIT MODAL
      ====================================== */}

      {editingProduct && (
        <div className="edit-modal-overlay">
          <div className="edit-modal">
            {/* HEADER */}

            <div className="edit-modal-header">
              <div>
                <h2>Edit Product</h2>

                <p>Update product information</p>
              </div>

              <button
                type="button"
                className="close-modal-btn"
                onClick={() => setEditingProduct(null)}
              >
                ✕
              </button>
            </div>

            {/* IMAGE */}

            <div className="edit-image-preview">
              {editImage ? (
                <img src={editImage} alt={editName} />
              ) : (
                <div>No Image</div>
              )}
            </div>

            {/* NAME */}

            <div className="form-group">
              <label>Product Name</label>

              <input
                type="text"
                value={editName}
                onChange={(event) => setEditName(event.target.value)}
              />
            </div>

            {/* CATEGORY */}

            <div className="form-group">
              <label>Category</label>

              <select
                value={editCategory}
                onChange={(event) => setEditCategory(event.target.value)}
              >
                <option value="Fruits">Fruits</option>

                <option value="Vegetables">Vegetables</option>

                <option value="Groceries">Groceries</option>

                <option value="Offers">Offers</option>
              </select>
            </div>

            {/* SUBCATEGORY */}

            <div className="form-group">
              <label>Subcategory</label>

              <input
                type="text"
                value={editSubcategory}
                onChange={(event) => setEditSubcategory(event.target.value)}
              />
            </div>

            {/* PRICE */}

            <div className="form-group">
              <label>Price</label>

              <input
                type="number"
                min="0.01"
                step="0.01"
                value={editPrice}
                onChange={(event) => setEditPrice(event.target.value)}
              />
            </div>

            {/* OLD PRICE */}

            <div className="form-group">
              <label>Old Price</label>

              <input
                type="number"
                min="0"
                step="0.01"
                value={editOldPrice}
                onChange={(event) => setEditOldPrice(event.target.value)}
              />
            </div>

            {/* STOCK */}

            <div className="form-group">
              <label>Stock</label>

              <input
                type="number"
                min="0"
                step="1"
                value={editStock}
                onChange={(event) => setEditStock(event.target.value)}
              />
            </div>

            {/* UNIT */}

            <div className="form-group">
              <label>Unit</label>

              <select
                value={editUnit}
                onChange={(event) => setEditUnit(event.target.value)}
              >
                <option value="piece">Piece</option>

                <option value="kg">Kilogram (kg)</option>

                <option value="gram">Gram (g)</option>

                <option value="litre">Litre (L)</option>

                <option value="dozen">Dozen</option>

                <option value="packet">Packet</option>

                <option value="box">Box</option>
              </select>
            </div>

            {/* ERROR */}

            {error && <div className="product-error-message">{error}</div>}

            {/* ACTIONS */}

            <div className="edit-modal-actions">
              <button
                type="button"
                className="cancel-edit-btn"
                onClick={() => setEditingProduct(null)}
              >
                Cancel
              </button>

              <button
                type="button"
                className="save-edit-btn"
                disabled={updating}
                onClick={handleUpdateProduct}
              >
                {updating ? "Updating..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
