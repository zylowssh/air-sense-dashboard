import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Shield, 
  Zap, 
  BarChart3, 
  Bell, 
  Smartphone,
  ArrowRight,
  CheckCircle2,
  Leaf,
  Building2,
  Users,
  LogIn
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import VideoSection from '@/components/landing/VideoSection';

const features = [
  {
    icon: Activity,
    title: 'Surveillance en Temps Réel',
    description: 'Suivez la qualité de l\'air de vos espaces avec des mises à jour instantanées.'
  },
  {
    icon: Bell,
    title: 'Alertes Intelligentes',
    description: 'Recevez des notifications personnalisées dès qu\'un seuil est dépassé.'
  },
  {
    icon: BarChart3,
    title: 'Analyses Avancées',
    description: 'Visualisez les tendances et comparez les données de multiples capteurs.'
  },
  {
    icon: Shield,
    title: 'Sécurité des Données',
    description: 'Vos données sont protégées avec un chiffrement de bout en bout.'
  },
  {
    icon: Zap,
    title: 'Intégration Facile',
    description: 'Connectez vos capteurs en quelques minutes sans configuration complexe.'
  },
  {
    icon: Smartphone,
    title: 'Accès Mobile',
    description: 'Consultez vos données depuis n\'importe quel appareil, où que vous soyez.'
  }
];

const stats = [
  { value: '99.9%', label: 'Disponibilité' },
  { value: '< 1s', label: 'Latence' },
  { value: '500+', label: 'Capteurs Actifs' },
  { value: '24/7', label: 'Support' }
];

const useCases = [
  {
    icon: Building2,
    title: 'Bureaux & Entreprises',
    description: 'Optimisez le confort et la productivité de vos équipes.'
  },
  {
    icon: Users,
    title: 'Établissements Scolaires',
    description: 'Assurez un environnement sain pour les élèves et enseignants.'
  },
  {
    icon: Leaf,
    title: 'Espaces de Santé',
    description: 'Maintenez des standards élevés de qualité de l\'air.'
  }
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg overflow-hidden">
                <img src="/logo.png" alt="Aerium" className="w-full h-full object-cover" />
              </div>
              <span className="text-xl font-bold text-foreground">Aerium</span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/auth">
                <Button variant="ghost" className="gap-2">
                  <LogIn className="w-4 h-4" />
                  Connexion
                </Button>
              </Link>
              <Link to="/auth">
                <Button className="gradient-primary text-primary-foreground">
                  Commencer
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Leaf className="w-4 h-4" />
              Surveillance Intelligente de la Qualité de l'Air
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Respirez Mieux,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                Vivez Mieux
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Aerium vous permet de surveiller, analyser et optimiser la qualité de l'air 
              de vos espaces en temps réel pour un environnement plus sain.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/auth">
                <Button size="lg" className="gradient-primary text-primary-foreground px-8">
                  Créer un Compte
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/auth">
                <Button size="lg" variant="outline" className="px-8">
                  Se Connecter
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Video Section */}
      <VideoSection />

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Fonctionnalités Puissantes
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tout ce dont vous avez besoin pour gérer la qualité de l'air de vos espaces.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Pour Tous les Espaces
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Aerium s'adapte à tous types d'environnements professionnels.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {useCases.map((useCase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-8 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 border border-border text-center"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <useCase.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {useCase.title}
                </h3>
                <p className="text-muted-foreground">{useCase.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
            Prêt à Améliorer Votre Air ?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Commencez dès maintenant à surveiller la qualité de l'air de vos espaces.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/auth">
              <Button size="lg" className="gradient-primary text-primary-foreground px-8">
                Démarrer Maintenant
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-success" />
              Installation Gratuite
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-success" />
              Support 24/7
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-success" />
              Sans Engagement
            </span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg overflow-hidden">
                <img src="/logo.png" alt="Aerium" className="w-full h-full object-cover" />
              </div>
              <span className="font-semibold text-foreground">Aerium</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 Aerium. Tous droits réservés.
            </p>
            <div className="flex items-center gap-6">
              <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Tableau de Bord
              </Link>
              <Link to="/sensors" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Capteurs
              </Link>
              <Link to="/settings" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Paramètres
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
