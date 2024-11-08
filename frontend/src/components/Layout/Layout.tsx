// frontend/src/Layout/Layout.tsx
import React, { ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <div>
      <header>Header Content</header>
      <main>{children}</main>
      <footer>Footer Content</footer>
    </div>
  );
};

export default Layout;
