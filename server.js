const express = require('express');
const app = express();
const authRoutes = require('./routes/auth');
const movieRoutes = require('./routes/movies');


const cors = require('cors');
app.use(cors());

app.use(express.json());

// Use auth routes with prefix /auth
app.use('/auth', authRoutes);
app.use('/api/movies', movieRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
