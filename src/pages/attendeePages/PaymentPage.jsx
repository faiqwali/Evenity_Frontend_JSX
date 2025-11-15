"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

const MySwal = withReactContent(Swal)

const Payment = () => {
  const navigate = useNavigate()
  const [amount] = useState(49.99) // example amount
  const [method, setMethod] = useState("card")
  const [paid, setPaid] = useState(false)

  const handlePayNow = async () => {
    if (paid) return

    // Confirm payment
    const result = await MySwal.fire({
      title: "Confirm Payment",
      text: `Are you sure you want to pay $${amount.toFixed(2)}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Pay Now",
      cancelButtonText: "Cancel",
    })

    if (result.isConfirmed) {
      // Payment success
      setPaid(true)
      await MySwal.fire({
        title: "Payment Successful!",
        text: "Your payment has been processed successfully.",
        icon: "success",
        confirmButtonText: "OK",
      })

      // Redirect to home page
      navigate("/")
    }
  }

  return (
    
    <>

      {/* Payment Container */}
      <div className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Complete Your Payment</h2>

          <div className="bg-white rounded-lg border shadow p-6">
            <div className="text-sm text-gray-500">Amount to Pay</div>
            <div className="mt-2 flex items-baseline gap-3">
              <div className="text-4xl font-extrabold text-indigo-700">${amount.toFixed(2)}</div>
              <div className="text-xs text-gray-500">USD</div>
            </div>

            <div className="mt-6">
              <div className="text-sm text-gray-600 mb-2">Payment Methods</div>

              {/* Card */}
              <label className={`flex items-center gap-3 p-3 rounded border ${method === "card" ? "border-indigo-400 bg-indigo-50" : "border-gray-200"} cursor-pointer`}>
                <input
                  type="radio"
                  name="method"
                  value="card"
                  checked={method === "card"}
                  onChange={() => setMethod("card")}
                  className="sr-only"
                />
                <img src="/images/card.png" alt="Card" className="w-12 h-8 object-contain" />
                <div className="flex-1">
                  <div className="text-sm font-semibold">Credit / Debit Card</div>
                  <div className="text-xs text-gray-500">Visa, Mastercard, Amex</div>
                </div>
              </label>

              {/* Wallet */}
              <label className={`flex items-center gap-3 p-3 mt-3 rounded border ${method === "wallet" ? "border-indigo-400 bg-indigo-50" : "border-gray-200"} cursor-pointer`}>
                <input
                  type="radio"
                  name="method"
                  value="wallet"
                  checked={method === "wallet"}
                  onChange={() => setMethod("wallet")}
                  className="sr-only"
                />
                <img src="/images/wallet.png" alt="Wallet" className="w-12 h-8 object-contain" />
                <div className="flex-1">
                  <div className="text-sm font-semibold">Wallet</div>
                  <div className="text-xs text-gray-500">Pay using wallet balance</div>
                </div>
              </label>

              {/* Bank */}
              <label className={`flex items-center gap-3 p-3 mt-3 rounded border ${method === "bank" ? "border-indigo-400 bg-indigo-50" : "border-gray-200"} cursor-pointer`}>
                <input
                  type="radio"
                  name="method"
                  value="bank"
                  checked={method === "bank"}
                  onChange={() => setMethod("bank")}
                  className="sr-only"
                />
                <img src="/images/bank.png" alt="Bank" className="w-12 h-8 object-contain" />
                <div className="flex-1">
                  <div className="text-sm font-semibold">Bank Transfer</div>
                  <div className="text-xs text-gray-500">Secure bank payment</div>
                </div>
              </label>
            </div>
          </div>

          {/* Pay Now Button */}
          <button
            disabled={paid}
            onClick={handlePayNow}
            className={`mt-6 w-full py-4 rounded-xl font-semibold text-lg transition-all ${
              paid
                ? "bg-gray-300 cursor-not-allowed text-gray-600"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
          >
            {paid ? "Payment Completed" : "Pay Now"}
          </button>
        </div>
      </div>

     </>
  )
}

export default Payment
