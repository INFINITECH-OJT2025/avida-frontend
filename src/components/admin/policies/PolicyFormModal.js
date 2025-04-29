// src/components/admin/policies/PolicyFormModal.js
import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Textarea from "@/components/ui/textarea";
import { addPolicy, updatePolicy } from "@/utils/api";
import { useToast } from "@/context/ToastContext";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";

const defaultSection = {
    title: "",
    description: "",
    details: "",
    examples: [{ category: "", example: "" }],
    explanation: "",
    image_url: "",
};

export default function PolicyFormModal({ isOpen, onClose, initialData = null, onSuccess }) {
    const { showToast } = useToast();
    const [formData, setFormData] = useState({
        main_title: "",
        sub_title: "",
        description: "",
    });
    const [sections, setSections] = useState([defaultSection]);
    const [expandedSections, setExpandedSections] = useState([true]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setFormData({
                    main_title: initialData.main_title,
                    sub_title: initialData.sub_title,
                    description: initialData.description,
                });
                setSections(initialData.sections || [defaultSection]);
                setExpandedSections((initialData.sections || [defaultSection]).map(() => true));
            } else {
                setFormData({ main_title: "", sub_title: "", description: "" });
                setSections([defaultSection]);
                setExpandedSections([true]);
            }
        }
    }, [isOpen, initialData]);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSectionChange = (index, field, value) => {
        const updated = [...sections];
        updated[index][field] = value;
        setSections(updated);
    };

    const handleExampleChange = (sIndex, eIndex, field, value) => {
        const updated = [...sections];
        updated[sIndex].examples[eIndex][field] = value;
        setSections(updated);
    };

    const addExampleRow = (sIndex) => {
        const updated = [...sections];
        if (!Array.isArray(updated[sIndex].examples)) {
            updated[sIndex].examples = [];
        }
        updated[sIndex].examples.push({ category: "", example: "" });
        setSections(updated);
    };


    const removeExampleRow = (sIndex, eIndex) => {
        const updated = [...sections];
        updated[sIndex].examples.splice(eIndex, 1);
        setSections(updated);
    };

    const handleAddSection = () => {
        setSections([...sections, defaultSection]);
        setExpandedSections([...expandedSections, true]);
        setCurrentIndex(sections.length);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                ...formData,
                sections,
            };
            if (initialData) {
                await updatePolicy(initialData.id, payload);
                showToast("Policy updated successfully!", "success");
            } else {
                await addPolicy(payload);
                showToast("Policy added successfully!", "success");
            }
            onSuccess();
            onClose();
        } catch (err) {
            console.error(err);
            showToast("Something went wrong.", "error");
        } finally {
            setLoading(false);
        }
    };

    const goPrev = () => currentIndex > 0 && setCurrentIndex((i) => i - 1);
    const goNext = () => currentIndex < sections.length - 1 && setCurrentIndex((i) => i + 1);

    const section = sections[currentIndex];

    return (
        <Dialog open={isOpen} onOpenChange={onClose} className="w-[100px] max-w-full h-[90vh] flex flex-col overflow-hidden rounded-xl shadow-xl p-0">
            <DialogContent className="w-[1500px] max-w-full h-[80vh] flex flex-col overflow-hidden rounded-xl shadow-xl p-0" style={{ margin: "auto" }}
            >

                {/* HEADER - Fixed */}
                <div className="px-4 py-3 border-b shrink-0">
                    <DialogHeader>
                        <DialogTitle className="text-[#990e15] text-lg font-semibold">
                            {initialData ? "Edit Policy" : "Add Policy"}
                        </DialogTitle>
                    </DialogHeader>
                </div>

                {/* BODY - Scrollable content only */}
                <div className="flex-1 overflow-y-auto px-4 py-3">
                    <form id="policy-form" onSubmit={handleSubmit} className="space-y-5">

                        {/* FORM FIELDS */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label className="text-sm font-medium">Main Title  </label>
                                <Input name="main_title" value={formData.main_title} onChange={handleFormChange} required />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Sub Title  </label>
                                <Input name="sub_title" value={formData.sub_title} onChange={handleFormChange} />
                            </div>
                            <div className="sm:col-span-2">
                                <label className="text-sm font-medium">Description  </label>
                                <Textarea name="description" value={formData.description} onChange={handleFormChange} className="max-h-24" />
                            </div>
                        </div>

                        {/* SECTION BOX */}
                        <div className="border p-3 rounded-md bg-gray-50">
                            <div className="flex justify-between items-center mb-2">
                                <h4 className="font-semibold">Section {currentIndex + 1}</h4>
                                {sections.length > 1 && (
                                    <Button variant="ghost" size="icon" onClick={() => setSections(sections.filter((_, i) => i !== currentIndex))}>
                                        <Trash2 className="w-4 h-4 text-red-600" />
                                    </Button>
                                )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <Input
                                    placeholder="Title"
                                    value={section.title}
                                    onChange={(e) => handleSectionChange(currentIndex, "title", e.target.value)}
                                />
                                <Input
                                    placeholder="Image URL (optional)"
                                    value={section.image_url}
                                    onChange={(e) => handleSectionChange(currentIndex, "image_url", e.target.value)}
                                />
                                <Textarea
                                    placeholder="Description"
                                    className="max-h-24"
                                    value={section.description}
                                    onChange={(e) => handleSectionChange(currentIndex, "description", e.target.value)}
                                />
                                <Textarea
                                    placeholder="Details (bullets by new line)"
                                    className="max-h-24"
                                    value={section.details}
                                    onChange={(e) => handleSectionChange(currentIndex, "details", e.target.value)}
                                />
                                <Textarea
                                    placeholder="Explanation (optional)"
                                    className="max-h-24"
                                    value={section.explanation}
                                    onChange={(e) => handleSectionChange(currentIndex, "explanation", e.target.value)}
                                />

                                {/* <div className="sm:col-span-2 border rounded p-4 bg-white w-full">
                                    <table className="w-full border text-sm mt-2 table-fixed">
                                        <thead>
                                            <tr className="bg-gray-100">
                                                <th className="border px-1 py-1 text-left">Category</th>
                                                <th className="border px-2 py-1 text-left">Examples</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Array.isArray(section?.examples) &&
                                                section.examples.map((ex, eIdx) => (
                                                    <tr key={eIdx} className="align-top">
                                                        <td className="border px-2 py-1 w-1/3">
                                                            <Input
                                                                placeholder="Category"
                                                                value={ex.category}
                                                                onChange={(e) => handleExampleChange(currentIndex, eIdx, "category", e.target.value)}

                                                            />
                                                        </td>
                                                        <td className="border px-2 py-1 w-2/3">
                                                            <Textarea
                                                                placeholder="Example (comma-separated or line breaks)"
                                                                value={ex.example}
                                                                onChange={(e) => handleExampleChange(currentIndex, eIdx, "example", e.target.value)}
                                                                className="h-40 resize-y w-full min-w-[500px]"
                                                            />

                                                        </td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>
                                    <div className="mt-2 flex gap-2">
                                        <Button type="button" size="sm" variant="outline" onClick={() => addExampleRow(currentIndex)}>
                                            <Plus className="w-4 h-4 mr-1" /> Add Row
                                        </Button>
                                    </div>
                                </div> */}
                            </div>
                        </div>

                        {/* PAGINATION CONTROLS */}
                        <div className="flex justify-between items-center border-t pt-3">
                            <Button type="button" variant="ghost" disabled={currentIndex === 0} onClick={goPrev}>Previous</Button>
                            <span className="text-xs text-gray-500">Section {currentIndex + 1} of {sections.length}</span>
                            <Button type="button" variant="ghost" disabled={currentIndex === sections.length - 1} onClick={goNext}>Next</Button>
                        </div>
                    </form>
                </div>

                {/* FIXED FOOTER */}
                <div className="px-4 py-3 border-t flex justify-between">
                    <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                    <div className="flex gap-2">
                        <Button type="button" variant="outline" onClick={handleAddSection}>
                            <Plus className="w-4 h-4 mr-1" /> Add Section
                        </Button>
                        <Button type="submit" form="policy-form" className="bg-[#990e15] text-white">
                            {initialData ? "Update" : "Save"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>

    );
}