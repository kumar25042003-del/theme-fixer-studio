import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface Subject {
  id: string;
  type: string;
  credits: number;
  grade: string;
  gradeValue: number;
}

const courseTypes = [
  { value: "theory", label: "Theory Course", credits: 3 },
  { value: "practical", label: "Practical Course", credits: 4 },
  { value: "project", label: "Project Work", credits: 1 },
  { value: "manual", label: "Custom Credits", credits: 0 },
];

const grades = [
  { value: "10", label: "O (10)", points: 10 },
  { value: "9", label: "A+ (9)", points: 9 },
  { value: "8", label: "A (8)", points: 8 },
  { value: "7", label: "B+ (7)", points: 7 },
  { value: "6", label: "B (6)", points: 6 },
  { value: "5", label: "C (5)", points: 5 },
  { value: "0", label: "RA/SA/W (0)", points: 0 },
];

export function GPACalculator() {
  const [semesterName, setSemesterName] = useState("");
  const [subjects, setSubjects] = useState<Subject[]>([
    { id: "1", type: "theory", credits: 3, grade: "", gradeValue: 0 }
  ]);
  const [result, setResult] = useState<any>(null);
  const { toast } = useToast();

  const addSubject = () => {
    const newSubject: Subject = {
      id: Date.now().toString(),
      type: "theory",
      credits: 3,
      grade: "",
      gradeValue: 0
    };
    setSubjects([...subjects, newSubject]);
  };

  const removeSubject = (id: string) => {
    if (subjects.length > 1) {
      setSubjects(subjects.filter(subject => subject.id !== id));
    } else {
      toast({
        title: "Cannot Remove",
        description: "At least one subject is required!",
        variant: "destructive"
      });
    }
  };

  const updateSubject = (id: string, field: keyof Subject, value: any) => {
    setSubjects(subjects.map(subject => {
      if (subject.id === id) {
        const updated = { ...subject, [field]: value };
        
        // Auto-fill credits based on course type
        if (field === 'type') {
          const courseType = courseTypes.find(ct => ct.value === value);
          if (courseType && courseType.credits > 0) {
            updated.credits = courseType.credits;
          }
        }
        
        return updated;
      }
      return subject;
    }));
  };

  const calculateGPA = () => {
    // Validation
    for (let i = 0; i < subjects.length; i++) {
      const subject = subjects[i];
      if (!subject.grade || subject.credits <= 0) {
        toast({
          title: "Incomplete Data",
          description: `Please fill all fields for Subject ${i + 1}`,
          variant: "destructive"
        });
        return;
      }
    }

    const totalCredits = subjects.reduce((sum, subject) => sum + subject.credits, 0);
    const totalGradePoints = subjects.reduce((sum, subject) => {
      const gradeData = grades.find(g => g.value === subject.grade);
      return sum + (subject.credits * (gradeData?.points || 0));
    }, 0);

    const gpa = totalCredits > 0 ? (totalGradePoints / totalCredits) : 0;
    
    const gradeDistribution = grades.reduce((dist, grade) => {
      const count = subjects.filter(s => s.grade === grade.value).length;
      if (count > 0) {
        dist[grade.label.split(' ')[0]] = count;
      }
      return dist;
    }, {} as Record<string, number>);

    setResult({
      semesterName: semesterName || "Current Semester",
      subjects,
      totalCredits,
      gpa: gpa.toFixed(2),
      gradeDistribution,
      performanceLevel: getPerformanceLevel(gpa)
    });

    toast({
      title: "GPA Calculated Successfully!",
      description: `Your GPA is ${gpa.toFixed(2)}/10`,
    });
  };

  const getPerformanceLevel = (gpa: number) => {
    if (gpa >= 9.5) return { text: "Outstanding Performance", color: "hsl(var(--excellent))" };
    if (gpa >= 8.5) return { text: "Excellent Performance", color: "hsl(var(--excellent))" };
    if (gpa >= 7.5) return { text: "Very Good Performance", color: "hsl(var(--very-good))" };
    if (gpa >= 6.5) return { text: "Good Performance", color: "hsl(var(--good))" };
    if (gpa >= 5.5) return { text: "Average Performance", color: "hsl(var(--average))" };
    return { text: "Needs Improvement", color: "hsl(var(--poor))" };
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Single Semester GPA Calculator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="semester">Semester Name</Label>
            <Input
              id="semester"
              placeholder="e.g., Semester 1, Final Year - Semester 1"
              value={semesterName}
              onChange={(e) => setSemesterName(e.target.value)}
              className="mt-1"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Subjects</h4>
              <Button onClick={addSubject} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Subject
              </Button>
            </div>

            <AnimatePresence>
              {subjects.map((subject, index) => (
                <motion.div
                  key={subject.id}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg bg-accent/50"
                >
                  <div>
                    <Label className="text-xs">Course Type</Label>
                    <Select 
                      value={subject.type} 
                      onValueChange={(value) => updateSubject(subject.id, 'type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {courseTypes.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-xs">Credits</Label>
                    <Input
                      type="number"
                      min="1"
                      max="10"
                      value={subject.credits}
                      onChange={(e) => updateSubject(subject.id, 'credits', parseInt(e.target.value) || 0)}
                      disabled={subject.type !== 'manual'}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label className="text-xs">Grade</Label>
                    <Select 
                      value={subject.grade} 
                      onValueChange={(value) => updateSubject(subject.id, 'grade', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Grade" />
                      </SelectTrigger>
                      <SelectContent>
                        {grades.map(grade => (
                          <SelectItem key={grade.value} value={grade.value}>
                            {grade.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-end">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeSubject(subject.id)}
                      disabled={subjects.length === 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <Button onClick={calculateGPA} className="w-full" size="lg">
            <Calculator className="h-4 w-4 mr-2" />
            Calculate GPA
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
                <CardTitle className="text-center">
                  {result.semesterName} - GPA Result
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">{result.gpa}/10</div>
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
                    <div className="text-2xl font-bold">{result.subjects.length}</div>
                    <div className="text-sm text-muted-foreground">Subjects</div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Grade Distribution</h4>
                  <div className="flex flex-wrap gap-2">
                      {Object.entries(result.gradeDistribution).map(([grade, count]) => (
                        <span 
                          key={grade} 
                          className="px-3 py-1 bg-secondary rounded-full text-sm"
                        >
                          {grade}: {count as number}
                        </span>
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