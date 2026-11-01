/** Filter chips shared by the /code hub and the cheat sheet. */
export const chip =
  "h-10 shrink-0 rounded-full border-border px-3.5 text-sm data-pressed:border-primary data-pressed:bg-primary/15 data-pressed:text-foreground";

/**
 * A chip row: one swipeable line with faded edges on phones, wrapping lines from `sm` up, so no
 * chip is ever clipped at the right edge.
 */
export const chipScroller =
  "-mx-4 overflow-x-auto px-4 [scrollbar-width:none] [mask-image:linear-gradient(to_right,transparent,black_1rem,black_calc(100%-2rem),transparent)] sm:mx-0 sm:overflow-visible sm:px-0 sm:[mask-image:none] [&::-webkit-scrollbar]:hidden";
export const chipGroup = "w-max gap-2 sm:w-auto sm:flex-wrap";
