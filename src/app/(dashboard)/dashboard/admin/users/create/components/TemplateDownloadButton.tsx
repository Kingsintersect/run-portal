"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import * as XLSX from "xlsx";

export default function TemplateDownloadButton() {
    // Download sample template
    const downloadSampleTemplate = () => {
        // Sample data for user upload template
        const sampleData = [
            {
                first_name: "John",
                last_name: "Doe",
                other_name: "other",
                email: "user1@example.com",
                reference: "RAND123JIBrish",
                password: "password",
                phone_number: "07035672342",
                country: "Nigeria",
                state: "Euugu",
                role: "STUDENT",
                application_paymentStatus: "",
            },
            {
                email: "user2@example.com",
                first_name: "Jane",
                last_name: "Smith",
                other_name: "other",
                phone_number: "07035672342",
                country: "Nigeria",
                state: "Euugu",
                role: "STUDENT",
                reference: "RAND123JIBrish",
                application_paymentStatus: "",
            }
        ];

        const worksheet = XLSX.utils.json_to_sheet(sampleData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
        XLSX.writeFile(workbook, "user_upload_template.xlsx");
    };

    return (
        <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={downloadSampleTemplate}
        >
            <Download size={16} />
            <span>Get Template</span>
        </Button>
    );
}