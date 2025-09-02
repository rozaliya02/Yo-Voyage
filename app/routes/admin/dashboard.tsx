import React from "react";
import { Header, StatsCard, TripCard } from '../../../components';
import { dashboardStats, user, allTrips } from "../../constants";
import {getUser} from "../../appwrite/auth";
import type { Route } from "./+types/dashboard";

const { totalUsers, usersJoined, totalTrips, tripsBooked, userRole } = dashboardStats;
 
export const clientLoader = async() => await getUser();
const Dashboard = ({loaderData} : Route.ComponentProps) => {
    const user = loaderData as User | null;
    return (
      <main className="dashboard wrapper">
        <Header title={`Welcome ${user?.name || 'Guest' }`}
        description='Track your trips, manage bookings, and explore new destinations with ease.' /> 

        <section className="flex flex-col gap-6">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            <StatsCard 
            headerTitle = 'Total Users'
            total = {totalUsers}
            currentMonthCount = {usersJoined.currentMonth}
            lastMonthCount = {usersJoined.lastMonth}
            />
              <StatsCard 
              headerTitle = 'Total Trips'
            total = {totalTrips}
            currentMonthCount = {tripsBooked.currentMonth}
            lastMonthCount = {tripsBooked.lastMonth}

            /> <StatsCard headerTitle = 'Active users Today'
            total = {userRole.total}
            currentMonthCount = {userRole.currentMonth}
            lastMonthCount = {userRole.lastMonth}
            />
          </div>
        </section>

        <section className="container">
          <h1 className="text-xl font-semibold text-dark-100">Created Trips</h1>
          <div className="trip-grid">
            {allTrips.slice(0, 4).map(({id, name, imageUrls, itinerary, tags, estimatedPrice}) => (
              <TripCard key={id}
                id={id.toString()}
                name={name}
                imageUrl={imageUrls[0]}
                location={itinerary?.[0]?.location ?? ''}
                tags={tags}
                estimatedPrice={estimatedPrice} 
              />
            ))}
          </div>
        </section>
      </main>
    );
  }

  export default Dashboard;