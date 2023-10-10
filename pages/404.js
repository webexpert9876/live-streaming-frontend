import {
  Box,
  Card,
  Typography,
  Container,
  Divider,
  Button,
  FormControl,
  OutlinedInput,
  InputAdornment,
  styled
} from '@mui/material';
import Head from 'next/head';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import { useRouter } from 'next/router';
import BaseLayout from 'src/layouts/BaseLayout';
import { useState } from 'react';

const MainContent = styled(Box)(
  () => `
    height: 100%;
    display: flex;
    flex: 1;
    flex-direction: column;
`
);

const TopWrapper = styled(Box)(
  ({ theme }) => `
  display: flex;
  width: 100%;
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing(6)};
`
);

const OutlinedInputWrapper = styled(OutlinedInput)(
  ({ theme }) => `
    background-color: ${theme.colors.alpha.white[100]};
`
);

const ButtonSearch = styled(Button)(
  ({ theme }) => `
    margin-right: -${theme.spacing(1)};
`
);

function Status404() {
  const [inputValue, setInputValue] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();
  
  const handleSearchClick =()=>{
    if(inputValue){
      router.push(`/search?searchString=${inputValue}`)
    } else{
      setErrorMessage('Please enter something to search');
    }
  }
  return (
    <>
      <Head>
        <title>Status - 404</title>
      </Head>
      <MainContent mt={'80px'}>
        <TopWrapper>
          <Container maxWidth="md">
            <Box textAlign="center">
              <img alt="404" height={180} src="/static/images/status/404.svg" />
              <Typography variant="h2" sx={{ my: 2 }}>
                The page you were looking for doesn't exist.
              </Typography>
              <Typography
                variant="h4"
                color="text.secondary"
                fontWeight="normal"
                sx={{ mb: 4 }}
              >
                It's on us, we moved the content to a different page. The search
                below should help!
              </Typography>
            </Box>
            <Container maxWidth="sm">
              <Card sx={{ textAlign: 'center', mt: 3, p: 4 }}>
                <FormControl variant="outlined" fullWidth>
                  <OutlinedInputWrapper
                    type="text"
                    placeholder="Search terms here..."
                    onChange={(e)=>{
                      setInputValue(e.target.value);
                      setErrorMessage('');
                    }}
                    endAdornment={
                      <InputAdornment position="end" onClick={handleSearchClick}>
                        <ButtonSearch variant="contained" size="small" >
                          Search
                        </ButtonSearch>
                      </InputAdornment>
                    }
                    startAdornment={
                      <InputAdornment position="start">
                        <SearchTwoToneIcon />
                      </InputAdornment>
                    }
                  />
                  {errorMessage && <Typography sx={{color: 'red', fontWeight: 600}}>{errorMessage}</Typography>}
                </FormControl>
                <Divider sx={{ my: 4 }}>OR</Divider>
                <Button href="/" variant="outlined">
                  Go to homepage
                </Button>
              </Card>
            </Container>
          </Container>
        </TopWrapper>
      </MainContent>
    </>
  );
}

export default Status404;

Status404.getLayout = function getLayout(page) {
  return <BaseLayout>{page}</BaseLayout>;
};
