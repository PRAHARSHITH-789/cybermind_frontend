import React, { useState } from "react";
import { Modal, Button, Form, Row, Col, InputGroup, FormControl } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import axios from "axios";

function CreateJob({ show, onHide }) {
  const [jobData, setJobData] = useState({
    role: "",
    company: "",
    location: "",
    jobType: "",
    salaryStart: "",
    salaryEnd: "",
    deadline: "",
    description: "",
  });

  const [draftJob, setDraftJob] = useState(null); // store draft locally

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "description") {
      const wordLimit = 20;
      const words = value.split(/\s+/).filter(Boolean);
      if (words.length <= wordLimit) {
        setJobData({ ...jobData, [name]: value });
      } else {
        const trimmed = words.slice(0, wordLimit).join(" ");
        setJobData({ ...jobData, [name]: trimmed });
      }
    } else {
      setJobData({ ...jobData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://myjob-9vq3.onrender.com/api/jobs", jobData);

      if (response.status === 201) {
        alert(response.data.message);
        onHide();
        setJobData({
          role: "",
          company: "",
          location: "",
          jobType: "",
          salaryStart: "",
          salaryEnd: "",
          deadline: "",
          description: "",
        });
      } else {
        alert("Something went wrong!");
      }
    } catch (err) {
      console.error(err);
      alert("Server error. Please try again.");
    }
  };

  const handleSaveDraft = () => {
    setDraftJob(jobData); // store draft locally
    alert("Draft saved locally!");
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title className="w-100 text-center">Create Job Openings</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {/* Role & Company */}
          <Row className="mb-3">
            <Col xs={12} md={6}>
              <Form.Group>
                <Form.Label>Job Title</Form.Label>
                <Form.Control
                  type="text"
                  name="role"
                  value={jobData.role}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col xs={12} md={6}>
              <Form.Group>
                <Form.Label>Company Name</Form.Label>
                <Form.Control
                  type="text"
                  name="company"
                  value={jobData.company}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Location & Job Type */}
          <Row className="mb-3">
            <Col xs={12} md={6}>
              <Form.Group>
                <Form.Label>Location</Form.Label>
                <Form.Select
                  name="location"
                  value={jobData.location}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Location</option>
                  <option value="Chennai">Chennai</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Bengaluru">Bengaluru</option>
                  <option value="Kolkata">Kolkata</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col xs={12} md={6}>
              <Form.Group>
                <Form.Label>Job Type</Form.Label>
                <Form.Select
                  name="jobType"
                  value={jobData.jobType}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Type</option>
                  <option value="Full-Time">Full-Time</option>
                  <option value="Part-Time">Part-Time</option>
                  <option value="Internship">Internship</option>
                  <option value="Contract">Contract</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          {/* Salary & Deadline */}
          <Row className="mb-3">
            <Col xs={12} md={6}>
              <Form.Group>
                <Form.Label>Salary Range</Form.Label>
                <Row>
                  <Col xs={6}>
                    <InputGroup>
                      <InputGroup.Text>
                        <i className="bi bi-arrow-down-up"></i>
                      </InputGroup.Text>
                      <FormControl
                        type="number"
                        placeholder="Start"
                        name="salaryStart"
                        value={jobData.salaryStart}
                        onChange={handleChange}
                      />
                    </InputGroup>
                  </Col>
                  <Col xs={6}>
                    <InputGroup>
                      <InputGroup.Text>
                        <i className="bi bi-arrow-down-up"></i>
                      </InputGroup.Text>
                      <FormControl
                        type="number"
                        placeholder="End"
                        name="salaryEnd"
                        value={jobData.salaryEnd}
                        onChange={handleChange}
                      />
                    </InputGroup>
                  </Col>
                </Row>
              </Form.Group>
            </Col>
            <Col xs={12} md={6}>
              <Form.Group>
                <Form.Label>Application Deadline</Form.Label>
                <Form.Control
                  type="date"
                  name="deadline"
                  value={jobData.deadline}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Job Description */}
          <Form.Group className="mb-3">
            <Form.Label>Job Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              name="description"
              value={jobData.description}
              onChange={handleChange}
              required
            />
            <small className="text-muted">
              {jobData.description.split(/\s+/).filter(Boolean).length} / 20 words
            </small>
          </Form.Group>

          {/* Buttons */}
          <div className="d-flex flex-column flex-md-row justify-content-between">
            <Button
              variant="secondary"
              className="mb-2 mb-md-0"
              onClick={handleSaveDraft}
            >
              Save as Draft
            </Button>
            <Button variant="success" onClick={handleSubmit}>
              Publish <i className="bi bi-arrow-right"></i>
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default CreateJob;
