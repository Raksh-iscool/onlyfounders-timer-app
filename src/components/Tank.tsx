import { motion } from 'framer-motion'

interface TankProps {
    fillPercentage: number
}

export default function Tank({ fillPercentage }: TankProps) {
    return (
        <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
            {/* Liquid/Coins Fill */}
            <motion.div
                className="absolute bottom-0 left-0 right-0 bg-red-700/40 backdrop-blur-[2px]"
                initial={{ height: '0%' }}
                animate={{ height: `${fillPercentage}%` }}
                transition={{ type: "spring", bounce: 0, duration: 2 }}
                style={{
                    boxShadow: '0 0 20px rgba(220, 38, 38, 0.3)',
                    maskImage: 'linear-gradient(to top, black 90%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to top, black 90%, transparent 100%)' // For Safari support
                }}
            >
                {/* Coins Texture */}
                <div className="w-full h-full opacity-30"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-weight='bold' font-size='24' fill='white' fill-opacity='0.8'%3E$%3C/text%3E%3Ctext x='0' y='0' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-weight='bold' font-size='24' fill='white' fill-opacity='0.8'%3E$%3C/text%3E%3Ctext x='60' y='60' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-weight='bold' font-size='24' fill='white' fill-opacity='0.8'%3E$%3C/text%3E%3C/svg%3E")`,
                        backgroundSize: '60px 60px'
                    }}
                />

                {/* Bubbles / Sparkles effect to be alive */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </motion.div>

            {/* Glass Overlay Reflections */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-white/5 pointer-events-none" />
            <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]" />
        </div>
    )
}
