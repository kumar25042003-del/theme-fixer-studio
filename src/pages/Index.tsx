import { useState } from "react";
import { motion } from "framer-motion";
import { GraduationCap, Calculator, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeToggle } from "@/components/ThemeToggle";
import { GradeSystem } from "@/components/GradeSystem";
import { GPACalculator } from "@/components/GPACalculator";
import { CGPACalculator } from "@/components/CGPACalculator";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <GraduationCap className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-bold">Anna University</h1>
              <p className="text-xs text-muted-foreground">CGPA Calculator</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8 space-y-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-sm font-medium text-primary">
            <GraduationCap className="h-4 w-4" />
            Academic Excellence Calculator
          </div>
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Calculate Your Academic Performance
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Easily calculate your GPA for individual semesters or your overall CGPA based on 
            Anna University's official grading system.
          </p>
        </motion.div>

        {/* Grading System Reference */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <GradeSystem />
        </motion.div>

        {/* Calculator Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Tabs defaultValue="gpa" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="gpa" className="flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                Single Semester GPA
              </TabsTrigger>
              <TabsTrigger value="cgpa" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Overall CGPA
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="gpa">
              <GPACalculator />
            </TabsContent>
            
            <TabsContent value="cgpa">
              <CGPACalculator />
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-background/50 backdrop-blur">
        <div className="container py-6 text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 Anna University CGPA Calculator. Built for students by students.
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Designed to help you track and improve your academic performance.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
