// client/src/pages/Exam.jsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { http } from "../api/http";

export default function Exam() {
  const nav = useNavigate();
  const { state } = useLocation(); // from Dashboard start

  const [init] = useState(() => {
    if (!state) return null;
    return {
      submissionId: state.submissionId,
      durationSeconds: state.durationSeconds,
      questions: state.questions,
    };
  });

  useEffect(() => {
    if (!init) nav("/");
  }, [init, nav]);

  if (!init) return null;

  const { submissionId, durationSeconds, questions } = init;

  // Persisted state
  const [current, setCurrent] = useState(() => {
    const saved = localStorage.getItem(`exam-${submissionId}-current`);
    return saved ? parseInt(saved, 10) : 0;
  });

  const [answers, setAnswers] = useState(() => {
    const saved = localStorage.getItem(`exam-${submissionId}-answers`);
    return saved ? JSON.parse(saved) : {};
  });

  const [remaining, setRemaining] = useState(() => {
    const saved = localStorage.getItem(`exam-${submissionId}-remaining`);
    return saved ? parseInt(saved, 10) : durationSeconds;
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    localStorage.setItem(
      `exam-${submissionId}-answers`,
      JSON.stringify(answers)
    );
  }, [answers, submissionId]);

  useEffect(() => {
    localStorage.setItem(`exam-${submissionId}-current`, current.toString());
  }, [current, submissionId]);

  useEffect(() => {
    localStorage.setItem(
      `exam-${submissionId}-remaining`,
      remaining.toString()
    );
  }, [remaining, submissionId]);

  useEffect(() => {
    const t = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(t);
          handleSubmit(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const q = questions[current];

  const select = (idx) => {
    setAnswers((a) => ({ ...a, [q._id]: idx }));
  };

  async function handleSubmit(auto = false) {
    if (submitting) return;
    setSubmitting(true);
    try {
      // Defensive normalization: only include answers that are numbers, stringify IDs
      const normalizedAnswers = Object.entries(answers)
        .filter(([, v]) => typeof v === "number" && Number.isInteger(v))
        .map(([questionId, selectedIndex]) => ({
          questionId: String(questionId),
          selectedIndex: Number(selectedIndex),
        }));

      const payload = {
        submissionId: String(submissionId),
        answers: normalizedAnswers,
      };

      const { data } = await http.post("/exams/submit", payload);

      // Clear persisted data after submit
      localStorage.removeItem(`exam-${submissionId}-answers`);
      localStorage.removeItem(`exam-${submissionId}-current`);
      localStorage.removeItem(`exam-${submissionId}-remaining`);

      nav(`/result/${submissionId}`, { state: data, replace: true });
    } catch (e) {
      nav(`/result/${submissionId}`, { replace: true });

      // still clear persisted data
      localStorage.removeItem(`exam-${submissionId}-answers`);
      localStorage.removeItem(`exam-${submissionId}-current`);
      localStorage.removeItem(`exam-${submissionId}-remaining`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h3>Exam</h3>
        <div style={{ fontFamily: "monospace" }}>
          Time: {Math.floor(remaining / 60)}:
          {String(remaining % 60).padStart(2, "0")}
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <div style={{ color: "#666" }}>
          Question {current + 1} of {questions.length}
        </div>
        <div style={{ fontSize: 18, margin: "8px 0" }}>{q.text}</div>
        <div>
          {q.options.map((opt, i) => (
            <label
              key={i}
              style={{
                display: "block",
                border: "1px solid #ddd",
                borderRadius: 6,
                padding: 10,
                marginBottom: 8,
                background: answers[q._id] === i ? "#e8f0fe" : "white",
                cursor: "pointer",
              }}
            >
              <input
                type="radio"
                name={`q-${q._id}`}
                checked={answers[q._id] === i}
                onChange={() => select(i)}
                style={{ marginRight: 8 }}
              />
              {opt}
            </label>
          ))}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 16,
        }}
      >
        <button
          disabled={current === 0}
          onClick={() => setCurrent((c) => c - 1)}
        >
          Previous
        </button>
        <div>
          <button
            onClick={() =>
              setCurrent((c) => Math.min(c + 1, questions.length - 1))
            }
          >
            Next
          </button>
          <button
            disabled={submitting}
            onClick={() => handleSubmit(false)}
            style={{ marginLeft: 8 }}
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}
