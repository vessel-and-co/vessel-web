"use client";

import Link from "next/link";
import { useState } from "react";

import { Icon } from "@/components/icons";

type NavLink = {
  href: string;
  label: string;
};

type MobileNavToggleProps = {
  links: readonly NavLink[];
};

export function MobileNavToggle({ links }: MobileNavToggleProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-label="Menú"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
        className="flex cursor-pointer items-center justify-center text-brand-green"
      >
        {isOpen ? (
          <Icon.close className="h-5 w-5" />
        ) : (
          <Icon.menu className="h-5 w-5" />
        )}
      </button>
      {isOpen ? (
        <nav className="absolute inset-x-0 top-full border-b border-line bg-paper px-10 py-2">
          <ul className="flex flex-col">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block py-3 text-base text-brand-green"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </div>
  );
}
