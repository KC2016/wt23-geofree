import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Search from "./Search";
import { Box, TextField, Grid, InputAdornment, Card } from "@mui/material";
import { CardActionArea } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const Home = () => {
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState(allData);
  const navigate = useNavigate();

  // const handleSearch = (event) => {
  //   let value = event.target.value;
  //   let result = [];
  //   console.log(value);
  //   result = allData.filter((data) => {
  //     return data.title.search(value) !== -1;
  //   });
  //   setFilteredData(result);
  // };

  const navigateToItem = (itemId) => {
    navigate(`/item/${itemId}`);
  };

  useEffect(() => {
    fetch("https://geofree.pythonanywhere.com/api/item-list/")
      .then((res) => {
        console.log(res);
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setAllData(data);
        setFilteredData(data);
      })
      .catch((e) => {
        console.log("ERROR", e);
      });
  }, []);

  return (
    <div>
      {/* Search bar:
      <Box>
        <TextField
          placeholder="Search"
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            disableUnderline: true,
          }}
          variant="standard"
          onChange={(event) => {
            event.preventDefault();
            handleSearch(event);
          }}
          sx={{ borderBottom: 1, borderColor: "border.main" }}
        />
      </Box> */}

      {/* <Search /> */}
      <Search />

      <div>
        {filteredData.map((value) => {
          return (
            <Card
              display="flex"
              justifyContent="center"
              sx={{
                m: 0,
                flexGrow: 1,
                borderBottom: 1,
                borderColor: "border.main",
                borderRadius: 0,
                backgroundColor: "background.default",
              }}
            >
              <CardActionArea onClick={() => navigateToItem(value.id)}>
                <Grid container spacing={1} sx={{ m: 1 }}>
                  <Grid item xs={6}>
                    <Box
                      component="img"
                      sx={{
                        width: 200,
                        height: 200,
                        border: 1,
                        borderColor: "border.main",
                        objectFit: "cover",
                        borderRadius: 0.3,
                      }}
                      alt="item"
                      src={
                        `https://geofree.pythonanywhere.com/` +
                        value.images[0].image
                      }
                    ></Box>
                  </Grid>

                  <Grid item xs={6}>
                    <div key={value.id}>
                      <div>
                        <strong>{value.title}</strong>
                      </div>
                      <div>{value.description}</div>
                      <div>Condition: {value.condition}</div>
                      <div>Category: {value.categories}</div>
                      <div>
                        <strong>Location</strong>
                      </div>
                    </div>
                  </Grid>
                </Grid>
              </CardActionArea>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Home;
