import { motion } from 'framer-motion';
import { Player } from '@remotion/player';
import { AeriumVideo, AERIUM_VIDEO_DURATION } from '@/remotion/AeriumVideo';
import { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';

const VideoSection = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const savedMusicState = localStorage.getItem('backgroundMusicPlaying');
    if (savedMusicState === 'true') {
      setIsPlaying(true);
    }
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch(() => {
        setIsPlaying(false);
      });
    } else {
      audio.pause();
    }

    localStorage.setItem('backgroundMusicPlaying', String(isPlaying));
  }, [isPlaying]);

  const toggleMusic = () => {
    setIsPlaying(!isPlaying);
  };

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
          className="relative rounded-2xl overflow-hidden border border-border shadow-2xl bg-card"
        >
          {/* Remotion Video Player */}
          <Player
            component={AeriumVideo}
            durationInFrames={AERIUM_VIDEO_DURATION}
            compositionWidth={1920}
            compositionHeight={1080}
            fps={30}
            controls
            style={{
              width: '100%',
              height: 'auto',
              aspectRatio: '16 / 9',
            }}
          />

          {/* Music Control Button */}
          <div className="absolute top-4 right-4 z-10">
            <Button
              variant="secondary"
              size="sm"
              onClick={toggleMusic}
              className="gap-2 backdrop-blur-sm bg-background/80"
              title={isPlaying ? "Arrêter la musique" : "Écouter la musique"}
            >
              {isPlaying ? (
                <>
                  <Volume2 className="w-4 h-4" />
                  Son
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4" />
                  Muet
                </>
              )}
            </Button>
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

      {/* Background Music */}
      <audio
        ref={audioRef}
        loop
        src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3"
        crossOrigin="anonymous"
      />
    </section>
  );
};

export default VideoSection;
