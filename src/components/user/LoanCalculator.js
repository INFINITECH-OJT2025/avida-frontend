import { useState, useEffect } from "react";
import LoanGraph from "../../../pages/loangraph";
import LoanTable from "../../../pages/loantable";

export default function LoanCalculator() {
  const [loanAmount, setLoanAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [loanTermYears, setLoanTermYears] = useState("");
  const [loanTermMonths, setLoanTermMonths] = useState("0");
  const [downPayment, setDownPayment] = useState("");
  const [discount, setDiscount] = useState("");
  const [propertyTax, setPropertyTax] = useState("");
  const [insurance, setInsurance] = useState("");
  const [hoaFees, setHoaFees] = useState("");
  const [monthlyPayment, setMonthlyPayment] = useState(0);

  useEffect(() => {
    calculateLoan();
  }, [loanAmount, interestRate, loanTermYears, loanTermMonths, downPayment, discount, propertyTax, insurance, hoaFees]);

  const parseNumberInput = (value) => value.replace(/,/g, "").replace(/ /g, "");

  const formatNumber = (value, separator = ",") => {
    if (!value) return "";
    return parseFloat(value).toLocaleString("en-US").replace(/,/g, separator);
  };

  const calculateLoan = () => {
    let principal = Number(parseNumberInput(loanAmount)) || 0;
    let down = Number(parseNumberInput(downPayment)) || 0;
    let discountPercent = Number(parseNumberInput(discount)) || 0;
    let rate = interestRate !== "" ? Number(parseNumberInput(interestRate)) : NaN;
    let taxRate = Number(parseNumberInput(propertyTax)) || 0;
    let insuranceCost = Number(parseNumberInput(insurance)) || 0;
    let hoa = Number(parseNumberInput(hoaFees)) || 0;

    discountPercent = Math.min(discountPercent, 100);
    let discountValue = (discountPercent / 100) * principal;
    let loanPrincipal = Math.max(principal - down - discountValue, 0);

    let totalMonths = Number(loanTermYears) * 12 + Number(loanTermMonths);
    totalMonths = Math.max(totalMonths, 1);

    let monthlyInterest = rate / 100 / 12;
    let payment =
      (loanPrincipal * monthlyInterest) /
      (1 - Math.pow(1 + monthlyInterest, -totalMonths));

    let taxMonthly = (taxRate / 100 / 12) * principal;
    let insuranceMonthly = insuranceCost / 12;
    let totalMonthlyPayment = payment + taxMonthly + insuranceMonthly + hoa;

    setMonthlyPayment(totalMonthlyPayment.toFixed(2));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-10 mb-10">
      <h2 className="text-3xl font-bold text-center mb-6 text-[#990e15]">Loan Calculator</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { label: "Loan Amount (Php)", value: loanAmount, onChange: setLoanAmount },
          { label: "Interest Rate (%)", value: interestRate, onChange: setInterestRate },
          { label: "Loan Term (Years)", value: loanTermYears, onChange: setLoanTermYears, type: "select", range: 26 },
          { label: "Loan Term (Months)", value: loanTermMonths, onChange: setLoanTermMonths, type: "select", range: 12 },
          { label: "Down Payment (Php)", value: downPayment, onChange: setDownPayment },
          { label: "Discount (%)", value: discount, onChange: setDiscount },
          { label: "Property Tax (%)", value: propertyTax, onChange: setPropertyTax },
          { label: "Home Insurance (Php/Year)", value: insurance, onChange: setInsurance },
          { label: "HOA Fees (Php/Month)", value: hoaFees, onChange: setHoaFees },
        ].map(({ label, value, onChange, type, range }, idx) => (
          <div key={idx}>
            <label className="block text-gray-700 mb-2 font-medium">{label}</label>
            {type === "select" ? (
              <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                {[...Array(range).keys()].map((val) => (
                  <option key={val} value={val}>{val}</option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={formatNumber(value)}
                onChange={(e) => onChange(parseNumberInput(e.target.value))}
                className="w-full p-2 border rounded-md"
              />
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-gray-100 rounded-md shadow-sm text-center">
        <h3 className="text-xl font-semibold">Estimated Monthly Payment:</h3>
        <p className="text-3xl font-bold text-[#990e15]">Php {formatNumber(monthlyPayment)}</p>
      </div>

      <div className="mt-6">
        <LoanGraph monthlyPayment={monthlyPayment} />
      </div>

      <div className="mt-6">
        <LoanTable
          loanAmount={loanAmount}
          interestRate={interestRate}
          loanTerm={loanTermYears * 12 + Number(loanTermMonths)}
          loanTermType="months"
          extraPayment={0}
          downPayment={downPayment}
        />
      </div>
    </div>
  );
}
