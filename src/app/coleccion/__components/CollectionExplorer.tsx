"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";

import { Icon } from "@/components/icons";
import type { ProductGender } from "@/lib/sanity/types";

// El componente client solo recibe las tarjetas ya renderizadas por el
// server (`card`), igual que ProductGallery con las URLs de imagen: si
// importara `ProductCard` directamente, empaquetaria el cliente de Sanity
// -y el token de lectura- en el bundle del navegador. Los demas campos son
// solo los datos que el filtro y el orden necesitan para decidir que
// tarjetas mostrar y en que orden.
export type CollectionItem = {
  name: string;
  brandName: string;
  brandSlug: string;
  gender: ProductGender;
  price: number;
  featured: boolean;
  card: ReactNode;
};

type GenderFilterValue = ProductGender | "todos";
type BrandFilterValue = string;
type SortValue = "destacados" | "precio-asc" | "precio-desc";

const ALL_BRANDS_FILTER_VALUE: BrandFilterValue = "todas";

type FilterOption<Value extends string> = {
  value: Value;
  label: string;
};

const GENDER_FILTER_OPTIONS: FilterOption<GenderFilterValue>[] = [
  { value: "todos", label: "Todos" },
  { value: "femenino", label: "Femenino" },
  { value: "masculino", label: "Masculino" },
  { value: "unisex", label: "Unisex" },
];

function getBrandFilterOptions(
  items: CollectionItem[]
): FilterOption<BrandFilterValue>[] {
  const brandsBySlug = new Map<string, string>();
  for (const item of items) {
    if (!brandsBySlug.has(item.brandSlug)) {
      brandsBySlug.set(item.brandSlug, item.brandName);
    }
  }
  const brandOptions = Array.from(brandsBySlug, ([slug, name]) => ({
    value: slug,
    label: name,
  })).sort((a, b) => a.label.localeCompare(b.label, "es"));

  return [{ value: ALL_BRANDS_FILTER_VALUE, label: "Todas" }, ...brandOptions];
}

const SORT_OPTIONS: FilterOption<SortValue>[] = [
  { value: "destacados", label: "Destacados" },
  { value: "precio-asc", label: "Precio: menor a mayor" },
  { value: "precio-desc", label: "Precio: mayor a menor" },
];

const DEFAULT_GENDER_FILTER: GenderFilterValue = "todos";
const DEFAULT_BRAND_FILTER: BrandFilterValue = ALL_BRANDS_FILTER_VALUE;
const DEFAULT_SORT: SortValue = "destacados";

function matchesSearch(item: CollectionItem, query: string): boolean {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) {
    return true;
  }
  return (
    item.name.toLowerCase().includes(normalizedQuery) ||
    item.brandName.toLowerCase().includes(normalizedQuery)
  );
}

function sortItems(items: CollectionItem[], sort: SortValue): CollectionItem[] {
  const sorted = [...items];
  if (sort === "precio-asc") {
    sorted.sort((a, b) => a.price - b.price);
  } else if (sort === "precio-desc") {
    sorted.sort((a, b) => b.price - a.price);
  } else {
    sorted.sort((a, b) => Number(b.featured) - Number(a.featured));
  }
  return sorted;
}

function formatResultCount(count: number): string {
  return `${count} ${count === 1 ? "perfume" : "perfumes"}`;
}

type CollectionExplorerProps = {
  items: CollectionItem[];
};

export function CollectionExplorer({ items }: CollectionExplorerProps) {
  const [search, setSearch] = useState("");
  const [genderFilter, setGenderFilter] = useState<GenderFilterValue>(
    DEFAULT_GENDER_FILTER
  );
  const [brandFilter, setBrandFilter] =
    useState<BrandFilterValue>(DEFAULT_BRAND_FILTER);
  const [sort, setSort] = useState<SortValue>(DEFAULT_SORT);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const brandFilterOptions = useMemo(
    () => getBrandFilterOptions(items),
    [items]
  );

  useEffect(() => {
    if (!isDrawerOpen) {
      return;
    }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isDrawerOpen]);

  const filteredItems = useMemo(() => {
    const filtered = items.filter(
      (item) =>
        (genderFilter === "todos" || item.gender === genderFilter) &&
        (brandFilter === ALL_BRANDS_FILTER_VALUE ||
          item.brandSlug === brandFilter) &&
        matchesSearch(item, search)
    );
    return sortItems(filtered, sort);
  }, [items, search, genderFilter, brandFilter, sort]);

  function handleClearFilters() {
    setGenderFilter(DEFAULT_GENDER_FILTER);
    setBrandFilter(DEFAULT_BRAND_FILTER);
    setSort(DEFAULT_SORT);
  }

  return (
    <>
      <div className="border-t border-line px-10 pt-6 lg:mx-auto lg:flex lg:max-w-[1152px] lg:items-center lg:gap-4 lg:px-24">
        <div className="flex items-center gap-2.5 rounded-md border border-line-2 bg-white px-4 py-3 lg:max-w-[420px] lg:flex-1">
          <Icon.search className="h-[18px] w-[18px] flex-shrink-0 text-ink-3" />
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por nombre o marca"
            className="w-full bg-transparent text-[15px] text-ink outline-none placeholder:text-ink-3"
          />
        </div>

        <button
          type="button"
          onClick={() => setIsDrawerOpen(true)}
          className="mt-3 flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-md border border-line-2 py-[13px] text-[15px] font-medium text-brand-green lg:mt-0 lg:w-auto lg:px-6"
        >
          <Icon.filters className="h-[18px] w-[18px]" />
          Filtrar y ordenar
        </button>
      </div>

      <p className="px-10 pt-5 text-[13px] text-ink-3 lg:mx-auto lg:max-w-[1152px] lg:px-24">
        {formatResultCount(filteredItems.length)}
      </p>

      <section className="px-10 py-6 lg:mx-auto lg:max-w-[1152px] lg:px-24">
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-6 lg:grid-cols-4 lg:gap-x-[26px] lg:gap-y-8">
            {filteredItems.map((item) => item.card)}
          </div>
        ) : (
          <p className="py-16 text-center text-[15px] text-ink-2">
            No encontramos perfumes con esos filtros.
          </p>
        )}
      </section>

      {isDrawerOpen ? (
        <FilterDrawer
          genderFilter={genderFilter}
          onGenderChange={setGenderFilter}
          brandFilter={brandFilter}
          brandFilterOptions={brandFilterOptions}
          onBrandChange={setBrandFilter}
          sort={sort}
          onSortChange={setSort}
          resultCount={filteredItems.length}
          onClear={handleClearFilters}
          onClose={() => setIsDrawerOpen(false)}
        />
      ) : null}
    </>
  );
}

type FilterChipProps = {
  label: string;
  isActive: boolean;
  onClick: () => void;
};

function FilterChip({ label, isActive, onClick }: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      className={`cursor-pointer rounded-full border px-[18px] py-2.5 text-sm whitespace-nowrap transition-colors ${
        isActive
          ? "border-brand-green bg-brand-green text-paper"
          : "border-line-2 bg-transparent text-ink-2"
      }`}
    >
      {label}
    </button>
  );
}

type FilterDrawerProps = {
  genderFilter: GenderFilterValue;
  onGenderChange: (value: GenderFilterValue) => void;
  brandFilter: BrandFilterValue;
  brandFilterOptions: FilterOption<BrandFilterValue>[];
  onBrandChange: (value: BrandFilterValue) => void;
  sort: SortValue;
  onSortChange: (value: SortValue) => void;
  resultCount: number;
  onClear: () => void;
  onClose: () => void;
};

function FilterDrawer({
  genderFilter,
  onGenderChange,
  brandFilter,
  brandFilterOptions,
  onBrandChange,
  sort,
  onSortChange,
  resultCount,
  onClear,
  onClose,
}: FilterDrawerProps) {
  return (
    <div className="fixed inset-0 z-[70]">
      <button
        type="button"
        aria-label="Cerrar filtros"
        onClick={onClose}
        className="absolute inset-0 cursor-pointer bg-brand-green-950/50"
      />
      <div className="absolute right-0 bottom-0 left-0 flex max-h-[85vh] flex-col rounded-t-2xl bg-paper shadow-[0_-10px_40px_rgba(14,36,26,0.25)] lg:top-0 lg:right-auto lg:h-full lg:max-h-none lg:w-full lg:max-w-sm lg:rounded-t-none lg:rounded-r-2xl lg:shadow-[10px_0_40px_rgba(14,36,26,0.25)]">
        <div className="mx-auto mt-3 mb-1 h-1 w-10 flex-shrink-0 rounded-full bg-line-2 lg:hidden" />
        <div className="flex flex-shrink-0 items-center justify-between border-b border-line px-6 py-4">
          <h3 className="font-serif text-[22px] font-normal text-brand-green">
            Filtrar y ordenar
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="cursor-pointer p-1 text-ink-2"
          >
            <Icon.close className="h-[22px] w-[22px]" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="mb-[26px]">
            <p className="mb-3 text-xs tracking-[0.14em] text-ink-3 uppercase">
              Género
            </p>
            <div className="flex flex-wrap gap-2.5">
              {GENDER_FILTER_OPTIONS.map((option) => (
                <FilterChip
                  key={option.value}
                  label={option.label}
                  isActive={option.value === genderFilter}
                  onClick={() => onGenderChange(option.value)}
                />
              ))}
            </div>
          </div>
          <div className="mb-[26px]">
            <p className="mb-3 text-xs tracking-[0.14em] text-ink-3 uppercase">
              Marca
            </p>
            <div className="flex flex-wrap gap-2.5">
              {brandFilterOptions.map((option) => (
                <FilterChip
                  key={option.value}
                  label={option.label}
                  isActive={option.value === brandFilter}
                  onClick={() => onBrandChange(option.value)}
                />
              ))}
            </div>
          </div>
          <div>
            <p className="mb-3 text-xs tracking-[0.14em] text-ink-3 uppercase">
              Ordenar por
            </p>
            <div className="flex flex-wrap gap-2.5">
              {SORT_OPTIONS.map((option) => (
                <FilterChip
                  key={option.value}
                  label={option.label}
                  isActive={option.value === sort}
                  onClick={() => onSortChange(option.value)}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-3 border-t border-line px-6 py-4">
          <button
            type="button"
            onClick={onClear}
            className="flex-1 cursor-pointer rounded-md border border-[#c3b795] px-6 py-3.5 text-[15px] font-medium text-brand-green transition-colors hover:border-brand-green"
          >
            Limpiar
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 cursor-pointer rounded-md bg-brand-green px-6 py-3.5 text-[15px] font-medium text-paper transition-colors hover:bg-brand-green-900"
          >
            Ver {formatResultCount(resultCount)}
          </button>
        </div>
      </div>
    </div>
  );
}
