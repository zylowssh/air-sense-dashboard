import { motion } from 'framer-motion';
import { Player, PlayerRef } from '@remotion/player';
import { AeriumVideo, AERIUM_VIDEO_DURATION } from '@/remotion/AeriumVideo';
import { useState, useEffect, useRef, forwardRef } from 'react';

const VideoSection = forwardRef<HTMLDivElement>((props, ref) => {
  const playerRef = useRef<PlayerRef>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showControls, setShowControls] = useState(false);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle Intersection Observer for auto-play/stop
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (playerRef.current) {
            playerRef.current.play();
          }
        } else {
          if (playerRef.current) {
            playerRef.current.pause();
          }
        }
      },
      { threshold: 0.3 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  // Note: audio is now embedded in the Remotion video composition (AeriumVideo)
  // and plays automatically as part of the video without separate controls.


  // Handle mouse movement to show/hide controls
  const handleMouseEnter = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    // Auto-hide controls after 3 seconds of inactivity
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  };

  const handleMouseLeave = () => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    setShowControls(false);
  };

  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  return (
    <section ref={ref || containerRef} className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold text-foreground mb-4"
          >
            Découvrez Aerium en Action
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Visualisez comment notre technologie surveille et analyse la qualité de l'air en temps réel.
          </motion.p>
        </div>

        <motion.div
          ref={containerRef}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="relative rounded-2xl overflow-hidden border border-border shadow-2xl bg-card group"
          onMouseEnter={handleMouseEnter}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* Remotion Video Player */}
          <div className="overflow-hidden rounded-2xl">
            <Player
              ref={playerRef}
              component={AeriumVideo}
              durationInFrames={AERIUM_VIDEO_DURATION}
              compositionWidth={1920}
              compositionHeight={1080}
              fps={30}
              controls={showControls}
              loop
              acknowledgeRemotionLicense={true}
              style={{
                width: '100%',
                height: 'auto',
                aspectRatio: '16 / 9',
              }}
            />
          </div>

          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent pointer-events-none rounded-2xl" />
        </motion.div>

        {/* Feature highlights below video */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          {[
            {
              title: 'Visualisation en Temps Réel',
              description: 'Observez les variations de CO₂, température et humidité instantanément.',
            },
            {
              title: 'Alertes Automatiques',
              description: 'Soyez notifié dès qu\'un seuil critique est atteint.',
            },
            {
              title: 'Historique Complet',
              description: 'Analysez les tendances sur des périodes personnalisées.',
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="text-center"
            >
              <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
});

VideoSection.displayName = 'VideoSection';

export default VideoSection;
