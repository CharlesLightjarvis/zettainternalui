"use client";

import { ChevronRight, Home, type LucideIcon } from "lucide-react";
import { Link, useLocation } from "react-router";
import { useEffect, useState } from "react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "~/components/ui/sidebar";
import { useAuth } from "~/hooks/use-auth";
import { getNavItemsByRole } from "~/data/navigation";

const STORAGE_KEY = "sidebar_menu_state";

export function NavMain() {
  const location = useLocation();
  const user = useAuth((state) => state.user);
  const navItems = getNavItemsByRole(user?.role);

  // État pour suivre les éléments ouverts
  const [openItems, setOpenItems] = useState<Record<string, boolean>>(() => {
    // Récupérer l'état sauvegardé du localStorage au chargement
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });

  // Sauvegarder l'état dans localStorage quand il change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(openItems));
  }, [openItems]);

  // Gérer le changement d'état d'un élément
  const handleItemToggle = (itemTitle: string, isOpen: boolean) => {
    setOpenItems((prev) => ({
      ...prev,
      [itemTitle]: isOpen,
    }));
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        {user?.role
          ? `${user.role.charAt(0).toUpperCase()}${user.role.slice(
              1
            )} Dashboard`
          : "Dashboard"}
      </SidebarGroupLabel>
      <Link to={`/${user?.role}/dashboard`}>
        <SidebarMenuButton
          tooltip="dashboard"
          className={
            location.pathname === `/${user?.role}/dashboard`
              ? "bg-[rgb(245,129,45)] text-white"
              : ""
          }
        >
          <Home />
          <span>Dashboard</span>
        </SidebarMenuButton>
      </Link>
      <SidebarMenu>
        {navItems.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            open={openItems[item.title]}
            onOpenChange={(isOpen) => handleItemToggle(item.title, isOpen)}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <Link to={item.url}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    className={
                      location.pathname === item.url
                        ? "bg-[rgb(245,129,45)] text-white"
                        : ""
                    }
                  >
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </Link>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <Link to={subItem.url}>
                        <SidebarMenuSubButton
                          asChild
                          className={
                            location.pathname === subItem.url
                              ? "bg-[rgb(245,129,45)] text-white"
                              : ""
                          }
                        >
                          <div>
                            <span>{subItem.title}</span>
                          </div>
                        </SidebarMenuSubButton>
                      </Link>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
