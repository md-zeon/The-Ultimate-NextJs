"use client"

import { createTicket } from "@/lib/actions";
// import { useRouter } from "next/navigation";
import React from "react";

const ClientPage = () => {
    // const router = useRouter();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        // call server action here
        await createTicket(formData);

        // router.push("/");
    }
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 max-w-5xl mx-auto">
        <h1 className="text-5xl font-bold text-left w-full">
            New Ticket (Client)
        </h1>
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4 mt-8">
                <div className="space-y-2">
                    <label htmlFor="name" className="font-medium">
                        Name
                    </label>
                    <input type="text" name="name" className="w-full h-10 px-3 border border-zinc-400" />
                </div>
                <div className="space-y-2">
                    <label htmlFor="type" className="font-medium">
                        Type
                    </label>
                    <input type="text" name="type" className="w-full h-10 px-3 border border-zinc-400" />
                </div>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                    Create Ticket
                </button>   
        </form>
    </main>
  )
}

export default ClientPage