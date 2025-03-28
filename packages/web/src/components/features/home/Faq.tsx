import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import H2 from "@/components/typography/h2";
import H4Span from "@/components/typography/h4AsSpan";
import Section from "@/components/global/Section";

const faqItemsGeneral = [
  {
    title: "Qu'est-ce que Mindify ?",
    content:
      "Mindify vous permet d'accéder et d’apprendre des connaissances sur divers sujets. Vous retrouverez des résumés de livres, de podcasts, de vidéos et des “MINDS” qui sont les idées principales de ces ressources. Vous pourrez ensuite enregistrer vos MINDS préférés et les apprendre grâce à un système de flashcards optimisé."
  },
  {
    title: "Pourquoi utiliser Mindify ?",
    content:
      "Chez Mindify, nous sommes convaincus que la connaissance peut changer une vie. De nos jours, nous avons tous accès à une quantité de savoir astronomique. Le problème est alors d’accéder à du contenu qualitatif et de le retenir. C’est ce que nous souhaitons vous permettre de faire grâce à Mindify. Si vous vous retrouvez dans ces problématiques, c’est que Mindify est fait pour vous."
  },
  {
    title: "Comment utiliser Mindify ?",
    content:
      "Pour utiliser Mindify, il vous suffit de vous inscrire et de commencer à explorer les différentes catégories de connaissances disponibles."
  }
];

const faqItemsPro = [
  {
    title: "Qu'est-ce que Mindify Pro ?",
    content:
      "Mindify Pro est une version premium de Mindify qui vous permet d'accéder à l'ensemble des connaissances disponibles sur la plateforme. Avec Mindify Pro, vous pouvez également accéder à des fonctionnalités exclusives."
  },
  {
    title: "Comment s'inscrire à Mindify Pro ?",
    content:
      "Pour vous inscrire à Mindify Pro, il vous suffit d'aller dans la section Offres et de cliquer sur le bouton Obtenir Mindify Pro."
  },
  {
    title: "Est-ce possible d'annuler mon abonnement à Mindify Pro ?",
    content:
      "Oui, vous pouvez annuler votre abonnement à Mindify Pro à tout moment en vous rendant dans la section Paramètres de votre compte."
  },
  {
    title: "Quand est-ce que mon abonnement à Mindify Pro sera activé ?",
    content:
      "Votre abonnement à Mindify Pro sera activé dans les 24 heures suivant votre paiement le temps que nous vérifions votre paiement."
  }
];

const Faq = () => {
  return (
    <Section id="faq">
      <div className="flex flex-col gap-8">
        <H2 center>Foire aux questions</H2>

        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <H4Span>Général</H4Span>
            <Accordion type="single" collapsible className="w-full">
              {faqItemsGeneral.map((item, index) => (
                <AccordionItem key={item.title} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">{item.title}</AccordionTrigger>
                  <AccordionContent>{item.content}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <div className="flex flex-col gap-2">
            <H4Span>Pro</H4Span>
            <Accordion type="single" collapsible className="w-full">
              {faqItemsPro.map((item, index) => (
                <AccordionItem key={item.title} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">{item.title}</AccordionTrigger>
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
