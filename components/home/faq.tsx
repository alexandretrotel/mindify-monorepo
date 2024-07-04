import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import TypographyH2 from "@/components/typography/h2";
import TypographyH4 from "@/components/typography/h4";
import Section from "../global/section";

const faqItemsGeneral = [
  {
    title: "Qu'est-ce que Savoir?",
    content:
      "Savoir est une application web qui vous permet d'accéder à des connaissances sur divers sujets. Vous retrouverez des idées et des concepts extraits principalement de livres, de podcasts et de vidéos."
  },
  {
    title: "Pourquoi utiliser Savoir?",
    content:
      "Avec Savoir, vous pouvez apprendre de nouvelles choses et découvrir des idées qui peuvent changer votre vie."
  },
  {
    title: "Comment utiliser Savoir?",
    content:
      "Pour utiliser Savoir, il vous suffit de vous inscrire et de commencer à explorer les différentes catégories de connaissances disponibles."
  }
];

const faqItemsPro = [
  {
    title: "Qu'est-ce que Savoir Pro?",
    content:
      "Savoir Pro est une version premium de Savoir qui vous permet d'accéder à l'ensemble des connaissances disponibles sur la plateforme. Avec Savoir Pro, vous pouvez également accéder à des fonctionnalités exclusives."
  },
  {
    title: "Comment s'inscrire à Savoir Pro?",
    content:
      "Pour vous inscrire à Savoir Pro, il vous suffit d'aller dans la section Prix et de cliquer sur le bouton Obtenir Savoir Pro."
  },
  {
    title: "Est-ce possible d'annuler mon abonnement à Savoir Pro?",
    content:
      "Oui, vous pouvez annuler votre abonnement à Savoir Pro à tout moment en vous rendant dans la section Paramètres de votre compte."
  },
  {
    title: "Quand est-ce que mon abonnement à Savoir Pro sera activé?",
    content:
      "Votre abonnement à Savoir Pro sera activé dans les 24 heures suivant votre paiement le temps que nous vérifions votre paiement."
  }
];

const Faq = () => {
  return (
    <Section id="Faq">
      <div className="flex flex-col gap-8">
        <TypographyH2>Foire aux questions</TypographyH2>

        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <TypographyH4>Général</TypographyH4>
            <Accordion type="single" collapsible className="w-full">
              {faqItemsGeneral.map((item, index) => (
                <AccordionItem key={item.title} value={`item-${index}`}>
                  <AccordionTrigger>{item.title}</AccordionTrigger>
                  <AccordionContent>{item.content}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <div className="flex flex-col gap-2">
            <TypographyH4>Pro</TypographyH4>
            <Accordion type="single" collapsible className="w-full">
              {faqItemsPro.map((item, index) => (
                <AccordionItem key={item.title} value={`item-${index}`}>
                  <AccordionTrigger>{item.title}</AccordionTrigger>
                  <AccordionContent>{item.content}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default Faq;
