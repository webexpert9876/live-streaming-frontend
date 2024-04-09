import { useRef, useState, useEffect } from 'react';
import {
  Button,
  Box,
  Menu,
  alpha,
  MenuItem,
  Typography,
  styled,
  useTheme
} from '@mui/material';
import ExpandMoreTwoToneIcon from '@mui/icons-material/ExpandMoreTwoTone';
import { Chart } from 'src/components/Chart';
import client from "../../../../graphql";
import { selectAuthUser } from 'store/slices/authSlice';
import { gql } from "@apollo/client";
import { useSelector, useDispatch } from 'react-redux';

const DotPrimaryLight = styled('span')(
  ({ theme }) => `
    border-radius: 22px;
    background: ${theme.colors.primary.lighter};
    width: ${theme.spacing(1.5)};
    height: ${theme.spacing(1.5)};
    display: inline-block;
    margin-right: ${theme.spacing(0.5)};
`
);

const DotPrimary = styled('span')(
  ({ theme }) => `
    border-radius: 22px;
    background: ${theme.colors.primary.main};
    width: ${theme.spacing(1.5)};
    height: ${theme.spacing(1.5)};
    display: inline-block;
    margin-right: ${theme.spacing(0.5)};
`
);

function ChannelAnalytics(props) {
  const theme = useTheme();

  const authState = useSelector(selectAuthUser)
  const [userData, setUserData] = useState([]);
  const [isUserAvailable, setIsUserAvailable] = useState(false);
  const [isFetchedApi, setIsFetchedApi] = useState(true);
  const [channelDetail, setChannelDetail] = useState([]);
  const [channelAnanlysisData, setChannelAnanlysisData] = useState([]);

  // useEffect(async ()=>{

  //   // let userId = JSON.parse(localStorage.getItem('authUser'));
  //   async function getUserAllDetails(){
  //     // let info = await client.query({
  //     client.query({
  //       variables: {
  //         usersId: userData[0]._id
  //       },
  //       query: gql`
  //         query Query($usersId: ID) {
  //           users(id: $usersId) {
  //             _id
  //             firstName
  //             lastName
  //             username
  //             email
  //             password
  //             profilePicture
  //             urlSlug
  //             jwtToken
  //             role
  //             channelId
  //             channelDetails {
  //               _id
  //               channelName
  //               urlSlug
  //               userId
  //               subscribers
  //             }
  //             interestedStyleDetail {
  //                 title
  //                 _id
  //             }
  //           }
  //         }
  //       `,
  //     })
  //     .then((result) => {
  //       setUserData(result.data.users);
  //       setChannelDetail(result.data.users[0].channelDetails);
  //     });
  //     // return info
  //   }

  //   if(isUserAvailable){
            
  //     if(isFetchedApi){
  //       console.log('fetch')
  //       setIsUserAvailable(false);
  //       setIsFetchedApi(false);
  //       // let userInfo = await getUserAllDetails();
  //       // console.log('--------------------------------------',userInfo);
  //       getUserAllDetails();
  //     }
  //   }
  //   // getUserAllDetails();
  // },[isUserAvailable])

  // useEffect(()=>{
  //   if(authState && Object.keys(authState).length > 0){
  //       setUserData([{...authState}])
  //       setIsUserAvailable(true);
  //   }
  // },[authState])

  // useEffect(()=>{

  //   if(channelDetail.length > 0){
  //     client.query({
  //       variables: {
  //         getChannelAnalysisByChannelIdId: channelDetail[0]._id
  //       },
  //       query: gql`
  //         query Query($getChannelAnalysisByChannelIdId: ID) {
  //           getChannelAnalysisByChannelId(id: $getChannelAnalysisByChannelIdId) {
  //             numberofvisit
  //           }
  //         }
  //       `,
  //     }).then((result)=>{
  //       let channelAnanlysis = result.data.getChannelAnalysisByChannelId
        
  //       let ananlysisData = [];

  //       channelAnanlysis.forEach((item)=>{
  //         ananlysisData.push(item.numberofvisit);
  //       });
  //       setChannelAnanlysisData(ananlysisData);
  //     })
  //   }
  // }, [channelDetail])
  
  useEffect(()=>{
    if(props.channelAnanlysisData.length > 0){
      setChannelAnanlysisData(props.channelAnanlysisData);
    }
  }, [props.channelAnanlysisData])
  
  useEffect(()=>{
    if(props.channelDetail.length > 0){
      setChannelDetail(props.channelDetail);
    }
  }, [props.channelDetail])

  const chartOptions = {
    chart: {
      background: 'transparent',
      type: 'bar',
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 6,
        columnWidth: '35%'
      }
    },
    colors: [theme.colors.primary.main, alpha(theme.colors.primary.main, 0.5)],
    dataLabels: {
      enabled: false
    },
    fill: {
      opacity: 1
    },
    theme: {
      mode: theme.palette.mode
    },
    stroke: {
      show: true,
      width: 3,
      colors: ['transparent']
    },
    legend: {
      show: false
    },
    labels: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec'
    ],
    grid: {
      strokeDashArray: 5,
      borderColor: theme.palette.divider
    },
    xaxis: {
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      },
      labels: {
        style: {
          colors: theme.palette.text.secondary
        }
      }
    },
    yaxis: {
      // tickAmount: 6,
      type: 'numeric', // Set y-axis type to 'numeric'
      forceNiceScale: false,
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      },
      labels: {
        style: {
          colors: theme.palette.text.secondary
        },
        formatter: function(value) {
          return Math.floor(value);
        }
      }
    },
    tooltip: {
      x: {
        show: false
      },
      marker: {
        show: false
      },
      y: {
        formatter: function (val) {
          return val;
        }
      },
      theme: 'dark'
    }
  };

  const chartData = [
    {
      name: 'visits',
      // data: [28, 47, 41, 34, 69, 91, 49, 82, 52, 72, 32, 99]
      // data: [8, 7, 4, 3, 2, 3, 3, 6, 8, 1, 5, 10]
      data: channelAnanlysisData
    },
    // {
    //   name: 'Expenses',
    //   data: [38, 85, 64, 40, 97, 82, 58, 42, 55, 46, 57, 70]
    // }
  ];

  const periods = [
    {
      value: 'today',
      text: 'Today'
    },
    {
      value: 'yesterday',
      text: 'Yesterday'
    },
    {
      value: 'last_month',
      text: 'Last month'
    },
    {
      value: 'last_year',
      text: 'Last year'
    }
  ];

  const actionRef1 = useRef(null);
  const [openPeriod, setOpenMenuPeriod] = useState(false);
  const [period, setPeriod] = useState(periods[3].text);

  return (
    <Box>
      <Box
        mb={2}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        <Typography variant="h4">Channel Analytics</Typography>
        {/* <Button
          size="small"
          variant="contained"
          color="secondary"
          ref={actionRef1}
          onClick={() => setOpenMenuPeriod(true)}
          endIcon={<ExpandMoreTwoToneIcon fontSize="small" />}
        >
          {period}
        </Button>
        <Menu
          disableScrollLock
          anchorEl={actionRef1.current}
          onClose={() => setOpenMenuPeriod(false)}
          open={openPeriod}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
        >
          {periods.map((_period) => (
            <MenuItem
              key={_period.value}
              onClick={() => {
                setPeriod(_period.text);
                setOpenMenuPeriod(false);
              }}
            >
              {_period.text}
            </MenuItem>
          ))}
        </Menu> */}
      </Box>
      <Box display="flex" alignItems="center" pb={2}>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: 'flex',
            alignItems: 'center',
            mr: 2
          }}
        >
          <DotPrimary />
          Channel visited
        </Typography>
        {/* <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <DotPrimaryLight />
          tasks completed
        </Typography> */}
      </Box>
      <Chart
        options={chartOptions}
        series={chartData}
        type="bar"
        height={270}
      />
    </Box>
  );
}

export default ChannelAnalytics;
