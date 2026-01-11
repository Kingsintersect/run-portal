import React from 'react'

export default function SettingsPage() {
    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Settings</h2>
            <div className="space-y-6">
                <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Profile Settings</h3>
                    <p className="text-sm text-gray-600">Update your profile information and preferences</p>
                </div>
                <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Notification Settings</h3>
                    <p className="text-sm text-gray-600">Manage how you receive notifications</p>
                </div>
                <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Privacy Settings</h3>
                    <p className="text-sm text-gray-600">Control your privacy and data sharing preferences</p>
                </div>
            </div>
        </div>
    );
}
