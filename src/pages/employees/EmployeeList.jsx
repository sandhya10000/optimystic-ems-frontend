import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from "@mui/material";

import { Add, Search } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const EmployeeList = () => {
  const navigate = useNavigate();

  // Temporary sample data
  const employees = [
    {
      id: "EMP001",
      name: "Rahul Sharma",
      email: "rahul@example.com",
      department: "IT",
      designation: "Frontend Developer",
      status: "Active",
    },
    {
      id: "EMP002",
      name: "Priya Verma",
      email: "priya@example.com",
      department: "HR",
      designation: "HR Executive",
      status: "Active",
    },
  ];

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Box>
          <Typography variant="h5" fontWeight={700}>
            Employees
          </Typography>

          <Typography color="text.secondary">
            Manage all employee records
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate("/admin/employees/add")}
        >
          Add Employee
        </Button>
      </Box>

      <Paper sx={{ p: 2, borderRadius: 3 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search employees..."
          InputProps={{
            startAdornment: <Search sx={{ mr: 1 }} />,
          }}
          sx={{ mb: 2, maxWidth: 350 }}
        />

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Employee ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Designation</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {employees.map((employee) => (
                <TableRow key={employee.id} hover>
                  <TableCell>{employee.id}</TableCell>
                  <TableCell>{employee.name}</TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>{employee.designation}</TableCell>
                  <TableCell>
                    <Chip
                      label={employee.status}
                      color="success"
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default EmployeeList;
