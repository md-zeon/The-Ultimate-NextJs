import React from 'react'

const UserPage = ({ params } : { params : { id: string} }) => {
    const { id } = params;
  return (
    <div>
        <h1 className='text-3xl'>User Profile {id}</h1>
    </div>
  )
}

export default UserPage