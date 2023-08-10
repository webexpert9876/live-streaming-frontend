import React from "react";
import Header from "../../../src/components/Layout/Header";
import Footer from "../../../src/components/Layout/Footer";
import { Box } from "@mui/material";

export default function Layout({ children }) {
    return (
        <>
            <Box>
                <Header />
                <main>{children}</main>
                <Footer />
            </Box>
        </>
    )
}