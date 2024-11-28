import { createSlice } from "@reduxjs/toolkit";

export const favouritesSlice = createSlice({
    name: "favourites",
    initialState: {
        favourites: [],
    },
    reducers: {
        addFavourite: (state, action) => {
            state.favourites.push(action.payload);
        },
        removeFavourite: (state, action) => {
            state.favourites = state.favourites.filter(
                (favourite) => favourite !== action.payload
            );
        },
        setFavourites: (state, action) => {
            state.favourites = action.payload;
        }
    },
});

export const { addFavourite, removeFavourite, setFavourites } = favouritesSlice.actions;
export default favouritesSlice.reducer;