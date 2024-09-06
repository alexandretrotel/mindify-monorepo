import { cn } from "@/lib/utils";
import Marquee from "@/components/magicui/marquee";
import Image from "next/image";
import Section from "@/components/global/Section";

const reviews = [
  {
    name: "Clara",
    username: "@clara_dupont",
    body: "Grâce aux résumés concis, j’ai pu gagner un temps précieux dans ma journée. En quelques minutes seulement, je peux maîtriser les points clés d’un livre ou d’un podcast. Un vrai gain d'efficacité !",
    img: "/testimonials/clara_dupont.jpeg"
  },
  {
    name: "Lucas",
    username: "@Lucas3465",
    body: "La répétition espacée facilitée avec les MINDS m’a permis de réviser plus efficacement. J’ai pu retenir des concepts importants sans perdre de temps, ce qui a vraiment boosté ma productivité.",
    img: "/testimonials/Lucas3465.jpeg"
  },
  {
    name: "Emma",
    username: "@emx35",
    body: "Que je sois en déplacement ou en pause, j’apprends à tout moment grâce à la version audio des résumés. C’est super pratique et ça me permet de transformer chaque moment libre en opportunité d’apprentissage.",
    img: "/testimonials/emx35.jpeg"
  },
  {
    name: "Sophie",
    username: "@laptitemistinguette23",
    body: "Je ne rate jamais une occasion d’apprendre quelque chose de nouveau grâce à cette plateforme. Elle m’aide à rester à jour sur les sujets qui m’intéressent sans avoir à chercher des heures.",
    img: "/testimonials/laptitemistinguette23.jpeg"
  },
  {
    name: "Antoine",
    username: "@antouinou",
    body: "J’ai toujours ressenti une satisfaction personnelle quand je maîtrisais des sujets complexes. Avec ces résumés simplifiés, je peux le faire sans la frustration que je ressentais à l'école.",
    img: "/testimonials/antouinou.jpeg"
  },
  {
    name: "Chloé",
    username: "@chlochlo2",
    body: "J’ai pris confiance en moi en enrichissant ma culture générale au quotidien. Avoir accès à autant d’informations m’a permis de tenir des conversations plus profondes et intéressantes.",
    img: "/testimonials/chlochlo2.jpeg"
  },
  {
    name: "Thomas",
    username: "@thoumsxp",
    body: "Je suis souvent surpris par la qualité des informations que je découvre ici, et je suis fier de pouvoir les partager avec mes amis et collègues. Ça fait de moi une véritable référence quand on parle de certains sujets.",
    img: "/testimonials/thoumsxp.jpeg"
  },
  {
    name: "Laura",
    username: "@lauralaura3",
    body: "Impressionner mes collègues avec des extraits d'experts mondiaux est devenu un jeu pour moi. Ils ne s’attendent jamais à ce que je sois aussi informé, c'est vraiment valorisant!",
    img: "/testimonials/lauralaura3.jpeg"
  },
  {
    name: "Julie",
    username: "@juliy56",
    body: "J’adore l'idée d'accéder à une bibliothèque aussi riche de résumés pour une fraction du prix d'achat des livres et podcasts complets. C'est un investissement intelligent pour élargir mes horizons sans me ruiner.",
    img: "/testimonials/juliy56.jpeg"
  },
  {
    name: "Paul",
    username: "@pauloencroizade",
    body: "Avec cette plateforme, j’économise non seulement de l’argent, mais aussi du temps. Avoir des contenus premium régulièrement mis à jour, tout cela pour un prix modique, c’est une aubaine!",
    img: "/testimonials/pauloencroizade.jpeg"
  }
];

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({
  img,
  name,
  username,
  body
}: {
  img: string;
  name: string;
  username: string;
  body: string;
}) => {
  return (
    <figure
      className={cn(
        "hide-scrollbar relative w-96 cursor-pointer overflow-hidden rounded-xl border p-4",
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]"
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <Image className="rounded-full" width={32} height={32} alt="" src={img} />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium dark:text-white">{name}</figcaption>
          <p className="text-xs font-medium dark:text-white/40">{username}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm">{body}</blockquote>
    </figure>
  );
};

const Testimonials = () => {
  return (
    <Section id="testimonials" fullWidth>
      <div className="hide-scrollbar relative flex h-full w-full flex-col items-center justify-center overflow-hidden">
        <Marquee pauseOnHover>
          {firstRow.map((review) => (
            <ReviewCard key={review.username} {...review} />
          ))}
        </Marquee>
        <Marquee reverse pauseOnHover>
          {secondRow.map((review) => (
            <ReviewCard key={review.username} {...review} />
          ))}
        </Marquee>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white dark:from-background"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white dark:from-background"></div>
      </div>
    </Section>
  );
};

export default Testimonials;
