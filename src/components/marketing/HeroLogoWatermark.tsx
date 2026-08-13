/** Large, faded logo watermark for dark page-header sections — decorative only. */
export function HeroLogoWatermark() {
  return (
    <img
      src="/logo.jpg"
      alt=""
      aria-hidden="true"
      className="pointer-events-none absolute -right-16 top-1/2 h-72 w-72 -translate-y-1/2 object-contain opacity-[0.08] sm:-right-10 sm:h-96 sm:w-96 lg:h-[28rem] lg:w-[28rem]"
    />
  );
}
