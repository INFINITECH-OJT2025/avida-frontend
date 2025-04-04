import { useState, useEffect } from "react";
import LoanGraph from "./loangraph";
import LoanTable from "./loantable";
import Header from "../src/components/Header"; // ✅ Import Header
import Footer from "../src/components/Footer";
import SEOComponent from "../src/hooks/useSEO";

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

  // ✅ Auto-calculate loan whenever inputs change
  useEffect(() => {
    calculateLoan();
  }, [loanAmount, interestRate, loanTermYears, loanTermMonths, downPayment, discount, propertyTax, insurance, hoaFees]);

  // ✅ Function to remove separators before storing the number
  const parseNumberInput = (value) => value.replace(/,/g, "").replace(/ /g, "");

  // ✅ Function to format numbers with commas or spaces
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
  const allowOnlyNumericWithDecimal = (value) => {
    // Only allow digits and one optional dot (decimal)
    const cleaned = value.replace(/[^\d.]/g, '');
    const parts = cleaned.split('.');
    return parts.length > 2 ? parts[0] + '.' + parts.slice(1).join('') : cleaned;
  };

  
  return (

    <div className=" top-0 left-0 w-full z-10 bg-white dark:bg-gray-900">
            <SEOComponent />
      <Header />

      <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md mt-10">
        <h2 className="text-2xl font-semibold text-center mb-4 mt-6">🏡 Loan Calculator</h2>

        <div className="grid grid-cols-2 gap-4">
          {/* ✅ Loan Amount */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300">Loan Amount (Php)</label>
            <input
              type="text"
              value={formatNumber(loanAmount)}
              onChange={(e) => setLoanAmount(allowOnlyNumericWithDecimal(e.target.value))}
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          {/* ✅ Interest Rate */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300">Interest Rate (%)</label>
            <input
              type="text"
              value={interestRate}
              onChange={(e) => setLoanAmount(allowOnlyNumericWithDecimal(e.target.value))}
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          {/* ✅ Loan Term - Years */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300">Loan Term (Years)</label>
            <select
              value={loanTermYears}
              onChange={(e) => setLoanTermYears(e.target.value)}
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              {[...Array(26).keys()].map((year) => (
                <option key={year} value={year}>
                  {year} {year === 1 ? "Year" : "Years"}
                </option>
              ))}
            </select>
          </div>

          {/* ✅ Loan Term - Months */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300">Loan Term (Months)</label>
            <select
              value={loanTermMonths}
              onChange={(e) => setLoanTermMonths(e.target.value)}
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              {[...Array(12).keys()].map((month) => (
                <option key={month} value={month}>
                  {month} {month === 1 ? "Month" : "Months"}
                </option>
              ))}
            </select>
          </div>

          {/* ✅ Down Payment */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300">Down Payment (Php)</label>
            <input
              type="text"
              value={formatNumber(downPayment)}
              onChange={(e) => setDownPayment((allowOnlyNumericWithDecimal.target.value))}
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          {/* ✅ Discount */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300">Discount (%)</label>
            <input
              type="text"
              value={discount}
              onChange={(e) => setDiscount(allowOnlyNumericWithDecimal(e.target.value))}
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Enter discount percentage (e.g., 20 for 20%)"
            />
          </div>

          {/* ✅ Property Tax */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300">Property Tax (%)</label>
            <input
              type="text"
              value={propertyTax}
              onChange={(e) => setPropertyTax((allowOnlyNumericWithDecimal.target.value))}
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Default: 1.2%"
            />
          </div>

          {/* ✅ Home Insurance */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300">Home Insurance (Php/Year)</label>
            <input
              type="text"
              value={formatNumber(insurance)}
              onChange={(e) => setInsurance((allowOnlyNumericWithDecimal.target.value))}
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Optional"
            />
          </div>

          {/* ✅ HOA Fees */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300">HOA Fees (Php/Month)</label>
            <input
              type="text"
              value={formatNumber(hoaFees)}
              onChange={(e) => setHoaFees((allowOnlyNumericWithDecimal.target.value))}
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Optional"
            />
          </div>
        </div>

        <div className="mt-6 text-center">
          <h3 className="text-lg font-medium">Estimated Monthly Payment:</h3>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">Php {formatNumber(monthlyPayment)}</p>
        </div>

        <LoanGraph monthlyPayment={monthlyPayment} />
        <LoanTable
          loanAmount={loanAmount}
          interestRate={interestRate}
          loanTerm={loanTermYears * 12 + Number(loanTermMonths)}
          loanTermType="months"
          extraPayment={0}
          downPayment={downPayment}
        />
      </div>
      <Footer />
    </div>
  );
}
