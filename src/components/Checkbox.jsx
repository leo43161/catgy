import React from 'react'
import { cn } from "@/lib/utils"
import { CheckIcon } from "@radix-ui/react-icons"

export default function Checkbox({ className }) {
    return (
        <input
            type='checkbox'
            className={cn(
                "peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
                className
            )}>
            <span data-state="checked" className="flex items-center justify-center text-current" style="pointer-events: none;">
                <CheckIcon className="h-4 w-4" />
            </span>
        </input>
    )
}
