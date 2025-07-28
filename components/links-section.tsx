"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { ArrowUpRight } from "lucide-react"
import type { Link } from "@/lib/db"
import { getSocialIcon, getSocialColor } from "@/lib/social-icons"

interface LinksSectionProps {
  links: Link[]
}

export function LinksSection({ links }: LinksSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      className="space-y-3 xs:space-y-4"
    >
      {links.map((link, index) => {
        const IconComponent = getSocialIcon(link.url)
        const iconColor = getSocialColor(link.url)

        return (
          <motion.a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.1 * index + 0.7,
              ease: [0.16, 1, 0.3, 1],
            }}
            whileHover={{
              scale: 1.02,
              y: -2,
              transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
            }}
            whileTap={{ scale: 0.98 }}
            className="group flex items-center w-full relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/3 via-white/5 to-white/3 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative flex items-center w-full bg-white/3 backdrop-blur-sm border border-white/10 rounded-xl p-4 xs:p-5 transition-all duration-300 group-hover:border-white/20 group-hover:shadow-xl group-hover:shadow-white/5">
              <div className="flex items-center justify-center w-12 h-12 xs:w-14 xs:h-14 rounded-xl bg-white/5 backdrop-blur-sm mr-4 xs:mr-5 flex-shrink-0 group-hover:bg-white/10 transition-colors duration-300">
                {link.icon_url ? (
                  <Image
                    src={link.icon_url || "/placeholder.svg"}
                    alt=""
                    width={24}
                    height={24}
                    className="w-6 h-6 xs:w-7 xs:h-7 rounded transition-transform duration-300 group-hover:scale-110"
                  />
                ) : (
                  <IconComponent
                    size={24}
                    className="w-6 h-6 xs:w-7 xs:h-7 text-white/80 group-hover:scale-110 transition-all duration-300"
                    style={{ color: iconColor }}
                  />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-base xs:text-lg text-white/90 truncate group-hover:text-white transition-colors duration-300">
                  {link.title}
                </h3>
              </div>

              <ArrowUpRight
                size={18}
                className="w-5 h-5 text-white/40 group-hover:text-white/80 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300 flex-shrink-0"
              />
            </div>
          </motion.a>
        )
      })}
    </motion.div>
  )
}
