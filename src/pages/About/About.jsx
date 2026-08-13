import "./About.css";

function About() {
  return (
    <div className="about-page">
      {/* HERO */}

      <section className="about-hero">
        <div className="about-hero-content">
          <span className="about-label">ABOUT FRESHMART</span>

          <h1>
            Fresh Food,
            <br />
            <span>Fresh Life.</span>
          </h1>

          <p>
            FreshMart brings fresh fruits, vegetables and groceries straight to
            your doorstep with quality you can trust.
          </p>
        </div>

        <div className="about-hero-icon">🍃</div>
      </section>

      {/* STORY */}

      <section className="about-story">
        <div className="about-story-image">🥬</div>

        <div className="about-story-content">
          <span className="about-section-label">OUR STORY</span>

          <h2>
            Freshness you can
            <span> count on.</span>
          </h2>

          <p>
            At FreshMart, we believe that good food starts with fresh
            ingredients. That's why we make it simple to discover and order
            quality fruits, vegetables and everyday groceries.
          </p>

          <p>
            From carefully selected products to convenient doorstep delivery,
            our goal is to make your daily shopping experience easier and
            better.
          </p>

          <div className="about-features">
            <div className="about-feature">
              <span>🌱</span>

              <div>
                <h3>Fresh Products</h3>

                <p>Quality products selected with care.</p>
              </div>
            </div>

            <div className="about-feature">
              <span>🚚</span>

              <div>
                <h3>Easy Delivery</h3>

                <p>Fresh groceries delivered to you.</p>
              </div>
            </div>

            <div className="about-feature">
              <span>❤️</span>

              <div>
                <h3>Customer First</h3>

                <p>Your satisfaction always comes first.</p>
              </div>
            </div>

            <div className="about-feature">
              <span>✨</span>

              <div>
                <h3>Trusted Quality</h3>

                <p>Freshness and quality in every order.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}

      <section className="about-stats">
        <div className="about-stat">
          <strong>100+</strong>

          <span>Fresh Products</span>
        </div>

        <div className="about-stat">
          <strong>24/7</strong>

          <span>Online Shopping</span>
        </div>

        <div className="about-stat">
          <strong>100%</strong>

          <span>Freshness Focused</span>
        </div>

        <div className="about-stat">
          <strong>❤️</strong>

          <span>Happy Customers</span>
        </div>
      </section>
    </div>
  );
}

export default About;
