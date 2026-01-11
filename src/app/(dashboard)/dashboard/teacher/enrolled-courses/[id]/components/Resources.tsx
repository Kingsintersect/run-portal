import { Download, FileText, Link, Video } from 'lucide-react';
import React from 'react'
import { resourcesData } from '../../../data';

export const Resources = () => {
    const getFileIcon = (type) => {
        switch (type) {
            case 'pdf': return <FileText className="w-5 h-5 text-red-500" />;
            case 'video': return <Video className="w-5 h-5 text-blue-500" />;
            case 'link': return <Link className="w-5 h-5 text-green-500" />;
            default: return <FileText className="w-5 h-5 text-gray-500" />;
        }
    };
    return (
        <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold">Course Resources</h2>
            </div>
            <div className="divide-y divide-gray-200">
                {resourcesData.map(resource => (
                    <div key={resource.id} className="p-6 hover:bg-gray-50">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                {getFileIcon(resource.type)}
                                <div>
                                    <h3 className="font-medium text-gray-900">{resource.name}</h3>
                                    <p className="text-sm text-gray-600">
                                        {resource.type === 'link' ? 'External Link' : `${resource.size} • `}
                                        Uploaded {resource.uploadDate}
                                    </p>
                                </div>
                            </div>
                            <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-800">
                                <Download className="w-4 h-4" />
                                <span>Download</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
