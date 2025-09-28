import tickets from "@/app/database";
import { NextRequest, NextResponse } from "next/server";

// api/tickets/search?query=bug&status=open&type=feature
// { query: "bug", status: "open", type: "feature" }

export async function GET(request: NextRequest, { params }: { params: Promise<{id: string}>}) {
    const searchParams = request.nextUrl.searchParams;

    const query = searchParams.get("query");
    const status = searchParams.get("status");
    const type = searchParams.get("type");

    // Perform search logic here
    let filteredTickets = tickets;
    
    if (query) {
        filteredTickets = filteredTickets.filter(ticket => 
            ticket.name.toLowerCase().includes(query.toLowerCase())
        );
    }
    if (status) {
        filteredTickets = filteredTickets.filter(ticket => 
            ticket.status.toLowerCase() === status.toLowerCase()
        );
    }
    if (type) {
        filteredTickets = filteredTickets.filter(ticket => 
            ticket.type.toLowerCase() === type.toLowerCase()
        );
    }

    return NextResponse.json(filteredTickets);
}