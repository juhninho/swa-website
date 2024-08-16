import React from "react";
import { useParams, Link as RouterLink } from "react-router-dom";

export default function Link({ to, target, className, children }) {
  const params = useParams();
  const lang = params.lang ?? "";

  return (
    <RouterLink
      to={`/${lang}${to ?? "/"}`}
      target={target ?? "_self"}
      rel="noopener noreferrer"
      className={className}
    >
      {children}
    </RouterLink>
  );
}
