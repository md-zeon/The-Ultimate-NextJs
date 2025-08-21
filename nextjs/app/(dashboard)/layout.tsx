import React from 'react'

const DashboardLayout = ({ children } : { children : React.ReactNode }) => {
  return (
    <div>
        <h1 className='text-3xl'>DashboardLayout</h1>
        {children}
    </div>
  )
}

export default DashboardLayout