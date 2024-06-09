import { createSlice } from '@reduxjs/toolkit';

export interface SearchState {
  searchList: any;
}

const initialState: SearchState = {
  searchList: []
}

export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {

  }
})
