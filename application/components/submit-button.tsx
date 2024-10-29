'use client'

import { useFormStatus } from "react-dom"

export default function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <button type="submit" disabled={pending} 
        className={` p-1 rounded-md shadow-md text-white transition ${
            pending ? 'opacity-80 cursor-progress bg-teal-700' : 
            'bg-teal-600 hover:scale-105'
        }`}>
            Submit
        </button>
    )
}