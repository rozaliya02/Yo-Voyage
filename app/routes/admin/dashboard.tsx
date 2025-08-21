import React from "react";
import { Header, StatsCard, TripCard } from '../../../components'
const Dashboard = () => {

  const user = {
    name: "John",
  }

  const dashboardStats = {
    totalUsers: 12450,
    usersJoined: {currentMonth: 218, lastMonth: 176},
    totalTrips: 3210,
    tripsBooked: {currentMonth: 150, lastMonth: 250},
    userRole: { total: 62, currentMonth: 25, lastMonth: 15 },
  }

  const { totalUsers, usersJoined, totalTrips, tripsBooked, userRole } = dashboardStats;
  return (
    <main className="dashboard wrapper">
      <Header title={`Welcome ${user?.name || 'Guest' }`}
      description='Track your trips, manage bookings, and explore new destinations with ease.' /> 

      <section className="flex flex-col gap-6">

        <div className="grid grid-cols-1 md-grid-cols-3 gap-6 w-full">
          <StatsCard headerTittle = 'Total Users'
          total = {totalUsers}
          currentMonth = {usersJoined.currentMonth}
          lastMonth = {usersJoined.lastMonth}
           />

            <StatsCard headerTittle = 'Total Trips'
          total = {totalTrips}
          currentMonth = {tripsBooked.currentMonth}
          lastMonth = {tripsBooked.lastMonth}

           /> <StatsCard headerTittle = 'Active users Today'
          total = {userRole.total}
          currentMonth = {userRole.currentMonth}
          lastMonth = {userRole.lastMonth}
           />
        </div>
      </section>
      
      <TripCard />
    </main>


  );
}

export default Dashboard;