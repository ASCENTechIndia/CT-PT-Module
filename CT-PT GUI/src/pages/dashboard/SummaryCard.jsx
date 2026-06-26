import React from "react";
import {
  Toilet,
  Users,
  ClipboardCheck,
  Hourglass,
  BadgeCheck,
  BadgeX,
  Gavel,
} from "lucide-react";

const summaryData = [
  {
    id: 1,
    label: "Total Toilets",
    value: "2,458",
    sub: "CT/PT Units",
    icon: Toilet,
    colorClass: "card-blue",
  },
  {
    id: 2,
    label: "Total Vendors",
    value: "126",
    sub: "Active Vendors",
    icon: Users,
    colorClass: "card-green",
  },
  {
    id: 3,
    label: "Today's Inspections",
    value: "89",
    sub: "Inspections",
    icon: ClipboardCheck,
    colorClass: "card-purple",
  },
  {
    id: 4,
    label: "Pending Verification",
    value: "32",
    sub: "Pending",
    icon: Hourglass,
    colorClass: "card-orange",
  },
  {
    id: 5,
    label: "Approved Bills",
    value: "₹18,75,450",
    sub: "Total Amount",
    icon: BadgeCheck,
    colorClass: "card-teal",
  },
  {
    id: 6,
    label: "Rejected Bills",
    value: "₹2,35,800",
    sub: "Total Amount",
    icon: BadgeX,
    colorClass: "card-red",
  },
  {
    id: 7,
    label: "Total Fine",
    value: "₹1,24,300",
    sub: "Total Amount",
    icon: Gavel,
    colorClass: "card-brown",
  },
];

const SummaryCards = () => {
  return (
    <div className="row g-2">
      {summaryData.map(({ id, label, value, sub, icon: Icon, colorClass }) => (
        <div key={id} className="col">
          <div className={`summary-card ${colorClass}`}>
            <div className="summary-card-icon">
              <Icon size={18} strokeWidth={1.8} />
            </div>
            <div className="summary-card-body">
              <span className="summary-card-label">{label}</span>
              <span className="summary-card-value">{value}</span>
              <span className="summary-card-sub">{sub}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;
