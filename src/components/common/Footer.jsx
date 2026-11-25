import { Box, Container, Typography, Stack, Link } from "@mui/material";

import { Link as RouterLink } from "react-router-dom";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#0b403d",
        color: "#ffffff",
        mt: "auto",
        py: 4,
      }}
    >
      <Container maxWidth="xl">
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", md: "center" }}
          spacing={3}
        >
          <Box>
            <Typography variant="h6" fontWeight={800} sx={{ color: "#ffffff" }}>
              EMS
              <Box component="span" sx={{ color: "#f59e0b", ml: 0.5 }}>
                Portal
              </Box>
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: "#d2e5e1",
                mt: 1,
                maxWidth: 360,
              }}
            >
              A smarter way to manage employees, attendance, assets, and
              payroll.
            </Typography>
          </Box>
        </Stack>

        <Box
          sx={{
            borderTop: "1px solid rgba(255,255,255,0.18)",
            mt: 3,
            pt: 2,
          }}
        >
          <Typography
            variant="body2"
            textAlign="center"
            sx={{ color: "#d2e5e1" }}
          >
            © {new Date().getFullYear()} EMS Portal. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
