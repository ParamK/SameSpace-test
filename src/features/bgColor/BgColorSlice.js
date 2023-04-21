import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    value: "#001529",
}

export const BgColorSlice = createSlice({
    name: 'bgColor',
    initialState,
    reducers: {
        updateBgColor: (state, action) => {
            state.value = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const { updateBgColor } = BgColorSlice.actions

export default BgColorSlice.reducer