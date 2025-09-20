import React from "react";
import PageAutores from "../components/listaDeAutores/page";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="layout">
      <PageAutores /> 
      {children}
    </div>
  );
}

