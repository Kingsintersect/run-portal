import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { parseExcelOrCSV } from './FileService';
import { CloudUploadIcon } from 'lucide-react';
import { UserData } from '@/hooks/useCreateUsers';

interface FileUploaderProps {
    onFileDataReceived: (data: UserData[], file: File) => void;
    disabled?: boolean;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileDataReceived, disabled = false }) => {
    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) return;

        const file = acceptedFiles[0];

        try {
            // Parse the file
            const data = await parseExcelOrCSV(file);

            // Pass the data back to parent component
            onFileDataReceived(data, file);
        } catch (error) {
            console.error('Error parsing file:', error);
            // Handle error - could trigger a notification here
        }
    }, [onFileDataReceived]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'text/csv': ['.csv'],
            'application/vnd.ms-excel': ['.xls'],
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
        },
        maxFiles: 1,
        disabled: disabled
    });

    return (
        <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-10 text-center transition-colors duration-300 cursor-pointer
        ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'}
        ${disabled ? 'opacity-60 cursor-not-allowed' : 'opacity-100'}`}
        >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center justify-center space-y-4">
                <CloudUploadIcon className="h-16 w-16 text-gray-400" />
                <div className="space-y-2">
                    <h3 className="text-lg font-medium">
                        {disabled ? 'Please select program and course first' : 'Drag & drop your file here'}
                    </h3>
                    <p className="text-sm text-gray-500">
                        {disabled ?
                            'File upload is disabled until selections are complete' :
                            'Support for CSV, XLS, XLSX files of users'}
                    </p>
                </div>
                {!disabled && (
                    <button
                        type="button"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                    >
                        Browse Files
                    </button>
                )}
            </div>
        </div>
    );
};

export default FileUploader;
