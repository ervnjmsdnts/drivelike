import { Email, Facebook, Phone } from '@mui/icons-material';
import { Avatar, Box, Divider, Link, Stack, Typography } from '@mui/material';
import Danao from '../../assets/danao.jpg';
import Bea from '../../assets/bea.jpg';
import Manalo from '../../assets/manalo.jpg';
import Manimtim from '../../assets/manimtim.jpg';

const Social = ({ name, Icon, href }) => {
  return (
    <Link href={href} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
      <Icon fontSize="small" />
      <Typography>{name}</Typography>
    </Link>
  );
};

const Researcher = ({ name, src }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 4
      }}
    >
      <Avatar
        src={src}
        sx={{ width: 100, height: 100, border: '1px solid gray' }}
      />
      <Typography variant="h6">{name}</Typography>
    </Box>
  );
};

const About = () => {
  return (
    <Box pt={8} height="100%">
      <Box sx={{ display: 'grid', gridTemplateColumns: '30% auto', gap: 4 }}>
        <Box>
          <Typography variant="h5" fontWeight="bold" mb={2}>
            Meet the Researchers
          </Typography>
          <Typography variant="h6" color="gray">
            We are 3rd Year college students from Batangas State
            University-Malvar Campus, taking Bachelor of Industrial Technology
            Major in Computer Technology. This system will serve as Teaching
            Demo Material that aims to make mathematics subject easy to learn
            and understand.
          </Typography>
          <Stack mt={4} gap={2} alignItems="start">
            <Social
              Icon={Facebook}
              name="Math E-turo"
              href="https://www.facebook.com/profile.php?id=100092136867548&mibextid=ZbWKwL"
            />
            <Social Icon={Email} name="20-60071@g.batstate-u.edu.ph" />
            <Social Icon={Phone} name="0956-4015-277 / 0977-0148-657" />
          </Stack>
        </Box>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)'
          }}
        >
          <Researcher name="Danao, Daniella P." src={Danao} />
          <Researcher name="Cañeza, Bea Mariel Nicholle D." src={Bea} />
          <Researcher name="Manalo, John Ryan D." src={Manalo} />
          <Researcher name="Manimtim, Rael P." src={Manimtim} />
        </Box>
      </Box>
      <Box pt={2}>
        <Divider />
        <Typography textAlign="center" pt={2}>
          Copyright © 2023 BatStateUMalvar College of Teacher Education
        </Typography>
      </Box>
    </Box>
  );
};

export default About;
