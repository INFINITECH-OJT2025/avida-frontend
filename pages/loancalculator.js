import { useState, useEffect } from "react";
import LoanGraph from "./loangraph";
import LoanTable from "./loantable";
import Header from "../src/components/Header";
import Footer from "../src/components/Footer";
import SEOComponent from "../src/hooks/useSEO";
import { useToast } from "../src/context/ToastContext";

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
  const { showToast } = useToast();

  useEffect(() => {
    calculateLoan();
  }, [loanAmount, interestRate, loanTermYears, loanTermMonths, downPayment, discount, propertyTax, insurance, hoaFees]);
const parseNumberInput = (value, label = "Field") => {
  const cleaned = value.replace(/,/g, "").replace(/ /g, "");
  if (!/^\d*\.?\d*$/.test(cleaned)) {
    showToast(`${label} must only contain numbers and at most one decimal.`, "error");
    return ""; // Clear invalid input
  }
  return cleaned;
};


  const allowOnlyValidNumeric = (val) => {
    let clean = val.replace(/[^\d.]/g, "");
    const parts = clean.split(".");
    if (parts.length > 2) {
      clean = parts[0] + "." + parts.slice(1).join("");
    }
    return clean;
  };

  const formatNumber = (value, separator = ",") => {
    if (!value || isNaN(value)) return "";
    const [whole, decimal] = parseNumberInput(value).split(".");
    const formattedWhole = whole.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
    return decimal !== undefined ? `${formattedWhole}.${decimal}` : formattedWhole;
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
    let payment = (loanPrincipal * monthlyInterest) / (1 - Math.pow(1 + monthlyInterest, -totalMonths));

    let taxMonthly = (taxRate / 100 / 12) * principal;
    let insuranceMonthly = insuranceCost / 12;
    let totalMonthlyPayment = payment + taxMonthly + insuranceMonthly + hoa;

    setMonthlyPayment(totalMonthlyPayment.toFixed(2));
    
  };

  return (
    <div className=" top-0 left-0 w-full z-10 bg-white dark:bg-gray-900">
      <SEOComponent />
      <Header />

      <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md mt-20">
        <h1 className="text-4xl font-semibold text-center mb-4">Loan Calculator</h1>

        <div className="grid grid-cols-2 gap-4">
          {[{
            label: "Loan Amount (Php)", value: loanAmount, setter: setLoanAmount
          }, {
            label: "Interest Rate (%)", value: interestRate, setter: setInterestRate
          }, {
            label: "Down Payment (Php)", value: downPayment, setter: setDownPayment
          }, {
            label: "Discount (%)", value: discount, setter: setDiscount
          }, {
            label: "Property Tax (%)", value: propertyTax, setter: setPropertyTax
          }, {
            label: "Home Insurance (Php/Year)", value: insurance, setter: setInsurance
          }, {
            label: "HOA Fees (Php/Month)", value: hoaFees, setter: setHoaFees
          }].map(({ label, value, setter }, i) => (
            <div key={i}>
              <label className="block text-gray-700 dark:text-gray-300">{label}</label>
              <input
                type="text"
                value={formatNumber(value)}
                onChange={(e) => setter(allowOnlyValidNumeric(e.target.value))}
                className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          ))}

          <div>
            <label className="block text-gray-700 dark:text-gray-300">Loan Term (Years)</label>
            <select
              value={loanTermYears}
              onChange={(e) => setLoanTermYears(e.target.value)}
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              {[...Array(26).keys()].map((year) => (
                <option key={year} value={year}>{year} {year >1  ? "Years" : "Year"}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300">Loan Term (Months)</label>
            <select
              value={loanTermMonths}
              onChange={(e) => setLoanTermMonths(e.target.value)}
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              {[...Array(12).keys()].map((month) => (
                <option key={month} value={month}>{month} {month > 1 ? "Months" : "Month"}</option>
              ))}
            </select>
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
