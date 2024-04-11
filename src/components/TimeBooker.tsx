"use client"

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import ClassBookingCard from './ClassBookingCard'

function TimeBooker() {

    const [date, setDate] = useState<Date | undefined>(new Date())

    return (
        <div className="flex flex-col items-center">
            <div className="flex justify-center items-stretch space-x-4">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border"
                />
                <div className="h-[350px] w-[350px] flex flex-col">
                    <div className="h-[50px] flex items-center justify-center border rounded-md mb-4">
                        {date ? date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }) : "Select a date"}
                    </div>
                    <div className="flex-1 rounded-md border p-4 overflow-y-auto">
                    
                        <ScrollArea className="h-full">
                            {Array.from({ length: 24 }, (_, index) => (
                                <ClassBookingCard 
                                    key={index} 
                                    id={index.toString()} 
                                    startTime={new Date()} 
                                    duration={1} 
                                    name="Yoga" 
                                    description="A relaxing yoga class" 
                                    location="Yoga Studio" 
                                    instructorName="John Doe"
                                />
                            ))}
                        </ScrollArea>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default TimeBooker