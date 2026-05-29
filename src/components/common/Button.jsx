import { Link } from "react-router-dom";

const variants = {
  primary: "bg-clay text-white shadow-lg shadow-clay/20 hover:bg-espresso",
  secondary:
    "border border-clay bg-transparent text-clay hover:bg-clay hover:text-white",
  light: "bg-white text-ink hover:bg-ivory",
  ghost: "text-clay hover:bg-clay/10",
  dark: "bg-ink text-white hover:bg-espresso",
};

const sizes = {
  sm: "px-4 py-2 text-xs",
  md: "px-5 py-3 text-sm",
  lg: "px-7 py-4 text-sm",
};

export default function Button({
  children,
  to,
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  ...props
}) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-full font-bold transition ${variants[variant]} ${sizes[size]} ${className}`;

  if (to) {
    return (
      <Link className={classes} to={to} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} type={type} {...props}>
      {children}
    </button>
  );
}
