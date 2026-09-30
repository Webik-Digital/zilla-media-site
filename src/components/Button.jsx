import { Link } from "react-router-dom";

/**
 * The site's one button.
 *
 * Every CTA used to style itself: some were underlined text with a sliding
 * arrow, some outlined pills with a green arrow badge, one was already the
 * filled pill this is based on. They now all come from here, so the shape only
 * has to be decided once.
 *
 * `surface` names the background the button sits on, not the button's own
 * colour — filled dark on light ground, filled light on dark ground. Getting
 * that backwards is the easy mistake, hence the naming.
 *
 * Renders as whatever the props imply: a router Link for `to`, an anchor for
 * `href`, otherwise a <button>. `as` overrides, which matters for buttons
 * nested inside a larger link — a <button> or <a> inside an <a> is invalid
 * markup, so those pass as="span".
 */
export default function Button({
  to,
  href,
  as,
  surface = "light",
  className = "",
  children,
  ...rest
}) {
  const base =
    "label label-btn inline-flex items-center justify-center rounded-full px-5 py-3 text-center transition-colors duration-500";

  // label-on-dark is the optical weight bump, not a colour change — see the
  // note beside it in index.css.
  const tone =
    surface === "dark"
      ? "label-on-dark bg-mist-100 text-ink hover:bg-zilla hover:text-ink"
      : "bg-ink text-mist-100 hover:bg-zilla hover:text-ink";

  const cls = `${base} ${tone} ${className}`;

  if (as) {
    const As = as;
    return (
      <As className={cls} {...rest}>
        {children}
      </As>
    );
  }

  if (to) {
    return (
      <Link to={to} data-cursor="true" className={cls} {...rest}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} data-cursor="true" className={cls} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <button data-cursor="true" className={cls} {...rest}>
      {children}
    </button>
  );
}
