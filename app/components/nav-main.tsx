"use client";

import { ChevronRight, Home, type LucideIcon } from "lucide-react";
import { Link, useLocation } from "react-router";

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

export function NavMain() {
  const location = useLocation();
  const user = useAuth((state) => state.user);
  const navItems = getNavItemsByRole(user?.role);

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
            defaultOpen={item.isActive}
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
                          className={
                            location.pathname === subItem.url
                              ? "bg-[rgb(245,129,45)] text-white"
                              : ""
                          }
                        >
                          <span>{subItem.title}</span>
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
