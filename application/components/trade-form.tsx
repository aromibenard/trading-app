
import SubmitButton from "./submit-button";
import { recordTrade } from "@/actions";

export default function Form() {
    return (
        <div>
            <form  action={recordTrade} className="shadow p-4 flex flex-col space-y-4 rounded px-6">
                <div className="flex flex-col space-y-2">
                    <div className="flex flex-col space-y-1">
                        <label htmlFor="currencyPair" className="font-medium">Currency Pair</label>
                        <select className="py-2 px-2 rounded-md" name="currencyPair">
                            <option value='AUD/CAD'>AUD/CAD</option>
                            <option value='GBP/USD'>GBP/USD</option>
                            <option value='EUR/USD'>EUR/USD</option>
                            <option value='USD/CHF'>USD/CHF</option>
                        </select>
                    </div>
                    <div className="flex flex-col space-y-1">
                        <label htmlFor="orderType" className="font-medium">Order Type</label>
                        <select className="py-2 px-2 rounded-md" name="orderType">
                            <option value='Buy'>Buy</option>
                            <option value='Sell'>Sell</option>
                        </select>
                    </div>
                    <div className="flex flex-col space-y-1">
                        <label htmlFor="result" className="font-medium">Result</label>
                        <select className="py-2 px-2 rounded-md" name="result">
                            <option value='profit'>Profit</option>
                            <option value='loss'>Loss</option>
                            <option value='breakeven'>Break-even</option>
                        </select>
                    </div>
                </div>
                <div className="flex flex-col space-y-2">
                    <label htmlFor="amount" className="font-medium">Amount (USD)</label>
                    <input
                        type="number"
                        name="amount"
                        className="bg-gray-100 shadow-sm p-1 rounded-md"
                        step={'0.01'}
                        required
                    />
                </div>
                <div className="flex flex-col space-y-2">
                    <label htmlFor="lotSize" className="font-medium">Lot Size</label>
                    <input
                        type="number"
                        name="lotSize"
                        className="bg-gray-100 shadow-sm p-1 rounded-md"
                        required
                        step={'0.01'}
                    />
                </div>
                <SubmitButton />
            </form>
        </div>
    )
}