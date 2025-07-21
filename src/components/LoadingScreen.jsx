// src/components/LoadingScreen.jsx
const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  background: "rgba(0, 0, 0, 0.95)",
  color: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999,
  fontSize: "3rem",
  flexDirection: "column",
  font: 'Arial',
  transition: "opacity 1s ease"
};

export default function LoadingScreen() {
  return (
    <div style={overlayStyle}>
      <div className="spinner" style={{marginBottom: 20}}>
        {/* Simple SVG spinner */}
        <svg width="60" height="60" viewBox="0 0 44 44" stroke="#fff">
          <g fill="none" fillRule="evenodd" strokeWidth="4">
            <circle cx="22" cy="22" r="18" strokeOpacity=".5"/>
            <path d="M40 22c0-9.94-8.06-18-18-18">
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 22 22"
                to="360 22 22"
                dur="1s"
                repeatCount="indefinite"/>
            </path>
          </g>
        </svg>
      </div>
      Loading...
      <p style={{ marginTop: 24, fontSize: "1.2rem", textAlign: "center" }}>
        Left-click and drag to look around<br/>
        Right-click and drag to move around<br/>
        Scroll to zoom in and out<br/>
        Click on objects to interact<br/>
      </p>
    </div>
  );
}
