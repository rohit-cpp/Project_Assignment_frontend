// client/src/pages/Result.jsx
import { useEffect, useState } from "react";
import { useLocation, useParams, Link } from "react-router-dom";
import { http } from "../api/http";

export default function Result() {
  const { id } = useParams();
  const { state } = useLocation();
  const [result, setResult] = useState(state || null);
  const [loading, setLoading] = useState(!state);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchResult() {
      setLoading(true);
      setError("");
      try {
        const { data } = await http.get(`/submissions/${id}`);
        setResult(data);
      } catch (e) {
        setError("Unable to load result. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    if (!state && id) {
      fetchResult();
    }
  }, [state, id]);

  if (loading) return <div className="container">Loading...</div>;
  if (error)
    return (
      <div className="container" style={{ color: "red" }}>
        {error}
      </div>
    );
  if (!result) return <div className="container">No result found.</div>;

  const { score, total, status, startedAt, submittedAt, timeExpired } = result;

  return (
    <div className="container">
      <h3>Result</h3>
      <div style={{ marginTop: 12 }}>
        <div style={{ fontSize: 18, marginBottom: 6 }}>
          Score: <strong>{typeof score === "number" ? score : 0}</strong> /{" "}
          {typeof total === "number" ? total : 0}
        </div>
        <div>Status: {status}</div>
        {timeExpired ? (
          <div style={{ color: "red", marginTop: 6 }}>Time expired</div>
        ) : null}
        <div style={{ marginTop: 10, color: "#666" }}>
          {startedAt ? (
            <div>Started: {new Date(startedAt).toLocaleString()}</div>
          ) : null}
          {submittedAt ? (
            <div>Submitted: {new Date(submittedAt).toLocaleString()}</div>
          ) : null}
        </div>

        <div style={{ marginTop: 16 }}>
          <Link to="/">Go to Dashboard</Link>
        </div>
      </div>
    </div>
  );
}
