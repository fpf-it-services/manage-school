import PropTypes from "prop-types";
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import PageLayout from "examples/LayoutContainers/PageLayout";
// import { Typography, List, ListItem, ListItemText } from "@mui/material";
// import { useLocation } from "react-router-dom";

function BasicLayout({ image, children }) {
  // const { pathname } = useLocation();

  return (
    <PageLayout>
      <MDBox
        sx={{ height: "auto", minHeight: "100vh" }}
        display="flex"
        flexDirection="column"
        minHeight="100vh"
      >
        <MDBox
          position="absolute"
          width="100%"
          minHeight="100vh"
          sx={{
            backgroundImage: ({ functions: { linearGradient, rgba }, palette: { gradients } }) =>
              image &&
              `${linearGradient(
                rgba(gradients.dark.main, 0.6),
                rgba(gradients.dark.state, 0.6)
              )}, url(${image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <MDBox
            position="relative"
            height="100%"
            display="flex"
            flexDirection="column"
            width="100%"
            justifyContent="center"
            paddingTop="4em"
          >
            <MDBox paddingBottom="3rem" sx={{ textAlign: "center" }}>
              {/* {pathname === "/auth/login" && (
                <MDBox display="flex" width="100%" justifyContent="center" sx={{ zIndex: "99" }}>
                  <MDBox
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    padding="1.5rem"
                    width="80%"
                  >
                    <MDBox
                      display="flex"
                      flexDirection="column"
                      justifyContent="center"
                      alignItems="center"
                      marginBottom="0.5rem"
                    >
                      <List dense={true}>
                        <ListItem>
                          <ListItemText
                            disableTypography
                            primary={
                              <Typography
                                variant="body2"
                                fontWeight="400"
                                style={{ color: "white" }}
                              >
                                Username{" "}
                                <Typography variant="span" fontWeight="700">
                                  admin@jsonapi.com
                                </Typography>{" "}
                                with password{" "}
                                <Typography variant="span" fontWeight="700">
                                  secret
                                </Typography>
                              </Typography>
                            }
                          />
                        </ListItem>
                      </List>
                    </MDBox>
                  </MDBox>
                </MDBox>
              )} */}
              <MDBox px={1} width="100%" mx="auto" paddingTop="1rem">
                <Grid container spacing={1} justifyContent="center" alignItems="center">
                  <Grid item xs={11} sm={9} md={5} lg={4} xl={3}>
                    {children}
                  </Grid>
                </Grid>
              </MDBox>
            </MDBox>
          </MDBox>
        </MDBox>
      </MDBox>
    </PageLayout>
  );
}

BasicLayout.propTypes = {
  image: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default BasicLayout;
