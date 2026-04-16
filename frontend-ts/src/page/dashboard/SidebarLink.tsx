import type { ReactNode } from "react";

interface SidebarLinkProps {
  icon: ReactNode;
  text: string;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

function SidebarLink({
  icon,
  text,
  active = false,
  onClick,
  className = "",
}: SidebarLinkProps) {
  return (
    <div
      className={`sidebar-link ${active ? "active" : ""} ${className}`}
      onClick={onClick}
    >
      {icon} {text}
    </div>
  );
}

export default SidebarLink;