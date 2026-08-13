import { Link } from "react-router-dom";

import "./Cards.css";

function Cards({
  title,
  description,
  image,
  icon,
  link = "#",
  className = "",
}) {
  return (
    <article className={`card ${className}`}>
      {/* =========================================
          IMAGE
      ========================================= */}

      <div className="card-image">
        {image ? (
          <img src={image} alt={title || "FreshMart"} loading="lazy" />
        ) : (
          <div className="card-image-placeholder">{icon || "🍃"}</div>
        )}
      </div>

      {/* =========================================
          CONTENT
      ========================================= */}

      <div className="card-content">
        {icon && <div className="card-icon">{icon}</div>}

        {title && <h3 className="card-title">{title}</h3>}

        {description && <p className="card-description">{description}</p>}

        {/* =======================================
            LINK
        ======================================= */}

        {link && link !== "#" && (
          <Link to={link} className="card-link">
            Explore
            <span>→</span>
          </Link>
        )}
      </div>
    </article>
  );
}

export default Cards;
