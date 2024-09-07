"use client";
import "client-only";

import Semibold from "@/components/typography/semibold";
import { CardStackClient } from "@/components/features/home/client/CardStackClient";

const cards = [
  {
    id: 0,
    name: "Père Riche, Père Pauvre",
    designation: "Robert Kiyosaki",
    content: <Semibold>Quelle est la différence entre un actif et un passif ?</Semibold>
  },
  {
    id: 1,
    name: "Atomic Habits",
    designation: "James Clear",
    content: <Semibold>Quelle est la loi des moindres efforts ?</Semibold>
  },
  {
    id: 2,
    name: "Sapiens",
    designation: "Yuval Noah Harari",
    content: (
      <Semibold>
        Quelle est la différence entre l&apos;homme de Néandertal et l&apos;homme moderne ?
      </Semibold>
    )
  },
  {
    id: 3,
    name: "The Lean Startup",
    designation: "Eric Ries",
    content: <Semibold>Qu&apos;est-ce qu&apos;un MVP ?</Semibold>
  },
  {
    id: 4,
    name: "The 4-Hour Workweek",
    designation: "Tim Ferriss",
    content: <Semibold>Qu&apos;est-ce que le D.E.A.L. ?</Semibold>
  }
];

export function QuestionCardsStackClient() {
  return (
    <div className="mt-16 flex w-full items-center justify-center md:mt-0 md:justify-start">
      <CardStackClient items={cards} />
    </div>
  );
}
