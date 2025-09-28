import { updateTicket } from "@/lib/actions";
import { readFile } from "@/lib/helpers";
import { redirect } from "next/navigation";
import React from "react";

const UpdatePage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const allTickets = readFile();
  const ticket = allTickets[id];
  if (!ticket) redirect("/");

  async function handleUpdate(formData: FormData) {
    "use server";
    // call server action here
    await updateTicket(Number(id), formData);
    redirect("/");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 max-w-5xl mx-auto">
      <h1 className="text-5xl font-bold text-left w-full">
        Update Ticket ({id})
      </h1>
      <form action={handleUpdate} className="w-full flex flex-col gap-4 mt-8">
        <div className="space-y-2">
          <label htmlFor="name" className="font-medium">
            Name
          </label>
          <input
            type="text"
            name="name"
            className="w-full h-10 px-3 border border-zinc-400"
            defaultValue={ticket?.name}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="type" className="font-medium">
            Type
          </label>
          <input
            type="text"
            name="type"
            className="w-full h-10 px-3 border border-zinc-400"
            defaultValue={ticket?.type}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="status" className="font-medium">
            Status
          </label>
          <input
            type="text"
            name="status"
            className="w-full h-10 px-3 border border-zinc-400"
            defaultValue={ticket?.status}
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Update Ticket
        </button>
      </form>
    </main>
  );
};

export default UpdatePage;
