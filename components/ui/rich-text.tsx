import type { ReactNode } from "react";

type RichTextProps = {
  text: string;
  className?: string;
  paragraphClassName?: string;
  headingClassName?: string;
  listClassName?: string;
};

function renderInline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean).map((part, index) => {
    const strong = part.match(/^\*\*(.+)\*\*$/);
    return strong ? <strong key={index} className="text-foreground">{strong[1]}</strong> : part;
  });
}

export function RichText({
  text,
  className = "space-y-3",
  paragraphClassName = "leading-6 text-muted-foreground",
  headingClassName = "mt-4 text-base font-bold text-foreground",
  listClassName = "list-disc list-inside space-y-1.5 text-muted-foreground",
}: RichTextProps) {
  return (
    <div className={className}>
      {text.split("\n\n").map((block, index) => {
        const heading = block.match(/^\*\*(.+)\*\*$/);
        if (heading) {
          return <h3 key={index} className={headingClassName}>{heading[1]}</h3>;
        }

        if (block.startsWith("- ")) {
          return (
            <ul key={index} className={listClassName}>
              {block.split("\n").filter((line) => line.startsWith("- ")).map((line, itemIndex) => (
                <li key={itemIndex}>{renderInline(line.slice(2))}</li>
              ))}
            </ul>
          );
        }

        return <p key={index} className={paragraphClassName}>{renderInline(block)}</p>;
      })}
    </div>
  );
}
