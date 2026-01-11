import React from 'react'

const DiscussionsPage = () => {
    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Discussions</h2>
            <div className="space-y-4">
                {[
                    { title: 'Question about Chapter 5', course: 'Math 101', replies: 8, lastPost: '2 hours ago' },
                    { title: 'Lab Safety Guidelines', course: 'Chemistry', replies: 3, lastPost: '1 day ago' },
                    { title: 'Physics Problem Help', course: 'Physics', replies: 12, lastPost: '3 hours ago' }
                ].map((discussion, index) => (
                    <div key={index} className="p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-gray-900">{discussion.title}</h3>
                            <span className="text-sm text-gray-600">{discussion.course}</span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span>{discussion.replies} replies</span>
                            <span>Last post: {discussion.lastPost}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default DiscussionsPage