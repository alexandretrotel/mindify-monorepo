import H2 from "@/components/typography/h2";
import H3 from "@/components/typography/h3";
import { Muted } from "@/components/typography/muted";
import Semibold from "@/components/typography/semibold";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Link from "next/link";

const contacts = [
  {
    label: "Email",
    value: "hello@mindify.fr",
    href: "mailto:hello@mindify.fr"
  },
  {
    label: "Téléphone",
    value: "+33 6 42 10 80 88",
    href: "tel:+33642108088"
  },
  {
    label: "Adresse",
    value: "9 Quai du duc d'aiguillon, 22130 Plancoët"
  }
];

export default function SupportPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4">
      <div className="flex flex-col items-center gap-8">
        <H2>Contacter le support</H2>

        <div className="flex-col gap-4">
          <Card className="w-fit">
            <CardHeader>
              <Semibold>Informations de contact</Semibold>
              <Muted size="sm">Vous pouvez nous contacter avec les informations suivantes.</Muted>
            </CardHeader>

            <CardContent>
              <div className="flex flex-col gap-4">
                {contacts.map(({ label, value, href }) => (
                  <div key={label} className="flex flex-col gap-1">
                    <Semibold size="sm">{label}</Semibold>
                    {href ? (
                      <Link
                        href={href}
                        target="_blank"
                        className="text-primary hover:text-primary/80"
                      >
                        {value}
                      </Link>
                    ) : (
                      <span>{value}</span>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
