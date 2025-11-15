"use client"

import { motion } from "framer-motion"
import { Music, Trophy, GraduationCap, Mic, Car, Theater, Calendar, PartyPopper } from "lucide-react"
import { Link } from "react-router-dom"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

const Categories = () => {
  const categories = [
    {
      name: "Concerts",
      icon: <Music className="w-12 h-12" />,
      description: "Live music performances from your favorite artists",
      image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&h=400&fit=crop",
      count: "150+ events",
      slug: "concerts",
    },
    {
      name: "Sports",
      icon: <Trophy className="w-12 h-12" />,
      description: "Exciting sporting events and competitions",
      image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&h=400&fit=crop",
      count: "80+ events",
      slug: "sports",
    },
    {
      name: "Stand-up Comedy",
      icon: <Mic className="w-12 h-12" />,
      description: "Laugh out loud with top comedians",
      image: "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=600&h=400&fit=crop",
      count: "60+ events",
      slug: "comedy",
    },
    {
      name: "Educational Events",
      icon: <GraduationCap className="w-12 h-12" />,
      description: "Workshops, seminars, and learning experiences",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop",
      count: "40+ events",
      slug: "educational",
    },
    {
      name: "Automobile Events",
      icon: <Car className="w-12 h-12" />,
      description: "Car shows, races, and automotive exhibitions",
      image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&h=400&fit=crop",
      count: "30+ events",
      slug: "automobile",
    },
    {
      name: "Theater & Arts",
      icon: <Theater className="w-12 h-12" />,
      description: "Drama, musicals, and artistic performances",
      image: "https://images.unsplash.com/photo-1503095396549-807759245b35?w=600&h=400&fit=crop",
      count: "50+ events",
      slug: "theater",
    },
    {
      name: "Festivals",
      icon: <PartyPopper className="w-12 h-12" />,
      description: "Music festivals, cultural celebrations, and more",
      image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600&h=400&fit=crop",
      count: "70+ events",
      slug: "festivals",
    },
    {
      name: "Conferences",
      icon: <Calendar className="w-12 h-12" />,
      description: "Business conferences and networking events",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop",
      count: "45+ events",
      slug: "conferences",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
    

      {/* Header */}
      <section className="relative bg-concert-blue text-white py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-concert-blue to-concert-blue/80"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Event Categories</h1>
            <p className="text-xl text-white/90">Explore various types of events and find what interests you most</p>
          </motion.div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link to={`/events/${category.slug}`}>
                <div className="group cursor-pointer">
                  <div className="relative rounded-2xl overflow-hidden mb-4 h-64 hover-lift">
                    <img
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <div className="text-white mb-2">{category.icon}</div>
                      <h3 className="text-white font-bold text-2xl mb-1">{category.name}</h3>
                      <p className="text-white/80 text-sm">{category.count}</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm">{category.description}</p>
                  <button className="mt-3 w-full bg-primary/10 text-primary py-2.5 rounded-lg hover:bg-primary hover:text-white transition-colors font-medium">
                    View Events
                  </button>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

    
    </div>
  )
}

export default Categories
