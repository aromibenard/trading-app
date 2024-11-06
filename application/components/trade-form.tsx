
import SubmitButton from "./submit-button";
import { recordTrade } from "@/actions";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Label } from "./ui/label";
import Form from 'next/form'

export default function TradeForm() {
    return (
        <div>
            <Form action={recordTrade} className="shadow p-4 pb-6 flex flex-col space-y-4 rounded px-5">
                <div className="flex flex-col space-y-2">
                    <div className="flex flex-col space-y-3">
                        <Label htmlFor="currencyPair">Currency Pair</Label>
                        <Select name="currencyPair">
                            <SelectTrigger >
                                <SelectValue placeholder="Select pair" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="AUD/CAD">AUD/CAD</SelectItem>
                                    <SelectItem value="GBP/USD">GBP/USD</SelectItem>
                                    <SelectItem value="EUR/USD">EUR/USD</SelectItem>
                                    <SelectItem value="USD/CHF">USD/CHF</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex flex-col space-y-3">
                        <Label htmlFor="orderType">Order</Label>
                        <Select name="orderType">
                            <SelectTrigger >
                                <SelectValue placeholder="Select order" />
                            </SelectTrigger>
                            <SelectContent>
                            <SelectGroup>
                                <SelectItem value="Buy">Buy</SelectItem>
                                <SelectItem value="Sell">Sell</SelectItem>
                            </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex flex-col space-y-3">
                        <Label htmlFor="result" className="font-medium">Result</Label>
                        <Select name="result">
                            <SelectTrigger >
                                <SelectValue placeholder="Select order" />
                            </SelectTrigger>
                            <SelectContent>
                            <SelectGroup>
                                <SelectItem value="profit">Profit</SelectItem>
                                <SelectItem value="loss">Loss</SelectItem>
                            </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="flex flex-col space-y-3">
                    <Label htmlFor="amount" className="font-medium">Amount (USD)</Label>
                    <input
                        type="number"
                        name="amount"
                        className="bg-gray-100 shadow-sm p-1 rounded-md"
                        step={'0.01'}
                        required
                        min={'0'}
                    />
                </div>
                <div className="flex flex-col space-y-2">
                    <Label htmlFor="lotSize" className="font-medium">Lot Size</Label>
                    <input
                        type="number"
                        name="lotSize"
                        className="bg-gray-100 shadow-sm p-1 rounded-md"
                        step={'0.01'}
                        required
                        min={'0'}
                    />
                </div>
                <SubmitButton />
            </Form>
        </div>
    )
}