import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface Semester {
  id: string;
  name: string;
  credits: number;
  gpa: number;
}

export function CGPACalculator() {
  const [semesters, setSemesters] = useState<Semester[]>([
    { id: "1", name: "", credits: 0, gpa: 0 }
  ]);
  const [result, setResult] = useState<any>(null);
  const { toast } = useToast();

  const addSemester = () => {
    const newSemester: Semester = {
      id: Date.now().toString(),
      name: "",
      credits: 0,
      gpa: 0
    };
    setSemesters([...semesters, newSemester]);
  };

  const removeSemester = (id: string) => {
    if (semesters.length > 1) {
      setSemesters(semesters.filter(semester => semester.id !== id));
    } else {
      toast({
        title: "Cannot Remove",
        description: "At least one semester is required!",
        variant: "destructive"
      });
    }
  };

  const updateSemester = (id: string, field: keyof Semester, value: any) => {
    setSemesters(semesters.map(semester => 
      semester.id === id 
        ? { ...semester, [field]: value }
        : semester
    ));
  };

  const calculateCGPA = () => {
    // Validation
    for (let i = 0; i < semesters.length; i++) {
      const semester = semesters[i];
      if (!semester.name.trim() || semester.credits <= 0 || semester.gpa < 0 || semester.gpa > 10) {
        toast({
          title: "Incomplete Data",
          description: `Please fill valid data for Semester ${i + 1}`,
          variant: "destructive"
        });
        return;
      }
    }

    const totalCredits = semesters.reduce((sum, semester) => sum + semester.credits, 0);
    const totalGradePoints = semesters.reduce((sum, semester) => 
      sum + (semester.credits * semester.gpa), 0);

    const cgpa = totalCredits > 0 ? (totalGradePoints / totalCredits) : 0;

    setResult({
      semesters,
      totalCredits,
      cgpa: cgpa.toFixed(2),
      performanceLevel: getPerformanceLevel(cgpa),
      academicStanding: getAcademicStanding(cgpa)
    });

    toast({
      title: "CGPA Calculated Successfully!",
      description: `Your CGPA is ${cgpa.toFixed(2)}/10`,
    });
  };

  const getPerformanceLevel = (cgpa: number) => {
    if (cgpa >= 9.5) return { text: "Outstanding Performance", color: "hsl(var(--excellent))" };
    if (cgpa >= 8.5) return { text: "Excellent Performance", color: "hsl(var(--excellent))" };
    if (cgpa >= 7.5) return { text: "Very Good Performance", color: "hsl(var(--very-good))" };
    if (cgpa >= 6.5) return { text: "Good Performance", color: "hsl(var(--good))" };
    if (cgpa >= 5.5) return { text: "Average Performance", color: "hsl(var(--average))" };
    return { text: "Needs Improvement", color: "hsl(var(--poor))" };
  };

  const getAcademicStanding = (cgpa: number) => {
    if (cgpa >= 9.0) return "First Class with Distinction";
    if (cgpa >= 7.5) return "First Class";
    if (cgpa >= 6.5) return "Second Class";
    if (cgpa >= 5.0) return "Third Class";
    return "Needs Improvement";
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Overall CGPA Calculator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Semesters</h4>
              <Button onClick={addSemester} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Semester
              </Button>
            </div>

            <AnimatePresence>
              {semesters.map((semester, index) => (
                <motion.div
                  key={semester.id}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg bg-accent/50"
                >
                  <div>
                    <Label className="text-xs">Semester Name</Label>
                    <Input
                      placeholder="e.g., Semester 1"
                      value={semester.name}
                      onChange={(e) => updateSemester(semester.id, 'name', e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label className="text-xs">Total Credits</Label>
                    <Input
                      type="number"
                      min="1"
                      placeholder="Credits"
                      value={semester.credits || ''}
                      onChange={(e) => updateSemester(semester.id, 'credits', parseInt(e.target.value) || 0)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label className="text-xs">GPA</Label>
                    <Input
                      type="number"
                      min="0"
                      max="10"
                      step="0.01"
                      placeholder="GPA (0-10)"
                      value={semester.gpa || ''}
                      onChange={(e) => updateSemester(semester.id, 'gpa', parseFloat(e.target.value) || 0)}
                      className="mt-1"
                    />
                  </div>

                  <div className="flex items-end">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeSemester(semester.id)}
                      disabled={semesters.length === 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <Button onClick={calculateCGPA} className="w-full" size="lg">
            <TrendingUp className="h-4 w-4 mr-2" />
            Calculate CGPA
          </Button>
        </CardContent>
      </Card>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="text-center">Overall CGPA Result</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">{result.cgpa}/10</div>
                  <div 
                    className="text-lg font-medium"
                    style={{ color: result.performanceLevel.color }}
                  >
                    {result.performanceLevel.text}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold">{result.totalCredits}</div>
                    <div className="text-sm text-muted-foreground">Total Credits</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{result.semesters.length}</div>
                    <div className="text-sm text-muted-foreground">Semesters</div>
                  </div>
                </div>

                <div className="text-center p-4 bg-secondary rounded-lg">
                  <h4 className="font-medium mb-2">Academic Standing</h4>
                  <div className="text-lg font-semibold text-primary">
                    {result.academicStanding}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Semester Breakdown</h4>
                  <div className="space-y-2">
                    {result.semesters.map((semester: any) => (
                      <div key={semester.id} className="flex justify-between items-center p-2 bg-secondary rounded">
                        <span className="font-medium">{semester.name}</span>
                        <span className="text-sm">{semester.credits} credits × {semester.gpa.toFixed(2)} = {(semester.credits * semester.gpa).toFixed(2)} points</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}