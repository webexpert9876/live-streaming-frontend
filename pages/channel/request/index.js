import { Container, Grid, Tooltip, Divider, Box, Typography, Card, CardHeader, CardActions, CardContent, TextField, Button } from "@mui/material";
import Text from "../../../src/components/Text";
import { useEffect, useState } from "react";
import SidebarLayout from 'src/layouts/SidebarLayout';

function ChannelRequest(){



    return(
        <>
            <Container maxWidth="lg" sx={{position: 'relative', top: '115px'}}>
                <Grid
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="stretch"
                    spacing={3}
                    mt={3}
                >
                    {/* <Grid item xs={12}></Grid> */}
                    <Card style={{width: "97%"}}>
                        <Box sx={{display: 'flex'}}>
                            {/* <Tooltip arrow placement="top" title="Go back" >
                                <IconButton color="primary" sx={{ p: 2 }}>
                                    <ArrowBackTwoToneIcon />
                                </IconButton>
                            </Tooltip> */}
                            <CardHeader
                                title="Apply For Channel"
                            />
                        </Box>
                        <Divider />
                        <Box>
                            <CardContent sx={{ p: 4 }}>
                                <Typography variant="subtitle2">
                                    <Grid container spacing={0}>
                                        <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                                            <Box mt={1} pr={3} pb={2}>
                                                {/* Title: */}
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} sm={8} md={9}>
                                            <Text color="black">
                                                <TextField
                                                    autoFocus
                                                    margin="dense"
                                                    id="title"
                                                    type="text"
                                                    fullWidth
                                                    variant="standard"
                                                    name='title'
                                                />
                                            </Text>
                                            {/* {openTitleError?<Box sx={{color: 'red', fontWeight: 600}}>
                                                    {titleErrorMessage}
                                            </Box>: null} */}
                                        </Grid>
                                        <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                                            <Box mt={1} pr={3} pb={2}>
                                                {/* Description: */}
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} sm={8} md={9}>
                                            <Typography width={250} color="black">
                                                <TextField
                                                    autoFocus
                                                    margin="dense"
                                                    id="description"
                                                    multiline
                                                    type="text"
                                                    fullWidth
                                                    variant="standard"
                                                    name='description'
                                                   
                                                />
                                            </Typography>
                                            {/* {openDescriptionError?<Box sx={{color: 'red', fontWeight: 600}}>
                                                {descriptionErrorMessage}
                                            </Box>: null} */}
                                        </Grid>
                                        <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                                            <Box mt={2} pr={3} pb={2}>
                                                {/* Tags: */}
                                            </Box>
                                        </Grid>
                                        {/* <Grid item xs={12} sm={8} md={9}>
                                            <Text color="black">
                                                <Box mt={2}>
                                                    <ReactTags
                                                        tags={tags}
                                                        renderSuggestion = {({ text }) => <div style={{}}>{text}</div>}
                                                        suggestions={suggestions}
                                                        delimiters={delimiters}
                                                        handleDelete={handleDelete}
                                                        handleAddition={handleAddition}
                                                        handleDrag={handleDrag}
                                                        handleTagClick={handleTagClick}
                                                        inputFieldPosition="top"
                                                        autocomplete
                                                    />
                                                </Box>
                                            </Text>
                                        </Grid> */}
                                        <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                                            <Box pr={3} pb={2}>
                                                {/* Video Preview Image: */}
                                            </Box>
                                        </Grid>
                                        {/* <Grid item xs={12} sm={8} md={9} sx={{paddingBottom: '20px'}}>
                                            <Box >
                                                {hideAvatarImage?
                                                    null
                                                :
                                                <Typography sx={{marginTop: '10px'}}>
                                                    {userUploadedImage?
                                                        <img style={prvVideoBanner} src={userUploadedImage}/> 
                                                    :
                                                        categoryPreviewImage? 
                                                            <img style={prvVideoBanner} src={`${process.env.NEXT_PUBLIC_S3_URL}/${categoryPreviewImage}`}/> 
                                                        : 
                                                        <Avatar
                                                            variant='rounded'
                                                            src={picture.croppedImg}
                                                            style={prvVideoBanner}
                                                            sx={{ padding: "5" }}
                                                        />
                                                    }
                                                </Typography>
                                                }
                                                {/* {hideAvatarImage?<Avatar
                                                src={picture.croppedImg}
                                                style={{ width: "100%", height: "auto", padding: "5" }}
                                                />: null} */}
                                                {/* {picture.cropperOpen && (
                                                    <Box display="block">
                                                        <AvatarEditor
                                                            ref={setEditorRef}
                                                            image={picture.img}
                                                            width={400}
                                                            height={400}
                                                            border={50}
                                                            color={[255, 255, 255, 0.6]} // RGBA
                                                            rotate={0}
                                                            scale={picture.zoom}
                                                            style={prvVideoBanner}
                                                        />
                                                        <Slider
                                                            aria-label="raceSlider"
                                                            value={picture.zoom}
                                                            min={1}
                                                            max={10}
                                                            step={0.1}
                                                            onChange={handleSlider}
                                                        ></Slider>
                                                        <Box>
                                                            <Button variant="contained" onClick={handleCancel}>
                                                                Cancel
                                                            </Button>
                                                            <Button onClick={handleSave}> Save</Button>
                                                        </Box>
                                                    </Box>
                                                )} */}
                                                {/* <Button
                                                    variant="contained"
                                                    width="100%"
                                                    sx={{marginTop: '10px', padding: '10px 0px 10px 20px'}}
                                                >
                                                    <input type="file" ref={imageInputRef} accept="image/*" onChange={handleFileChange} />
                                                </Button> */}
                                            {/* </Box> */}
                                            {/* {progress > 0 ?<LinearProgressWithLabel value={progress} />: null} */}
                                            {/* {openImageError?<Box sx={{color: 'red', fontWeight: 600}}>
                                                {imageErrorMessage}
                                            </Box>: null}
                                        </Grid> */}
                                    </Grid>
                                </Typography>
                                <Typography sx={{textAlign: 'end'}}>
                                    <Button >Cancel</Button>
                                    <Button > Apply</Button>
                                </Typography>
                            </CardContent>
                        </Box>
                    </Card>
                </Grid>
            </Container >
        </>
    )

}

export default ChannelRequest