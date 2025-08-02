"use client";

import React, { useState } from "react";

export interface AccordionItem {
  question: string;
  answer: React.ReactNode; // Allows for JSX content including multiple paragraphs
}

interface AccordionProps {
  items: AccordionItem[];
  className?: string;
}

export default function Accordion({ items, className = "" }: AccordionProps) {
  const [openItem, setOpenItem] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenItem(prev => prev === index ? null : index);
  };

  return (
    <div className={`space-y-6 w-full max-w-2xl ${className}`} style={{ minWidth: 320 }}>
      {items.map((item, index) => {
        const isOpen = openItem === index;
        return (
          <div key={index} className="border border-secondary rounded-lg">
            <button
              onClick={() => toggleItem(index)}
              className="flex justify-between items-center w-full
                         pt-3 pr-5 pb-3 pl-5 bg-secondary-20
                         text-left font-medium text-foreground
                         transition-colors cursor-pointer hover:bg-primary-20"
            >
              <h3 id="accordion-question"
                className="font-bold text-lg"
              >
                {item.question}
              </h3>
              <span id="accordion-icon"
                className={`text-accent font-black text-4xl transition-transform duration-300 ${
                  isOpen ? 'rotate-45' : 'rotate-0'
                }`}
                style={{ strokeWidth: '2px' }}
              >
                +
              </span>
            </button>
            <div
              className={`overflow-hidden transition-[max-height] duration-300 ease-in-out ${
                isOpen ? 'max-h-96' : 'max-h-0'
              }`}
            >
              <div id="accordion-answer"
                className="p-4 bg-secondary-20 border-secondary-20 text-left text-foreground space-y-3"
              >
                {item.answer}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
