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
          className="border border-gray-300 px-2 py-1 rounded-md"
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
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Phone Number
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Hobbies
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item) => (
            <tr key={item._id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item._id)}
                  onChange={() => onCheckboxChange(item._id)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">{item._id}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {renderTableCell(item, "name")}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {renderTableCell(item, "phoneNumber")}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {renderTableCell(item, "email")}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {renderTableCell(item, "hobbies")}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {editModeMap[item._id] ? (
                  <button
                    onClick={() => handleSaveChanges(item._id)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => handleToggleEditMode(item._id)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    Edit
                  </button>
                )}
                <button
                  onClick={() => handleDelete(item._id)}
                  className="text-red-600 hover:text-red-900 ml-2"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
