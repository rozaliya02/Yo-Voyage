import React from "react";
import { Header } from '../../../components'
const Dashboard = () => {

  const user = {
    name: "John",
  }
  return (
    <main className="dashboard wrapper">
      <Header title={`Welcome ${user?.name || 'Guest' }`}
      description='Track your trips, manage bookings, and explore new destinations with ease.' /> 

      Dashboard Page Component
    </main>


  );
}

export default Dashboard;