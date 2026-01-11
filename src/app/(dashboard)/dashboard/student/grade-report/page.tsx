
import { StudentHeader } from './components/StudentHeader';
import { StudentInfo } from './components/StudentInfo';
import { CourseTable } from './components/CourseTable';
import { GradeDistribution } from './components/GradeDistribution';
import { AcademicStanding } from './components/AcademicStanding';
import { ReportFooter } from './components/ReportFooter';
import { verifySession } from '@/lib/server.utils';
import { loginSessionKey } from '@/lib/definitions';
import { getStudentGradeReport } from './api/studentGradeReport.api';
import { generateGPASummary, processGradeReport } from '@/lib/gpa.utils';

const StudentGradeReport = async () => {
    const session = await verifySession(loginSessionKey);
    const gradeReport = await getStudentGradeReport(session.user.email, session.access_token);
    const processedGradeReport = processGradeReport(gradeReport);

    const summary = generateGPASummary(processedGradeReport.courses);
    const { gpa, totalCredits, totalQualityPoints, degreeClass, academicStanding } = summary;

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
                <StudentHeader
                    gradeReport={processedGradeReport}
                    gpa={gpa}
                    totalCredits={totalCredits}
                    totalQualityPoints={totalQualityPoints}
                    degreeClass={degreeClass}
                />
                <StudentInfo />
                <CourseTable courses={processedGradeReport.courses} />

                <div className="p-6 bg-gray-50 border-t">
                    <h3 className="text-lg font-semibold mb-4">Performance Summary</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <GradeDistribution courses={processedGradeReport.courses} />
                        <AcademicStanding
                            gpa={gpa}
                            degreeClass={degreeClass}
                            academicStanding={academicStanding}
                        />
                    </div>
                </div>

                <ReportFooter
                    semester={processedGradeReport.semester}
                    academicYear={processedGradeReport.academicYear}
                />
            </div>
        </div>
    );
};

export default StudentGradeReport;
