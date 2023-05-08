import { Email, Facebook, Instagram, Phone } from '@mui/icons-material';
import { Avatar, Box, Divider, Link, Stack, Typography } from '@mui/material';
import Danao from '../../assets/danao.jpg';
import Bea from '../../assets/bea.jpg';
import Manalo from '../../assets/manalo.jpg';
import Manimtim from '../../assets/manimtim.jpg';

const Social = ({ name, Icon, href }) => {
  return (
    <Link href={href} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
      <Icon fontSize="large" />
      <Typography>{name}</Typography>
    </Link>
  );
};

const Researcher = ({ name, src }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2
      }}
    >
      <Avatar
        src={src}
        sx={{ width: 150, height: 150, border: '1px solid gray' }}
      />
      <Typography variant="h6">{name}</Typography>
    </Box>
  );
};

const About = () => {
  return (
    <Box sx={{ display: 'flex', height: '100%', flexDirection: 'column' }}>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="h4">We are the</Typography>
        <Typography variant="h3" fontWeight="bold">
          Researchers!
        </Typography>
        <Box
          sx={{
            mt: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-evenly'
          }}
        >
          <Researcher name="Danao, Daniella P." src={Danao} />
          <Researcher name="Cañeza, Bea Mariel Nicholle D." src={Bea} />
          <Researcher name="Manalo, John Ryan D." src={Manalo} />
          <Researcher name="Manimtim, Rael P." src={Manimtim} />
        </Box>
        <Box mt={4}>
          <Typography variant="h4" fontWeight="bold">
            Introduction
          </Typography>
          <Typography variant="h5" sx={{ textIndent: 64 }}>
            We are 3rd Year college students from Batangas State
            University-Malvar Campus, taking Bachelor of Industrial Technology
            Major in Computer Technology. This system will serve as Teaching
            Demo Material that aims to make mathematics subject easy to learn
            and understand.
          </Typography>
        </Box>
        <Stack mt={4} gap={2} alignItems="start">
          <Typography variant="h4" fontWeight="bold">
            Contact Us!
          </Typography>
          <Social
            Icon={Facebook}
            name="Math E-turo"
            href="https://www.facebook.com/profile.php?id=100092136867548&mibextid=ZbWKwL"
          />
          <Social Icon={Email} name="20-60071@g.batstate-u.edu.ph" />
          <Social Icon={Phone} name="0956-4015-277 / 0977-0148-657" />
        </Stack>
      </Box>
      <Box>
        <Divider />
        <Typography textAlign="center" py={2}>
          2023 &copy; BatStateUMalvar SIT Student
        </Typography>
      </Box>
    </Box>
  );
};

export default About;
