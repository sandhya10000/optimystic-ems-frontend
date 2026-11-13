import { Box, Paper, Typography, Button } from "@mui/material";
import { Block } from "@mui/icons-material";
import { Link } from "react-router-dom";

const Unauthorized = () => {
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
        <Block sx={{ fontSize: 75, color: "error.main" }} />

        <Typography variant="h4" fontWeight={700} mt={2}>
          403
        </Typography>

        <Typography variant="h6" fontWeight={600} mt={1}>
          Access Denied
        </Typography>

        <Typography color="text.secondary" mt={1}>
          You do not have permission to access this page. Please contact your
          administrator if you think this is a mistake.
        </Typography>

        <Button
          component={Link}
          to="/login"
          variant="contained"
          sx={{ mt: 3, textTransform: "none" }}
        >
          Back to Login
        </Button>
      </Paper>
    </Box>
  );
};

export default Unauthorized;
