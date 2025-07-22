import express from 'express';
import 'dotenv/config';
import cors from 'cors'
import { customerSupportRouter } from './Router/customerSupportRouter.js';
import { ambulanceRouter } from './Router/ambulancePartnerRouter.js';
import { rideRouter } from './Router/rideRouter.js';
import { slotRouter } from './Router/slotRouter.js';
import { doctorRouter } from './Router/doctorRouter.js';
import { educationRouter } from './Router/educationRouter.js';
import { experienceRouter } from './Router/experienceRouter.js';
import { timingRouter } from './Router/timingRouter.js';

import { createServer } from 'http';
import { initializeSocket } from './Utils/initSocket.js';


const PORT = process.env.PORT || 8000
const app = express();


app.use(cors({
  origin: "*",
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true
}));


// socket connnection 
export const server = createServer(app);
initializeSocket(server);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.status(200).json({ message: "Har Har Mahadev" })
})


app.use('/api/v1/customersupport', customerSupportRouter);
app.use('/api/v1/ambulancepartner', ambulanceRouter);
app.use('/api/v1/ride', rideRouter);
app.use('/api/v1/slot', slotRouter);
app.use('/api/v1/doctor', doctorRouter);
app.use('/api/v1/education', educationRouter);
app.use('/api/v1/experience', experienceRouter);
app.use('/api/v1/timing', timingRouter);



server.listen(PORT, () => {
  console.log(`Server Started At ${PORT}`)
});