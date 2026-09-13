import { ProductCard } from "@/components/ProductCard";
import type { GenderPageSlug } from "@/lib/gender.content";
import { GENDER_PAGES } from "@/lib/gender.content";
import { getProductsByGender } from "@/lib/sanity/product.query";
import { getSettings } from "@/lib/sanity/settings.query";
import { getSiteUrl } from "@/lib/site";

type GenderCollectionProps = {
  slug: GenderPageSlug;
};

export async function GenderCollection({ slug }: GenderCollectionProps) {
  const content = GENDER_PAGES[slug];
  const [settings, products] = await Promise.all([
    getSettings(),
    getProductsByGender(content.gender),
  ]);
  const whatsappNumber = settings?.whatsappNumber ?? null;
  const siteUrl = getSiteUrl();
  const pageUrl = `${siteUrl}/${slug}`;

  const collectionPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: content.title,
    description: content.metaDescription,
    url: pageUrl,
  };

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: product.name,
      url: `${siteUrl}/perfumes/${product.slug.current}`,
    })),
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionPageJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      {products.length > 0 ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(itemListJsonLd).replace(/</g, "\\u003c"),
          }}
        />
      ) : null}

      <div className="px-10 pt-11 lg:mx-auto lg:max-w-[1152px] lg:px-24 lg:pt-16">
        <div className="mb-2 h-px w-11 bg-brand-gold" />
        <h1 className="font-serif text-[40px] font-normal text-brand-green lg:text-[56px]">
          {content.title}
        </h1>
        <p className="mt-4 max-w-[65ch] text-[15px] leading-relaxed text-ink-2">
          {content.text}
        </p>
      </div>

      <div className="border-t border-line px-10 py-6 lg:mx-auto lg:max-w-[1152px] lg:px-24 lg:py-10">
        {products.length > 0 && whatsappNumber ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-6 lg:grid-cols-4 lg:gap-x-[26px] lg:gap-y-8">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                whatsappNumber={whatsappNumber}
              />
            ))}
          </div>
        ) : (
          <p className="py-16 text-center text-[15px] text-ink-2">
            {content.emptyMessage}
          </p>
        )}
      </div>
    </div>
  );
}
