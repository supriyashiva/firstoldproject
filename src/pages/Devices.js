import React, { useEffect, useState } from 'react'
import Container from '@material-ui/core/Container'
import { Grid, makeStyles } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import { useHistory } from 'react-router-dom'
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight'
import DeviceCard from '../components/DeviceCard';
import db from '../firebase';
import { DataGrid } from "@material-ui/data-grid";
import { PieChart, Pie, Cell, Tooltip } from "recharts";


const data = [
    { name: "BLR", num: 2 },
    { name: "MYS", num: 1 },

];
const columns = [
    {
        field: "Imei",
        headerName: "Imei",
        width: 110,
        headerClassName: 'header-name',
    },
    {
        field: "Entity",
        headerName: "Entity",
        width: 120,
        headerClassName: 'header-name',
    },
    {
        field: "Deviceid",
        headerName: "DeviceId",
        width: 140,
        headerClassName: 'header-name',
    },
    {
        field: "Devicename",
        headerName: "Device Name",
        width: 190,
        headerClassName: 'header-name',
    },
    {
        field: "Client",
        headerName: "Client",
        width: 120,
        headerClassName: 'header-name',
    },
    {
        field: "Farmername",
        headerName: "Farmer Name",
        width: 190,
        headerClassName: 'header-name',
    },
];

const useStyles = makeStyles({
    rootcol: {
        "& .header-name": {
            backgroundColor: '#8860CD',
            fontSize: 17,
            fontFamily: 'Poppins Regular',
            fontStyle: 'bold',

        },
    },
    tm: {
        marginTop: 30
    },
});

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
}) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text
            x={x}
            y={y}
            fill="white"
            textAnchor={x > cx ? "start" : "end"}
            dominantBaseline="central"
        >
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};
const COLORS = ["#3DCC91", "#FFB366", "#FF7373", "#FFCC00", "#3B22FF"];


function Devices() {
    const history = useHistory();
    const [info, setInfo] = useState([]);
    const classes = useStyles();

    useEffect(() => {

        db.collection("devices").get().then((querySnapshot) => {
            // Loop through the data and store
            // it in array to display
            querySnapshot.forEach(element => {
                var data = element.data();
                setInfo(arr => [...arr, data]);
            });
        })

    }, [])

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure to delete this record?")) {
            alert(id)
            db.collection("devices").where("Imei", "==", id).get()
                .then(querySnapshot => {
                    querySnapshot.docs[0].ref.delete();
                });
        };
        const newDevices = info.filter(note => note.Imei != id)
        setInfo(newDevices)
        //     await fetch('https://nov22-3c43a-default-rtdb.firebaseio.com/devices.json' + id, {
        //         method: 'DELETE'
        //     })
        //     const newDevices = alldevices.filter(note => note.id != id)
        //     setAllDevices(newDevices)
    }


    return (
        <>

            <Container maxWidth="lg">
                <h1>Devices Page</h1>


                <Grid container spacing={0}>
                    <Grid item xs={12} >

                        <Button
                            onClick={() => history.push('/cdf')}
                            type="submit"
                            color="secondary"
                            variant="contained"
                            endIcon={<KeyboardArrowRightIcon />}>
                            Create Device
                    </Button>
                    </Grid>
                    <div className={classes.tm} >
                        <h1></h1>
                    </div>

                    <Grid item xs={10} className={classes.rootcol} >

                        <DataGrid width={100} rows={info} columns={columns} pageSize={5} />
                    </Grid>
                    <Grid item xs={2} >

                        <PieChart width={200} height={400}>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                dataKey="num"
                                outerRadius={100}
                                labelLine={false}
                                label={renderCustomizedLabel}
                            >
                                {data.map((entry, index) => (
                                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </Grid>

                    <div className={classes.tm} >
                        {info.map(item => (
                            <Grid item lg={2} key={info.iimei}>
                                <DeviceCard data={item} handleDelete={handleDelete} />
                            </Grid>
                        ))}
                    </div>

                </Grid>
            </Container>

        </>
    )
}
export default Devices