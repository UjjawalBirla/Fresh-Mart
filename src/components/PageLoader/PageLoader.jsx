import "./PageLoader.css";

function PageLoader() {
  return (
    <div className="page-loader">
      <div className="page-loader-content">
        <div className="page-loader-icon">🍃</div>

        <div className="page-loader-spinner">
          <span></span>
          <span></span>
          <span></span>
        </div>

        <p>Loading FreshMart...</p>
      </div>
    </div>
  );
}

export default PageLoader;
