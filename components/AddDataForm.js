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
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl mb-4">Add New Data</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Name:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
          />
          {formErrors.name && (
            <span className="text-red-500">{formErrors.name}</span>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="phoneNumber"
            className="block text-sm font-medium text-gray-700"
          >
            Phone Number:
          </label>
          <input
            type="number"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
          />
          {formErrors.phoneNumber && (
            <span className="text-red-500">{formErrors.phoneNumber}</span>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email:
          </label>
          <input
            type="text"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
          />
          {formErrors.email && (
            <span className="text-red-500">{formErrors.email}</span>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="hobbies"
            className="block text-sm font-medium text-gray-700"
          >
            Hobbies:
          </label>
          <input
            type="text"
            id="hobbies"
            name="hobbies"
            value={formData.hobbies}
            onChange={handleChange}
            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
          />
          {formErrors.hobbies && (
            <span className="text-red-500">{formErrors.hobbies}</span>
          )}
        </div>
        <button
          type="submit"
          className="inline-block bg-blue-500 text-white py-2 px-4 rounded-md mr-4"
          disabled={!formValid}
        >
          Save
        </button>
        <button
          onClick={onClose}
          className="inline-block bg-gray-500 text-white py-2 px-4 rounded-md"
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default AddDataForm;
