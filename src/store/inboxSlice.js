// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// export const fetchInboxes = createAsyncThunk('inbox/fetchInboxes', async () => {
//     const response = await fetch('http://localhost:8080/inboxes');
//     if (!response.ok) throw new Error('Failed to fetch inboxes');
//     return response.json();
// });

// export const createInbox = createAsyncThunk('inbox/createInbox', async () => {
//     const response = await fetch('http://localhost:8080/inboxes', { method: 'POST' });
//     if (!response.ok) throw new Error('Failed to create inbox');
//     return response.json();
// });

// export const deleteInbox = createAsyncThunk('inbox/deleteInbox', async (inboxId) => {
//     const response = await fetch(`http://localhost:8080/inboxes/${inboxId}`, { method: 'DELETE' });
//     if (!response.ok) throw new Error('Failed to delete inbox');
//     return inboxId;
// });

// export const fetchInboxEmails = createAsyncThunk('inbox/fetchInboxEmails', async (inboxId) => {
//     const response = await fetch(`http://localhost:8080/inboxes/${inboxId}/emails`);
//     if (!response.ok) throw new Error(`Failed to fetch emails for ${inboxId}`);
//     return { inboxId, emails: await response.json() };
// });
// export const sendEmail = createAsyncThunk('inbox/sendEmail', async ({ from, to, subject, body }) => {
//     const response = await fetch('http://localhost:8080/send-email', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ from, to, subject, body }),
//     });
//     if (!response.ok) throw new Error('Failed to send email');
//     return response.json();
// });


// const inboxSlice = createSlice({
//     name: 'inbox',
//     initialState: {
//         inboxes: [],
//         emails: {}, // Store emails by inboxId
//         status: 'idle',
//         error: null,
//     },
//     reducers: {},
//     extraReducers: (builder) => {
//         builder
//             .addCase(fetchInboxes.pending, (state) => {
//                 state.status = 'loading';
//             })
//             .addCase(fetchInboxes.fulfilled, (state, action) => {
//                 state.status = 'succeeded';
//                 state.inboxes = action.payload;
//             })
//             .addCase(fetchInboxes.rejected, (state, action) => {
//                 state.status = 'failed';
//                 state.error = action.error.message;
//             })
//             .addCase(createInbox.fulfilled, (state, action) => {
//                 state.inboxes.push({ id: action.payload.inbox_id, created_at: new Date().toISOString() });
//             })
//             .addCase(deleteInbox.fulfilled, (state, action) => {
//                 state.inboxes = state.inboxes.filter((inbox) => inbox.id !== action.payload);
//                 delete state.emails[action.payload]; // Clear emails on delete
//             })
//             .addCase(fetchInboxEmails.pending, (state) => {
//                 state.status = 'loading';
//             })
//             .addCase(fetchInboxEmails.fulfilled, (state, action) => {
//                 state.status = 'succeeded';
//                 state.emails[action.payload.inboxId] = action.payload.emails;
//             })
//             .addCase(fetchInboxEmails.rejected, (state, action) => {
//                 state.status = 'failed';
//                 state.error = action.error.message;
//             })
//             .addCase(sendEmail.fulfilled, (state, action) => {
//                 state.status = 'succeeded';
//             })
//             .addCase(sendEmail.rejected, (state, action) => {
//                 state.status = 'failed';
//                 state.error = action.error.message;
//             })
//     },
// });





// export default inboxSlice.reducer;

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchInboxes = createAsyncThunk('inbox/fetchInboxes', async () => {
    const response = await fetch('http://localhost:8080/inboxes');
    if (!response.ok) throw new Error('Failed to fetch inboxes');
    return response.json();
});

export const createInbox = createAsyncThunk('inbox/createInbox', async () => {
    const response = await fetch('http://localhost:8080/inboxes', { method: 'POST' });
    if (!response.ok) throw new Error('Failed to create inbox');
    return response.json();
});

export const deleteInbox = createAsyncThunk('inbox/deleteInbox', async (inboxId) => {
    const response = await fetch(`http://localhost:8080/inboxes/${inboxId}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Failed to delete inbox');
    return inboxId;
});

export const fetchInboxEmails = createAsyncThunk('inbox/fetchInboxEmails', async (inboxId) => {
    const response = await fetch(`http://localhost:8080/inboxes/${inboxId}/emails`);
    if (!response.ok) throw new Error(`Failed to fetch emails for ${inboxId}`);
    return { inboxId, emails: await response.json() };
});
export const sendEmail = createAsyncThunk('inbox/sendEmail', async ({ from, to, subject, body }) => {
    const response = await fetch('http://localhost:8080/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to, subject, body }),
    });
    console.log("Response status:", response.status, "Body:", await response.clone().text());
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to send email: ${errorText}`);
    }
    return response.json();
  });
const inboxSlice = createSlice({
    name: 'inbox',
    initialState: {
        inboxes: [],
        emails: {},
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchInboxes.pending, (state) => {
                state.status = 'loading';
                state.error = null; // Clear error on new action
            })
            .addCase(fetchInboxes.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.inboxes = action.payload;
            })
            .addCase(fetchInboxes.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
                console.error('Fetch inboxes failed:', action.error.message);
            })
            .addCase(createInbox.fulfilled, (state, action) => {
                state.inboxes.push({ id: action.payload.inbox_id, created_at: new Date().toISOString() });
                state.status = 'succeeded';
            })
            .addCase(deleteInbox.fulfilled, (state, action) => {
                state.inboxes = state.inboxes.filter((inbox) => inbox.id !== action.payload);
                delete state.emails[action.payload];
                state.status = 'succeeded';
            })
            .addCase(fetchInboxEmails.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchInboxEmails.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.emails[action.payload.inboxId] = action.payload.emails;
            })
            .addCase(fetchInboxEmails.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
                console.error('Fetch emails failed:', action.error.message);
            })
            .addCase(sendEmail.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(sendEmail.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(sendEmail.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
                console.error('Send email failed:', action.error.message);
            });
    },
});

export default inboxSlice.reducer;