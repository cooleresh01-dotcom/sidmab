'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import { HiMail, HiPhone } from 'react-icons/hi'
import { FaLinkedinIn, FaTwitter, FaInstagram } from 'react-icons/fa'
import { teamMembers } from '@/lib/data'
import { cn } from '@/lib/utils'
import PageHero from '@/components/ui/PageHero'

function TeamGrid() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="section-padding">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            Who We Are
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
            Dedicated to Excellence
          </h2>
          <p className="text-base-content/70">
            Every member of our team brings unique expertise and passion to
            create extraordinary events.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              whileHover={{ y: -10 }}
              className="group"
            >
              <div className="card bg-base-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="relative h-72 overflow-hidden">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <div className="flex gap-2">
                      <a
                        href="#"
                        className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-primary transition-colors"
                      >
                        <FaLinkedinIn className="w-3.5 h-3.5" />
                      </a>
                      <a
                        href="#"
                        className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-primary transition-colors"
                      >
                        <FaTwitter className="w-3.5 h-3.5" />
                      </a>
                      <a
                        href="#"
                        className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-primary transition-colors"
                      >
                        <FaInstagram className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>

                <div className="card-body p-5 text-center">
                  <h3 className="font-semibold text-lg">{member.name}</h3>
                  <p className="text-sm text-primary font-medium">
                    {member.role}
                  </p>
                  <p className="text-xs text-base-content/60 mt-1">
                    {member.experience} years experience
                  </p>
                  <p className="text-sm text-base-content/70 mt-3 line-clamp-3">
                    {member.bio}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function JoinTeamSection() {
  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1920"
          alt="Join Us"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/80" />
      </div>
      <div className="relative z-10 container mx-auto text-center text-primary-content">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Join Our Team
          </h2>
          <p className="text-lg opacity-80 max-w-2xl mx-auto mb-8">
            Passionate about events? We&apos;re always looking for talented
            individuals to join the SIDMAB family.
          </p>
          <a
            href="mailto:careers@sidmab.com"
            className="btn btn-lg bg-white text-primary hover:bg-white/90 rounded-full px-8 border-none gap-2"
          >
            <HiMail className="w-5 h-5" />
            Send Your Resume
          </a>
        </motion.div>
      </div>
    </section>
  )
}

export default function TeamPage() {
  return (
    <>
      <PageHero
        title="Our Team"
        subtitle="Meet the passionate professionals behind SIDMAB Events & Management."
        image="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920"
        badge="Who We Are"
      />
      <TeamGrid />
    </>
  )
}
