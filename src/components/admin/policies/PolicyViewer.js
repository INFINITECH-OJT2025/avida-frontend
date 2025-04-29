// components/admin/policies/PolicyViewer.js
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function PolicyViewer({ policy, onClose }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const sections = policy?.sections || [];
    const section = sections[currentIndex] || {};

    const goNext = () => {
        if (currentIndex < sections.length - 1) setCurrentIndex((i) => i + 1);
    };

    const goPrev = () => {
        if (currentIndex > 0) setCurrentIndex((i) => i - 1);
    };

    return (
        <Dialog open={!!policy} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="w-[1000px] h-[80vh] overflow-hidden">
                <div className="flex flex-col h-full">
                    <DialogHeader className="p-6 border-b">
                        <DialogTitle className="text-3xl font-bold text-[#990e15]">
                            {policy?.main_title}
                        </DialogTitle>
                        {policy?.sub_title && (
                            <DialogDescription className="text-gray-500 text-base">
                                {policy.sub_title}
                            </DialogDescription>
                        )}
                    </DialogHeader>

                    <div className="flex-1 overflow-y-auto p-2 space-y-3">
                        {policy?.description && (
                            <p className="text-sm text-gray-700 leading-relaxed border border-gray-200 rounded p-4 bg-gray-50 whitespace-pre-line">
                                {policy.description}
                            </p>
                        )}

                        <div className="p-2 border border-gray-200 rounded-md bg-white shadow-sm">
                            {section.title && (
                                <h3 className="text-xl font-bold text-[#990e15] mb-2">
                                    {section.title}
                                </h3>
                            )}

                            {section.description && (
                                <p className="text-xs text-gray-700 mb-3 whitespace-pre-line">
                                    {section.description}
                                </p>
                            )}

                            {section.details && (
                                <ul className="list-disc list-inside text-xs text-gray-700 space-y-1 mb-4">
                                    {section.details
                                        .split(/\r?\n/)
                                        .filter((v) => v.trim() !== "")
                                        .map((line, i) => (
                                            <li key={i}>{line}</li>
                                        ))}
                                </ul>
                            )}

                            {/* {Array.isArray(section.examples) && section.examples.some((e) => typeof e.example === "string" && e.example.trim() !== "") && (
                                <div className="overflow-x-auto mt-4">
                                    <table className="w-full text-sm border border-gray-200">
                                        <thead className="bg-gray-100">
                                            <tr>
                                                <th className="text-left px-4 py-2 w-1/3 border border-gray-200">
                                                    CATEGORIES
                                                </th>
                                                <th className="text-left px-4 py-2 border border-gray-200">
                                                    EXAMPLES
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {section.examples
                                                .filter((row) => typeof row.example === "string" && row.example.trim() !== "")
                                                .map((row, i) => (
                                                    <tr key={i} className="border-t border-gray-100">
                                                        <td className="px-4 py-2 font-medium border border-gray-100 whitespace-nowrap">
                                                            {row.category}
                                                        </td>
                                                        <td className="px-4 py-2 border border-gray-100 whitespace-pre-line">
                                                            <ul className="list-disc list-inside space-y-1">
                                                                {row.example
                                                                    .split(/\r?\n|,\s?/)
                                                                    .filter((v) => v.trim() !== "")
                                                                    .map((item, idx) => (
                                                                        <li key={idx}>{item}</li>
                                                                    ))}
                                                            </ul>
                                                        </td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>
                                </div>
                            )} */}

                            {section.explanation && (
                                <p className="text-sm text-gray-700 mt-4 whitespace-pre-line">
                                    {section.explanation}
                                </p>
                            )}

                            {section.image_url && (
                                <div className="mt-4">
                                    <img
                                        src={section.image_url}
                                        alt="Section Visual"
                                        className="w-full max-w-md rounded shadow-md"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-between items-center p-4 border-t bg-gray-50">
                        <Button
                            onClick={goPrev}
                            disabled={currentIndex === 0}
                            className={`px-4 py-2 font-medium rounded ${currentIndex === 0
                                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                                : "bg-[#990e15] text-white hover:bg-[#7d0b11]"
                                }`}
                        >
                            Previous
                        </Button>

                        <span className="text-sm text-gray-600 font-medium">
                            Section {currentIndex + 1} of {sections.length}
                        </span>

                        <Button
                            onClick={goNext}
                            disabled={currentIndex === sections.length - 1}
                            className={`px-4 py-2 font-medium rounded ${currentIndex === sections.length - 1
                                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                                : "bg-[#990e15] text-white hover:bg-[#7d0b11]"
                                }`}
                        >
                            Next
                        </Button>

                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
