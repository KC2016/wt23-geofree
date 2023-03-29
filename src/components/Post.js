import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  CardContent,
  TextField,
  Card,
  Box,
  Stack,
  ButtonGroup,
  Grid,
  Fab,
  Button,
} from "@mui/material";
import Multiselect from "multiselect-react-dropdown";

import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";

import Location from "./Location";

const Post = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [condition, setCondition] = useState("");
  const [myImage, setMyImage] = useState();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]); // state() that stores the categories selected by the user to do the query
  const [categoriesSelected, setCategoriesSelected] = useState([]); //state() that stores the choices of
  const ref = useRef();
  const [addCategory, setAddCategory] = useState(false); //state() that will conditionally display the input of a new category
  const [newCategory, setNewCategory] = useState(); // state() that stores the new category created by the user

  const handleChange = (event) => {
    setCategories(event.target.value);
  };

  //fetch the GeoFree categories
  useEffect(() => {
    fetch("https://geofree.pythonanywhere.com/api/get-categories/")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setCategories(data);
      })
      .catch((e) => {
        console.log("ERROR", e);
      });
  }, []);

  //building the categories array to show in Multiselect component
  const option = [];
  for (let i = 0; i < categories.length; i++) {
    option.push(categories[i].name);
  }

  const submitHandle = (e) => {
    e.preventDefault();
    const uploadData = new FormData();
    // Loop over myImage array
    for (let i = 0; i < myImage.length; i++) {
      uploadData.append(`uploaded_images[${i}]`, myImage[i], myImage.name);
    }

    uploadData.append("title", title);
    uploadData.append("description", description);
    uploadData.append("latitude", lat);
    uploadData.append("longitude", lng);
    uploadData.append("condition", condition);
    uploadData.append("categories", categoriesSelected); //Array of categories added to the item3
    fetch("https://geofree.pythonanywhere.com/api/item-create/", {
      method: "POST",
      body: uploadData,
    })
      .then((res) => console.log(res))
      .catch((error) => console.log(error));

    navigate("/");
  };

  //If user adds a new category, it will be added to the category DB
  const addCategoryHandle = (event) => {
    event.preventDefault();
    if (option.includes(newCategory)) {
      setNewCategory("Category already exists");
    } else {
      categoriesSelected.push(newCategory);
      fetch("http://127.0.0.1:8000/api/category-create/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newCategory,
        }),
      })
        .then((response) => console.log(response))
        .catch((error) => console.log(error));
      setAddCategory(false);
      setNewCategory(null);
    }
  };

  const reset = (e) => {
    e.preventDefault();
    ref.current.value = null;
    setMyImage(null);
  };

  return (
    <form onSubmit={submitHandle}>
      {/* Upload image: */}

      <Card
        sx={{
          minHeight: 250,
          border: 1,
          borderColor: "border.main",
          backgroundColor: "text.disabled",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 0,
        }}
      >
        <CardContent>
          <Grid container>
            {myImage ? (
              <div>
                {Array.from(myImage).map((item) => {
                  return (
                    <img
                      key={item.name}
                      alt="not found"
                      width={"250px"}
                      src={URL.createObjectURL(item)}
                    />
                  );
                })}

                <Fab component="span" onClick={reset}>
                  <ClearOutlinedIcon />
                </Fab>
              </div>
            ) : null}
            <input
              type="file"
              name="myImage"
              id="uploadimage"
              accept="image/*"
              ref={ref}
              multiple
              hidden
              onChange={(event) => {
                setMyImage(event.target.files);
              }}
            />

            <label htmlFor="uploadimage">
              <Fab component="span">
                <DriveFolderUploadOutlinedIcon />
              </Fab>
            </label>
          </Grid>
        </CardContent>
      </Card>

      {/* Form: */}

      <Stack direction="column" spacing={2} display="flex" alignItems="center">
        {/* Title form: */}
        <Box>
          <label>
            Name
            <br />
            <TextField
              name="title"
              type="text"
              label="Title"
              variant="outlined"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              sx={{ minWidth: "90vw" }}
            ></TextField>
          </label>
          <br />
        </Box>

        {/* Description form: */}
        <Box>
          <label>
            Description
            <br />
            <TextField
              name="description"
              type="text"
              label="Description"
              variant="outlined"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              sx={{
                minWidth: "90vw",
              }}
            ></TextField>
            <br />
          </label>
        </Box>

        {/* Category dropdown:
        <Box sx={{ minWidth: 120 }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Category</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={categories}
              label="Category"
              onChange={handleChange}
              sx={{ minWidth: "90vw" }}
            >
              <MenuItem value="Curniture">Furniture</MenuItem>
              <MenuItem value="Clothes">Clothes</MenuItem>
              <MenuItem value="Kitchen">Kitchen</MenuItem>
              <MenuItem value="Kids">Kids</MenuItem>
              <MenuItem value="Books">Books</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>
        </Box> */}

        <label>
          Category
          <Multiselect
            avoidHighlightFirstOption={true}
            isObject={false}
            options={option}
            onRemove={(event) => {
              setCategoriesSelected(event);
            }}
            onSelect={(event) => {
              setCategoriesSelected(event);
            }}
            onChange={(event) => {
              setCategoriesSelected(event);
            }}
          />
          <div onClick={() => setAddCategory(true)}>Add Category</div>
          {addCategory ? (
            <div>
              <input
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
              <button onClick={addCategoryHandle}>Add</button>
              <div onClick={() => setAddCategory(false)}>(X)</div>
            </div>
          ) : null}
        </label>

        {/* Condition dropdown: */}
        <Box>
          <label>
            Object condition:
            <br />
            <ButtonGroup
              name="condition"
              value={condition}
              onClick={(e) => setCondition(e.target.value)}
              variant="contained"
              aria-label="outlined primary button group"
              fullWidth
              sx={{ minWidth: "90vw" }}
            >
              <Button value="like new">Like new</Button>
              <Button value="good">Good</Button>
              <Button value="acceptable">Acceptable</Button>
              <Button value="poor">Poor</Button>
            </ButtonGroup>
          </label>
        </Box>

        <Box sx={{ minWidth: "90vw" }}>
          <Location setLat={setLat} setLng={setLng} lat={lat} lng={lng} />
          <Button variant="contained" type="submit" color="secondary">
            Submit
          </Button>
        </Box>
      </Stack>
    </form>
  );
};

export default Post;
