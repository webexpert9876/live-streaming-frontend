import {
  Box,
  Tooltip,
  Badge,
  tooltipClasses,
  styled,
  useTheme
} from '@mui/material';
import Link from 'src/components/Link';
// import logo from '../../../pages/Assets/img/logo.png'
import Image from 'next/image'

const LogoWrapper = styled(Link)(
  ({ theme }) => `
        color: ${theme.palette.text.primary};
        display: flex;
        text-decoration: none;
        width: 53px;
        margin: 0 auto;
        font-weight: ${theme.typography.fontWeightBold};
`
);

const LogoSignWrapper = styled(Box)(
  () => `
        width: 52px;
        height: 38px;
`
);

const LogoSign = styled(Box)(
  ({ theme }) => `
        background: ${theme.general.reactFrameworkColor};
        width: 18px;
        height: 18px;
        border-radius: ${theme.general.borderRadiusSm};
        position: relative;
        transform: rotate(45deg);
        top: 3px;
        left: 17px;

        &:after, 
        &:before {
            content: "";
            display: block;
            width: 18px;
            height: 18px;
            position: absolute;
            top: -1px;
            right: -20px;
            transform: rotate(0deg);
            border-radius: ${theme.general.borderRadiusSm};
        }

        &:before {
            background: ${theme.palette.primary.main};
            right: auto;
            left: 0;
            top: 20px;
        }

        &:after {
            background: ${theme.palette.secondary.main};
        }
`
);

const LogoSignInner = styled(Box)(
  ({ theme }) => `
        width: 16px;
        height: 16px;
        position: absolute;
        top: 12px;
        left: 12px;
        z-index: 5;
        border-radius: ${theme.general.borderRadiusSm};
        background: ${theme.header.background};
`
);

const width = {
  width:"170px",  
};

function Logo() {
  const theme = useTheme();


  return (

      <LogoWrapper href="/" sx={width}>
        {/* <Image
      src="/pages/Assets/img/logo.png"
      width={500}
      height={500}
      alt="Picture of the author"
    /> */}
        {/* <img src={`${process.env.NEXT_PUBLIC_S3_URL}/pages/Assets/img/logo.png`} /> */}
        {/* <img src={`http://localhost:3000/pages/Assets/img/logo.png`} /> */}
        <Image
          src='/logo.png'
          alt="Picture of the author"
          width="165px"
          height="60px"
          
        />
      </LogoWrapper>
    
  );
}

export default Logo;
