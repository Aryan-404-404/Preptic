// components/ActiveSessionBanner.jsx
const ActiveSessionBanner = ({ session, onResume, onDiscard }) => {
  return (
    <div style={{
      backgroundColor: "#fff8ec",
      border: "1px solid #f5a623",
      borderRadius: "12px",
      padding: "16px 24px",
      marginBottom: "28px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "16px",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <span style={{
          backgroundColor: "#f5a623",
          borderRadius: "50%",
          width: "10px",
          height: "10px",
          display: "inline-block",
          flexShrink: 0,
          boxShadow: "0 0 0 3px rgba(245,166,35,0.25)",
        }} />
        <div>
          <p style={{ margin: 0, fontWeight: 600, fontSize: "14px", color: "#1a1a1a" }}>
            You have an active session
          </p>
          <p style={{ margin: 0, fontSize: "13px", color: "#666", marginTop: "2px" }}>
            {session.trackType} · Level {session.level} · Question {session.questionNumber}/3
          </p>
        </div>
      </div>

      <div style={{ display: "flex", gap: "10px", flexShrink: 0 }}>
        <button onClick={onDiscard} style={{
          padding: "7px 16px",
          borderRadius: "8px",
          border: "1px solid #ddd",
          backgroundColor: "white",
          fontSize: "13px",
          cursor: "pointer",
          color: "#555",
        }}>
          Discard
        </button>
        <button onClick={onResume} style={{
          padding: "7px 16px",
          borderRadius: "8px",
          border: "none",
          backgroundColor: "#f5a623",
          fontSize: "13px",
          fontWeight: 600,
          cursor: "pointer",
          color: "white",
        }}>
          Resume →
        </button>
      </div>
    </div>
  );
};

export default ActiveSessionBanner;