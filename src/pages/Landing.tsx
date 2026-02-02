import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Activity, 
  TrendingUp, 
  Zap, 
  BarChart3, 
  Bell, 
  Wind,
  ArrowRight,
  Gauge,
  Leaf,
  Code2,
  Github,
  LogIn,
  Lightbulb,
  Terminal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import VideoSection from '@/components/landing/VideoSection';
import { useState, useEffect } from 'react';

const features = [
  {
    icon: BarChart3,
    title: 'Dashboard Avancé',
    description: 'Visualisez les données en temps réel avec des graphiques interactifs et des analyses détaillées.'
  },
  {
    icon: Bell,
    title: 'Système d\'Alertes',
    description: 'Notifications intelligentes basées sur des seuils personnalisés pour chaque capteur.'
  },
  {
    icon: TrendingUp,
    title: 'Analyses Tendances',
    description: 'Comparez les données historiques et identifiez les patterns de qualité de l\'air.'
  },
  {
    icon: Wind,
    title: 'Support Multi-Capteurs',
    description: 'Compatible avec une large gamme de capteurs IoT pour une flexibilité maximale.'
  },
  {
    icon: Gauge,
    title: 'Métriques Détaillées',
    description: 'Suivi complet de CO2, humidité, température et autres paramètres clés.'
  },
  {
    icon: Lightbulb,
    title: 'Recommandations',
    description: 'Suggestions intelligentes pour améliorer la qualité de l\'air de vos espaces.'
  }
];

const techStack = [
  { name: 'React + TypeScript', icon: Code2 },
  { name: 'Python Flask', icon: Terminal },
  { name: 'Real-time Updates', icon: Zap },
  { name: 'Database', icon: Activity }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

const Landing = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.div 
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-9 h-9 rounded-lg overflow-hidden">
                <img src="/logo.png" alt="Aerium" className="w-full h-full object-contain" />
              </div>
              <span className="text-xl font-bold text-foreground">Aerium</span>
            </motion.div>
            <motion.div 
              className="flex items-center gap-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link to="/dashboard">
                <Button variant="ghost" className="gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Démo
                </Button>
              </Link>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" className="gap-2">
                  <Github className="w-4 h-4" />
                </Button>
              </a>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Parallax */}
      <section className="relative min-h-screen pt-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center overflow-hidden">
        {/* Animated Background Elements */}
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"
          animate={{ y: scrollY * 0.5 }}
          transition={{ type: 'spring', stiffness: 10 }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl"
          animate={{ y: -scrollY * 0.5 }}
          transition={{ type: 'spring', stiffness: 10 }}
        />

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 border border-primary/20"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-4 h-4 rounded overflow-hidden flex-shrink-0">
                <img src="/logo.png" alt="" className="w-full h-full object-contain" />
              </div>
              Projet de Surveillance de la Qualité de l'Air
            </motion.div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-8 leading-tight">
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="block mb-4"
              >
                Surveillez l'Air
              </motion.span>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary"
              >
                en Temps Réel
              </motion.span>
            </h1>

            <motion.p 
              className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              Un dashboard interactif pour monitorer la qualité de l'air avec des capteurs IoT, 
              des analyses avancées et des alertes intelligentes.
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              <Link to="/dashboard">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="lg" className="gradient-primary text-primary-foreground px-8 h-12 text-lg">
                    Explorer le Dashboard
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </motion.div>
              </Link>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" variant="outline" className="px-8 h-12 text-lg">
                  En Savoir Plus
                </Button>
              </motion.div>
            </motion.div>

            {/* Tech Stack Pills */}
            <motion.div
              className="flex flex-wrap items-center justify-center gap-4 mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              {techStack.map((tech, index) => (
                <motion.div
                  key={index}
                  className="px-4 py-2 rounded-full bg-card border border-border/50 text-sm font-medium text-foreground/80"
                  whileHover={{ borderColor: 'hsl(var(--primary))' }}
                  transition={{ duration: 0.3 }}
                >
                  {tech.name}
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            className="absolute left-1/2 transform -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="flex flex-col items-center gap-2">
              <p className="text-xs text-muted-foreground">Scroll to explore</p>
              <div className="w-6 h-10 border-2 border-primary/30 rounded-full flex items-start justify-center p-2">
                <motion.div
                  className="w-1 h-2 bg-primary rounded-full"
                  animate={{ y: [0, 4, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Video Section */}
      <VideoSection />

      {/* Features Section with Stagger Animation */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
              Fonctionnalités
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Un ensemble complet d'outils pour une surveillance efficace de la qualité de l'air.
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
                whileHover={{ y: -8 }}
              >
                <motion.div 
                  className="w-14 h-14 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-6 group-hover:from-primary/40 group-hover:to-accent/40 transition-all duration-300"
                  whileHover={{ rotate: 12, scale: 1.1 }}
                >
                  <feature.icon className="w-7 h-7 text-primary" />
                </motion.div>
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>


      {/* How It Works Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
              Comment Ça Marche
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Une architecture simple et efficace pour la surveillance en temps réel.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {[
              { number: '1', title: 'Capteurs IoT', description: 'Des capteurs collectent les données de qualité de l\'air' },
              { number: '2', title: 'Backend Python', description: 'Les données sont traitées et stockées en temps réel' },
              { number: '3', title: 'Dashboard React', description: 'Visualisation interactive et alertes intelligentes' }
            ].map((step, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="relative p-8 rounded-2xl bg-card border border-border"
              >
                <div className="absolute top-0 left-8 transform -translate-y-1/2">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-lg">
                    {step.number}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3 mt-4">
                  {step.title}
                </h3>
                <p className="text-muted-foreground">{step.description}</p>
                {index < 2 && (
                  <motion.div
                    className="hidden md:block absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2"
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <ArrowRight className="w-6 h-6 text-primary/50" />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Project Highlights */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
              Points Forts du Projet
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Découvrez ce qui rend Aerium unique et performant.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12">
            {[
              {
                title: 'Interface Moderne',
                description: 'Built avec React, TypeScript et Tailwind CSS pour une expérience utilisateur fluide et réactive.',
                icon: Lightbulb
              },
              {
                title: 'Temps Réel',
                description: 'Mise à jour instantanée des données via WebSockets pour un monitoring continu sans latence.',
                icon: Zap
              },
              {
                title: 'Architecture Scalable',
                description: 'Backend Python Flask conçu pour supporter des milliers de capteurs simultanément.',
                icon: BarChart3
              },
              {
                title: 'Base de Données',
                description: 'Stockage efficient avec indexation optimisée pour les requêtes historiques rapides.',
                icon: Activity
              }
            ].map((highlight, index) => (
              <motion.div
                key={index}
                className="flex gap-6 p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors"
                initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <highlight.icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {highlight.title}
                  </h3>
                  <p className="text-muted-foreground">{highlight.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
              Prêt à Découvrir Aerium ?
            </h2>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Explorez le dashboard complet avec des données en direct et des fonctionnalités interactives.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/dashboard">
                  <Button size="lg" className="gradient-primary text-primary-foreground px-8 h-12 text-lg">
                    Accéder au Dashboard
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" variant="outline" className="px-8 h-12 text-lg gap-2">
                    <Github className="w-5 h-5" />
                    Voir le Code Source
                  </Button>
                </a>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="flex flex-col md:flex-row items-center justify-between gap-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg overflow-hidden">
                <img src="/logo.png" alt="Aerium" className="w-full h-full object-contain" />
              </div>
              <span className="font-semibold text-foreground">Aerium</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 Aerium - Projet de Surveillance de la Qualité de l'Air
            </p>
            <div className="flex items-center gap-6">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                GitHub
              </a>
              <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Dashboard
              </Link>
              <Link to="/sensors" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Capteurs
              </Link>
            </div>
          </motion.div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
