import React from "react";
import Layout from "../../components/Layout";
import SummaryCards from "./SummaryCard";
import CleaningCompliance from "./CleaningCompliance";
import WardWiseStatus from "./WardWiseStatus";
import RecentInspections from "./RecentInspections";
import BillsOverview from "./BillsOverview";
import CitizenComplaintStatus from "./CitizenComplaintStatus";
import TopComplaintCategories from "./TopComplaintCategories";
// import "./Dashboard.css";

const Dashboard = () => {
  return (
    <Layout>
      <div className="dashboard-wrapper">
        <div className="row">
          <div className="col-12">
            <SummaryCards />
          </div>
        </div>

        <div className="row mt-3">
          <div className=" col-12">
            <WardWiseStatus />
          </div>
        </div>

        <div className="row mt-3">
          <div className="col-lg-5 col-12">
            <TopComplaintCategories />
          </div>
          <div className="col-lg-7 col-12 mt-lg-0 mt-3">
            <RecentInspections />
          </div>
        </div>

        <div className="row mt-3">
          <div className="col-lg-4 col-12">
            <CleaningCompliance />
          </div>
          <div className="col-lg-4 col-12 mt-lg-0 mt-3">
            <CitizenComplaintStatus />
          </div>
          <div className="col-lg-4 col-12 mt-lg-0 mt-3">
            <BillsOverview />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
