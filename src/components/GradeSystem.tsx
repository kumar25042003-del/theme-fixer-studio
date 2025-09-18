import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const gradeData = [
  { grade: "O", points: "10", description: "Outstanding" },
  { grade: "A+", points: "9", description: "Excellent" },
  { grade: "A", points: "8", description: "Very Good" },
  { grade: "B+", points: "7", description: "Good" },
  { grade: "B", points: "6", description: "Average" },
  { grade: "C", points: "5", description: "Below Average" },
  { grade: "RA/SA/W", points: "0", description: "Fail/Absent/Withdrawn" },
];

export function GradeSystem() {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-center">Anna University Grading System</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3">
          {gradeData.map((item, index) => (
            <div
              key={index}
              className="text-center p-3 rounded-lg border-2 border-accent transition-all hover:border-primary hover:shadow-md"
            >
              <div className="font-bold text-primary text-lg">{item.grade}</div>
              <div className="font-semibold text-lg">{item.points}</div>
              <div className="text-xs text-muted-foreground mt-1">{item.description}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}