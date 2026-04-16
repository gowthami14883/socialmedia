function VisualPanel() {
  return (
    <div className="visual-panel">
      <div className="auto-scroll">
        {[47, 32, 15, 5, 68, 21, 9, 44, 18, 60].map((img, i) => (
          <div className="ad-card" key={i}>
            <span className="ad-badge">Sponsored</span>

            <img
              src={`https://i.pravatar.cc/300?img=${img}`}
              className="ad-media"
              alt="ad"
            />

            <div className="ad-text">
              <h4>Discover Beauty ✨</h4>
              <p>Trending creators today</p>
              <button>Follow</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default VisualPanel;