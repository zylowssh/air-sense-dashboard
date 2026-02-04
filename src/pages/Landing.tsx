import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, Variants } from 'framer-motion';
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
  Terminal,
  ChevronDown,
  MousePointer2,
  Building2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import VideoSection from '@/components/landing/VideoSection';
import { useState, useEffect, useRef } from 'react';

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
  { name: 'Python (Flask)', icon: Terminal },
  { name: 'Mises à Jour en temps réel', icon: Zap },
  { name: 'Base de Données', icon: Activity }
];

// Animation variants with proper typing
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

const featureCardVariants: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  },
  hover: {
    y: -12,
    transition: { duration: 0.3 }
  }
};

// Fade up/down for scroll direction
const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 60 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" }
  },
  exit: { 
    opacity: 0, 
    y: -60,
    transition: { duration: 0.5, ease: "easeIn" }
  }
};

const scaleInVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const Landing = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isAtTop, setIsAtTop] = useState(true);
  const videoSectionRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);

  // Smooth scroll tracking for parallax
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  
  // Navbar opacity based on scroll
  const navBgOpacity = useTransform(smoothProgress, [0, 0.05], [0, 1]);
  const navBorderOpacity = useTransform(smoothProgress, [0, 0.05], [0, 1]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      setIsAtTop(currentScrollY < 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = () => {
    if (videoSectionRef.current) {
      const navbarHeight = 130; // Navbar height + padding to account for proper spacing
      const elementPosition = videoSectionRef.current.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - navbarHeight,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Navigation - Blends with hero at top */}
      <motion.nav 
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          backgroundColor: isAtTop ? 'transparent' : 'hsl(var(--background) / 0.85)',
          backdropFilter: isAtTop ? 'none' : 'blur(12px)',
        }}
      >
        <motion.div 
          className="absolute inset-x-0 bottom-0 h-px bg-border"
          style={{ opacity: navBorderOpacity }}
        />
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
      </motion.nav>

      {/* Hero Section with Enhanced Parallax */}
      <section 
        ref={heroRef}
        className="relative min-h-screen pt-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center overflow-hidden"
      >
        {/* Animated Background Elements */}
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-primary/15 rounded-full blur-3xl"
          style={{ y: scrollY * 0.4, opacity: Math.max(0, 1 - scrollY / 500) }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl"
          style={{ y: -scrollY * 0.3, opacity: Math.max(0, 1 - scrollY / 600) }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl"
          style={{ scale: 1 + scrollY * 0.0005 }}
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
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className="w-4 h-4 rounded overflow-hidden flex-shrink-0">
                <img src="/logo.png" alt="" className="w-full h-full object-contain" />
              </div>
              Projet de Surveillance de la Qualité de l'Air
            </motion.div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-8 leading-tight">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="block mb-4"
              >
                Surveillez l'Air
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
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
                  <Button size="lg" className="gradient-primary text-primary-foreground px-8 h-12 text-lg shadow-lg shadow-primary/25">
                    Explorer le Dashboard
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </motion.div>
              </Link>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" variant="outline" className="px-8 h-12 text-lg" onClick={scrollToSection}>
                  En Savoir Plus
                </Button>
              </motion.div>
            </motion.div>

            {/* Tech Stack Pills */}
            <motion.div
              className="flex flex-wrap items-center justify-center gap-3 mb-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              {techStack.map((tech, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 backdrop-blur-sm border border-border/50 text-sm font-medium text-foreground hover:border-primary/50 transition-all duration-300 group"
                  whileHover={{ scale: 1.05, y: -2 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + index * 0.1, duration: 0.4 }}
                >
                  <tech.icon className="w-4 h-4 text-primary group-hover:text-primary/80 transition-colors" />
                  <span>{tech.name}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Enhanced Scroll Indicator */}
          <motion.div
            className="absolute left-1/2 -translate-x-1/2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            <motion.button
              onClick={scrollToSection}
              className="flex flex-col items-center gap-3 text-muted-foreground hover:text-foreground transition-colors cursor-pointer group"
              whileHover={{ scale: 1.05 }}
            >
              <span className="text-xs font-medium tracking-wider uppercase">Découvrir</span>
              <motion.div 
                className="relative w-8 h-14 rounded-full border-2 border-primary/30 flex items-start justify-center p-2 group-hover:border-primary/60 transition-colors"
              >
                <motion.div
                  className="w-1.5 h-3 bg-primary rounded-full"
                  animate={{ y: [0, 6, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
              </motion.div>
              <motion.div
                animate={{ y: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <ChevronDown className="w-5 h-5 text-primary/60" />
              </motion.div>
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Video Section */}
      <VideoSection ref={videoSectionRef} />

      {/* Features Section */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 relative bg-gradient-to-b from-background via-muted/20 to-background">
        {/* Animated background */}
        <motion.div
          className="absolute top-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            className="text-center mb-20"
            variants={fadeUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.span
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 border border-primary/20"
              variants={scaleInVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <Zap className="w-4 h-4" />
              Caractéristiques Puissantes
            </motion.span>
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
              Fonctionnalités
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Un ensemble complet d'outils pour une surveillance efficace de la qualité de l'air.
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group relative"
              >
                <motion.div
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  className="p-8 rounded-2xl bg-card/50 backdrop-blur-sm border border-border hover:border-primary/50 transition-all duration-300 h-full relative overflow-hidden"
                >
                  {/* Animated gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-accent/0 group-hover:from-primary/10 group-hover:via-accent/5 group-hover:to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  
                  {/* Icon with glow effect */}
                  <motion.div 
                    className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-6 group-hover:from-primary/40 group-hover:to-accent/40 transition-all duration-300 relative z-10 shadow-lg shadow-primary/20 group-hover:shadow-primary/40"
                    whileHover={{ rotate: 10, scale: 1.15 }}
                    transition={{ duration: 0.3 }}
                  >
                    <feature.icon className="w-8 h-8 text-primary" />
                  </motion.div>
                  
                  <h3 className="text-lg font-bold text-foreground mb-3 relative z-10">
                    {feature.title}
                  </h3>
                  
                  <p className="text-muted-foreground leading-relaxed relative z-10 text-sm">
                    {feature.description}
                  </p>
                  
                  {/* Animated border accent */}
                  <motion.div
                    className="absolute top-0 left-0 h-1 bg-gradient-to-r from-primary via-accent to-primary"
                    initial={{ width: '0%' }}
                    whileHover={{ width: '100%' }}
                    transition={{ duration: 0.4 }}
                  />
                  <motion.div
                    className="absolute bottom-0 right-0 w-1 bg-gradient-to-b from-primary via-accent to-primary"
                    initial={{ height: '0%' }}
                    whileHover={{ height: '100%' }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                  />
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>


      {/* How It Works Section */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-muted/30 via-muted/50 to-muted/30" />
        <motion.div
          className="absolute top-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            className="text-center mb-20"
            variants={fadeUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.span
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 border border-primary/20"
              variants={scaleInVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <Activity className="w-4 h-4" />
              Architecture Simple
            </motion.span>
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
              { number: '1', title: 'Capteurs IoT', description: 'Des capteurs collectent les données de qualité de l\'air en continu', icon: Gauge, details: 'Température, humidité, CO2, particules' },
              { number: '2', title: 'Backend Python', description: 'Les données sont traitées et stockées en temps réel', icon: Terminal, details: 'WebSockets, base de données, alertes' },
              { number: '3', title: 'Dashboard React', description: 'Visualisation interactive et alertes intelligentes', icon: BarChart3, details: 'Graphiques en direct, historique, rapports' }
            ].map((step, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="relative"
              >
                <motion.div
                  whileHover={{ y: -12 }}
                  transition={{ duration: 0.3 }}
                  className="p-8 rounded-2xl bg-card/50 backdrop-blur-sm border border-border hover:border-primary/50 transition-all duration-300 group h-full relative overflow-hidden"
                >
                  {/* Animated background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Number badge with enhanced styling */}
                  <motion.div 
                    className="absolute -top-4 -right-6 w-20 h-20 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center text-primary-foreground font-bold text-3xl shadow-2xl shadow-primary/50 group-hover:shadow-primary/70 group-hover:from-primary/50 group-hover:to-accent/50 transition-all duration-300"
                    whileHover={{ scale: 1.2, rotate: 15 }}
                    transition={{ duration: 0.3 }}
                  >
                    {step.number}
                  </motion.div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <motion.div
                        whileHover={{ scale: 1.2, rotate: 5 }}
                        transition={{ duration: 0.2 }}
                        className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center shadow-lg shadow-primary/30"
                      >
                        <step.icon className="w-6 h-6 text-primary" />
                      </motion.div>
                      <h3 className="text-2xl font-bold text-foreground">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-muted-foreground mb-4 leading-relaxed">{step.description}</p>
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      whileHover={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.3 }}
                      className="text-sm text-primary/70 font-medium overflow-hidden"
                    >
                      {step.details}
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>



      {/* Use Cases Section */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gradient-to-b from-background via-muted/20 to-background">
        <motion.div
          className="absolute top-1/2 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            className="text-center mb-20"
            variants={fadeUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.span
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 border border-primary/20"
              variants={scaleInVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <Lightbulb className="w-4 h-4" />
              Cas d'Usage
            </motion.span>
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
              Parfait Pour
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Découvrez comment Aerium s'adapte à vos besoins spécifiques.
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {[
              {
                title: 'Bâtiments Intelligents',
                description: 'Surveillance continue de la qualité de l\'air intérieur pour optimiser le confort et la santé des occupants.',
                icon: Building2,
                color: 'from-blue-500/20 to-cyan-500/20'
              },
              {
                title: 'Environnement & Recherche',
                description: 'Collecte et analyse de données environnementales pour des études scientifiques et le monitoring urbain.',
                icon: Leaf,
                color: 'from-green-500/20 to-emerald-500/20'
              },
              {
                title: 'Industrie & Usines',
                description: 'Contrôle qualité atmosphérique en temps réel pour assurer la conformité réglementaire et la sécurité.',
                icon: Wind,
                color: 'from-purple-500/20 to-pink-500/20'
              }
            ].map((useCase, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="relative group overflow-hidden"
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <div className="p-8 rounded-2xl bg-card/50 backdrop-blur-sm border border-border h-full relative overflow-hidden">
                  {/* Animated gradient background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${useCase.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  
                  {/* Animated blur circle */}
                  <motion.div
                    className={`absolute -top-8 -right-8 w-32 h-32 rounded-full blur-2xl opacity-0 group-hover:opacity-30`}
                    initial={{ scale: 0 }}
                    whileHover={{ scale: 1 }}
                    transition={{ duration: 0.5 }}
                    style={{ backgroundImage: `linear-gradient(135deg, var(--primary), var(--accent))` }}
                  />

                  <div className="relative z-10">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 10 }}
                      transition={{ duration: 0.3 }}
                      className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-6 group-hover:from-primary/40 group-hover:to-accent/40 transition-all duration-300"
                    >
                      <useCase.icon className="w-7 h-7 text-primary" />
                    </motion.div>
                    
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      {useCase.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {useCase.description}
                    </p>
                    
                    <motion.div 
                      className="flex items-center gap-2 text-primary font-medium mt-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      initial={{ x: -10 }}
                      whileHover={{ x: 0 }}
                    >
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        />
        
        {/* Animated orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1.1, 1, 1.1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
        />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            variants={fadeUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.span
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 border border-primary/20"
              variants={scaleInVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <Zap className="w-4 h-4" />
              Commencez Maintenant
            </motion.span>
            
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
              Prêt à Découvrir Aerium ?
            </h2>
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              Explorez le dashboard complet avec des données en direct, des alertes intelligentes et des analyses avancées.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12">
              <motion.div 
                whileHover={{ scale: 1.05, y: -4 }} 
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/dashboard">
                  <Button size="lg" className="gradient-primary text-primary-foreground px-10 h-14 text-lg shadow-lg shadow-primary/25 relative overflow-hidden group">
                    <motion.div
                      className="absolute inset-0 bg-white/20"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: '100%' }}
                      transition={{ duration: 0.5 }}
                    />
                    <span className="relative flex items-center gap-2">
                      Accéder au Dashboard
                      <ArrowRight className="w-5 h-5" />
                    </span>
                  </Button>
                </Link>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05, y: -4 }} 
                whileTap={{ scale: 0.95 }}
              >
                <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" variant="outline" className="px-10 h-14 text-lg gap-2 hover:bg-primary/5">
                    <Github className="w-5 h-5" />
                    Voir le Code Source
                  </Button>
                </a>
              </motion.div>
            </div>

            {/* Additional Info Cards */}
            <motion.div 
              className="grid md:grid-cols-3 gap-6 mt-12"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              {[
                { icon: Zap, label: 'Temps Réel', description: 'Mise à jour instantanée' },
                { icon: BarChart3, label: 'Analyse', description: 'Rapports détaillés' },
                { icon: Bell, label: 'Alertes', description: 'Notifications intelligentes' }
              ].map((info, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="p-6 rounded-xl bg-card/30 backdrop-blur-sm border border-border hover:border-primary/30 transition-all group"
                  whileHover={{ y: -4 }}
                >
                  <info.icon className="w-8 h-8 text-primary mx-auto mb-3 group-hover:scale-110 transition-transform" />
                  <p className="font-semibold text-foreground mb-1">{info.label}</p>
                  <p className="text-sm text-muted-foreground">{info.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-border bg-card/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="grid md:grid-cols-3 gap-12 mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Brand */}
            <motion.div whileHover={{ y: -2 }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg overflow-hidden">
                  <img src="/logo.png" alt="Aerium" className="w-full h-full object-contain" />
                </div>
                <span className="font-semibold text-foreground">Aerium</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Plateforme de surveillance de qualité de l'air en temps réel avec IA.
              </p>
            </motion.div>

            {/* Quick Links */}
            <motion.div>
              <h4 className="font-semibold text-foreground mb-4">Accès Rapide</h4>
              <div className="space-y-2">
                <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 group">
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                  Dashboard
                </Link>
                <Link to="/sensors" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 group">
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                  Capteurs
                </Link>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 group">
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                  GitHub
                </a>
              </div>
            </motion.div>

            {/* Legal */}
            <motion.div>
              <h4 className="font-semibold text-foreground mb-4">Information</h4>
              <p className="text-sm text-muted-foreground mb-3">
                © 2026 Aerium - Projet de Surveillance de la Qualité de l'Air
              </p>
              <div className="flex gap-4">
                <motion.a
                  href="#"
                  className="w-10 h-10 rounded-lg bg-card border border-border flex items-center justify-center hover:border-primary/50 transition-colors"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Github className="w-5 h-5 text-muted-foreground" />
                </motion.a>
              </div>
            </motion.div>
          </motion.div>

          {/* Bottom Bar */}
          <motion.div
            className="pt-8 border-t border-border/50 text-center text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p>Conçu avec <span className="text-primary">❤</span> pour améliorer la qualité de l'air</p>
          </motion.div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
