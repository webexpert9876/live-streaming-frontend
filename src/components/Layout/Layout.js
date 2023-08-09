import React from "react";
import Header from "../../../src/components/Layout/Header";
import Footer from "../../../src/components/Layout/Footer";

export default function Layout({ children }) {
    return (
        <>
        <Header />
        <main>{children}</main>
        <Footer />
        </>
    )
}