"use client";
import React, { useState, useEffect } from "react";
import {
  Bell,
  Mail,
  Menu,
  MoreHorizontal,
  UserIcon,
  X,
  Sun,
  Moon,
  Laptop,
  Tractor,
  HomeIcon,
  LucideLayoutDashboard,
  InboxIcon,
  Store,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useSession } from "next-auth/react";
import { Button } from "./button";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import Logout from "@/app/authclient/Logout";
import { ThemeToggleButton } from "./ThemeToggle";

interface IconButtonProps {
  icon: React.ElementType;
  label: string;
  onClick?: () => void;
  href?: string;
}

const IconButton = ({ icon: Icon, label, onClick, href }: IconButtonProps) => {
  const ButtonContent = (
    <div className="inline-flex items-center justify-center rounded-full w-10 h-10 hover:bg-secondary cursor-pointer transition-colors">
      <Icon className="text-foreground" />
    </div>
  );

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {href ? (
            <Link href={href}>{ButtonContent}</Link>
          ) : (
            <div onClick={onClick}>{ButtonContent}</div>
          )}
        </TooltipTrigger>
        <TooltipContent>
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default function MainHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { setTheme } = useTheme();
  const { data: session } = useSession();
  const { profile } = useSelector((state: RootState) => state.userProfile);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="bg-background/80 transition-colors">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-2 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex-shrink-0">
              <h2 className="scroll-m-20 font-extrabold tracking-tight text-xl sm:text-2xl md:text-3xl text-foreground">
                Harvest Bridge
              </h2>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background/80 transition-colors">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-2 sm:py-4 space-y-4">
        {/* Top Bar */}
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              href={"/"}
              className="scroll-m-20 font-extrabold tracking-tight text-xl sm:text-2xl md:text-3xl text-foreground"
            >
              Harvest Bridge
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-center gap-2 lg:gap-3 flex-1 px-4 lg:px-8">
            <TooltipProvider>
              <div className="flex items-center gap-1 lg:gap-3">
                <IconButton icon={HomeIcon} label="Home" href="/" />
                <IconButton
                  icon={Bell}
                  label="Notifications"
                  href="/profile/Notifications"
                />
                <IconButton
                  icon={InboxIcon}
                  label="Inbox"
                  href="/profile/Chats"
                />
                <ThemeToggleButton setTheme={setTheme} />
                <Popover>
                  <PopoverTrigger asChild>
                    <div className="inline-flex items-center justify-center rounded-full w-10 h-10 hover:bg-secondary cursor-pointer">
                      <MoreHorizontal className="text-foreground" />
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-60 rounded-2xl py-1">
                    <div className="flex flex-col text-sm">
                      {profile?.role === "Farmer" && (
                        <Link
                          href="/profile/farmer"
                          className="p-2 hover:bg-secondary transition-colors flex items-center justify-start gap-3 mt-1"
                        >
                          <Tractor size={18} />
                          <span>Farmer Dashboard</span>
                        </Link>
                      )}
                      {profile?.role === "Seller" && (
                        <Link
                          href="/profile/seller"
                          className="p-2 hover:bg-secondary transition-colors flex items-center justify-start gap-3 mt-1"
                        >
                          <Store size={18} />
                          <span>Store Dashboard</span>
                        </Link>
                      )}
                      {profile?.role === "Customer" && (
                        <Link
                          href="/profile/customer"
                          className="p-2 hover:bg-secondary transition-colors flex items-center justify-start gap-3 mt-1"
                        >
                          <LucideLayoutDashboard size={18} />
                          <span>Customer Dashboard</span>
                        </Link>
                      )}
                    </div>
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <div className="inline-flex items-center justify-center rounded-full w-10 h-10 hover:bg-secondary cursor-pointer">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="User profile"
                      >
                        <Avatar className="h-10 w-10 border border-border rounded-full shadow-md">
                          <AvatarImage
                            src={
                              profile?.profilePicture ||
                              session?.user?.image ||
                              undefined
                            }
                            alt={session?.user?.name || "User"}
                          />
                          <AvatarFallback>
                            <UserIcon size={18} />
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="min-w-60 rounded-2xl p-2">
                    <div className="w-full flex flex-col text-sm gap-3">
                      <Link
                        href={"/profile/shared_profile"}
                        className="p-2 hover:bg-secondary hover:rounded-lg transition-colors flex items-center justify-start gap-3 pb-3 border-b-2"
                      >
                        <Avatar className="h-10 w-10 border border-border rounded-full shadow-md">
                          <AvatarImage
                            src={
                              profile?.profilePicture ||
                              session?.user?.image ||
                              undefined
                            }
                            alt={session?.user?.name || "User"}
                          />
                          <AvatarFallback>
                            <UserIcon size={18} />
                          </AvatarFallback>
                        </Avatar>
                        <p className="w-full truncate flex flex-col leading-7 [&:not(:first-child)]:mt-0 text-sm p-2">
                          <span>{session?.user?.name || "Not Signed In"}</span>
                          <span>{session?.user?.email || ""}</span>
                        </p>
                      </Link>
                      {!session ? (
                        <Button>
                          <Link href={"/authclient/Login"}>SignUp</Link>
                        </Button>
                      ) : (
                        <Logout
                          formClassName="my-custom-form-class"
                          buttonClassName="w-full"
                          buttonVariant="outline"
                          buttonSize="lg"
                          buttonDisabledText="Signing out..."
                          buttonDefaultText="Sign Out"
                          iconSize={18}
                        />
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </TooltipProvider>
          </div>

          {/* Sell Button and Mobile Menu Toggle */}
          <div className="flex items-center gap-2 sm:gap-4">
            <Button
              variant="ghost"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden space-y-4 pt-4 border-t">
            <div className="flex justify-between items-center gap-4 px-4">
              <div className="flex flex-col items-center cursor-pointer">
                <Bell className="mb-1 text-foreground" />
                <Link href={"/profile/Notifications"} className="text-xs">
                  Alerts
                </Link>
              </div>
              <div className="flex flex-col items-center cursor-pointer">
                <Mail className="mb-1 text-foreground" />
                <Link href={"/profile/Chats"} className="text-xs">
                  Chats
                </Link>
              </div>

              <div className="flex flex-col items-center cursor-pointer">
                <Popover>
                  <PopoverTrigger asChild>
                    <div className="inline-flex items-center justify-center rounded-full w-9 h-9 hover:bg-secondary cursor-pointer">
                      <MoreHorizontal className="text-foreground" />
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-60 rounded-2xl">
                    <div className="flex flex-col text-sm">
                      {profile?.role === "Farmer" && (
                        <Link
                          href="/profile/farmer"
                          className="p-2 hover:bg-secondary transition-colors flex items-center justify-start gap-3 mt-1"
                        >
                          <Tractor size={18} />
                          <span>Farmer Dashboard</span>
                        </Link>
                      )}
                      {profile?.role === "Seller" && (
                        <Link
                          href="/profile/seller"
                          className="p-2 hover:bg-secondary transition-colors flex items-center justify-start gap-3 mt-1"
                        >
                          <Store size={18} />
                          <span>Store Dashboard</span>
                        </Link>
                      )}
                      {profile?.role === "Customer" && (
                        <Link
                          href="/profile/customer"
                          className="p-2 hover:bg-secondary transition-colors flex items-center justify-start gap-3 mt-1"
                        >
                          <Store size={18} />
                          <span>Customer Dashboard</span>
                        </Link>
                      )}
                      <div className="p-2 hover:bg-secondary transition-colors flex items-center justify-start gap-3">
                        <Popover>
                          <PopoverTrigger className="w-full hover:bg-secondary transition-colors flex items-center justify-start gap-1 p-0 -pl-3">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="relative h-10 w-10 rounded-full"
                            >
                              <Sun className="rotate-0 scale-100 transition-transform duration-200 dark:-rotate-90 dark:scale-0" />
                              <Moon className="absolute rotate-90 scale-0 transition-transform duration-200 dark:rotate-0 dark:scale-100" />
                            </Button>
                            <span>Change Theme</span>
                          </PopoverTrigger>
                          <PopoverContent align="center" className="w-36">
                            <Button
                              onClick={() => setTheme("light")}
                              className="flex w-full items-center justify-start gap-3 rounded-md p-2"
                              variant="ghost"
                            >
                              <Sun className="h-5 w-5" />
                              <span>Light</span>
                            </Button>
                            <Button
                              onClick={() => setTheme("dark")}
                              className="flex w-full items-center justify-start gap-3 rounded-md p-2 my-1"
                              variant="ghost"
                            >
                              <Moon className="h-5 w-5" />
                              <span>Dark</span>
                            </Button>
                            <Button
                              onClick={() => setTheme("system")}
                              className="flex w-full items-center justify-start gap-3 rounded-md p-2"
                              variant="ghost"
                            >
                              <Laptop className="h-5 w-5" />
                              <span>System</span>
                            </Button>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
                <span className="text-sm">More</span>
              </div>
              <div className="flex flex-col items-center cursor-pointer">
                <Popover>
                  <PopoverTrigger asChild>
                    <div className="inline-flex items-center justify-center rounded-full w-9 h-9 hover:bg-secondary cursor-pointer">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="User profile"
                      >
                        <Avatar className="h-full w-full border border-border rounded-full shadow-md">
                          <AvatarImage
                            src={
                              profile?.profilePicture ||
                              session?.user?.image ||
                              undefined
                            }
                            alt={session?.user?.name || "User"}
                          />
                          <AvatarFallback>
                            <UserIcon size={18} />
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="min-w-60 rounded-2xl">
                    <div className="flex flex-col text-sm gap-3">
                      <Link
                        href={"/profile"}
                        className="p-2 hover:bg-secondary hover:rounded-lg transition-colors flex items-center justify-start gap-3 pb-3 border-b-2"
                      >
                        <Avatar className="h-10 w-10 border border-border rounded-full shadow-md">
                          <AvatarImage
                            src={
                              profile?.profilePicture ||
                              session?.user?.image ||
                              undefined
                            }
                            alt={session?.user?.name || "User"}
                          />
                          <AvatarFallback>
                            <UserIcon size={18} />
                          </AvatarFallback>
                        </Avatar>
                        <p className="w-[3/4] truncate flex flex-col leading-7 [&:not(:first-child)]:mt-0 text-sm p-2">
                          <span>{session?.user?.name || "Not Signed In"}</span>
                          <span>{session?.user?.email || ""}</span>
                        </p>
                      </Link>
                      {!session ? (
                        <Button>
                          <Link href={"/authclient/Login"}>SignUp</Link>
                        </Button>
                      ) : (
                        <Logout
                          formClassName="my-custom-form-class"
                          buttonClassName="w-full"
                          buttonVariant="outline"
                          buttonSize="lg"
                          buttonDisabledText="Signing out..."
                          buttonDefaultText="Sign Out"
                          iconSize={18}
                        />
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
                <span className="text-sm">profile</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
