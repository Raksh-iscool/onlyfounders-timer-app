import { useState, useEffect } from 'react'
import { clsx } from 'clsx'

interface CountdownProps {
    targetDate: Date
}

export default function Countdown({ targetDate }: CountdownProps) {
    const [timeLeft, setTimeLeft] = useState({
        totalHours: 0,
        minutes: 0,
        seconds: 0
    })
    const [isUrgent, setIsUrgent] = useState(false)

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date()
            const difference = targetDate.getTime() - now.getTime()

            if (difference > 0) {
                const totalHours = Math.floor(difference / (1000 * 60 * 60))
                const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
                const seconds = Math.floor((difference % (1000 * 60)) / 1000)

                setTimeLeft({
                    totalHours,
                    minutes,
                    seconds
                })

                // Urgent if less than 30 minutes left (total hours must be 0)
                setIsUrgent(totalHours === 0 && minutes < 30)
            } else {
                setTimeLeft({ totalHours: 0, minutes: 0, seconds: 0 })
                setIsUrgent(false)
            }
        }

        calculateTimeLeft()
        const timer = setInterval(calculateTimeLeft, 1000)

        return () => clearInterval(timer)
    }, [targetDate])

    const TimeUnit = ({ value, label }: { value: number, label: string }) => (
        <div className="flex flex-col items-center mx-2 md:mx-6 min-w-[120px] md:min-w-[180px]">
            <div
                className={clsx(
                    "text-6xl md:text-9xl font-black transition-colors duration-500 tabular-nums w-full text-center",
                    isUrgent ? "text-red-600 drop-shadow-[0_0_25px_rgba(220,38,38,0.9)]" : "text-yellow-500 drop-shadow-[0_0_15px_rgba(234,179,8,0.6)]"
                )}
                style={{ fontFamily: '"Impact", "Arial Black", sans-serif' }}
            >
                {String(value).padStart(2, '0')}
            </div>
            <span className={clsx(
                "text-sm md:text-xl uppercase tracking-widest mt-2 md:mt-4 font-bold",
                isUrgent ? "text-red-200" : "text-yellow-200"
            )}>{label}</span>
        </div>
    )

    return (
        <div className={clsx(
            "flex flex-row justify-center items-center p-8 md:p-12 rounded-3xl backdrop-blur-md transition-colors duration-500 shadow-[0_0_50px_rgba(0,0,0,0.8)] bg-black/60")}>
            <TimeUnit value={timeLeft.totalHours} label="Hours" />
            <span className={clsx(
                "text-7xl font-black relative -top-6 transition-colors duration-500",
                isUrgent ? "text-red-600" : "text-yellow-500"
            )}>:</span>
            <TimeUnit value={timeLeft.minutes} label="Minutes" />
            <span className={clsx(
                "text-7xl font-black relative -top-6 transition-colors duration-500",
                isUrgent ? "text-red-600" : "text-yellow-500"
            )}>:</span>
            <TimeUnit value={timeLeft.seconds} label="Seconds" />
        </div>
    )
}
