import React from "react";
import Header from "../../../src/components/Layout/Header";
import Footer from "../../../src/components/Layout/Footer";
import { Box } from "@mui/material";
import LeftMenu from "src/content/Overview/LeftMenu";
import { useRouter } from "next/router"; // Import the useRouter hook

export default function Layout({ children }) {
    // const router = useRouter();
    // const pagesWithNoTopMargin = ["/auth/login", "/auth/forgot", "/auth/registration", "/management/profile/settings"];
    // const isPageWithNoTopMargin = pagesWithNoTopMargin.includes(router.pathname);

    // const stickyMT = {
    //     marginTop: isPageWithNoTopMargin ? "0" : "90px",
    // };
    

    return (
        <>
        <Header />
            <Box>
                <Box sx={{ display: 'flex' }}>                    
                    <Box component="main" sx={{ flexGrow: 1, p: 3 }} style={{padding: "0"}}>
                        <main className="testttttt">{children}</main>                        
                    </Box>
                </Box>                
            </Box>            
        </>
    )
}