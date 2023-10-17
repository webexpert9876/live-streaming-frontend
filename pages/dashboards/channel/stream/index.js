import client from "../../../../graphql";
import { gql } from "@apollo/client";
import { useState, useEffect } from "react";
import LiveStreamChatAdmin from '../../../../src/content/Channel/LiveStreamChatAdmin';
import { setAuthUser, setAuthState, selectAuthState, selectAuthUser } from '../../../../store/slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Box } from "@mui/material";

function ManageLiveStream(params) {
    let userDetails = useSelector(selectAuthUser);
    let userIsLogedIn = useSelector(selectAuthState);
    const [userDetail, setUserDetail] = useState(userDetails);
    const [userAuthState, setUserAuthState] = useState(userIsLogedIn);
    const [liveStreamInfo, setLiveStreamInfo] = useState({});
    const [oldChatMessages, setOldChatMessages] = useState({});

    useEffect(async ()=>{
        if (userDetails && userIsLogedIn) {

            console.log('userDetails', userDetails)
            console.log('userIsLogedIn', userIsLogedIn)
            setUserDetail(userDetails)
            setUserAuthState(userIsLogedIn)
            const liveStreamInfo = await client.query({
                query: gql`
                query Query ($channelId: String) {
                    liveStreamings(channelId: $channelId) {
                        title
                        description
                        _id
                        userId
                        videoPoster
                        channelId
                        viewers
                        videoId
                        tags
                        tattooCategory
                        streamUrl
                        tattooCategoryDetails {
                            title
                            urlSlug
                        }
                    }
                }
            `,
                variables: {
                    "channelId": userDetails.channelId
                    // "channelId": '64be593ca0f0c930a531b7ab'
                }
            }).then((result) => {
                // setIsChannelFollowing(result.data.isChannelFollowing[0])
                // setUserDetail(userDetails);
                console.log('liveStreamInfo', result.data.liveStreamings[0]);
                setLiveStreamInfo(result.data.liveStreamings[0]);
                return result.data.liveStreamings[0]
            });
            console.log('liveStreamInfo', liveStreamInfo);

            let chatMessages;
            if(liveStreamInfo){

                chatMessages = await client.query({
                    query: gql`
                    query Query ($videoId: String!) {
                        chatMessages(videoId: $videoId) {
                            userDetail {
                                firstName
                                lastName
                                _id
                            }
                            message
                            videoId
                            hours
                            mins
                            _id
                            userId
                            liveStreamId
                            isPinned
                        }
                    }
                `,
                    variables: {
                        "videoId": liveStreamInfo.videoId
                        // "channelId": '64be593ca0f0c930a531b7ab'
                    }
                }).then((result) => {
                    console.log('chatMessages result.data.chatMessages', result.data.chatMessages)
                    setOldChatMessages(result.data.chatMessages)
                    return result.data.chatMessages
                });
            }

            console.log('chatMessages', chatMessages);
            
        }
    }, [userIsLogedIn])

    return (
        <>
            <Box mt='100px'>
                {liveStreamInfo && userDetail && oldChatMessages && <LiveStreamChatAdmin liveStreamInfo={liveStreamInfo} viewerUser={userDetail} oldReceivedMessages={oldChatMessages}/>}
            </Box>
        </>
    )
}

export default ManageLiveStream;