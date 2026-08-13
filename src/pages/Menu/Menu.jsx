import { NavLink } from "react-router-dom";
import { FiArrowRight, FiShoppingCart, FiStar } from "react-icons/fi";

import "./Menu.css";

function Menu() {
  const categories = [
    {
      id: 1,
      emoji: "🍎",
      title: "Fresh Fruits",
      description: "Fresh and juicy fruits selected for your everyday needs.",
      path: "/fruits",
      className: "menu-fruits",
    },

    {
      id: 2,
      emoji: "🥦",
      title: "Vegetables",
      description: "Farm-fresh vegetables delivered straight to your doorstep.",
      path: "/vegetables",
      className: "menu-vegetables",
    },

    {
      id: 3,
      emoji: "🛒",
      title: "Groceries",
      description: "Everything you need for your everyday kitchen essentials.",
      path: "/groceries",
      className: "menu-groceries",
    },

    {
      id: 4,
      emoji: "🏷️",
      title: "Special Offers",
      description:
        "Grab amazing deals and save more on your favourite products.",
      path: "/offers",
      className: "menu-offers",
    },
  ];

  return (
    <div className="menu-page">
      {/* =========================================
          HERO
      ========================================== */}

      <section className="menu-hero">
        <div className="menu-hero-content">
          <span className="menu-label">FRESHMART MENU</span>

          <h1>
            Fresh choices,
            <br />
            <span>made for you.</span>
          </h1>

          <p>
            Explore fresh fruits, vegetables, groceries and special offers — all
            in one place.
          </p>

          <NavLink to="/fruits" className="menu-shop-btn">
            Start Shopping
            <FiArrowRight />
          </NavLink>
        </div>

        <div className="menu-hero-visual">
          <div className="menu-hero-fruit">🍎</div>

          <div className="menu-hero-vegetable">🥦</div>

          <div className="menu-hero-grocery">🛒</div>
        </div>
      </section>

      {/* =========================================
          CATEGORY SECTION
      ========================================== */}

      <section className="menu-section">
        <div className="menu-section-heading">
          <div>
            <span className="menu-section-label">EXPLORE</span>

            <h2>Shop by Category</h2>
          </div>

          <p>Choose a category and discover fresh products waiting for you.</p>
        </div>

        {/* CATEGORY GRID */}

        <div className="menu-category-grid">
          {categories.map((category) => (
            <NavLink
              key={category.id}
              to={category.path}
              className={`menu-category-card ${category.className}`}
            >
              <div className="menu-card-image">
                <span>{category.emoji}</span>
              </div>

              <div className="menu-card-content">
                <span className="menu-card-number">0{category.id}</span>

                <h3>{category.title}</h3>

                <p>{category.description}</p>

                <span className="menu-card-link">
                  Explore
                  <FiArrowRight />
                </span>
              </div>
            </NavLink>
          ))}
        </div>
      </section>

      {/* =========================================
          WHY FRESHMART
      ========================================== */}

      <section className="menu-benefits">
        <div className="menu-benefit">
          <div className="menu-benefit-icon">🌱</div>

          <div>
            <h3>Fresh Products</h3>

            <p>Carefully selected products for better quality.</p>
          </div>
        </div>

        <div className="menu-benefit">
          <div className="menu-benefit-icon">🚚</div>

          <div>
            <h3>Fast Delivery</h3>

            <p>Get your everyday groceries delivered conveniently.</p>
          </div>
        </div>

        <div className="menu-benefit">
          <div className="menu-benefit-icon">⭐</div>

          <div>
            <h3>Quality First</h3>

            <p>Quality and freshness are always our priority.</p>
          </div>
        </div>

        <div className="menu-benefit">
          <div className="menu-benefit-icon">❤️</div>

          <div>
            <h3>Customer First</h3>

            <p>A simple and friendly shopping experience for everyone.</p>
          </div>
        </div>
      </section>

      {/* =========================================
          BOTTOM CTA
      ========================================== */}

      <section className="menu-cta">
        <div className="menu-cta-icon">🛒</div>

        <div className="menu-cta-content">
          <span>READY TO SHOP?</span>

          <h2>
            Freshness is just
            <strong> one click away.</strong>
          </h2>

          <p>Explore our categories and find everything you need.</p>
        </div>

        <NavLink to="/fruits" className="menu-cta-btn">
          Shop Now
          <FiArrowRight />
        </NavLink>
      </section>
    </div>
  );
}

export default Menu;
