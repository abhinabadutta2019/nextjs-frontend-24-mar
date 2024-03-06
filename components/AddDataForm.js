import React, { useState } from "react";

const AddDataForm = ({ onClose, fetchData }) => {
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    hobbies: "",
  });
  const [formErrors, setFormErrors] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    hobbies: "",
  });
  const [formValid, setFormValid] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "name":
        error = value.length === 0 ? "Name is required" : "";
        break;
      case "phoneNumber":
        error = value.length === 0 ? "Phone number is required" : "";
        break;
      case "email":
        error = value.length === 0 ? "Email is required" : "";
        break;
      case "hobbies":
        error = value.length === 0 ? "Hobbies are required" : "";
        break;
      default:
        break;
    }
    setFormErrors({ ...formErrors, [name]: error });
    setFormValid(
      Object.values(formErrors).every((err) => err.length === 0) &&
        Object.values(formData).every((val) => val.length > 0)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/data`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        console.log("Form submitted successfully");
        onClose(); // Close the form after submission
        alert("Data added successfully"); // Show success alert
        fetchData(); // Fetch data again to update the UI with new data
      } else {
        console.error("Error submitting form");
        alert("Error adding data"); // Show error alert
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error adding data: " + error.message); // Show error alert
    }
  };

  return (
    <div>
      <h2>Add New Data</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          {formErrors.name && <span>{formErrors.name}</span>}
        </div>
        <div>
          <label htmlFor="phoneNumber">Phone Number:</label>
          <input
            type="number"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
          />
          {formErrors.phoneNumber && <span>{formErrors.phoneNumber}</span>}
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="text"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          {formErrors.email && <span>{formErrors.email}</span>}
        </div>
        <div>
          <label htmlFor="hobbies">Hobbies:</label>
          <input
            type="text"
            id="hobbies"
            name="hobbies"
            value={formData.hobbies}
            onChange={handleChange}
          />
          {formErrors.hobbies && <span>{formErrors.hobbies}</span>}
        </div>
        <button type="submit" disabled={!formValid}>
          Save
        </button>
        <button onClick={onClose}>Cancel</button> {/* Close button */}
      </form>
    </div>
  );
};

export default AddDataForm;
