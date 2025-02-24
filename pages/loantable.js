"use client"; // ✅ Ensures this runs only in the browser

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const getJSPDF = async () => {
  if (typeof window !== "undefined") {
    const jsPDF = (await import("jspdf")).default;
    return jsPDF;
  }
  return null;
};

const LoanTable = ({ loanAmount, interestRate, loanTerm, loanTermType, downPayment }) => {
  const [schedule, setSchedule] = useState([]);
  const [loanSummary, setLoanSummary] = useState({});

  const generateSchedule = useCallback(() => {
    let principal = Number(loanAmount) || 0;
    let rate = Number(interestRate) || 0;
    let down = Number(downPayment) || 0;

    let monthlyInterest = rate > 0 ? rate / 100 / 12 : 0;
    let totalLoanMonths = loanTermType === "months" ? Number(loanTerm) : Number(loanTerm) * 12;
    totalLoanMonths = totalLoanMonths > 0 ? totalLoanMonths : 1;

    if (principal === 0 || rate === 0) {
      setSchedule([]);
      setLoanSummary({
        scheduledPayment: "Php 0.00",
        scheduledPayments: 0,
        actualPayments: 0,
        totalInterest: "Php 0.00",
      });
      return;
    }

    let loanPrincipal = Math.max(principal - down, 0);
    let payment =
      (loanPrincipal * monthlyInterest) /
      (1 - Math.pow(1 + monthlyInterest, -totalLoanMonths));

    let newSchedule = [];
    let remainingBalance = loanPrincipal;
    let totalInterestPaid = 0;
    let cumulativeInterest = 0;

    for (let month = 1; month <= totalLoanMonths; month++) {
      let interestPaid = remainingBalance * monthlyInterest;
      let principalPaid = payment - interestPaid;
      remainingBalance -= principalPaid;
      totalInterestPaid += interestPaid;
      cumulativeInterest += interestPaid;

      if (remainingBalance < 0) remainingBalance = 0;

      newSchedule.push({
        month,
        beginningBalance: `Php ${(remainingBalance + principalPaid).toLocaleString("en-PH", { minimumFractionDigits: 2 })}`,
        scheduledPayment: `Php ${payment.toFixed(2)}`,
        totalPayment: `Php ${payment.toFixed(2)}`,
        principalPaid: `Php ${principalPaid.toFixed(2)}`,
        interestPaid: `Php ${interestPaid.toFixed(2)}`,
        endingBalance: `Php ${remainingBalance.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`,
        cumulativeInterest: `Php ${cumulativeInterest.toFixed(2)}`,
      });

      if (remainingBalance <= 0) break;
    }

    setSchedule(newSchedule);
    setLoanSummary({
      scheduledPayment: `Php ${payment.toFixed(2)}`,
      scheduledPayments: totalLoanMonths,
      actualPayments: newSchedule.length,
      totalInterest: `Php ${totalInterestPaid.toFixed(2)}`,
      totalEarlyPayments: `Php ${down.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`,
    });
  }, [loanAmount, interestRate, loanTerm, loanTermType, downPayment]);

  useEffect(() => {
    generateSchedule();
  }, [generateSchedule]);

  return (
    <div className="mt-6 p-4 bg-white shadow-lg rounded-md">
      <h3 className="text-lg font-semibold text-center">📅 Loan Amortization Schedule</h3>

      {/* Loan Summary */}
      <div className="grid grid-cols-2 gap-4 bg-green-100 p-4 rounded-md">
        <p><strong>Scheduled Payment:</strong> {loanSummary.scheduledPayment}</p>
        <p><strong>Scheduled Payments:</strong> {loanSummary.scheduledPayments} months</p>
        <p><strong>Actual Payments:</strong> {loanSummary.actualPayments}</p>
        <p><strong>Total Interest Paid:</strong> {loanSummary.totalInterest}</p>
        <p><strong>Total Early Payments:</strong> {loanSummary.totalEarlyPayments}</p>
      </div>

      {/* Table */}
      <table className="w-full border-collapse mt-3 text-sm">
        <thead>
          <tr className="bg-gray-200 text-gray-700">
            {["Month", "Beginning Balance", "Scheduled Payment", "Total Payment", "Principal", "Interest", "Ending Balance", "Cumulative Interest"].map((header) => (
              <th className="border p-2" key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {schedule.map((row) => (
            <tr key={row.month} className="text-center">
              {Object.values(row).map((value, idx) => (
                <td key={idx} className="border p-2">{value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Print Button */}
      <div className="flex justify-center mt-4">
        <button onClick={() => generateLoanPDF(loanSummary, schedule)} className="bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 w-full">
          🖨️ Print / Save as PDF
        </button>
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(LoanTable), { ssr: false });

// ✅ Move the function OUTSIDE the component to avoid the export issue
const generateLoanPDF = (loanDetails, schedule) => {
  const doc = new jsPDF();
  
  // Define Colors
  const themeColor = [153, 14, 21]; // #990e15
  
  // Header with Company Details
  doc.setFillColor(...themeColor);
  doc.rect(0, 0, 210, 40, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(25);
  doc.text("Loan Amortization ", 5, 15);
  doc.text("Schedule Receipt", 5, 25);
  
  // Company Information
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.text("Avida Land", 170, 7);
  doc.setFontSize(10);
  doc.text("Bonifacio Global City Head Office", 153, 12);
  doc.text("#909 40th Street cor. 10th Avenue,", 151, 17);
  doc.text("North Bonifacio Triangle, Bonifacio Global City, Taguig City 1634", 104, 22);
  doc.text("Customer Service Hotline: (+632)8848-5200", 136, 27);
  doc.text("Head Office Trunk Line: (+632)8988-2111", 140, 32);

  // Loan Details
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.text(`Scheduled Payment: ${loanDetails.scheduledPayment}`, 10, 50);
  doc.text(`Scheduled Payments: ${loanDetails.scheduledPayments} months`, 10, 60);
  doc.text(`Actual Payments: ${loanDetails.actualPayments}`, 10, 70);
  doc.text(`Total Interest Paid: ${loanDetails.totalInterest}`, 10, 80);
  doc.text(`Total Early Payments: ${loanDetails.totalEarlyPayments}`, 10, 90);
  
  // Loan Table
  doc.autoTable({
    startY: 100,
    head: [[
      "Month", "Beginning Balance", "Scheduled Payment", "Total Payment", "Principal", "Interest", "Ending Balance", "Cumulative Interest"
    ]],
    body: schedule.map((row) => [
      row.month,
      row.beginningBalance,
      row.scheduledPayment,
      row.totalPayment,
      row.principalPaid,
      row.interestPaid,
      row.endingBalance,
      row.cumulativeInterest,
    ]),
    theme: "grid",
    headStyles: { fillColor: themeColor, textColor: [255, 255, 255] },
    alternateRowStyles: { fillColor: [240, 240, 240] },
    styles: { fontSize: 10 }
  });
  
  // Open PDF Preview
  const pdfBlob = doc.output("blob");
  const pdfUrl = URL.createObjectURL(pdfBlob);
  window.open(pdfUrl, "_blank");
  
  // ✅ Save PDF with Fixed File Name
  doc.save("Avida_Amortization_Receipt.pdf");
};

