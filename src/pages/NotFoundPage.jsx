import React from "react";
import Navbar from "../components/Navbar";
import ErrorPage from "./ErrorPage"; 

const NotFoundPage = () => {
  return (
    <>
      <Navbar />
      <ErrorPage
        code="404"
        title="Page Not Found"
        description="Oops! The page you’re looking for doesn’t exist or has been moved."
      />
    </>
  );
};

export default NotFoundPage;
