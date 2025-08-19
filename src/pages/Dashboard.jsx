import { useNavigate } from "react-router-dom";
import { http } from "../api/http";
import { useAuth } from "../context/AuthContext";

// shadcn/ui
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState } from "react";

const EXAM_ID = import.meta.env.VITE_EXAM_ID || ""; // set this in .env

export default function Dashboard() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [err, setErr] = useState("");

  const startExam = async () => {
    setErr("");
    if (!EXAM_ID) {
      setErr("Please set VITE_EXAM_ID in your client .env file");
      return;
    }
    try {
      const { data } = await http.post("/exams/start", { examId: EXAM_ID });
      nav("/exam", { state: data }); // { submissionId, durationSeconds, questions }
    } catch (e) {
      setErr("Failed to start exam. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-lg shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl text-center font-bold text-gray-800">
            Welcome, {user?.name}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 text-gray-700">
          <p>
            When you’re ready, click <b>Start Exam</b>. You will have limited
            time, and answers will auto-submit when time ends.
          </p>

          {err && (
            <Alert variant="destructive">
              <AlertDescription>{err}</AlertDescription>
            </Alert>
          )}
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button onClick={startExam}>Start Exam</Button>
          <Button variant="outline" onClick={logout}>
            Logout
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
