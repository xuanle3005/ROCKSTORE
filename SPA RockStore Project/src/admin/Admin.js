import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';

import Alert from '@mui/material/Alert';
import Snackbar from "@mui/material/Snackbar";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import Loader from "./../components/Loader";
import { getCookie } from "./../components/Utility.js";

import "./Admin.css";


export default function Admin() {

    const [showToast, setShowToast] = useState(false);
    const [data, setData] = useState(null);

    const queryRef = useRef(null);

    const navigate = useNavigate();

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setShowToast(false);
    };

    useEffect(() => {

        if (getCookie("admin") == 0) {

            navigate("/");
        }
    }, []);

    const onSubmit = () => {

        setShowToast(true);

        fetch("/api/admin/query", {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({ command: queryRef.current.value })
        })
            .then((response) => {
                return response.json();
            })
            .then((data) => {

                if (data.message) {
                    setData(data.message);
                }
                else {
                    setData(data);
                }
            })
    }


    const displayResults = () => {

        if (!data) {
            return <h4 id="admin-NothingText"> No results... </h4>;
        }
        else if (typeof data === "string") {
            return <h4 id="admin-NothingText"> {data} </h4>;
        }
        else {
            if (!data.length) {
                return <h4 id="admin-NothingText"> No results... </h4>;
            }

            let keys = Object.keys(data[0]);
            let len = keys.length;
            
            const headers = () => {
                let array = [];

                for (let i = 0; i < len; i++) {
                    array.push(<TableCell>{keys[i]}</TableCell>);
                }

                return array;
            };

            const body = (row) => {
                let array = [];
                
                for (let i = 0; i < len; i++) {
                    array.push(<TableCell align="right">{row[keys[i]]}</TableCell>);
                }

                return array;
            };

            return (
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                {headers()}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((row) => (
                                <TableRow
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    {body(row)}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>);
        }
    };

    // WIP display a table when a query is returned else display the successful or error text below
    // upload successful toast, perhaps for query too
    // if need be, have a row of buttons for tables and radio buttons for type of operations
    return (
        <div id="admin-Body">
            <h2>Admin Area</h2>

            <div id="admin-QueryRow">
                <h3> Query: </h3>
                <input id="admin-QueryRowText" placeholder="Enter your SQL Query..." ref={queryRef} />
                <button id="admin-QueryRowButton" onClick={onSubmit}> Submit Query</button>
            </div>

            <div id="admin-QueryRow">
                <h3> File Upload: </h3>
                <form 
                    action="/api/admin/upload"
                    method="POST"
                    encType="multipart/form-data">
                    <input id="admin-QueryRowFile" placeholder="Enter your SQL Query..." type="file" name="imgFile" accept="image/.png, image/.jpeg, image/.jpg"/>
                    <button id="admin-QueryRowButton" value="Upload"> Upload File</button>
                </form>
            </div>

            <h2>Query Results</h2>
            <div>
                {displayResults()}
            </div>

            <Snackbar open={showToast} autoHideDuration={2000} onClose={handleClose} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
                <Alert severity="info" sx={{ width: '100%' }} onClose={handleClose}>
                    Query submitted.
                </Alert>
            </Snackbar>
        </div>

    );
}