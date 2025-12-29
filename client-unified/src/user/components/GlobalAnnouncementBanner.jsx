import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Megaphone } from "lucide-react";
import { getAnnouncements } from "../api/api";

const GlobalAnnouncementBanner = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAnnouncements();
        setAnnouncements(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load announcements");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (announcements.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((i) => (i + 1) % announcements.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [announcements.length]);

  if (loading || announcements.length === 0) return null;

  const item = announcements[currentIndex];

  return (
    <motion.section
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full border-b border-white/10 
                 bg-gradient-to-r from-[#3A2C23] via-[#4A3A2F] to-[#3A2C23]"
    >
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-start sm:items-center gap-3">
          
          {/* Icon */}
          <div className="flex-shrink-0 w-9 h-9 rounded-full 
                          bg-amber-400/10 border border-amber-400/20 
                          flex items-center justify-center">
            <Megaphone className="w-4 h-4 text-amber-400" />
          </div>

          {/* Text */}
          <div className="relative w-full overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={item._id || currentIndex}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35 }}
                className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2"
              >
                <span className="inline-block text-xs sm:text-sm 
                                 font-semibold tracking-wide uppercase
                                 text-amber-300 bg-amber-300/10 
                                 px-2 py-0.5 rounded-md w-fit">
                  {item.title}
                </span>

                <p className="text-white text-sm sm:text-base 
                              leading-snug break-words">
                  {item.body}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Dots */}
        {announcements.length > 1 && (
          <div className="flex justify-center gap-1.5 mt-2">
            {announcements.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300
                  ${i === currentIndex 
                    ? "w-4 bg-amber-400" 
                    : "w-1.5 bg-white/30"}`}
              />
            ))}
          </div>
        )}
      </div>
    </motion.section>
  );
};

export default GlobalAnnouncementBanner;
