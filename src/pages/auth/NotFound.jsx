import { Box, Paper, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { SearchOff } from "@mui/icons-material";

const NotFound = () => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const homePath = !token
    ? "/login"
    : user?.role?.toLowerCase() === "employee"
      ? "/employee/profile"
      : "/admin/dashboard";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f8fafc",
        p: 2,
      }}
    >
      <Paper
        sx={{
          maxWidth: 450,
          width: "100%",
          p: 4,
          textAlign: "center",
          borderRadius: 3,
        }}
      >
        <SearchOff sx={{ fontSize: 75, color: "primary.main" }} />

        <Typography variant="h2" fontWeight={700} mt={1}>
          404
        </Typography>

        <Typography variant="h6" fontWeight={600}>
          Page Not Found
        </Typography>

        <Typography color="text.secondary" mt={1}>
          The page you are looking for does not exist or may have been moved.
        </Typography>

        <Button
          component={Link}
          to={homePath}
          variant="contained"
          sx={{ mt: 3, textTransform: "none" }}
        >
          Go to Home
        </Button>
      </Paper>
    </Box>
  );
};

export default NotFound;
