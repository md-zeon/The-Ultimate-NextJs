import React from 'react'

const Books = async () => {
    const response = await fetch("http://localhost:3000/api/books");
    const data = await response.json();
    // console.log(data);
  return (
    <main>
        <pre>
            {JSON.stringify(data, null, 2)}
        </pre>
    </main>
  )
}

export default Books