// JobCards.js
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

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
  const [range, setRange] = useState([0, 1000000]);
  const [showModal, setShowModal] = useState(false);
  const [jobs, setJobs] = useState([]); // All jobs from backend
  const [filters, setFilters] = useState({
    title: "",
    location: "",
    jobType: ""
  });

  // Fetch jobs from backend
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/jobs");
        // Initialize applied status for each job
        setJobs(res.data.map((job) => ({ ...job, applied: false })));
        console.log("Jobs fetched:", res.data);
      } catch (err) {
        console.error("Error fetching jobs:", err);
      }
    };

    fetchJobs();
    const intervalId = setInterval(fetchJobs, 1000);
    return () => clearInterval(intervalId);
  }, []);

  // Filter jobs dynamically
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
  className="shadow-sm  mx-auto navbar-custom  overflow-hidden "
  style={{ maxWidth: "800px", borderRadius: "50px",maxHeight:"10%" }}
>
  <Container>
    <Navbar.Brand href="#">
      <img src="logo.svg" className="mx-2" alt="logo" width="40" />
    </Navbar.Brand>

    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="me-auto ms-4 h6">
        <Nav.Link href="#" className="nav-hover mx-2">Home</Nav.Link>
        <Nav.Link href="#" className="mx-2 nav-hover">Find Jobs</Nav.Link>
        <Nav.Link href="#" className="mx-2 nav-hover">Find Talents</Nav.Link>
        <Nav.Link href="https://www.cybermindworks.com/portfolio/" className="mx-2 nav-hover">About us</Nav.Link>
        <Nav.Link href="#" className="mx-2 nav-hover">Testimonials</Nav.Link>
      </Nav>

      <Button
        variant="primary"
        className="create-job-btn px-3 mx-4 rounded-pill"
        onClick={() => setShowModal(true)}
        style={{ backgroundColor: "#6100AD", borderColor: "#00AAFF" }}
      >
        Create Jobs
      </Button>
    </Navbar.Collapse>
  </Container>
</Navbar>



      {/* Create Job Modal */}
      <CreateJob show={showModal} onHide={() => setShowModal(false)} />

      {/* Filters */}
     <Container className="my-4 container-fluid container-xl  pb-2 bg-white">
  <Row className="g-3 align-items-center">
    
    {/* Title Filter */}
    <Col xs={12} md={3} className="d-flex align-items-center">
      <InputGroup className="border-0">
        <InputGroup.Text className="border-0 bg-white"><i className="bi bi-search"></i></InputGroup.Text>
        <Form.Control
          type="text"
          placeholder="Search By Job Title, Role"
          value={filters.title}
          onChange={(e) => setFilters({ ...filters, title: e.target.value })}
          className="border-0"
        />
      </InputGroup>
      <span className="mx-2 d-none d-md-inline">|</span>
    </Col>

    {/* Location Filter */}
    <Col xs={12} md={3} className="d-flex align-items-center">
      <InputGroup className="border-0">
        <InputGroup.Text className="border-0 bg-white"><i className="bi bi-geo-alt"></i></InputGroup.Text>
        <Form.Select
          value={filters.location}
          onChange={(e) => setFilters({ ...filters, location: e.target.value })}
          className="border-0"
        >
          <option value="">Perferred Location</option>
          <option value="Chennai">Chennai</option>
          <option value="Bengaluru">Bengaluru</option>
          <option value="Delhi">Delhi</option>
        </Form.Select>
      </InputGroup>
      <span className="mx-2 d-none d-md-inline">|</span>
    </Col>

    {/* Job Type Filter */}
    <Col xs={12} md={3} className="d-flex align-items-center">
      <InputGroup className="border-0">
        <InputGroup.Text className="border-0 bg-white"><i className="bi bi-briefcase"></i></InputGroup.Text>
        <Form.Select
          value={filters.jobType}
          onChange={(e) => setFilters({ ...filters, jobType: e.target.value })}
          className="border-0"
        >
          <option value="">Job Type</option>
          <option value="Onsite">Onsite</option>
          <option value="Remote">Remote</option>
          <option value="Hybrid">Hybrid</option>
        </Form.Select>
      </InputGroup>
      <span className="mx-2 d-none d-md-inline">|</span>
    </Col>

    {/* Salary Slider */}
    <Col xs={12} md={3} className="d-flex flex-column">
      <div className="mb-1 text-dark d-flex justify-content-between small">
        <span className="fw-bold">Salary Per Month</span>
        <span className="fw-bold">
          ₹ {(range[0] / 1000).toLocaleString("en-IN")}K - ₹ {(range[1] / 1000).toLocaleString("en-IN")}K
        </span>
      </div>
     <Slider
  range
  min={1000}
  max={1000000}
  step={10000}
  value={range}
  onChange={(val) => setRange(val)}
  trackStyle={[{ backgroundColor: 'lightgray', }]} // Slider track color & height
  railStyle={{ backgroundColor: '#e9ecef',  }} // Background rail
  handleStyle={[
    { borderColor: '#080808ff',  backgroundColor: '#fff' },
    { borderColor: 'black',  backgroundColor: '#fff' }
  ]}
/>

    </Col>

  </Row>
</Container>


      {/* Job Cards */}
      <Container className="mt-4">
  <Row>
    {filteredJobs.map((job, index) => {
      // Calculate "time ago"
      let timeAgo = "Just now";
      if (job.createdAt) {
        const createdDate = new Date(job.createdAt);
        const now = new Date();
        const diffMs = now - createdDate;
        const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffHrs / 24);

        if (diffHrs < 1) {
          timeAgo = "Just now";
        } else{
          timeAgo = `${diffHrs}h Ago`;
        } 
      }

      return (
        <Col key={index} md={3} className="mb-1">
          <Card className="h-100 shadow-sm border-0 position-relative">
            
            {/* Time Ago at top-right */}
            <span
              className="badge  text-dark position-absolute p-2"

              style={{ top: "8px", right: "8px", fontSize: "0.7rem" ,backgroundColor:"#B0D9FF"
}}
            >
              {timeAgo}
            </span>

            <Card.Body>
              {/* Company Logo */}
              <div
                className="d-flex align-items-center justify-content-center mb-2"
                style={{
                  width: "70px",
                  height: "70px",
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.10)",
                  backgroundColor: "#fff",
                }}
              >
                <img
                  src={`https://logo.clearbit.com/${job.company.toLowerCase()}.com`}
                  alt={job.company}
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                  }}
                  onError={(e) =>
                    (e.target.src =
                      "https://cdn-icons-png.flaticon.com/512/5968/5968672.png")
                  }
                />
              </div>

              <Card.Title className="mb-0">{job.role}</Card.Title>

              <ul
                className="list-unstyled d-flex align-items-center mb-2 gap-3 flex-nowrap"
                style={{ fontSize: "0.75rem", whiteSpace: "nowrap" }}
              >
                <li className="d-flex align-items-center">
                  <i className="bi bi-person-plus-fill me-1 fs-6 align-middle"></i>
                  <span>{job.exp || "0-1 Yrs"}</span>
                </li>
                <li className="d-flex align-items-center">
                  <i className="bi bi-buildings me-1 fs-6 align-middle"></i>
                  <span>{job.jobType}</span>
                </li>
                <li className="d-flex align-items-center">
                  <i className="bi bi-layers me-1 fs-6 align-middle"></i>
                  <span>
                    {job.salaryEnd
                      ? `₹ ${(job.salaryEnd / 10000).toFixed(1)} LPA`
                      : "Not disclosed"}
                  </span>
                </li>
              </ul>

              <Card.Text style={{ fontSize: "0.8rem" }}>
                <ul className="mb-0 ps-3">
                  {job.description &&
                    job.description
                      .split(".")
                      .map((sentence, idx) =>
                        sentence.trim() ? (
                          <li key={idx}>{sentence.trim()}.</li>
                        ) : null
                      )}
                </ul>
              </Card.Text>

              {/* Apply / Applied button */}
              <Button
               
                className="w-100 "
                style={{ backgroundColor: " #00AAFF"
 }}
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
      );
    })}
  </Row>
</Container>

    </>
  );
}

export default JobCards;
