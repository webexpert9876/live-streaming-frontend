import React, { useState, useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Container, Link, ListItemText, styled, Box } from '@mui/material';
import { useRouter } from 'next/router';


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

const ChannelCategory = ({ tattooCategories }) => {
    const [showCount, setShowCount] = React.useState(6);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();


    const handleShowMore = () => {
      setShowCount(prevCount => prevCount + 6);
    };

    useEffect(() => {
        // Simulate a delay to show the skeleton animation
        setTimeout(() => {
            setIsLoading(false);
        }, 2000);
    }, []);

    const sliceSentence = (sentence, maxLength) => {
        if (sentence.length <= maxLength) return sentence;
        const trimmedSentence = sentence.substr(0, maxLength);
        return trimmedSentence.substr(0, Math.min(trimmedSentence.length, trimmedSentence.lastIndexOf(" ")));
    };

    return (
        <>
            <Container style={{ width: "100%", maxWidth: "100%", marginTop: "0px" }}>
                <h2><Link 
                // href="#"
                onClick={()=> router.push(`/categories`)}
                style={{cursor: "pointer"}}
                >Categories</Link> we think you’ll like</h2>
    
                {isLoading ? (
                    <Grid sx={recommendedStyle} className='desktop5'>
                        {/* Skeleton loading animation */}
                        {Array.from({ length: 6 }).map((_, index) => (
                            <CategoryItemSkeletonItem key={index} />
                        ))}
                    </Grid>
                ) : (
                    <Box sx={{width: "100%"}}>
                        <Grid container rowSpacing={{ xs: 2, sm: 3, md: 3, lg: 3.5, xl: 3.5 }} columnSpacing={{ xs: 2, sm: 3, md: 3, lg: 3.5, xl: 3.5  }}>
                            {tattooCategories.slice(0, showCount).map((channelCat) => (
                                <Grid item xs={12} sm={5.9} md={3} lg={2.39} xl={2} key={channelCat._id}>
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
                                                color={'white'}>{sliceSentence(channelCat.title, 20)}</Link>
                                                {/* color={'white'}>{channelCat.title.slice(0, 20)}</Link> */}
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
                        </Grid>
                    </Box>
                )}
                {showCount < tattooCategories.length && (
                    <div className='showAllItemHr'>
                        <Button variant="contained" color="primary" onClick={handleShowMore}>Show More</Button>
                    </div>
                )}
            </Container>
        </>
    );
};

export default ChannelCategory;