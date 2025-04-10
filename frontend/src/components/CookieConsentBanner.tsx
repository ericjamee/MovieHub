import { useState, useEffect } from "react";

function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (consent !== "true") {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "true");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#212529",
        color: "#fff",
        padding: "1rem",
        textAlign: "center",
        zIndex: 1000,
      }}
    >
      <p style={{ marginBottom: "0.5rem" }}>
        We use cookies to improve your experience. By clicking “Accept,” you
        agree to the use of non-essential cookies.
      </p>
      <button className="btn btn-primary btn-sm" onClick={handleAccept}>
        Accept
      </button>
    </div>
  );
}

export default CookieConsentBanner;
