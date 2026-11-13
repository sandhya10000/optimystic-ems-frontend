import { Box, Typography, Paper, Grid } from "@mui/material";

const Reports = () => {
  return (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={1}>
        Reports & Analytics
      </Typography>

      <Typography color="text.secondary" mb={3}>
        View employee, attendance and payroll reports.
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography color="text.secondary">Total Employees</Typography>
            <Typography variant="h4" fontWeight={700}>
              125
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography color="text.secondary">Attendance</Typography>
            <Typography variant="h4" fontWeight={700}>
              89.5%
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography color="text.secondary">Monthly Payroll</Typography>
            <Typography variant="h4" fontWeight={700}>
              ₹5.3L
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Reports;
