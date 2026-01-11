import { PDFDocument, StandardFonts, rgb, degrees } from "pdf-lib";
import { saveAs } from "file-saver";

type CourseResult = {
  course_code: string;
  course_title: string;
  credit_load: number;
  grade: string;
  quality_point: string;
  score: string;
};

type StudentInfo = {
  first_name: string;
  last_name: string;
  reg_number: string;
  department_id: number;
  faculty_id: number;
  program: string;
  level: string;
};

export const generateResultPdf = async (
  filteredData: CourseResult[],
  studentInfo: StudentInfo,
  semester: string,
  session: string,
  gpaData: {
    gpa: number;
    totalCredits: number;
    totalQualityPoints: number;
    degreeClass: string;
  }
) => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4 size

  // Load logo with error handling
  let logoImage;
  try {
    const logoUrl = "/logo/logo_image_copy-removebg-preview.png";
    const logoResponse = await fetch(logoUrl);
    const logoBytes = await logoResponse.arrayBuffer();
    logoImage = await pdfDoc.embedPng(logoBytes);
  } catch (error) {
    console.warn("Logo not found or failed to load", error);
  }

  // Set up fonts
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const watermarkText = "CHUKWUEMEKA ODUMEGWU OJUKWU UNIVERSITY";
  const watermarkFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Header Section with Logo
  if (logoImage) {
    page.drawImage(logoImage, {
      x: 220,
      y: 720,
      width: 130,
      height: 130,
    });
  }

  page.drawText(watermarkText, {
    x: 100,
    y: 700,  
    size: 40,
    font: watermarkFont,
    color: rgb(0, 0, 0),  
    rotate: degrees(-45),
    opacity: 0.15  
});

  // University Information
  page.drawText("CHUKWUEMEKA ODUMEGWU OJUKWU UNIVERSITY", {
    x: 140,
    y: 700,
    size: 14,
    font: boldFont,
    color: rgb(0, 0, 0),
  });

  page.drawText("OFFICE OF THE REGISTRAR", {
    x: 200,
    y: 680,
    size: 12,
    font: boldFont,
  });

  page.drawText("P.M.B 6059 IGBARIAM, ANAMBRA STATE, NIGERIA", {
    x: 150,
    y: 660,
    size: 10,
    font: boldFont,
  });

  page.drawText("STUDENT'S SEMESTER ACADEMIC RESULT", {
    x: 180,
    y: 640,
    size: 12,
    font: boldFont,
    color: rgb(0.5, 0, 0),
  });

  // Student Information Table
  const startY = 630;
  const col1 = 50;
  const col2 = 250;
  const col3 = 450;

  // Draw table borders
  page.drawRectangle({
    x: col1,
    y: startY - 80,
    width: 500,
    height: 80,
    borderWidth: 1,
    borderColor: rgb(0, 0, 0),
  });

  // Draw vertical lines
  [col2, col3].forEach((x) => {
    page.drawLine({
      start: { x, y: startY },
      end: { x, y: startY - 80 },
      thickness: 1,
      color: rgb(0, 0, 0),
    });
  });

  // Draw horizontal lines
  [startY - 40, startY - 60].forEach((y) => {
    page.drawLine({
      start: { x: col1, y },
      end: { x: col1 + 500, y },
      thickness: 1,
      color: rgb(0, 0, 0),
    });
  });

  // Student Info Headers
  page.drawText("Name of Student", {
    x: col1 + 10,
    y: startY - 15,
    size: 10,
    font: boldFont,
  });
  page.drawText("Reg. No", {
    x: col3 + 10,
    y: startY - 15,
    size: 10,
    font: boldFont,
  });
  page.drawText("Faculty", {
    x: col2 + 10,
    y: startY - 15,
    size: 10,
    font: boldFont,
  });
  page.drawText("Program", {
    x: col1 + 10,
    y: startY - 55,
    size: 10,
    font: boldFont,
  });
  page.drawText("Level", {
    x: col3 + 10,
    y: startY - 55,
    size: 10,
    font: boldFont,
  });
  page.drawText("Department", {
    x: col2 + 10,
    y: startY - 55,
    size: 10,
    font: boldFont,
  });

  // Student Data
  page.drawText(`${studentInfo.last_name} ${studentInfo.first_name}`, {
    x: col1 + 10,
    y: startY - 35,
    size: 10,
    font: font,
  });

  page.drawText(studentInfo.reg_number, {
    x: col3 + 10,
    y: startY - 35,
    size: 10,
    font: font,
  });

  page.drawText("ARTS AND HUMANITIES", {
    x: col2 + 10,
    y: startY - 35,
    size: 10,
    font: font,
  });

  page.drawText(studentInfo.program || "DEGREE", {
    x: col1 + 10,
    y: startY - 75,
    size: 10,
    font: font,
  });

  const levelNumber = studentInfo.level
    ? studentInfo.level.match(/\d+/)?.[0] || "100"
    : "100";
  page.drawText(`${levelNumber} LEVEL`, {
    x: col3 + 10,
    y: startY - 75,
    size: 10,
    font: font,
  });

  page.drawText("ECONOMICS & SOCIOLOGY", {
    x: col2 + 10,
    y: startY - 75,
    size: 10,
    font: font,
  });

  // Semester Header
  page.drawText(`${session} ${semester.toUpperCase()} SEMESTER`, {
    x: col1,
    y: startY - 100,
    size: 11,
    font: boldFont,
    color: rgb(0, 0, 0.5),
  });

  // Course Results Table
  const courseHeaderY = startY - 120;
  const colWidths = [80, 180, 50, 50, 50, 50]; // Adjusted column widths

  // Draw table borders
  page.drawRectangle({
    x: col1,
    y: courseHeaderY - 20 - filteredData.length * 20,
    width: 500,
    height: 20 + filteredData.length * 20,
    borderWidth: 1,
    borderColor: rgb(0, 0, 0),
  });

  // Draw column lines
  let xPos = col1;
  for (let i = 0; i < colWidths.length; i++) {
    xPos += colWidths[i];
    page.drawLine({
      start: { x: xPos, y: courseHeaderY },
      end: { x: xPos, y: courseHeaderY - 20 - filteredData.length * 20 },
      thickness: 1,
      color: rgb(0, 0, 0),
    });
  }

  // Draw headers with proper spacing
  xPos = col1 + 5;
  const headers = [
    "Course Code",
    "Title of Course",
    "Units",
    "Grade",
    "Score(%)",
    "Points",
  ];
  headers.forEach((header, i) => {
    page.drawText(header, {
      x: xPos,
      y: courseHeaderY - 15,
      size: 10,
      font: boldFont,
    });
    xPos += colWidths[i];
  });

  // Course Results
  let courseY = courseHeaderY - 20;
  filteredData.forEach((course, index) => {
    xPos = col1 + 5;

    // Draw course data
    const fields = [
      course.course_code,
      course.course_title,
      course.credit_load.toString(),
      course.grade,
      course.score.endsWith(".00")
        ? course.score.replace(".00", "%")
        : `${course.score}%`,
      course.quality_point,
    ];

    fields.forEach((field, i) => {
      page.drawText(field, {
        x: xPos,
        y: courseY - 15,
        size: 10,
        font: font,
      });
      xPos += colWidths[i];
    });

    // Draw GPA in a separate column to prevent collision
    if (index === filteredData.length - 1) {
      page.drawText("G.P.A.", {
        x: xPos,
        y: courseHeaderY - 15,
        size: 10,
        font: boldFont,
      });
      page.drawText(gpaData.gpa.toFixed(2), {
        x: col1 + 470,
        y: courseY - 15,
        size: 10,
        font: font,
      });
    }

    // Draw row line
    page.drawLine({
      start: { x: col1, y: courseY - 20 },
      end: { x: col1 + 500, y: courseY - 20 },
      thickness: 0.5,
      color: rgb(0, 0, 0),
    });

    courseY -= 20;
  });

  // Grade Legend Table
  const legendY = courseY - 40;
  page.drawRectangle({
    x: col1,
    y: legendY - 60,
    width: 500,
    height: 60,
    borderWidth: 1,
    borderColor: rgb(0, 0, 0),
  });

  // Draw column lines
  page.drawLine({
    start: { x: col1 + 250, y: legendY },
    end: { x: col1 + 250, y: legendY - 60 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });

  // Draw row lines
  page.drawLine({
    start: { x: col1, y: legendY - 20 },
    end: { x: col1 + 500, y: legendY - 20 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });

  page.drawLine({
    start: { x: col1, y: legendY - 40 },
    end: { x: col1 + 500, y: legendY - 40 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });

  // Legend Content
  const grades = [
    { text: "A - Excellent: 5 points", x: col1 + 10, y: legendY - 15 },
    { text: "B - Very Good: 4 points", x: col1 + 260, y: legendY - 15 },
    { text: "C - Good: 3 points", x: col1 + 10, y: legendY - 35 },
    { text: "D - Pass: 2 points", x: col1 + 260, y: legendY - 35 },
    { text: "E - Poor Pass: 1 point", x: col1 + 10, y: legendY - 55 },
    { text: "F - Fail: 0 points", x: col1 + 260, y: legendY - 55 },
  ];

  grades.forEach((grade) => {
    page.drawText(grade.text, {
      x: grade.x,
      y: grade.y,
      size: 10,
      font: font,
    });
  });

  // Footer
  page.drawText("Official Transcript - Not Valid Without University Seal", {
    x: 150,
    y: 50,
    size: 10,
    font: boldFont,
  });

  page.drawText(`Generated on: ${new Date().toLocaleDateString()}`, {
    x: 220,
    y: 30,
    size: 10,
    font: font,
  });

  // Save PDF
  const pdfBytes = await pdfDoc.save();
  const uint8Array = new Uint8Array(pdfBytes);
  const blob = new Blob([uint8Array], { type: "application/pdf" });
  saveAs(
    blob,
    `Transcript_${studentInfo.reg_number}_${session}_${semester}_Semester.pdf`
  );
};

//  const pdfBytes = await pdfDoc.save();
//   const uint8Array = new Uint8Array(pdfBytes);
//   const blob = new Blob([uint8Array], { type: 'application/pdf' });
//   saveAs(blob, `Transcript_${studentInfo.reg_number}_${session}_${semester}_Semester.pdf`);
