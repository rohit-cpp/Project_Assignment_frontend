// client/src/pages/Result.jsx
import { useEffect, useState } from "react";
import { useLocation, useParams, Link } from "react-router-dom";
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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

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

  if (loading)
    return (
      <div className="container max-w-xl mx-auto py-10 text-center text-muted-foreground">
        Loading...
      </div>
    );

  if (error)
    return (
      <div className="container max-w-xl mx-auto py-10 text-center text-red-500">
        {error}
      </div>
    );

  if (!result)
    return (
      <div className="container max-w-xl mx-auto py-10 text-center text-muted-foreground">
        No result found.
      </div>
    );

  const { score, total, status, startedAt, submittedAt, timeExpired } = result;

  return (
    <div className="container max-w-xl mx-auto py-8">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl font-bold">Exam Result</CardTitle>
          <CardDescription>Your exam performance summary</CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="space-y-4 mt-4">
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium">Score</span>
            <span className="text-2xl font-bold">
              {typeof score === "number" ? score : 0} /{" "}
              {typeof total === "number" ? total : 0}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-lg font-medium">Status</span>
            <Badge
              variant={
                status === "Passed"
                  ? "default"
                  : status === "Failed"
                  ? "destructive"
                  : "secondary"
              }
              className="capitalize"
            >
              {status}
            </Badge>
          </div>

          {timeExpired ? (
            <div className="text-red-500 text-sm">⏳ Time Expired</div>
          ) : null}

          <Separator className="my-2" />

          <div className="text-sm text-muted-foreground space-y-1">
            {startedAt && (
              <div>
                <strong>Started:</strong> {new Date(startedAt).toLocaleString()}
              </div>
            )}
            {submittedAt && (
              <div>
                <strong>Submitted:</strong>{" "}
                {new Date(submittedAt).toLocaleString()}
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex justify-center mt-4">
          <Button asChild>
            <Link to="/">⬅ Go to Dashboard</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
