import React, { useState, useEffect } from "react";
import DataTable from "../components/DataTable";
import AddDataForm from "../components/AddDataForm";

const Index = () => {
  const [data, setData] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/data`);
      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleAddButtonClick = () => {
    setShowAddForm(true);
  };

  const handleCloseAddForm = () => {
    setShowAddForm(false);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/data/${id}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        console.log("Data deleted successfully");
        fetchData();
        alert("Data deleted successfully");
      } else {
        console.error("Error deleting data");
        alert("Error deleting data");
      }
    } catch (error) {
      console.error("Error deleting data:", error);
      alert("Error deleting data: " + error.message);
    }
  };

  const handleCheckboxChange = (id) => {
    setSelectedItems((prevSelectedItems) => {
      if (prevSelectedItems.includes(id)) {
        return prevSelectedItems.filter((item) => item !== id);
      } else {
        return [...prevSelectedItems, id];
      }
    });
  };

  const handleSendEmail = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/mail`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "abhinabadutta3959@gmail.com",
          subject: "Selected Data",
          message: "Here is the selected data:",
          selectedIds: selectedItems,
        }),
      });
      if (response.ok) {
        console.log("Email sent successfully");
        alert("Email sent successfully");
      } else {
        console.error("Error sending email");
        alert("Error sending email");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Error sending email: " + error.message);
    }
  };

  const handleUpdateData = (updatedData) => {
    setData(updatedData);
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-4xl font-bold mt-8 mb-4">Data Forge</h1>
      <button
        onClick={handleAddButtonClick}
        className="bg-blue-500 text-white py-2 px-4 rounded-md mr-4 hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
      >
        Add
      </button>{" "}
      <DataTable
        data={data}
        onDelete={handleDelete}
        onCheckboxChange={handleCheckboxChange}
        selectedItems={selectedItems}
        fetchData={fetchData}
        updateData={handleUpdateData}
      />
      {selectedItems.length > 0 && (
        <button
          onClick={handleSendEmail}
          className="bg-green-500 text-white py-2 px-4 rounded-md mr-4 mt-4 hover:bg-green-600 focus:outline-none focus:bg-green-600"
        >
          Send Email
        </button>
      )}
      {showAddForm && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg">
            <AddDataForm onClose={handleCloseAddForm} fetchData={fetchData} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
