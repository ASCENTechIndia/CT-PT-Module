import { Navigate } from "react-router-dom";

const HomeRedirect = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const designation = user?.designation;

  switch (designation) {
    case "Supervisor":
      return <Navigate to="/supervisor-complaint-list" replace />;

    case "Sanitary Inspector":
      return <Navigate to="/all-complaint" replace />;

    default:
      return <Navigate to="/login" replace />;
  }
};

export default HomeRedirect;