import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface CompteurState {
    count: number;
}

const initialState: CompteurState = { count: 0 };

const compteurSlice = createSlice({
    name: 'compteur',
    initialState,
    reducers: {
        increment(state) {
            state.count += 1;
        },
        decrement(state) {
            state.count -= 1;
        },
        reset(state) {
            state.count = 0;
        },
        setCount(state, action: PayloadAction<number>) {
            state.count = action.payload;
        },
    },
});

export const { increment, decrement, reset, setCount } = compteurSlice.actions;
export default compteurSlice.reducer;