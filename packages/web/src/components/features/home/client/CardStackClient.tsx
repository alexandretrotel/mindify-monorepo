"use client";
import "client-only";

import styles from "@/styles/CardStackClient.module.css";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Semibold from "@/components/typography/semibold";
import { Muted } from "@/components/typography/muted";
import BlackTransparentLogo from "@/../public/logos/mindify-black-transparent.svg";
import WhiteTransparentLogo from "@/../public/logos/mindify-white-transparent.svg";
import Image from "next/image";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CTA_URL } from "@/data/constants";

let interval: any;

type Card = {
  id: number;
  name: string;
  designation: string;
  content: React.ReactNode;
};

export const CardStackClient = ({
  items,
  offset,
  scaleFactor
}: {
  items: Card[];
  offset?: number;
  scaleFactor?: number;
}) => {
  const CARD_OFFSET = offset ?? 10;
  const SCALE_FACTOR = scaleFactor ?? 0.06;
  const [cards, setCards] = useState<Card[]>(items);

  const { resolvedTheme } = useTheme();

  useEffect(() => {
    startFlipping();

    return () => clearInterval(interval);
  }, []);

  const startFlipping = () => {
    interval = setInterval(() => {
      setCards((prevCards: Card[]) => {
        const newArray = [...prevCards];
        newArray.unshift(newArray.pop()!);
        return newArray;
      });
    }, 5000);
  };

  return (
    <div className="relative h-60 w-full md:h-60 md:w-96">
      {cards.map((card, index) => {
        return (
          <motion.div
            key={card.id}
            style={{
              transformOrigin: "top center",
              position: "absolute",
              display: "flex",
              height: "15rem",
              width: "100%",
              flexDirection: "column",
              justifyContent: "space-between",
              borderRadius: "0.5rem",
              border: "1px solid",
              borderColor: resolvedTheme === "light" ? "#e4e4e7" : "#27272a",
              padding: "1rem",
              backgroundColor: resolvedTheme === "light" ? "white" : "#1c1917",
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
            }}
            animate={{
              top: index * -CARD_OFFSET,
              scale: 1 - index * SCALE_FACTOR,
              zIndex: cards.length - index
            }}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-col">
                <Semibold>{card.name}</Semibold>
                <Muted size="sm">{card.designation}</Muted>
              </div>

              <Logo theme={resolvedTheme as string} />
            </div>

            <Semibold>{card.content}</Semibold>

            <Button className="w-full" disabled asChild>
              <Link href={CTA_URL}>Afficher le MIND</Link>
            </Button>
          </motion.div>
        );
      })}
    </div>
  );
};

function Logo({ theme }: Readonly<{ theme: string }>) {
  const size = 28;

  return (
    <React.Fragment>
      {theme === "light" ? (
        <Image src={BlackTransparentLogo} alt="Mindify" width={size} height={size} />
      ) : (
        <Image src={WhiteTransparentLogo} alt="Mindify" width={size} height={size} />
      )}
    </React.Fragment>
  );
}
