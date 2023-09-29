import { useState, useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';
import Head from 'next/head';
import SidebarLayout from 'src/layouts/SidebarLayout';
import PageHeader from 'src/content/Management/Users/settings/PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Container, Tabs, Tab, Grid, Link, ListItemText, Card, CardMedia, Typography } from '@mui/material';
import Footer from 'src/components/Footer';
import { styled } from '@mui/material/styles';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { selectAuthUser } from 'store/slices/authSlice';
import client from "../../graphql";
import { gql } from "@apollo/client";

const recommendedStyle = {
    display: 'grid',
    gridTemplateColumns: 'auto auto auto auto auto auto',
    gap: '15px'
}
const Styledesktop10 = {
    display: 'grid',
    gridTemplateColumns: 'auto auto auto auto auto auto',
    gap: '10px'
}

const CategoryItemSkeletonItem = () => {

    return (
        <Grid
            container
            className="tooltip"
            direction="row"
            alignItems="center"
            mt={"0px"}
            ml={"8px"}
            pb={"15px"}
            style={{ display: "flex", alignItems: "flex-start" }}
        >   
            <Skeleton
                    className='br100 listChannelIconSize'
                    style={{ width: "225px", borderRadius: "10px" }}
                    height={140}
                />
            <Grid item>
                <Skeleton
                    className='br100 listChannelIconSize'
                    style={{ width: "30px" }}
                    height={30}
                />
            </Grid>
            <Grid item ml={"15px"} style={{ width: "74%" }}>
                <ListItemText sx={{ display: 'block' }} style={{ position: "relative" }}>
                    <div className='channelListChannelName'>
                        <Skeleton height={16} width={100} />
                    </div>
                    <Skeleton height={16} width={100} />
                    <span className="tooltiptext" style={{ textAlign: "left", padding: "10px" }}>
                        <Skeleton height={16} width={100} />
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        
                        <Skeleton height={16} width={50} />
                    </div>
                </ListItemText>
            </Grid>
        </Grid>
    );
};

function CategoryList(props) {
    const [tattooCategoryList, setTattooCategoryList] = useState(props.tattooCategories.length>0?props.tattooCategories: []);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Simulate a delay to show the skeleton animation
        setTimeout(() => {
            setIsLoading(false);
        }, 2000);
    }, []);

    return(
        <>
            <Container style={{ width: "100%", maxWidth: "100%", marginTop: "120px" }}>
                <Typography sx={{fontSize: '50px !important', color: '#8162d2', fontWeight: 800}} mb={2}>Tattoo Categories</Typography>
    
                {isLoading ? (
                    <Grid sx={recommendedStyle} className='desktop5'>
                        {Array.from({ length: 6 }).map((_, index) => (
                            <CategoryItemSkeletonItem key={index} />
                        ))}
                    </Grid>
                ) : (
                    tattooCategoryList.length > 0 ?<Grid sx={recommendedStyle} className='desktop5'>
                        {tattooCategoryList.map((channelCat) => (
                            <Grid item xs={12} sm={10} md={4} key={channelCat._id}>
                                <Card sx={{ maxWidth: 290 }} style={{ position: 'relative' }}>
                                    <div style={{ position: 'relative' }}>
                                        <CardMedia
                                            sx={{ height: 280 }}
                                            image={`https://livestreamingmaria.s3.us-west-1.amazonaws.com/images/${channelCat.profilePicture}`}
                                        />

                                    </div>
                                    <Grid container direction="row" alignItems="center" mt={"15px"} ml={"15px;"} pb={"15px"} style={{ display: "flex", alignItems: "flex-start" }} >
                                        <Typography gutterBottom variant="h5" component="div" style={{ width: "100%" }}>
                                            <Link 
                                            // href={`/single-category/${channelCat.urlSlug}`}
                                            onClick={()=> router.push(`/single-category/${channelCat.urlSlug}`)}
                                            style={{cursor: "pointer"}}
                                            color={'white'}>{channelCat.title.slice(0, 20)}</Link>
                                        </Typography>
                                        <div className='cateBadge'> New</div>

                                        {channelCat.tags && channelCat.tags ? <ul className='videoTags'>
                                                {channelCat.tags && channelCat.tags.map((tag) => (
                                                    <li key={tag}>
                                                        <Link 
                                                        // href="#"
                                                        onClick={()=> router.push("#")}                                                        
                                                        style={{ fontSize: "10px", cursor: "pointer"}}>{tag}</Link>
                                                    </li>
                                                ))}
                                            </ul> : null
                                        }

                                    </Grid>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>:<div>
                            No tattooCategories found
                        </div>
                )}
                {/* {showCount < tattooCategories.length && (
                    <div className='showAllItemHr'>
                        <Button variant="contained" color="primary" onClick={handleShowMore}>Show More</Button>
                    </div>
                )} */}
            </Container>
        </>
    )
}

export async function getStaticProps() {
    try {
      const { data } = await client.query({
        query: gql`
          query Query {
            tattooCategories {
              _id
              profilePicture
              tags
              title
              urlSlug
            }
          }
        `,
      });
  
      return {
        props: {tattooCategories: data.tattooCategories }, // No need to stringify the data
      };
    } catch (error) {
        console.error('Error fetching data:', error);
        return {
            props: { data: null }, // Handle error case gracefully in your component
        };
    }
}
  
export default CategoryList;
