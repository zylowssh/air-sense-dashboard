 import { useState, useEffect, useCallback } from 'react';
 
 const TOUR_STORAGE_KEY = 'aerium_tour_completed';
 
 export interface TourStep {
   id: string;
   target: string;
   title: string;
   content: string;
   placement?: 'top' | 'bottom' | 'left' | 'right';
 }
 
 export const tourSteps: TourStep[] = [
   {
     id: 'welcome',
     target: '[data-tour="dashboard"]',
     title: 'Bienvenue sur Aerium ! 👋',
     content: 'Aerium vous aide à surveiller la qualité de l\'air en temps réel. Suivez ce guide pour découvrir les fonctionnalités principales.',
     placement: 'bottom'
   },
   {
     id: 'kpi-cards',
     target: '[data-tour="kpi-cards"]',
     title: 'Indicateurs Clés',
     content: 'Ces cartes affichent les métriques essentielles : CO₂ moyen, température, humidité et score de santé global.',
     placement: 'bottom'
   },
   {
     id: 'air-quality',
     target: '[data-tour="air-quality"]',
     title: 'Qualité de l\'Air',
     content: 'Visualisez l\'évolution du CO₂ sur les dernières heures avec ce graphique interactif.',
     placement: 'right'
   },
   {
     id: 'alerts',
     target: '[data-tour="alerts"]',
     title: 'Alertes en Temps Réel',
     content: 'Recevez des notifications instantanées lorsque les seuils de qualité de l\'air sont dépassés.',
     placement: 'left'
   },
   {
     id: 'sensors',
     target: '[data-tour="sensors"]',
     title: 'Vos Capteurs',
     content: 'Gérez vos capteurs ici. Ajoutez des capteurs réels (SDC30) ou utilisez le mode simulation pour tester.',
     placement: 'top'
   },
   {
     id: 'add-sensor',
     target: '[data-tour="add-sensor"]',
     title: 'Ajouter un Capteur',
     content: 'Cliquez ici pour ajouter un nouveau capteur à votre réseau de surveillance.',
     placement: 'bottom'
   },
   {
     id: 'notifications',
     target: '[data-tour="notifications"]',
     title: 'Notifications',
     content: 'Accédez à toutes vos notifications et alertes depuis ce panneau.',
     placement: 'bottom'
   },
   {
     id: 'theme',
     target: '[data-tour="theme"]',
     title: 'Mode Sombre / Clair',
     content: 'Basculez entre le mode sombre et clair selon vos préférences.',
     placement: 'bottom'
   },
   {
     id: 'tour-button',
     target: '[data-tour="tour-button"]',
     title: 'Relancer le Guide',
     content: 'Vous pouvez relancer ce guide à tout moment en cliquant sur ce bouton. Bonne exploration !',
     placement: 'bottom'
   }
 ];
 
 export const useTour = () => {
   const [isOpen, setIsOpen] = useState(false);
   const [currentStep, setCurrentStep] = useState(0);
   const [hasCompletedTour, setHasCompletedTour] = useState(true);
 
   useEffect(() => {
     const completed = localStorage.getItem(TOUR_STORAGE_KEY);
     if (!completed) {
       setHasCompletedTour(false);
     }
   }, []);
 
   const startTour = useCallback(() => {
     setCurrentStep(0);
     setIsOpen(true);
   }, []);
 
   const nextStep = useCallback(() => {
     if (currentStep < tourSteps.length - 1) {
       setCurrentStep(prev => prev + 1);
     } else {
       completeTour();
     }
   }, [currentStep]);
 
   const prevStep = useCallback(() => {
     if (currentStep > 0) {
       setCurrentStep(prev => prev - 1);
     }
   }, [currentStep]);
 
   const completeTour = useCallback(() => {
     setIsOpen(false);
     setHasCompletedTour(true);
     localStorage.setItem(TOUR_STORAGE_KEY, 'true');
   }, []);
 
   const skipTour = useCallback(() => {
     completeTour();
   }, [completeTour]);
 
   return {
     isOpen,
     currentStep,
     totalSteps: tourSteps.length,
     currentStepData: tourSteps[currentStep],
     hasCompletedTour,
     startTour,
     nextStep,
     prevStep,
     skipTour,
     completeTour
   };
 };