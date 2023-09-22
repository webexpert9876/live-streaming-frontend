import Head from 'next/head';
import SidebarLayout from 'src/layouts/SidebarLayout';
import { useState, useEffect } from 'react';
import PageHeader from 'src/components/category/PageHeader';
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
    TextField,
    Alert
} from '@mui/material';

import Label from 'src/components/Label';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import Footer from 'src/components/Footer';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { selectAuthUser } from 'store/slices/authSlice';
import client from "../../../../../graphql";
import { gql } from "@apollo/client";
import axios from 'axios';
import CategoryEdit from "src/components/category/CategoryEdit";
import AddCategory from "src/components/category/AddCategory";
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';


function TattooCategory() {
  const [userData, setUserData] = useState([]);

//  For pagination
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(5);
  const [showAllCategoriesDetails, setShowAllCategoriesDetails]= useState([])
  const [isCheckPaginationChange, setIsCheckPaginationChange]= useState(false)

  const authState = useSelector(selectAuthUser)
  const router = useRouter();

  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const [isTattooCategoryEditing, setIsTattooCategoryEditing] = useState(true);
  const [isAddingTattooCategory, setIsAddingTattooCategory] = useState(false);
  const [selectedRowDetails, setSelectedRowDetails] = useState({});
  
  const [tattooCategoryList, setTattooCategoryList] = useState([]);
  const [tagList, setTagList] = useState([]);

  const [isDeletingCategory, setIsDeletingCategory] = useState(false);
  const [deleteInputValue, setDeleteInputValue] = useState('');

  // -------------------------Error state------------------------
  const [apiResponseMessage, setApiResponseMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [apiMessageType, setApiMessageType] = useState('');

  useEffect(()=>{
    // if(userInfo.length == 0){
    //   setUserInfo(authState);
    // }
    let userId = JSON.parse(localStorage.getItem('authUser'));
    function getUserAllDetails(){
      client.query({
        variables: {
          usersId: userId._id
        },
        query: gql`
            query Query($usersId: ID) {
                users(id: $usersId) {
                    _id
                    firstName
                    lastName
                    username
                    email
                    password
                    profilePicture
                    urlSlug
                    jwtToken
                    role
                    channelId
                }
                tattooCategories {
                    _id
                    urlSlug
                    title
                    description
                    createdAt
                    profilePicture
                    tags
                }
                tagForStream {
                    text
                    id
                }
            }
        `,
      }).then((result) => {

          setUserData(result.data.users);
          setTattooCategoryList(result.data.tattooCategories);
          setShowAllCategoriesDetails(result.data.tattooCategories);
          setTagList(result.data.tagForStream)
          setIsCheckPaginationChange(true)
        });
    }
    getUserAllDetails();
  },[])

  useEffect(()=>{
    if(isCheckPaginationChange){

        applyPagination(
            tattooCategoryList,
            page,
            limit
        );
        setIsCheckPaginationChange(false)
    }
  },[isCheckPaginationChange])
  
  useEffect(()=>{
    if(isDeletingCategory){

        axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/delete/category/${selectedRowDetails._id}`, {headers: {'x-access-token': userData[0].jwtToken, 'Content-Type': 'multipart/form-data'}}).then((data)=>{
            setApiMessageType('danger')
            setApiResponseMessage('Tattoo Category deleted successfully');
            removeCategoryFromList(selectedRowDetails._id)
            setIsDeletingCategory(false);
            setLoading(false);
            handleMessageBoxOpen()
        }).catch((error)=>{
            console.log('error', error);
            setApiMessageType('error')
            const errorMessage = error.response.data.message;
            
            handleMessageBoxOpen()
            setApiResponseMessage(errorMessage);
            setIsDeletingCategory(false)
            setLoading(false);
        });

    }
  },[isDeletingCategory])

    
    const handleClickOpen = (dialogType, category) => {
        switch(dialogType){
            case 'tattooCategoryEdit':
                setSelectedRowDetails(category)
                setIsTattooCategoryEditing(false)
                break;
            case 'tattooCategoryDelete':
                setSelectedRowDetails(category)
                setOpenDeleteDialog(true);
                break;
        }
    };

    const handleClose = (dialogType) => {
        switch(dialogType){
            case 'tattooCategoryEdit':
                setOpenEditDialog(false);
                break;
            case 'tattooCategoryDelete':
                setOpenDeleteDialog(false);
                break;
        }
    };

    const handleMessageBoxClose = () => {
        setOpen(false);
        setApiResponseMessage('');
        setApiMessageType('')
    };
    const handleMessageBoxOpen = () => {
        setOpen(true);
    };

    const removeCategoryFromList = (id)=>{
        
        const updatedArray  = tattooCategoryList.filter(obj => obj._id !== id);
        
        setTattooCategoryList(updatedArray)
        let selectedCategory = updatedArray.slice(page * limit, page * limit + limit);

        setShowAllCategoriesDetails(selectedCategory);
    }
    
    const applyPagination = (allTattooCategory, page, limit) => {
        let selectedCategories = allTattooCategory.slice(page * limit, page * limit + limit);
        setShowAllCategoriesDetails(selectedCategories);
    };

    const handlePageChange = (_event, newPage) => {
        setPage(newPage);
        setIsCheckPaginationChange(true)
    };

    const handleLimitChange = (event) => {
        setLimit(parseInt(event.target.value));
        setIsCheckPaginationChange(true)
    };

    const handleCancelBtnFunction = ()=>{
        setIsTattooCategoryEditing(true);
        setIsAddingTattooCategory(false);
    }
    
    const handleTagListUpdate = (tags)=>{
        setTagList(tags);
    }
    
    const handleAddingCategory = ()=>{
        setIsTattooCategoryEditing(false);
        setIsAddingTattooCategory(true);
    }

    const handleListCategoryUpdate = (id, categoryData)=>{
          
        const updatedArray = tattooCategoryList.map(obj => {
            if (obj._id === id) {
                return { ...categoryData }; 
            }
            return obj;
        });
        
        setTattooCategoryList(updatedArray)
        let selectedCategory = updatedArray.slice(page * limit, page * limit + limit);
        setShowAllCategoriesDetails(selectedCategory);
    }

    const handleAddNewCategory = (newCategory)=>{
        setTattooCategoryList([...tattooCategoryList, newCategory]);
        setShowAllCategoriesDetails([...tattooCategoryList, newCategory]);
    }

    const theme = useTheme();

    const handleDeleteCategory= ()=>{
        if(deleteInputValue.toLowerCase() == 'delete'){
            setIsDeletingCategory(true)
            handleClose('tattooCategoryDelete')
        }
    }

    return (
        <>
            {/* <SidebarLayout userData={[{role: '647f15e20d8b7330ed890da4'}]}> */}
            {userData.length > 0?
                <SidebarLayout userData={userData}>
                    <Head>
                        <title>All Tattoo Category</title>
                    </Head>
                    {
                        isTattooCategoryEditing?
                            <>
                                <PageTitleWrapper>
                                    <PageHeader categoryAddFunction={handleAddingCategory}/>
                                </PageTitleWrapper>
                                <Container maxWidth="lg">
                                    <Grid
                                        container
                                        direction="row"
                                        justifyContent="center"
                                        alignItems="stretch"
                                        spacing={3}
                                    >
                                        <Grid item xs={12}></Grid>
                                        <Card style={{width: "97%"}}>
                                            <CardHeader title="Tattoo Categories" />
                                            <Divider />
                                            <TableContainer>
                                                <Table>
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell>Title</TableCell>
                                                            <TableCell>Description</TableCell>
                                                            <TableCell>Picture</TableCell>
                                                            <TableCell align='center'>Tags</TableCell>
                                                            <TableCell align="right">Actions</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {showAllCategoriesDetails.map((category) => {
                                                            return (
                                                                <TableRow hover key={category._id}>
                                                                    <TableCell>
                                                                        <Typography
                                                                            variant="body1"
                                                                            fontWeight="bold"
                                                                            color="text.primary"
                                                                            gutterBottom
                                                                        >
                                                                            {category.title}
                                                                        </Typography>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <Typography
                                                                            variant="body1"
                                                                            fontWeight="bold"
                                                                            color="text.primary"
                                                                            gutterBottom
                                                                        >
                                                                            {category.description.slice(0, 80)}...
                                                                        </Typography>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <img width={50} height={50} src={`${process.env.NEXT_PUBLIC_S3_URL}/${category.profilePicture}`}></img>
                                                                    </TableCell>
                                                                    <TableCell align='center'>
                                                                        <Typography
                                                                            variant="body1"
                                                                            fontWeight="bold"
                                                                            color="text.primary"
                                                                            gutterBottom
                                                                            noWrap
                                                                        >
                                                                            {category.tags.slice(0,2).map((tag, index)=>{
                                                                                return(<Button key={index} variant="contained" sx={{ fontWeight: 400, fontSize: '12px', borderRadius: '50px', padding: '5px', margin: '0px 2px' }}>
                                                                                {/* <Link href={`/tags/`} sx={{ color: '#fff' }}>{tag}</Link> */}{tag}
                                                                            </Button>)
                                                                            })}
                                                                        </Typography>
                                                            
                                                                    </TableCell>
                                                                    <TableCell align="right">
                                                                        <Tooltip title="Edit Tattoo Category" arrow>
                                                                            <IconButton
                                                                                sx={{
                                                                                    '&:hover': {
                                                                                        background: theme.colors.primary.lighter
                                                                                    },
                                                                                    color: theme.palette.primary.main
                                                                                }}
                                                                                color="inherit"
                                                                                size="small"
                                                                                onClick={()=>{handleClickOpen('tattooCategoryEdit', category)}}
                                                                            >
                                                                                <EditTwoToneIcon fontSize="small" />
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                        <Tooltip title="Delete Tattoo Category" arrow>
                                                                            <IconButton
                                                                                sx={{
                                                                                    '&:hover': { background: theme.colors.error.lighter },
                                                                                    color: theme.palette.error.main
                                                                                }}
                                                                                color="inherit"
                                                                                size="small"
                                                                                onClick={()=>{handleClickOpen('tattooCategoryDelete', category)}}
                                                                            >
                                                                                <DeleteTwoToneIcon fontSize="small" />
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                    </TableCell>
                                                                </TableRow>
                                                            );
                                                        })}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                            <Box p={2}>
                                                <TablePagination
                                                    component="div"
                                                    count={tattooCategoryList.length}
                                                    onPageChange={handlePageChange}
                                                    onRowsPerPageChange={handleLimitChange}
                                                    page={page}
                                                    rowsPerPage={limit}
                                                    rowsPerPageOptions={[5, 10, 25, 30]}
                                                />
                                            </Box>
                                        </Card>
                                    </Grid>
                                    
                {/* ---------------------------------------Tattoo Category Delete box---------------------------------- */}
                                    <Dialog open={openDeleteDialog} onClose={()=>handleClose('tattooCategoryDelete')}>
                                        <DialogTitle>Delete Tattoo Category Details</DialogTitle>
                                        <DialogContent>
                                            <DialogContentText>
                                                Are you sure? You want delete this Category. If you want to delete this Category type delete in input box.
                                            </DialogContentText>
                                            <TextField
                                                autoFocus
                                                margin="dense"
                                                id="delete-text"
                                                label="Delete"
                                                type="text"
                                                fullWidth
                                                variant="standard"
                                                value={deleteInputValue}
                                                onChange={(e)=>{setDeleteInputValue(e.target.value)}}
                                            />
                                        </DialogContent>
                                        <DialogActions>
                                            <Button onClick={()=>handleClose('tattooCategoryDelete')}>Cancel</Button>
                                            <Button onClick={handleDeleteCategory}>Delete</Button>
                                        </DialogActions>
                                    </Dialog>
                                </Container >
                            </>
                        :
                            isAddingTattooCategory?
                                userData && tagList &&
                                <AddCategory 
                                    userData={userData}
                                    tagData={tagList}
                                    cancelBtnFunction={handleCancelBtnFunction}
                                    tagUpdateFunction={handleTagListUpdate}
                                    newCategoryAddFunction={handleAddNewCategory}
                                />
                            :
                                // (userData && selectedRowDetails && tattooCategoryList && tagList) ? 
                                (userData && selectedRowDetails && tagList) ? 
                                    <CategoryEdit 
                                        userData={userData} 
                                        tattooCategoryDetail={selectedRowDetails}
                                        // tattooCategoryList={tattooCategoryList}
                                        tagData={tagList}
                                        cancelBtnFunction={handleCancelBtnFunction}
                                        categoryUpdateFunction={handleListCategoryUpdate}
                                        tagUpdateFunction={handleTagListUpdate}
                                    /> 
                                    : null
                    }

                {/* --------------------------------------------------------Error or success message------------------------------------------ */}
                    <Stack spacing={2} sx={{ width: '100%' }}>
                        <Snackbar anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }} open={open} autoHideDuration={6000} onClose={handleMessageBoxClose} >
                        <Alert onClose={handleMessageBoxClose} variant="filled" severity={`${apiMessageType=='success'? 'success': 'error'}`} sx={{ width: '100%' }}>
                            {apiResponseMessage}
                        </Alert>
                        </Snackbar>
                    </Stack>


                    <Footer />
                </SidebarLayout>
            : null}

        </>
    );
};

export default TattooCategory;
