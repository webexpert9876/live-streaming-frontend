import React from "react";
import Header from "../../../src/components/Layout/Header";
import Footer from "../../../src/components/Layout/Footer";
import { Box } from "@mui/material";
import LeftMenu from "src/content/Overview/LeftMenu";


export default function Layout({ children }) {
    const stickyMT = {
        marginTop: "100px"
    }

    return (
        <>
        <Header />
            <Box>
                <Box sx={{ display: 'flex' }}>                    
                    <Box component="main" sx={{ flexGrow: 1, p: 3 }} style={{padding: "0"}}>
                        <main style={stickyMT}>{children}</main>                        
                    </Box>
                </Box>                
            </Box>            
        </>
    )
}