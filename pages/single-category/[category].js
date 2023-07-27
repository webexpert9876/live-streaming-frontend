import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import PageHeader from 'src/content/Dashboards/Tasks/PageHeader';
import { gql, useQuery, ApolloClient, InMemoryCache } from '@apollo/client';
import client from "../../graphql";
import {
  Typography,
  Box,
  Card,
  Container,
  Button,
  styled,
  Grid,
  Paper
} from '@mui/material';
import Logo from 'src/components/LogoSign';
import Link from 'src/components/Link';
import Head from 'next/head';
import { Transform } from '@mui/icons-material';

export default function Category(props) {
  console.log('props', JSON.parse(props.category))
  const [tattooCategories, setTattooCategories] = useState(JSON.parse(props.category).tattooCategories);
  const [countFollower, setCountFollower] = useState(JSON.parse(props.category).countTattooCategoryFollower[0]);
  const [isCatFollowing, setIsCatFollowing] = useState(JSON.parse(props.category).isTattooCategoryFollowing);
  
  // if (router.isFallback) {
  //   <h1>Data is loading</h1>;
  // }
  
  const HeaderWrapper = styled(Card)(
    ({ theme }) => `
    width: 100%;
    display: flex;
    align-items: center;
    height: ${theme.spacing(10)};
    margin-bottom: ${theme.spacing(10)};
    border-radius:0;
  `
  );
  const router = useRouter()
  console.log('isCatFollowing', isCatFollowing[0].isFollowing)
  // const categoryId = router.query.category; // Access the dynamic route parameter
  // const client = new ApolloClient({
  //   uri: 'YOUR_GRAPHQL_ENDPOINT_HERE', // Replace with your GraphQL endpoint
  //   cache: new InMemoryCache(),
  // });

  // const GET_SINGLE_CATEGORY = gql`
  //   query GetSingleCategory($tattooCategoriesId: ID!) {
  //     tattooCategories(id: $tattooCategoriesId) {
  //       _id
  //       description
  //       profilePicture
  //       tags
  //       title
  //     }
  //   }
  // `;

  // const { loading, error, data } = useQuery(GET_SINGLE_CATEGORY, {
  //   variables: {
  //     tattooCategoriesId: categoryId,
  //   },
  // });

  // useEffect(() => {
  //   if (data && data.tattooCategories) {
  //     console.log('single category.data', data.tattooCategories);
  //     // You can set your category data in the state or use it directly here
  //   }
  // }, [data]);

  // if (loading) return <p>Loading...</p>;
  // if (error) return <p>Error: {error.message}</p>;
  // useEffect(() => {
  //   client.query({
  //     query: gql`
  //           query Query ($tattooCategoriesId: ID) {
  //             tattooCategories(id: $tattooCategoriesId) {
  //               _id
  //               description
  //               profilePicture
  //               tags
  //               title
  //             }
  //           }
  //       `,
  //       variables: {
  //         "tattooCategoriesId": router.query.category
  //       }
  //   })
  //     .then((result) => {
  //       console.log('single category.data', result.data)
  //       // setChannels(result.data.channels)
  //       // tattooCategories(result.data.tattooCategories)        
  //     });
  // }, [])

  return (
    <>

      <HeaderWrapper>
        <Container maxWidth="lg">
          <Box display="flex" alignItems="center">
            <Logo />
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              flex={1}
            >
              <Box />
              <Box>
                <Button
                  component={Link}
                  href="/auth/login"
                  variant="contained"
                  sx={{ ml: 2 }}
                >
                  Login
                </Button>
              </Box>
            </Box>
          </Box>
        </Container>
      </HeaderWrapper>
      <Container>
        <Grid container spacing={2}>
          {/* Left Image Section */}
          <Grid item xs={12} sm={2}>
            <img
              src="https://static-cdn.jtvnw.net/ttv-boxart/493597_IGDB.jpg"
              alt="Left Image"
              style={{ width: '150px', height: 'auto' }}
            />
          </Grid>

          {/* Right Text Section */}
          <Grid item xs={12} sm={10}>
            <Paper elevation={3} style={{ padding: '16px' }}>
              <Grid container direction="row" alignItems="center" mt={"0px"} ml={"8px"} pb={"15px"} style={{ display: "flex", alignItems: "flex-start" }} >
                <Grid item>
                  {tattooCategories[0].viewers}
                </Grid>
                <Grid item>
                  {countFollower.countFollower} Followers <br></br>
                  {isCatFollowing[0].isFollowing? 'true': 'false'}55
                  
                </Grid>
                <Grid item>
                  {tattooCategories[0].tags}
                </Grid>


              </Grid>

              <Typography variant="h2" >{tattooCategories[0].title}</Typography>
              <p>{tattooCategories[0].description}</p>
              <Typography variant="h5"><span style={{ textTransform: "uppercase" }}>{router.query.category}</span></Typography>
              <Typography variant="body1">

              </Typography>
            </Paper>
          </Grid>
        </Grid>

      </Container>
      <div>
        {tattooCategories[0]._id}
        {tattooCategories[0].profilePicture}
        {tattooCategories[0].description}
        <br />

        <br />

      </div>
    </>
  )
}

// export const getStaticProps = async () => {
//   client.query({
//     query: gql`
//           query Query ($tattooCategoriesId: ID) {
//             tattooCategories(id: $tattooCategoriesId) {
//               _id
//               description
//               profilePicture
//               tags
//               title
//             }
//           }
//       `,
//       variables: {
//         "tattooCategoriesId": params
//       }
//   })
//     .then((result) => {
//       console.log('single category.data', result.data)
//       // setChannels(result.data.channels)
//       // tattooCategories(result.data.tattooCategories)
//     });
//   return { props: { test: 'repo' } }
// }

export async function getStaticPaths() {


  let tattooData = await client.query({
    query: gql`
            query Query {
              tattooCategories {
                _id
              }
            }
        `,
  })
    .then((result) => {
      console.log('single category.data', result.data)
      // setChannels(result.data.channels)
      // tattooCategories(result.data.tattooCategories)      
      let categoryId = result.data.tattooCategories.map((item) => {
        return {
          params: {
            category: `${item._id}`
          }
        }
      })
      console.log('categoryId', categoryId)
      return categoryId;
    });
  console.log('tattooData', tattooData)
  return {
    paths: tattooData,
    fallback: false,
  };






  // let blogData = await axios.get(process.env.BACKEND_URL + `/api/blogs`).then((data) => {
  //   // console.log(data.data.data)
  //   let blogId = data.data.data.map((item) => {
  //     return {

  //       params: {
  //         id: `${item.id}`
  //       }
  //     }
  //   })
  //   // console.log(blogId)
  //   return blogId;
  // });
  // return {
  //   paths: blogData,
  //   fallback: true,
  // };
}

export async function getStaticProps({ params }) {

  let category = await client.query({
    query: gql`
          query Query ($tattooCategoriesId: ID, $tattooCategoryId: String!, $isTattooCategoryFollowingTattooCategoryId2: String!, $userId: String!) {
            tattooCategories(id: $tattooCategoriesId) {
              _id
              description
              profilePicture
              tags
              title
            }
            countTattooCategoryFollower(tattooCategoryId: $tattooCategoryId) {
              countFollower
            }
            isTattooCategoryFollowing(tattooCategoryId: $isTattooCategoryFollowingTattooCategoryId2, userId: $userId) {
              isFollowing
            }
          }
      `,
    variables: {
      "tattooCategoriesId": params.category,
      "tattooCategoryId": params.category,
      "isTattooCategoryFollowingTattooCategoryId2": params.category,
      "userId": "64808a8239f7e8f7f68643d1"
    }
  })
    .then((result) => {
      console.log('single category.data', result.data)
      // setChannels(result.data.channels)
      return result.data
      // tattooCategories(result.data.tattooCategories)        
    });
  category = JSON.stringify(category);
  return {
    props: { 
      category: category
    },
  }
}