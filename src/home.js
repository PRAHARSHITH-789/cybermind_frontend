// JobCards.js
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import './home.css';
import CreateJob from "./test"; // Your modal component
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Navbar,
  Nav,
  Form,
  InputGroup
} from "react-bootstrap";

function JobCards() {
  const [range, setRange] = useState([0, 100000]);
  const [showModal, setShowModal] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [filters, setFilters] = useState({
    title: "",
    location: "",
    jobType: ""
  });

  // Fetch jobs from backend
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get("https://myjob-9vq3.onrender.com/api/jobs");
        setJobs(res.data.map((job) => ({ ...job, applied: false }))); // Initialize applied
      } catch (err) {
        console.error("Error fetching jobs:", err);
      }
    };

    fetchJobs();
    const intervalId = setInterval(fetchJobs, 1000);
    return () => clearInterval(intervalId);
  }, []);

  // Filter jobs
  const filteredJobs = jobs.filter((job) => {
    const matchTitle = job.role.toLowerCase().includes(filters.title.toLowerCase());
    const matchLocation = filters.location ? job.location === filters.location : true;
    const matchType = filters.jobType ? job.jobType === filters.jobType : true;
    const matchSalary = job.salaryStart >= range[0] && job.salaryEnd <= range[1];
    return matchTitle && matchLocation && matchType && matchSalary;
  });

  return (
    <>
      {/* Navbar */}
      <Navbar
        bg="white"
        expand="lg"
        className="container-xl container-fluid shadow-sm py-3 w-75 mx-auto navbar-custom mt-2"
      >
        <Container className="fixed-container">
          <Navbar.Brand href="#">
            <img src="logo.svg" className="mx-5" alt="logo" width="40" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav w-50">
            <Nav className="me-auto ms-4 h6">
              <Nav.Link href="#" className="nav-hover">Home</Nav.Link>
              <Nav.Link href="#" className="mx-4 nav-hover">Find Jobs</Nav.Link>
              <Nav.Link href="#" className="mx-4 nav-hover">Find Talents</Nav.Link>
              <Nav.Link href="https://www.cybermindworks.com/portfolio/" className="mx-4 nav-hover">About us</Nav.Link>
              <Nav.Link href="#" className="mx-4 nav-hover">Testimonials</Nav.Link>
            </Nav>
            <Button variant="primary" className="rounded-pill px-4 mx-4" onClick={() => setShowModal(true)}>
              Create Jobs
            </Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Create Job Modal */}
      <CreateJob show={showModal} onHide={() => setShowModal(false)} />

      {/* Filters */}
      <Container className="my-4 container-fluid">
        <Row className="g-3 align-items-center">
          <Col xs={12} md={3}>
            <InputGroup>
              <InputGroup.Text><i className="bi bi-search"></i></InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Search by job title or role"
                value={filters.title}
                onChange={(e) => setFilters({ ...filters, title: e.target.value })}
              />
            </InputGroup>
          </Col>

          <Col xs={12} md={3}>
            <InputGroup>
              <InputGroup.Text><i className="bi bi-geo-alt"></i></InputGroup.Text>
              <Form.Select
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              >
                <option value="">Choose location</option>
                <option value="Chennai">Chennai</option>
                <option value="Bengaluru">Bengaluru</option>
                <option value="Delhi">Delhi</option>
              </Form.Select>
            </InputGroup>
          </Col>

          <Col xs={12} md={2}>
            <InputGroup>
              <InputGroup.Text><i className="bi bi-briefcase"></i></InputGroup.Text>
              <Form.Select
                value={filters.jobType}
                onChange={(e) => setFilters({ ...filters, jobType: e.target.value })}
              >
                <option value="">Job Type</option>
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
                <option value="Internship">Internship</option>
                <option value="Contract">Contract</option>
              </Form.Select>
            </InputGroup>
          </Col>

          <Col xs={12} md={4}>
            <div className="mb-1 text-dark d-flex justify-content-between small">
              <span>Salary per month</span>
              <span>₹ {range[0].toLocaleString("en-IN")} - ₹ {range[1].toLocaleString("en-IN")}</span>
            </div>
            <Slider
              range
              min={0}
              max={100000}
              step={1000}
              value={range}
              onChange={(val) => setRange(val)}
            />
          </Col>
        </Row>
      </Container>

      {/* Job Cards */}
      <Container className="container-fluid container-sm mb-5">
        <Row className="justify-content-center mb-5 g-4">
          {filteredJobs.map((job, idx) => (
            <Col xs={12} sm={6} md={6} lg={4} key={idx}>
              <Card className="h-100 shadow-sm border-0 mb-4">
                <Card.Body>
                  <div className="d-flex justify-content-between mb-3">
                    <img
                      src={`https://logo.clearbit.com/${job.company.toLowerCase()}.com`}
                      alt={job.company}
                      className="img-fluid rounded"
                      style={{ width: "50px", height: "50px", objectFit: "contain" }}
                      onError={(e) =>
                        (e.target.src =
                          "https://cdn-icons-png.flaticon.com/512/5968/5968672.png")
                      }
                    />
                  </div>

                  <Card.Title>{job.role}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">{job.company}</Card.Subtitle>

                  <p className="mb-2 small text-muted">
                    {job.exp || "0-1 Yrs"} | {job.jobType} | ₹{job.salaryStart}-{job.salaryEnd}
                  </p>

                  <p className="small">{job.description}</p>

                  {/* Apply / Applied button */}
                  <Button
                    variant="primary"
                    className="w-100"
                    onClick={() => {
                      setJobs((prevJobs) =>
                        prevJobs.map((j) =>
                          j === job ? { ...j, applied: true } : j
                        )
                      );
                    }}
                    disabled={job.applied}
                  >
                    {job.applied ? "Applied" : "Apply Now"}
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
}

export default JobCards;
