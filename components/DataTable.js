// components/DataTable.js
import React, { useState } from "react";

const DataTable = ({
  data,
  onDelete,
  onCheckboxChange,
  selectedItems,
  fetchData,
  updateData,
}) => {
  const [editModeMap, setEditModeMap] = useState({});

  const handleToggleEditMode = (id) => {
    setEditModeMap((prevEditModeMap) => ({
      ...prevEditModeMap,
      [id]: !prevEditModeMap[id],
    }));
  };

  const handleDelete = async (id) => {
    onDelete(id);
  };

  const handleUpdate = async (id, updatedData) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/data/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        }
      );
      if (response.ok) {
        console.log("Data updated successfully");
        fetchData(); // Fetch data again to update the UI
        alert("Data updated successfully");
      } else {
        console.error("Error updating data");
        alert("Error updating data");
      }
    } catch (error) {
      console.error("Error updating data:", error);
      alert("Error updating data: " + error.message);
    }
  };
  const renderTableCell = (item, field) => {
    if (editModeMap[item._id]) {
      return (
        <input
          type="text"
          value={item[field]}
          onChange={(e) => handleFieldChange(item._id, field, e.target.value)}
          readOnly={false} // Ensure the input field is editable
        />
      );
    } else {
      return <span>{item[field]}</span>;
    }
  };

  const handleFieldChange = (id, field, value) => {
    const updatedData = data.map((item) =>
      item._id === id ? { ...item, [field]: value } : item
    );
    updateData(updatedData); // Update the data in the parent component
  };

  const handleSaveChanges = async (id) => {
    const updatedItem = data.find((item) => item._id === id);
    await handleUpdate(id, updatedItem);
    setEditModeMap((prevEditModeMap) => ({
      ...prevEditModeMap,
      [id]: false, // Set edit mode to false after saving changes
    }));
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>ID</th>
            <th>Name</th>
            <th>Phone Number</th>
            <th>Email</th>
            <th>Hobbies</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item._id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item._id)}
                  onChange={() => onCheckboxChange(item._id)}
                />
              </td>
              <td>{item._id}</td>
              <td>{renderTableCell(item, "name")}</td>
              <td>{renderTableCell(item, "phoneNumber")}</td>
              <td>{renderTableCell(item, "email")}</td>
              <td>{renderTableCell(item, "hobbies")}</td>
              <td>
                {editModeMap[item._id] ? (
                  <button onClick={() => handleSaveChanges(item._id)}>
                    Save
                  </button>
                ) : (
                  <button onClick={() => handleToggleEditMode(item._id)}>
                    Edit
                  </button>
                )}
                <button onClick={() => handleDelete(item._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
