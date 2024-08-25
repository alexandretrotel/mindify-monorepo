"use client";
import "client-only";

import H3Span from "@/components/typography/h3AsSpan";
import { Muted } from "@/components/typography/muted";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import React from "react";
import { useTheme } from "next-themes";

export default function AccountSettings() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col">
        <H3Span>Paramètres</H3Span>
        <Muted size="sm">Définissez vos préférences afin de personnaliser votre expérience.</Muted>
      </div>

      <Separator className="max-w-lg" />

      <div className="flex max-w-3xl flex-col gap-8">
        <div className="space-y-1">
          <div className="flex flex-col gap-2">
            <Label>Thème</Label>
            <Muted size="sm">Choisissez entre un thème clair ou sombre.</Muted>
          </div>

          <div className="grid max-w-md grid-cols-1 gap-8 pt-2 md:max-w-3xl md:grid-cols-3">
            <div>
              <button onClick={() => setTheme("light")} className="w-full">
                <div
                  className={`items-center rounded-md border-2 ${theme === "light" ? "border-primary" : "border-muted"} bg-popover p-1 hover:bg-accent hover:text-accent-foreground`}
                >
                  <div className="space-y-2 rounded-sm bg-[#ecedef] p-2">
                    <div className="space-y-2 rounded-md bg-white p-2 shadow-sm">
                      <div className="h-2 w-[80px] rounded-lg bg-[#ecedef]" />
                      <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                    </div>
                    <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                      <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
                      <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                    </div>
                    <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                      <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
                      <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                    </div>
                  </div>
                </div>
              </button>

              <div className="mt-2 w-full text-center">
                <Label>Clair</Label>
              </div>
            </div>

            <div>
              <button onClick={() => setTheme("dark")} className="w-full">
                <div
                  className={`items-center rounded-md border-2 ${theme === "dark" ? "border-primary" : "border-muted"} bg-popover p-1 hover:bg-accent hover:text-accent-foreground`}
                >
                  <div className="space-y-2 rounded-sm bg-slate-950 p-2">
                    <div className="space-y-2 rounded-md bg-slate-800 p-2 shadow-sm">
                      <div className="h-2 w-[80px] rounded-lg bg-slate-400" />
                      <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                    </div>
                    <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
                      <div className="h-4 w-4 rounded-full bg-slate-400" />
                      <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                    </div>
                    <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
                      <div className="h-4 w-4 rounded-full bg-slate-400" />
                      <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                    </div>
                  </div>
                </div>
              </button>

              <div className="mt-2 w-full text-center">
                <Label>Sombre</Label>
              </div>
            </div>

            <div>
              <button onClick={() => setTheme("system")} className="w-full">
                <div
                  className={`items-center rounded-md border-2 ${theme === "system" ? "border-primary" : "border-muted"} bg-popover p-1 hover:bg-accent hover:text-accent-foreground`}
                >
                  <div className="space-y-2 rounded-sm bg-[#ecedef] p-2">
                    <div className="space-y-2 rounded-md bg-slate-800 p-2 shadow-sm">
                      <div className="h-2 w-[80px] rounded-lg bg-slate-400" />
                      <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                    </div>
                    <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                      <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
                      <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                    </div>
                    <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
                      <div className="h-4 w-4 rounded-full bg-slate-400" />
                      <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                    </div>
                  </div>
                </div>
              </button>

              <div className="mt-2 w-full text-center">
                <Label>Système</Label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
