import CircularProgress from '@mui/material/CircularProgress';

export default function Loader({ fullScreen = false }) {
    return ( // <> </> is needed somehow
        <>
            {fullScreen ?

                <div style={{ position: "absolute", display: "flex", top:"75px", height: "100%", width: "100vw", margin: "0px", backgroundColor: "white" }}>
                    <div style={{ margin: "auto auto auto auto", display: "block", fontFamily: "\"Fira Sans\", sans-serif" }}>
                        <div style={{ display: "flex", marginBottom: "10px" }}>
                            <CircularProgress sx={{ marginLeft: "auto", marginRight: "auto" }} />
                        </div>

                        Loading...
                    </div>
                </div> :

                <div style={{ display: "flex", height: "100%", width: "100%" }}>
                    <div style={{ margin: "auto auto auto auto", display: "block" }}>
                        <div style={{ display: "flex" }}>
                            <CircularProgress sx={{ marginLeft: "auto", marginRight: "auto" }} />
                        </div>

                        Loading...
                    </div>
                </div>
            }
        </>
    );
}