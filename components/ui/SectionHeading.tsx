import { Reveal } from "./Reveal";

type Props = {
  id: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
};

export function SectionHeading({ id, eyebrow, title, subtitle, center = false }: Props) {
  return (
    <header className={center ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      {eyebrow ? (
        <Reveal>
          <p className={`eyebrow ${center ? "justify-center" : ""}`}>{eyebrow}</p>
        </Reveal>
      ) : null}
      <Reveal delay={0.05}>
        <h2 id={id} className="h2 mt-4">
          {title}
        </h2>
      </Reveal>
      {subtitle ? (
        <Reveal delay={0.1}>
          <p className="lead mt-5">{subtitle}</p>
        </Reveal>
      ) : null}
    </header>
  );
}
