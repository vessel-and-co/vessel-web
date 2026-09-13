type ProductStatusBadgeProps = {
  available: boolean;
  usedInVideo: boolean;
  featured: boolean;
};

export function ProductStatusBadge({
  available,
  usedInVideo,
  featured,
}: ProductStatusBadgeProps) {
  if (!available) {
    return (
      <span className="mb-2 self-start rounded-sm border border-line-2 bg-paper px-[9px] py-[5px] text-[10px] tracking-[0.1em] text-ink-2 uppercase">
        Agotado
      </span>
    );
  }
  if (usedInVideo) {
    return (
      <span className="mb-2 self-start rounded-sm bg-brand-green px-[9px] py-[5px] text-[10px] tracking-[0.1em] text-paper uppercase">
        En video
      </span>
    );
  }
  if (featured) {
    return (
      <span className="mb-2 self-start rounded-sm border border-brand-gold px-[9px] py-[5px] text-[10px] tracking-[0.1em] text-brand-green uppercase">
        Destacado
      </span>
    );
  }
  return null;
}
