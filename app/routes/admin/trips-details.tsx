import { Header } from "components"
import type { LoaderFunctionArgs } from "react-router"
import { getTripById } from "~/appwrite/trips";
import type { Route } from "./+types/trips-details";
import { parseTripData } from "~/lib/utils";

export const loader = async ({params} : LoaderFunctionArgs) => {
    const {tripId} = params;

    if(!tripId) throw new Error ('Trip ID is required');

        const trip = await getTripById(tripId);

        return trip;
}

const TripsDetails = ({loaderData} : Route.ComponentProps) => {

    console.log(loaderData);
    
    const tripData = parseTripData(loaderData?.trip?.TripsDetails);

    const {name } = tripData || {};


    return (
        <main className="travel-detail wrapper">
            <Header title="Trip Details" description="View and edit AI-generated travel plans"/>
            <section>
                <header className="p-40-semibold text-dark-100"><h1>{name}</h1></header>
            </section>
        
        </main>
        
    )
}

export default TripsDetails