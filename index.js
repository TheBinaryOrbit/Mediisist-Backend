import express from 'express';
import 'dotenv/config';
import cors from 'cors'
import { customerSupportRouter } from './Router/customerSupportRouter.js';
import { ambulanceRouter } from './Router/ambulancePartnerRouter.js';
import { rideRouter } from './Router/rideRouter.js';


const PORT = process.env.PORT || 8000
const app = express();

app.use(cors({
  origin: "*",
  methods: ['GET', 'POST', 'PUT', 'DELETE' , 'PATCH'],
  credentials: true
}));


app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.get('/' , (req,res)=>{
    res.status(200).json({message : "Har Har Mahadev"})
})


app.use('/api/v1/customersupport' , customerSupportRouter);
app.use('/api/v1/ambulancepartner' , ambulanceRouter);
app.use('/api/v1/ride' , rideRouter)

app.listen(PORT , ()=>{
    console.log(`Server Started At ${PORT}`)
});