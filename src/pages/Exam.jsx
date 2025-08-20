// client/src/pages/Exam.jsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { http } from "../api/http";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

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

      localStorage.removeItem(`exam-${submissionId}-answers`);
      localStorage.removeItem(`exam-${submissionId}-current`);
      localStorage.removeItem(`exam-${submissionId}-remaining`);

      nav(`/result/${submissionId}`, { state: data, replace: true });
    } catch (e) {
      nav(`/result/${submissionId}`, { replace: true });
      localStorage.removeItem(`exam-${submissionId}-answers`);
      localStorage.removeItem(`exam-${submissionId}-current`);
      localStorage.removeItem(`exam-${submissionId}-remaining`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container max-w-2xl mx-auto py-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Exam</CardTitle>
            <CardDescription>
              Question {current + 1} of {questions.length}
            </CardDescription>
          </div>
          <div className="font-mono font-semibold">
            ⏳ {Math.floor(remaining / 60)}:
            {String(remaining % 60).padStart(2, "0")}
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="mt-4">
          <p className="text-base font-medium mb-4">{q.text}</p>
          <RadioGroup
            value={answers[q._id] !== undefined ? String(answers[q._id]) : ""}
            onValueChange={(val) => select(Number(val))}
          >
            {q.options.map((opt, i) => (
              <Label
                key={i}
                className={`flex items-center gap-3 border rounded-lg px-4 py-2 mb-2 cursor-pointer hover:bg-muted transition ${
                  answers[q._id] === i ? "bg-primary/10 border-primary" : ""
                }`}
                htmlFor={`q-${q._id}-${i}`}
              >
                <RadioGroupItem
                  value={String(i)}
                  id={`q-${q._id}-${i}`}
                  className="border-primary"
                />
                {opt}
              </Label>
            ))}
          </RadioGroup>
        </CardContent>
        <Separator />
        <CardFooter className="flex justify-between mt-4">
          <Button
            variant="outline"
            disabled={current === 0}
            onClick={() => setCurrent((c) => c - 1)}
          >
            ⬅ Previous
          </Button>
          <div className="space-x-2">
            <Button
              variant="secondary"
              onClick={() =>
                setCurrent((c) => Math.min(c + 1, questions.length - 1))
              }
            >
              Next ➡
            </Button>
            <Button
              variant="default"
              disabled={submitting}
              onClick={() => handleSubmit(false)}
            >
              {submitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
