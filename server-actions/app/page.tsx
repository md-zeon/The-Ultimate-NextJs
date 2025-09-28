import { deleteTicket } from "@/lib/actions";
import { readFile, Ticket } from "@/lib/helpers";

export default function Home() {
  const request = readFile();
  const result = Object.values(request) as Ticket[];
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 max-w-5xl mx-auto">
      <h1 className="text-5xl font-bold text-left w-full">Tickets</h1>
      {result.length > 0 ? (
        <div>
          <ul className="w-full mt-8 space-y-4">
            {result.map((ticket) => (
              <li
                key={ticket.id}
                className="flex items-center border border-zinc-400 p-4 rounded"
              >
                <div className="flex-1">
                  <a href={`/ticket/update/${ticket.id}`}>
                    <h2 className="text-2xl font-semibold">{ticket.name}</h2>
                  </a>
                  <p className="mt-2">Type: {ticket.type}</p>
                  <p>Status: {ticket.status}</p>
                </div>
                <form
                  action={async () => {
                    "use server";
                    await deleteTicket(ticket.id);
                  }}
                >
                  <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition">
                    Delete
                  </button>
                </form>
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
              <a href="/ticket/create">Create New Ticket (Server) </a>
            </button>
            <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition ml-4">
              <a href="/ticket/create/client">Create New Ticket (Client)</a>
            </button>
          </div>
        </div>
      ) : (
        <ul className="w-full mt-8 space-y-4">
          <li className="border border-zinc-400 p-4 rounded">
            No tickets found.
          </li>
        </ul>
      )}
    </main>
  );
}
