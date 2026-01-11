"use client";
import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { StudentHeader } from "@/app/(dashboard)/dashboard/student/grade-report/components/StudentHeader";
import { StudentInfo } from "@/app/(dashboard)/dashboard/student/grade-report/components/StudentInfo";
import { CourseTable } from "@/app/(dashboard)/dashboard/student/grade-report/components/CourseTable";
import { GradeDistribution } from "@/app/(dashboard)/dashboard/student/grade-report/components/GradeDistribution";
import { AcademicStanding } from "@/app/(dashboard)/dashboard/student/grade-report/components/AcademicStanding";
import { generateGPASummary, processGradeReport } from "@/lib/gpa.utils";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchStudentScores } from "@/app/actions/student.results";
import { useAuth } from "@/contexts/AuthContext";
import { ReportFooter } from "../../../grade-report/components/ReportFooter";
import { generateResultPdf } from "@/lib/generateResultPdf";

type UserInfo = {
  id: number;
  first_name: string;
  last_name: string;
  reg_number: string;
  program: string;
  level: string;
  department_id: number;
  faculty_id: number;
  academic_session: string | null;


};

type CourseInfo = {
  id: number;
  course_title: string;
  course_code: string;
  description: string;
};

type ResultItem = {
  id: number;
  user_id: number;
  course_id: number;
  course_code: string;
  course_title: string;
  credit_load: number;
  quality_point: string;
  level: string;
  session: string;
  semester: string;
  assignment: string;
  quiz: string;
  exam: string;
  bonus_points_applied: string;
  score: string;
  grade: string;
  remarks: string | null;
  status: string;
  date_of_result: string;
  batch_id: string | null;
  imported_from: string | null;
  created_at: string;
  updated_at: string;
  course: CourseInfo;
  user: UserInfo;
};

export default function StudentResultView() {
  const [selectedSemester, setSelectedSemester] = useState<string>("");
  const [selectedSession, setSelectedSession] = useState<string>("");
  const { access_token } = useAuth();

  function getCurrentAcademicYear(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    return month >= 8 ? `${year}/${year + 1}` : `${year - 1}/${year}`;
  }

  const availableSessions = [
    getCurrentAcademicYear(),
    "2025/2026",
    "2024/2025",
  ];

  const {
    mutate: fetchResults,
    data: apiResponse,
    isPending,
    error,
  } = useMutation({
    mutationFn: async () => {
      if (!access_token || !selectedSemester || !selectedSession) {
        throw new Error("Missing required parameters");
      }
      const response = await fetchStudentScores(access_token, selectedSemester, selectedSession);
      // console.log("API Response:", response);
      if (!response.success) {
        throw new Error("No results found for the selected academic year and semester");
      }
      return response;
    },
  });

  useEffect(() => {
    if (selectedSemester && selectedSession) {
      fetchResults();
    }
  }, [selectedSemester, selectedSession, fetchResults]);

  const handleSessionChange = (value: string) => {
    setSelectedSession(value);
  };

  const handleSemesterChange = (value: string) => {
    setSelectedSemester(value);
  };

  const resultsData =
    (apiResponse && (apiResponse as any).data) ||
    (apiResponse && (apiResponse as any).success?.data) ||
    [];
  // console.log("Results Data:", resultsData);

  // Safely handle the results data
  const filteredData = resultsData.filter((result: ResultItem) => {
    // Case-insensitive comparison for semester
    const semesterMatch = result.semester?.toLowerCase().includes(selectedSemester.toLowerCase());
    const sessionMatch = result.session === selectedSession;

    // console.log("Filter check:", { 
    //   resultSemester: result.semester, 
    //   selectedSemester,
    //   resultSession: result.session,
    //   selectedSession,
    //   semesterMatch,
    //   sessionMatch
    // });

    return semesterMatch && sessionMatch;
  });

  console.log("Filtered Data:", filteredData);

  const handleDownload = async () => {
    try {
      if (filteredData.length === 0) {
        throw new Error("No results available to download");
      }

      // Get the first result to extract student info
      const firstResult = filteredData[0];
      const studentInfo = {
        first_name: firstResult.user.first_name,
        last_name: firstResult.user.last_name,
        reg_number: firstResult.user.reg_number,
        program: firstResult.user.program,
        level: firstResult.user.level,
        department_id: firstResult.user.department_id,
        faculty_id: firstResult.user.faculty_id,
      };

      // Calculate GPA data
      const gpaData = generateGPASummary(
        filteredData.map((result) => ({
          course_id: result.course_id.toString(),
          course_code: result.course_code,
          course_name: result.course_title,
          credit_load: result.credit_load,
          finalgrade: parseFloat(result.score),
          grade: result.grade,
          semester: result.semester.includes("Ist Semester") ? "First" : "Second",
          activities: [],
          quality_point: parseFloat(result.quality_point),
          session: result.session,
          user_info: result.user,
        }))
      );

      // Generate and download the PDF
      await generateResultPdf(
        filteredData.map(result => ({
          ...result,
          course_code: result.course_code,
          course_title: result.course_title,
          credit_load: result.credit_load,
          grade: result.grade,
          quality_point: result.quality_point,
        })),
        studentInfo,
        selectedSemester.includes("Ist Semester") ? "First" : "Second",
        selectedSession,
        {
          gpa: gpaData.gpa,
          totalCredits: gpaData.totalCredits,
          totalQualityPoints: gpaData.totalQualityPoints,
          degreeClass: gpaData.degreeClass,
        }
      );

    } catch (error) {
      console.error("Download error:", error);
      alert(error instanceof Error ? error.message : "Failed to generate PDF");
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Grade Report</h1>
          <div className="flex flex-col sm:flex-row gap-4">
            <Select
              value={selectedSession}
              onValueChange={handleSessionChange}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select Academic Year" />
              </SelectTrigger>
              <SelectContent>
                {availableSessions.map((session) => (
                  <SelectItem key={session} value={session}>
                    {session}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Tabs
              value={selectedSemester}
              onValueChange={handleSemesterChange}
              className="w-[200px]"
            >
              <TabsList>
                <TabsTrigger value="Ist Semester">First Semester</TabsTrigger>
                <TabsTrigger value="2nd Semester">Second Semester</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {selectedSemester && selectedSession && (
          <Button onClick={handleDownload} className="bg-transparent hover:bg-inherit" disabled={isPending}>
            <Download className="mr-2 h-4 w-4" />
            Download Result
          </Button>
        )}
      </div>

      {/* Show initial state when no selections made */}
      {(!selectedSemester || !selectedSession) && (
        <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
          <div className="text-center text-gray-500">
            Please select an academic year and semester to view results
          </div>
        </div>
      )}

      {/* Show loading state */}
      {isPending && selectedSemester && selectedSession && (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary" />
          <span className="ml-3">Loading results...</span>
        </div>
      )}

      {/* Show error state */}
      {error && selectedSemester && selectedSession && (
        <div className="p-4 bg-red-50 rounded-lg text-gray-700">
          Error: {error instanceof Error ? error.message : "Failed to fetch results"}
        </div>
      )}

      {/* Show no results state */}
      {!isPending &&
        !error &&
        selectedSemester &&
        selectedSession &&
        filteredData.length === 0 && (
          <div className="p-4 bg-yellow-50 rounded-lg text-yellow-800">
            No results found for the selected criteria
          </div>
        )}

      {/* Show results */}
      {!isPending &&
        !error &&
        selectedSemester &&
        selectedSession &&
        filteredData.length > 0 && (
          <div className="bg-white text-black rounded-lg shadow-md overflow-hidden">
            <div className="space-y-6 p-0">
              <StudentHeader
                gradeReport={processGradeReport({
                  courses: filteredData.map((result) => ({
                    course_id: result.course_id.toString(),
                    course_code: result.course_code,
                    course_name: result.course_title,
                    credit_load: result.credit_load,
                    finalgrade: parseFloat(result.score),
                    grade: result.grade,
                    semester: result.semester.includes("Ist Semester") ? "First" : "Second",
                    activities: [],
                    quality_point: parseFloat(result.quality_point),
                    session: result.session,
                    user_info: result.user,
                  })),
                })}
                {...generateGPASummary(
                  filteredData.map((result) => ({
                    course_id: result.course_id.toString(),
                    course_code: result.course_code,
                    course_name: result.course_title,
                    credit_load: result.credit_load,
                    finalgrade: parseFloat(result.score),
                    grade: result.grade,
                    semester: result.semester.includes("Ist Semester") ? "First" : "Second",
                    activities: [],
                    quality_point: parseFloat(result.quality_point),
                    session: result.session,
                    user_info: result.user,
                  }))
                )}
              // semester={selectedSemester === "Ist Semester" ? "First" : "Second"}
              // academicYear={selectedSession}
              />

              <StudentInfo
              // studentName={`${filteredData[0].user.first_name} ${filteredData[0].user.last_name}`}
              // regNumber={filteredData[0].user.reg_number}
              // program={filteredData[0].user.program}
              // level={filteredData[0].user.level}
              // department={filteredData[0].user.department_id.toString()}
              // session={filteredData[0].session}
              // semester={filteredData[0].semester.includes("1") ? "First" : "Second"}
              />

              <CourseTable
                courses={filteredData.map((result) => ({
                  course_id: result.course_id.toString(),
                  course_code: result.course_code,
                  course_name: result.course_title,
                  credit_load: result.credit_load,
                  finalgrade: parseFloat(result.score),
                  grade: result.grade,
                  semester: result.semester.includes("Ist Semester") ? "First" : "Second",
                  activities: [],
                  quality_point: parseFloat(result.quality_point),
                  session: result.session,
                  user_info: result.user,
                }))}
              />

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Performance Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <GradeDistribution
                    courses={filteredData.map((result) => ({
                      course_id: result.course_id.toString(),
                      course_code: result.course_code,
                      course_name: result.course_title,
                      credit_load: result.credit_load,
                      finalgrade: parseFloat(result.score),
                      grade: result.grade,
                      semester: result.semester.includes("Ist Semester") ? "First" : "Second",
                      activities: [],
                      quality_point: parseFloat(result.quality_point),
                      session: result.session,
                      user_info: result.user,
                    }))}
                  />
                  <AcademicStanding
                    {...generateGPASummary(
                      filteredData.map((result) => ({
                        course_id: result.course_id.toString(),
                        course_code: result.course_code,
                        course_name: result.course_title,
                        credit_load: result.credit_load,
                        finalgrade: parseFloat(result.score),
                        grade: result.grade,
                        semester: result.semester.includes("Ist Semester") ? "First" : "Second",
                        activities: [],
                        quality_point: parseFloat(result.quality_point),
                        session: result.session,
                        user_info: result.user,
                      }))
                    )}
                  />
                </div>
              </div>
              <ReportFooter
                semester={selectedSemester === "Ist Semester" ? "First" : "Second"}
                academicYear={selectedSession}
              />
            </div>
          </div>
        )}
    </div>
  );
}

