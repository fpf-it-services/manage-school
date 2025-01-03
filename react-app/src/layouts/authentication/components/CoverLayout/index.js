import PropTypes from "prop-types";
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import PageLayout from "examples/LayoutContainers/PageLayout";

function CoverLayout({ coverHeight, image, children }) {
  return (
    <PageLayout>
      <MDBox
        width="calc(100% - 2rem)"
        minHeight={coverHeight}
        borderRadius="xl"
        mx={2}
        my={2}
        pt={6}
        sx={{
            
          backgroundImage: `linear-gradient(
            135deg, 
            color-mix(in srgb, var(--accent-color), transparent 95%) 50%, 
            color-mix(in srgb, var(--accent-color), transparent 98%) 25%, 
            transparent 50%
          )`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        }}
      />
      <MDBox mt={{ xs: -28, lg: -25 }} px={1} width="calc(100% - 2rem)" mx="auto">
        <Grid container spacing={1} justifyContent="center">
          <Grid item xs={11} sm={9} md={5} lg={4} xl={3}>
            {children}
          </Grid>
        </Grid>
      </MDBox>
    </PageLayout>
  );
}

CoverLayout.defaultProps = {
  coverHeight: "35vh",
};
CoverLayout.propTypes = {
  coverHeight: PropTypes.string,
  image: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default CoverLayout;
