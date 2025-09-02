import { Header } from "components"

const Trips = () => {
    return (
         <main className="flex flex-col gap-10 pb-20 wrapper">
            <Header title='Trips' 
            description='View and edit AI travel plans'
            ctaText='Create a trip'
            ctaUrl="/trips/create"
            />
        </main>
    )
}

export default Trips
