// src/components/admin/contacts/ContactFormModal.js
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { addContact, updateContact } from "@/utils/api";
import { useToast } from "@/context/ToastContext";

const defaultForm = {
  name: "",
  address: "",
  main_phone: "",
  sales_phone: "",
  leasing_phone: "",
  employment_phone: "",
  customer_care_phone: "",
  customer_care_landline: "",
  email: "",
  support_email: "",
  business_hours: "",
  facebook_link: "",
  instagram_link: "",
  youtube_link: "",
  linkedin_link: "",
  tiktok_link: "",
};

export default function ContactFormModal({ isOpen, onClose, initialData = null, onSuccess }) {
  const { showToast } = useToast();
  const [formData, setFormData] = useState(defaultForm);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData(initialData);
      } else {
        setFormData(defaultForm);
      }
    }
  }, [isOpen, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (initialData) {
        await updateContact(initialData.id, formData);
        showToast("Contact updated successfully!", "success");
      } else {
        await addContact(formData);
        showToast("Contact added successfully!", "success");
      }
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Contact form error:", err);
      showToast("Something went wrong while submitting the contact.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[#990e15] text-xl font-bold">
            {initialData ? "Edit Contact" : "Add Contact"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
          {Object.entries(formData).map(([key, value]) => (
            <div key={key}>
              <label className="text-sm font-semibold">{key.replace(/_/g, " ").toUpperCase()}</label>
              <Input
                name={key}
                value={value || ""}
                onChange={handleChange}
              />
            </div>
          ))}

          <div className="col-span-full flex justify-end gap-2 mt-6">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" className="bg-[#990e15] text-white hover:bg-red-800">
              {initialData ? "Update" : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
