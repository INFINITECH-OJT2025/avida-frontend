// src\components\admin\about\ImagesSection.js
import React, { useState } from "react";
import { useToast } from "../../../context/ToastContext";
import { callAPI } from "../../../utils/api";

export default function ImagesSection({ form }) {
  const [companyLogo, setCompanyLogo] = useState(null);
  const [officeImages, setOfficeImages] = useState([]);
  const { toast, showToast } = useToast();

  const handleLogoChange = (e) => {
    setCompanyLogo(e.target.files[0]);
  };

  const handleOfficeImagesChange = (e) => {
    setOfficeImages([...e.target.files]);
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("company_name", form.company_name); // Required for validation
    if (companyLogo) formData.append("company_logo", companyLogo);
    if (officeImages.length > 0) {
      officeImages.forEach((img) => formData.append("office_images[]", img));
    }

    try {
      await callAPI("post", "/admin/about-us/update", formData);
      toast.success("Images Updated Successfully!");
    } catch (error) {
      toast.error("Error updating images");
    }
  };

  return (
    <div className="bg-white p-6 shadow-md rounded-md mb-6">
      <h2 className="text-xl font-bold mb-4">Company Images</h2>

      <div className="flex space-x-6 items-center">
        <div className="text-center">
          <h3 className="font-medium text-gray-600">Company Logo</h3>
          {form.company_logo ? (
            <img
              src={`/uploads/about/${form.company_logo}`}
              alt="Company Logo"
              className="w-32 h-32 rounded-md shadow-md mt-2"
            />
          ) : (
            <p className="text-gray-500">No Logo Uploaded</p>
          )}
          <input type="file" onChange={handleLogoChange} className="mt-2" />
        </div>

        <div className="text-center">
          <h3 className="font-medium text-gray-600">Office Images</h3>
          <div className="flex space-x-4">
            {form.office_images ? (
              JSON.parse(form.office_images).map((img, index) => (
                <img
                  key={index}
                  src={`/uploads/about/${img}`}
                  alt={`Office ${index + 1}`}
                  className="w-32 h-32 rounded-md shadow-md mt-2"
                />
              ))
            ) : (
              <p className="text-gray-500">No Office Images Uploaded</p>
            )}
          </div>
          <input type="file" multiple onChange={handleOfficeImagesChange} className="mt-2" />
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded-md mt-4"
      >
        Save Images
      </button>
    </div>
  );
}
