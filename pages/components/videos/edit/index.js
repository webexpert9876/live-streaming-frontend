import Head from 'next/head';
import SidebarLayout from 'src/layouts/SidebarLayout';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import numeral from 'numeral';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Grid, Container } from '@mui/material';
import {
    Tooltip,
    Divider,
    Box,
    FormControl,
    InputLabel,
    Card,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
    TableContainer,
    Select,
    MenuItem,
    Typography,
    useTheme,
    CardHeader,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField
} from '@mui/material';

import Label from 'src/components/Label';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import Footer from 'src/components/Footer';
import { subDays } from 'date-fns';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { selectAuthUser } from 'store/slices/authSlice';
// import client from "../../../graphql";
import { gql } from "@apollo/client";
import axios from 'axios';

const Edit = () => {

//   useEffect(()=>{
    
//     function getUserAllDetails(){
//       client.query({
//         variables: {
//           usersId: userId._id,
//           artistId: userId._id,
//         },
//         query: gql`
//             query Query($usersId: ID, $artistId: String) {
//                 users(id: $usersId) {
//                     _id
//                     firstName
//                     lastName
//                     username
//                     email
//                     password
//                     profilePicture
//                     urlSlug
//                     jwtToken
//                     role
//                     channelId
//                     channelDetails {
//                         channelName
//                         _id
//                         channelPicture
//                         channelCoverImage
//                         description
//                         subscribers
//                         userId
//                         urlSlug
//                         location
//                         createdAt
//                         socialLinks {
//                             platform
//                             url
//                         }
//                     }
//                     interestedStyleDetail {
//                         title
//                         _id
//                     }
//                 }
//                 videos(userId: $artistId) {
//                     _id
//                     videoServiceType
//                     views
//                     tattooCategoryId
//                     title
//                     url
//                     updatedAt
//                     userId
//                     videoPreviewImage
//                     videoPreviewStatus
//                     channelId
//                     createdAt
//                     description
//                     isPublished
//                     isStreamed
//                     isUploaded
//                     streamId
//                     tags
//                     videoQualityUrl {
//                     url
//                     quality
//                     }
//                     channelDetails {
//                     channelCoverImage
//                     channelPicture
//                     channelName
//                     description
//                     isApproved
//                     subscribers
//                     urlSlug
//                     userId
//                     }
//                     tattooCategoryDetails {
//                     description
//                     title
//                     profilePicture
//                     _id
//                     urlSlug
//                     }
//                 }
//             }
//         `,
//       }).then((result) => {
          
//         });
//     }
//     getUserAllDetails();
//   },[])

    return (
        <>
            <SidebarLayout userData={userData}>
                    <Head>
                        <title>All Videos</title>
                    </Head>
                    <PageTitleWrapper>
                        <PageHeader />
                    </PageTitleWrapper>
                    <Footer />
                </SidebarLayout>
        </>
    );
};

export default Edit;
