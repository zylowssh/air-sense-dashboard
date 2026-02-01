import { motion } from 'framer-motion';
import { Play, Pause } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
// Animated motion graphics component simulating Remotion-style animation
const AnimatedGraphics = () => {
  return (
    <div className="relative w-full h-full bg-gradient-to-br from-primary/20 via-background to-accent/20 overflow-hidden">
      {/* Animated particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-primary/40"
          initial={{
            x: Math.random() * 100 + '%',
            y: Math.random() * 100 + '%',
            scale: 0,
          }}
          animate={{
            x: [
              `${Math.random() * 100}%`,
              `${Math.random() * 100}%`,
              `${Math.random() * 100}%`,
            ],
            y: [
              `${Math.random() * 100}%`,
              `${Math.random() * 100}%`,
              `${Math.random() * 100}%`,
            ],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 8 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}

      {/* Central animated sensor visualization */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          {/* Pulsing rings */}
          {[1, 2, 3].map((ring) => (
            <motion.div
              key={ring}
              className="absolute inset-0 rounded-full border-2 border-primary/30"
              style={{
                width: 100 + ring * 60,
                height: 100 + ring * 60,
                left: `calc(50% - ${(100 + ring * 60) / 2}px)`,
                top: `calc(50% - ${(100 + ring * 60) / 2}px)`,
              }}
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: ring * 0.3,
              }}
            />
          ))}

          {/* Central circle with CO2 animation */}
          <motion.div
            className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-2xl"
            animate={{
              boxShadow: [
                '0 0 20px rgba(var(--primary), 0.3)',
                '0 0 40px rgba(var(--primary), 0.6)',
                '0 0 20px rgba(var(--primary), 0.3)',
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          >
            <div className="text-center text-primary-foreground">
              <motion.div
                className="text-2xl font-bold"
                animate={{ opacity: [1, 0.7, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                CO₂
              </motion.div>
              <motion.div
                className="text-lg"
                key="co2-value"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <CountUpAnimation from={400} to={850} />
                <span className="text-xs ml-1">ppm</span>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Floating data cards */}
        <motion.div
          className="absolute top-1/4 left-1/4 bg-card/80 backdrop-blur-sm rounded-lg p-3 border border-border shadow-lg"
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
          }}
        >
          <div className="text-xs text-muted-foreground">Température</div>
          <div className="text-lg font-semibold text-foreground">23.5°C</div>
        </motion.div>

        <motion.div
          className="absolute bottom-1/4 right-1/4 bg-card/80 backdrop-blur-sm rounded-lg p-3 border border-border shadow-lg"
          animate={{
            y: [0, 10, 0],
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
          }}
        >
          <div className="text-xs text-muted-foreground">Humidité</div>
          <div className="text-lg font-semibold text-foreground">55%</div>
        </motion.div>

        {/* Animated connection lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <motion.path
            d="M200,200 Q300,150 350,200"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
            fill="none"
            strokeDasharray="5,5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </svg>
      </div>
    </div>
  );
};

// Count up animation component
const CountUpAnimation = ({ from, to }: { from: number; to: number }) => {
  const [count, setCount] = useState(from);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => {
        const newValue = prev + Math.round((Math.random() - 0.5) * 20);
        return Math.max(from, Math.min(to, newValue));
      });
    }, 1500);
    return () => clearInterval(interval);
  }, [from, to]);

  return <span>{count}</span>;
};

const VideoSection = () => {
  const [isPlaying, setIsPlaying] = useState(true);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
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
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="relative aspect-video rounded-2xl overflow-hidden border border-border shadow-2xl bg-card"
        >
          {/* Motion Graphics Animation (Remotion-style) */}
          <div className="absolute inset-0">
            {isPlaying ? (
              <AnimatedGraphics />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Play className="w-8 h-8 text-primary ml-1" />
                  </div>
                  <p className="text-muted-foreground">Cliquez pour lancer l'animation</p>
                </div>
              </div>
            )}
          </div>

          {/* Play/Pause overlay */}
          <div className="absolute bottom-4 right-4">
            <Button
              size="sm"
              variant="secondary"
              className="backdrop-blur-sm bg-background/80"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Lecture
                </>
              )}
            </Button>
          </div>

          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent pointer-events-none" />
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
};

export default VideoSection;
