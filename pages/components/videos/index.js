import Head from 'next/head';
import SidebarLayout from 'src/layouts/SidebarLayout';
import { useState } from 'react';
import { format } from 'date-fns';
import numeral from 'numeral';
import PropTypes from 'prop-types';
import PageHeader from './PageHeader';
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
    CardHeader
} from '@mui/material';

import Label from 'src/components/Label';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import Footer from 'src/components/Footer';
import { subDays } from 'date-fns';

const getStatusLabel = (cryptoOrderStatus) => {
    const map = {        
        public: {
            text: 'Public',
            color: 'success'
        },
        draft: {
            text: 'Draft',
            color: 'warning'
        }
    };

    const { text, color } = map[cryptoOrderStatus];

    return <Label color={color}>{text}</Label>;
};

const applyFilters = (cryptoOrders, filters) => {
    return cryptoOrders.filter((cryptoOrder) => {
        let matches = true;

        if (filters.status && cryptoOrder.status !== filters.status) {
            matches = false;
        }

        return matches;
    });
};

const applyPagination = (cryptoOrders, page, limit) => {
    return cryptoOrders.slice(page * limit, page * limit + limit);
};

const Video = ({ cryptoOrders }) => {
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(5);
    const [filters, setFilters] = useState({
        status: null
    });

    const statusOptions = [
        {
            id: 'all',
            name: 'All'
        },
        {
            id: 'public',
            name: 'Public'
        },
        {
            id: 'draft',
            name: 'Draft'
        },
     
    ];

    const handleStatusChange = (e) => {
        let value = null;

        if (e.target.value !== 'all') {
            value = e.target.value;
        }

        setFilters((prevFilters) => ({
            ...prevFilters,
            status: value
        }));
    };

    const handlePageChange = (_event, newPage) => {
        setPage(newPage);
    };

    const handleLimitChange = (event) => {
        setLimit(parseInt(event.target.value));
    };

    const filteredVideo = applyFilters(cryptoOrders, filters);
    const paginatedVideo = applyPagination(
        filteredVideo,
        page,
        limit
    );
    const theme = useTheme();
    const video = [
        {
            id: '1',
            orderDetails: 'Video 1',
            orderDate: new Date().getTime(),
            status: 'public',
            orderID: 'VUVX709ET7BY',
            styleName: 'Style 1',            
            videoView: "10005",
        },
        {
            id: '2',
            orderDetails: 'Video 2',
            orderDate: subDays(new Date(), 1).getTime(),
            status: 'public',
            orderID: '23M3UOG65G8K',
            styleName: 'Style 2',
            videoView: "85585",
        },
        {
            id: '3',
            orderDetails: 'Video 3',
            orderDate: subDays(new Date(), 5).getTime(),
            status: 'draft',
            orderID: 'F6JHK65MS818',
            styleName: 'Style 3',
            videoView: "998898",
        },
        {
            id: '4',
            orderDetails: 'Video 4',
            orderDate: subDays(new Date(), 55).getTime(),
            status: 'public',
            orderID: 'QJFAI7N84LGM',
            styleName: 'Style 4',
            videoView: "5555",
        },
        {
            id: '5',
            orderDetails: 'Video 5',
            orderDate: subDays(new Date(), 56).getTime(),
            status: 'draft',
            orderID: 'BO5KFSYGC0YW',
            styleName: 'Style 5',
            videoView: "859595",
        },
        {
            id: '6',
            orderDetails: 'Video 6',
            orderDate: subDays(new Date(), 33).getTime(),
            status: 'public',
            orderID: '6RS606CBMKVQ',
            styleName: 'Style 6',
            videoView: "4545454",
        },
        {
            id: '7',
            orderDetails: 'Video 7',
            orderDate: new Date().getTime(),
            status: 'draft',
            orderID: '479KUYHOBMJS',
            styleName: 'Style 7',
            videoView: "554545",
        },
        {
            id: '8',
            orderDetails: 'Video 8',
            orderDate: subDays(new Date(), 22).getTime(),
            status: 'public',
            orderID: 'W67CFZNT71KR',
            sourceName: 'Paypal Account',
            sourceDesc: '*** 1111',
            videoView: "55555",
        },
        {
            id: '9',
            orderDetails: 'Video 9',
            orderDate: subDays(new Date(), 11).getTime(),
            status: 'public',
            orderID: '63GJ5DJFKS4H',
            styleName: 'Style 8',
            videoView: "9999",
        },
        {
            id: '10',
            orderDetails: 'Video 10',
            orderDate: subDays(new Date(), 123).getTime(),
            status: 'draft',
            orderID: '17KRZHY8T05M',
            styleName: 'Style 9',
            videoView: "1000",
        }
    ];

    // console.log(video)

    return (
        <>
            <Head>
                <title>All Videos</title>
            </Head>
            <PageTitleWrapper>
                <PageHeader />
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
                    <Card  style={{width: "97%"}}>
                        <CardHeader
                            action={
                                <Box width={150}>
                                    <FormControl fullWidth variant="outlined">
                                        <InputLabel>Status</InputLabel>
                                        <Select
                                            value={filters.status || 'all'}
                                            onChange={handleStatusChange}
                                            label="Status"
                                            autoWidth
                                        >
                                            {statusOptions.map((statusOption) => (
                                                <MenuItem key={statusOption.id} value={statusOption.id}>
                                                    {statusOption.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Box>
                            }
                            title="Recent Orders"
                        />
                        <Divider />
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Video Title</TableCell>
                                        <TableCell>Video ID</TableCell>
                                        <TableCell>Style</TableCell>
                                        <TableCell align="right">Views</TableCell>
                                        <TableCell align="right">Status</TableCell>
                                        <TableCell align="right">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {video.map((video) => {
                                        return (
                                            <TableRow hover key={video.id}>
                                                <TableCell>
                                                    <Typography
                                                        variant="body1"
                                                        fontWeight="bold"
                                                        color="text.primary"
                                                        gutterBottom
                                                        noWrap
                                                    >
                                                        {video.orderDetails}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary" noWrap>
                                                        {format(video.orderDate, 'MMMM dd yyyy')}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography
                                                        variant="body1"
                                                        fontWeight="bold"
                                                        color="text.primary"
                                                        gutterBottom
                                                        noWrap
                                                    >
                                                        {video.orderID}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography
                                                        variant="body1"
                                                        fontWeight="bold"
                                                        color="text.primary"
                                                        gutterBottom
                                                        noWrap
                                                    >
                                                        {video.styleName}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary" noWrap>
                                                        {video.sourceDesc}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Typography
                                                        variant="body1"
                                                        fontWeight="bold"
                                                        color="text.primary"
                                                        gutterBottom
                                                        noWrap
                                                    >
                                                        {video.videoView}
                                                        {video.cryptoCurrency}
                                                    </Typography>
                                        
                                                </TableCell>
                                                <TableCell align="right">
                                                    {getStatusLabel(video.status)}
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Tooltip title="Edit Order" arrow>
                                                        <IconButton
                                                            sx={{
                                                                '&:hover': {
                                                                    background: theme.colors.primary.lighter
                                                                },
                                                                color: theme.palette.primary.main
                                                            }}
                                                            color="inherit"
                                                            size="small"
                                                        >
                                                            <EditTwoToneIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Delete Order" arrow>
                                                        <IconButton
                                                            sx={{
                                                                '&:hover': { background: theme.colors.error.lighter },
                                                                color: theme.palette.error.main
                                                            }}
                                                            color="inherit"
                                                            size="small"
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
                                count={filteredVideo.length}
                                onPageChange={handlePageChange}
                                onRowsPerPageChange={handleLimitChange}
                                page={page}
                                rowsPerPage={limit}
                                rowsPerPageOptions={[5, 10, 25, 30]}
                            />
                        </Box>
                    </Card>
                </Grid>
            </Container >
            <Footer />

        </>
    );
};

Video.propTypes = {
    cryptoOrders: PropTypes.array.isRequired
};

Video.defaultProps = {
    cryptoOrders: []
};
Video.getLayout = (page) => (
    <SidebarLayout>{page}</SidebarLayout>
);
export default Video;
