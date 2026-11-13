import {
  Box,
  Button,
  Container,
  Typography,
  Stack,
  Card,
  CardContent,
  Chip,
  Avatar,
  Divider,
} from "@mui/material";

// MUI Icons - Individual imports
import PersonOutline from "@mui/icons-material/PersonOutline";
import CalendarMonth from "@mui/icons-material/CalendarMonth";
import WbSunnyOutlined from "@mui/icons-material/WbSunnyOutlined";
import PaymentsOutlined from "@mui/icons-material/PaymentsOutlined";
import PersonAddAlt1 from "@mui/icons-material/PersonAddAlt1";
import TrendingUp from "@mui/icons-material/TrendingUp";
import CheckCircle from "@mui/icons-material/CheckCircle";
import ArrowForward from "@mui/icons-material/ArrowForward";
import PlayCircleOutline from "@mui/icons-material/PlayCircleOutline";

import { useNavigate } from "react-router-dom";

const features = [
  {
    icon: <PersonOutline />,
    title: "Employee Records",
    description:
      "Keep profiles, documents and job history organised and searchable.",
  },
  {
    icon: <CalendarMonth />,
    title: "Attendance Tracking",
    description:
      "Track check-ins, shifts and overtime with clear daily and monthly views.",
  },
  {
    icon: <WbSunnyOutlined />,
    title: "Leave Management",
    description:
      "Apply, approve and balance leave in a few clicks, with policy rules built in.",
  },
  {
    icon: <PaymentsOutlined />,
    title: "Payroll",
    description:
      "Run accurate payroll, generate payslips and manage deductions on time.",
  },
  {
    icon: <PersonAddAlt1 />,
    title: "Recruitment",
    description:
      "Post jobs, track candidates and onboard new hires from one pipeline.",
  },
  {
    icon: <TrendingUp />,
    title: "Performance & Reports",
    description:
      "Set goals, run reviews and export reports to make better decisions.",
  },
];

const steps = [
  {
    number: "1",
    title: "Add your team",
    description: "Import employees from a spreadsheet or add them one by one.",
  },
  {
    number: "2",
    title: "Set your policies",
    description:
      "Configure shifts, leave types, salary structures and approval flows.",
  },
  {
    number: "3",
    title: "Run everything in one place",
    description:
      "Manage daily HR work, payroll and reports from a single dashboard.",
  },
];

const stats = [
  { value: "[00K+]", label: "Employees managed" },
  { value: "[000+]", label: "Companies onboard" },
  { value: "[00%]", label: "Time saved on HR tasks" },
  { value: "[0.0/5]", label: "Customer rating" },
];

const Home = () => {
  const navigate = useNavigate();

  const goToLogin = () => navigate("/login");

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <Box sx={{ bgcolor: "#ffffff", color: "#103f3d", overflow: "hidden" }}>
      {/* HERO SECTION */}
      <Box sx={{ bgcolor: "#f1f8f7", py: { xs: 6, md: 9 } }}>
        <Container maxWidth="xl">
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "1fr 1fr",
              },
              alignItems: "center",
              gap: { xs: 5, md: 7 },
            }}
          >
            {/* Hero Content */}
            <Box>
              <Chip
                label="Employee Management System"
                sx={{
                  bgcolor: "#fff2c7",
                  color: "#875b00",
                  fontWeight: 700,
                  mb: 2.5,
                  fontSize: 12,
                }}
              />

              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: 36, sm: 44, md: 48 },
                  lineHeight: 1.13,
                  fontWeight: 800,
                  letterSpacing: -1.5,
                  color: "#103f3d",
                  mb: 2,
                }}
              >
                Manage your people, payroll and performance in{" "}
                <Box component="span" sx={{ color: "#0e8278" }}>
                  one place
                </Box>
              </Typography>

              <Typography
                sx={{
                  color: "#526779",
                  fontSize: 15,
                  lineHeight: 1.8,
                  maxWidth: 520,
                  mb: 3,
                }}
              >
                Hiring, attendance, leave, payroll and reports in a single,
                simple platform, so your team spends less time on paperwork.
              </Typography>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                <Button
                  variant="contained"
                  onClick={goToLogin}
                  sx={{
                    bgcolor: "#0e8278",
                    px: 3,
                    py: 1.4,
                    fontWeight: 700,
                    textTransform: "none",
                    "&:hover": { bgcolor: "#096c64" },
                  }}
                >
                  Start Free Trial
                  <ArrowForward sx={{ ml: 1, fontSize: 18 }} />
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<PlayCircleOutline />}
                  onClick={() => scrollToSection("how-it-works")}
                  sx={{
                    color: "#0e8278",
                    borderColor: "#0e8278",
                    px: 3,
                    py: 1.3,
                    textTransform: "none",
                  }}
                >
                  Watch Demo
                </Button>
              </Stack>

              <Stack direction="row" flexWrap="wrap" gap={2.5} mt={3}>
                {[
                  "No credit card needed",
                  "Setup in minutes",
                  "Cancel anytime",
                ].map((item) => (
                  <Typography key={item} fontSize={12} color="#526779">
                    ✓ {item}
                  </Typography>
                ))}
              </Stack>
            </Box>

            {/* Dashboard Preview */}
            <Box
              sx={{
                position: "relative",
                px: { xs: 0, sm: 2 },
                py: 3,
              }}
            >
              <Box
                sx={{
                  bgcolor: "#ffffff",
                  borderRadius: 3,
                  overflow: "hidden",
                  boxShadow: "0 20px 45px rgba(10,60,55,0.14)",
                  border: "1px solid #dce8e7",
                }}
              >
                <Box
                  sx={{
                    bgcolor: "#0b403d",
                    p: 1.5,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  {["#fb7185", "#fbbf24", "#4ade80"].map((color) => (
                    <Box
                      key={color}
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        bgcolor: color,
                      }}
                    />
                  ))}

                  <Typography color="#c9e3df" fontSize={11} ml={1}>
                    [yourcompany].ems.com
                  </Typography>
                </Box>

                <Box sx={{ p: 2.5 }}>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3, 1fr)",
                      gap: 1.2,
                    }}
                  >
                    {[
                      ["Employees", "[000]"],
                      ["Present", "[000]"],
                      ["On leave", "[00]"],
                    ].map(([label, value]) => (
                      <Box
                        key={label}
                        sx={{
                          border: "1px solid #e0e8ef",
                          borderRadius: 2,
                          p: 1.5,
                        }}
                      >
                        <Typography fontSize={11} color="text.secondary">
                          {label}
                        </Typography>
                        <Typography
                          fontWeight={800}
                          fontSize={21}
                          color="#103f3d"
                        >
                          {value}
                        </Typography>
                      </Box>
                    ))}
                  </Box>

                  <Box
                    sx={{
                      height: 235,
                      display: "flex",
                      alignItems: "flex-end",
                      gap: 1.5,
                      pt: 3,
                      px: 0.5,
                    }}
                  >
                    {[45, 58, 40, 65, 50, 28].map((height, index) => (
                      <Box
                        key={index}
                        sx={{
                          flex: 1,
                          height: `${height}%`,
                          bgcolor:
                            index === 4
                              ? "#f59e0b"
                              : index === 5
                                ? "#cbd5e1"
                                : "#117d73",
                          borderRadius: "4px 4px 0 0",
                          minWidth: 0,
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              </Box>

              {/* Floating notifications */}
              <Box
                sx={{
                  position: "absolute",
                  right: { xs: -5, sm: -12 },
                  top: "34%",
                  bgcolor: "#ffffff",
                  p: 1.5,
                  borderRadius: 2,
                  boxShadow: "0 8px 25px rgba(0,0,0,0.12)",
                  display: "flex",
                  gap: 1,
                  alignItems: "center",
                }}
              >
                <Avatar sx={{ bgcolor: "#fff2c7", color: "#a16207" }}>₹</Avatar>
                <Box>
                  <Typography fontSize={12} fontWeight={700}>
                    Payroll processed
                  </Typography>
                  <Typography fontSize={10} color="text.secondary">
                    [Month, Year]
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  position: "absolute",
                  left: { xs: -5, sm: -12 },
                  bottom: 0,
                  bgcolor: "#ffffff",
                  p: 1.5,
                  borderRadius: 2,
                  boxShadow: "0 8px 25px rgba(0,0,0,0.12)",
                  display: "flex",
                  gap: 1,
                  alignItems: "center",
                }}
              >
                <Avatar sx={{ bgcolor: "#dcfce7", color: "#15803d" }}>
                  <CheckCircle />
                </Avatar>
                <Box>
                  <Typography fontSize={12} fontWeight={700}>
                    Leave approved
                  </Typography>
                  <Typography fontSize={10} color="text.secondary">
                    [Employee name], [dates]
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* TRUSTED COMPANIES */}
      <Box sx={{ py: 4, borderBottom: "1px solid #edf1f2" }}>
        <Container maxWidth="xl">
          <Typography
            textAlign="center"
            color="text.secondary"
            fontSize={13}
            mb={2}
          >
            Trusted by growing teams
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(2, 1fr)",
                md: "repeat(5, 1fr)",
              },
              gap: 2,
            }}
          >
            {[1, 2, 3, 4, 5].map((item) => (
              <Box
                key={item}
                sx={{
                  border: "1px dashed #d5e1e8",
                  borderRadius: 2,
                  py: 1.5,
                  textAlign: "center",
                  color: "#526779",
                  fontSize: 12,
                }}
              >
                [Client logo]
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* FEATURES */}
      <Box id="features" sx={{ py: { xs: 7, md: 10 } }}>
        <Container maxWidth="xl">
          <Box textAlign="center" mb={5}>
            <Typography
              color="#0e8278"
              fontWeight={800}
              fontSize={13}
              letterSpacing={1}
            >
              FEATURES
            </Typography>

            <Typography
              variant="h3"
              fontWeight={800}
              sx={{
                fontSize: { xs: 28, md: 36 },
                mt: 1,
                color: "#103f3d",
              }}
            >
              Everything your HR team needs
            </Typography>

            <Typography color="text.secondary" mt={1}>
              From the first day to the last payslip, handle the full employee
              journey without switching tools.
            </Typography>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
              },
              gap: 2.5,
            }}
          >
            {features.map((feature) => (
              <Card
                key={feature.title}
                variant="outlined"
                sx={{
                  borderRadius: 3,
                  borderColor: "#e0e9ee",
                  boxShadow: "none",
                  transition: "0.3s",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 12px 25px rgba(0,0,0,0.06)",
                    borderColor: "#0e8278",
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Avatar
                    variant="rounded"
                    sx={{
                      bgcolor: "#e5f4f1",
                      color: "#0e8278",
                      mb: 2,
                    }}
                  >
                    {feature.icon}
                  </Avatar>

                  <Typography fontWeight={800} mb={1}>
                    {feature.title}
                  </Typography>

                  <Typography
                    fontSize={13}
                    color="text.secondary"
                    lineHeight={1.7}
                  >
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Container>
      </Box>

      {/* HOW IT WORKS */}
      <Box
        id="how-it-works"
        sx={{
          bgcolor: "#0b403d",
          py: { xs: 7, md: 9 },
          color: "#ffffff",
        }}
      >
        <Container maxWidth="xl">
          <Box textAlign="center" mb={5}>
            <Typography
              color="#f59e0b"
              fontWeight={800}
              fontSize={13}
              letterSpacing={1}
            >
              HOW IT WORKS
            </Typography>

            <Typography
              variant="h3"
              fontWeight={800}
              sx={{ fontSize: { xs: 28, md: 36 }, mt: 1 }}
            >
              Up and running in three steps
            </Typography>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "repeat(3, 1fr)",
              },
              gap: 2.5,
            }}
          >
            {steps.map((step) => (
              <Box
                key={step.number}
                sx={{
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: 3,
                  p: 3,
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: "#f59e0b",
                    color: "#103f3d",
                    fontWeight: 800,
                    width: 38,
                    height: 38,
                    mb: 2,
                  }}
                >
                  {step.number}
                </Avatar>

                <Typography fontWeight={800} mb={1}>
                  {step.title}
                </Typography>

                <Typography fontSize={13} color="#c5d9d6" lineHeight={1.7}>
                  {step.description}
                </Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* STATISTICS & TESTIMONIAL */}
      <Box id="customers" sx={{ py: { xs: 7, md: 10 } }}>
        <Container maxWidth="xl">
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "1fr 1fr",
              },
              gap: 4,
              alignItems: "stretch",
            }}
          >
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 2,
              }}
            >
              {stats.map((stat) => (
                <Card
                  key={stat.label}
                  variant="outlined"
                  sx={{
                    borderRadius: 3,
                    borderColor: "#e0e9ee",
                  }}
                >
                  <CardContent sx={{ p: 2.5 }}>
                    <Typography fontSize={29} fontWeight={800} color="#0e8278">
                      {stat.value}
                    </Typography>

                    <Typography fontSize={12} color="text.secondary">
                      {stat.label}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>

            <Box
              sx={{
                bgcolor: "#f1f8f7",
                borderRadius: 4,
                p: { xs: 3, md: 4 },
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Typography fontSize={36} fontWeight={800} color="#f59e0b">
                “
              </Typography>

              <Typography fontSize={18} lineHeight={1.7} color="#103f3d" mb={3}>
                [Customer testimonial about how EMS helped their team save time
                and stay organised.]
              </Typography>

              <Stack direction="row" spacing={1.5} alignItems="center">
                <Avatar sx={{ bgcolor: "#0e8278" }}>AB</Avatar>

                <Box>
                  <Typography fontWeight={800} fontSize={13}>
                    [Customer name]
                  </Typography>
                  <Typography fontSize={11} color="text.secondary">
                    [Role, Company]
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* CTA SECTION */}
      <Container maxWidth="xl" sx={{ pb: 8 }}>
        <Box
          sx={{
            bgcolor: "#0e8278",
            color: "#ffffff",
            borderRadius: 4,
            p: { xs: 3, md: 5 },
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 3,
          }}
        >
          <Box>
            <Typography variant="h4" fontWeight={800} mb={1}>
              Ready to simplify your HR?
            </Typography>

            <Typography fontSize={14} color="#d7eeea">
              Start your free trial today, or book a demo with our team.
            </Typography>
          </Box>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
            <Button
              variant="contained"
              onClick={goToLogin}
              sx={{
                bgcolor: "#f59e0b",
                color: "#103f3d",
                fontWeight: 800,
                px: 3,
                py: 1.3,
                textTransform: "none",
                "&:hover": { bgcolor: "#e88b00" },
              }}
            >
              Start Free Trial
            </Button>

            <Button
              variant="outlined"
              onClick={goToLogin}
              sx={{
                borderColor: "#ffffff",
                color: "#ffffff",
                px: 3,
                py: 1.3,
                textTransform: "none",
              }}
            >
              Book a Demo
            </Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default Home;
