import { useEffect, useRef, useState } from "react";
import { LogOut, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import "./LogoutButton.css";

const LogoutButton = ({ children = "Log out", className = "" }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const cancelButtonRef = useRef(null);
  const triggerButtonRef = useRef(null);

  useEffect(() => {
    if (!dialogOpen) return undefined;
    cancelButtonRef.current?.focus();
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setDialogOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [dialogOpen]);

  const closeDialog = () => {
    setDialogOpen(false);
    triggerButtonRef.current?.focus();
  };

  const confirmLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <>
      <button
        ref={triggerButtonRef}
        type="button"
        className={`logout-trigger ${className}`.trim()}
        onClick={() => setDialogOpen(true)}
      >
        <LogOut size={17} />
        <span>{children}</span>
      </button>
      {dialogOpen && (
        <div
          className="logout-dialog-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeDialog();
          }}
        >
          <section
            className="logout-dialog"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="logout-dialog-title"
            aria-describedby="logout-dialog-description"
          >
            <button type="button" className="logout-dialog-close" aria-label="Close dialog" onClick={closeDialog}>
              <X size={17} />
            </button>
            <span className="logout-dialog-icon"><LogOut size={20} /></span>
            <h2 id="logout-dialog-title">Sign out of your account?</h2>
            <p id="logout-dialog-description">You’ll need to sign in again to continue managing your care workspace.</p>
            <div className="logout-dialog-actions">
              <button ref={cancelButtonRef} type="button" className="logout-dialog-cancel" onClick={closeDialog}>Stay signed in</button>
              <button type="button" className="logout-dialog-confirm" onClick={confirmLogout}>Yes, log out</button>
            </div>
          </section>
        </div>
      )}
    </>
  );
};

export default LogoutButton;
