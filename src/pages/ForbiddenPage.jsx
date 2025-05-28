import React from "react";
import Navbar from "../components/Navbar";
import ErrorPage from "./ErrorPage"; 

const ForbiddenPage = () => {
  return (
    <>
      <Navbar />
      <ErrorPage
        code="403"
        title="Access Forbidden"
        description="ou don’t have permission to access this page."
      />
    </>
  );
};

export default ForbiddenPage;
