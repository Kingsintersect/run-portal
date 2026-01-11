import React from 'react'

export const WelcomeCard = ({ user }) => {
    return (
        <div className="text-center mb-12" >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Your Admission Journey!</h2>
            <p className="text-xl text-gray-600 mb-2">Hello <span className="text-site-a-dark font-bold">{user?.first_name}</span>, you're just a few steps away from joining our university.</p>
            <p className="text-gray-500">Follow the simple process below to complete your admission application.</p>
            {user?.reference && <>
                <h5 className='text-base font-bold text-site-a-dark'>You can also login with your Reference  <span className="inline-block p-2 ml-5 rounded-sm bg-pink-100 text-pink-600">{user.reference}</span></h5>
                <hr className="my-5" />
            </>}
        </div>
    )
}
