import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";

import Header from "../components/common/Header";
import Footer from "../components/common/Footer";

const PublicLayout = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Header />

      <Box
        component="main"
        sx={{
          flex: 1,
          width: "100%",
        }}
      >
        <Outlet />
      </Box>

      <Footer />
    </Box>
  );
};

export default PublicLayout;
