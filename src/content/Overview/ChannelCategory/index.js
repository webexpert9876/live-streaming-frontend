import * as React from 'react';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Container, Link } from '@mui/material';
import { borders } from '@mui/system';
import { styled } from '@mui/system';


// const RecommendedStyle = styled(`Grid`)({
//     display: 'grid',
//     gridTemplateColumns: 'auto auto auto auto auto',
//     gap: '15px'
// })
const Styledesktop10 = {
    display: 'grid',
    gridTemplateColumns: 'auto auto auto auto auto auto auto auto auto auto',
    gap: '10px'
}


const ChannelCategory = ({ tattooCategories }) => {
    const [showCount, setShowCount] = React.useState(8);

    const handleShowMore = () => {
      setShowCount(prevCount => prevCount + 8);
    };

    return (
        <>
            <Container style={{ width: "100%", maxWidth: "100%", marginTop: "0px" }}>
                <h2><Link href="#">Categories</Link> we think you’ll like</h2>
                <Grid sx={Styledesktop10}>
                {tattooCategories.slice(0, showCount).map((channelCat) => (
                        <Grid item xs={12} sm={10} md={4} key={channelCat._id}>
                            <Card sx={{ maxWidth: 190 }} style={{ position: 'relative' }}>
                                <div style={{ position: 'relative' }}>
                                    <CardMedia
                                        sx={{ height: 280 }}
                                        image={`https://livestreamingmaria.s3.us-west-1.amazonaws.com/images/${channelCat.profilePicture}`}
                                    />

                                </div>
                                <Grid container direction="row" alignItems="center" mt={"15px"} ml={"15px;"} pb={"15px"} style={{ display: "flex", alignItems: "flex-start" }} >
                                    <Typography gutterBottom variant="h5" component="div" style={{ width: "100%" }}>
                                        <Link href="#" color={'white'}>{channelCat.title.slice(0, 20)}</Link>
                                    </Typography>
                                    <div className='cateBadge'> New</div>

                                    {channelCat.tags && channelCat.tags ? <ul className='videoTags'>
                                        {channelCat.tags && channelCat.tags.map((tag) => (
                                            <li key={tag}>
                                                <Link href="#" style={{ fontSize: "10px" }}>{tag}</Link>
                                            </li>
                                        ))}
                                    </ul> : null
                                    }

                                </Grid>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
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