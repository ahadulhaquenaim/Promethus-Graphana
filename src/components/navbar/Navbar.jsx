"use client";

import Link from "next/link";
import React, { useState } from "react";
import styles from "./navbar.module.css";
import DarkModeToggle from "../DarkModeToggle/DarkModeToggle";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

const links = [
  {
    id: 1,
    title: "Home",
    url: "/",
  },
  {
    id: 2,
    title: "Portfolio",
    url: "/portfolio",
  },
  {
    id: 3,
    title: "Blog",
    url: "/blog",
  },
  {
    id: 4,
    title: "About",
    url: "/about",
  },
  {
    id: 5,
    title: "Contact",
    url: "/contact",
  },
  {
    id: 6,
    title: "Dashboard",
    url: "/dashboard",
  },
];

const Navbar = () => {
  const session = useSession();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (url) => {
    if (url === "/") return pathname === "/";
    return pathname.startsWith(url);
  };

  return (
    <nav className={styles.container}>
      <Link href="/" className={styles.logo}>
        <span className={styles.logoIcon}>✦</span>
        <span className={styles.logoText}>Blog Portal</span>
      </Link>

      {/* Mobile Menu Toggle */}
      <button
        className={styles.menuToggle}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <span className={`${styles.hamburger} ${menuOpen ? styles.open : ""}`}></span>
      </button>

      <div className={`${styles.links} ${menuOpen ? styles.showMenu : ""}`}>
        <div className={styles.navLinks}>
          {links.map((link) => (
            <Link
              key={link.id}
              href={link.url}
              className={`${styles.link} ${isActive(link.url) ? styles.active : ""}`}
              onClick={() => setMenuOpen(false)}
            >
              {link.title}
              <span className={styles.linkUnderline}></span>
            </Link>
          ))}
        </div>

        <div className={styles.actions}>
          <DarkModeToggle />
          {session.status === "authenticated" && (
            <button className={styles.logout} onClick={signOut}>
              <span>Logout</span>
              <svg
                className={styles.logoutIcon}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16,17 21,12 16,7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
