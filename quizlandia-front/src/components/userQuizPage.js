import React from 'react';
import { backEndpoint } from '../envs';
import { ReactComponent as EditIcon } from './../assets/icons/edit.svg';
import { ReactComponent as DeleteIcon } from './../assets/icons/delete.svg';

const UserQuizzes = () => {

    return (
        <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: "20px"}}>
            <div style={{ width: "50%", border: "1px solid black", padding: "15px"}}>
                <div style={{ display: "flex", "justifyContent": "space-between"}}>
                    <div style={{ display: "flex", gap: "15px"}}>
                        <span style={{ fontWeight: "600"}}>1#</span>
                        <span><i>Pavadinimas</i></span>
                    </div>
                    <div style={{ display: "flex", gap: "10px", alignItems: "center"}}>
                        <EditIcon />
                        <DeleteIcon />
                    </div>
                </div>
                <p>Aprašymas</p>
                <div style={{ display: "flex", justifyContent: "space-between"}}>
                    <div style={{ display: "flex", gap: "20px"}}>
                        <div>
                            <span style={{ marginRight: "5px" }}>Spręsta:</span>
                            <span>0</span>
                        </div>
                        <div>
                            <span style={{ marginRight: "5px" }}>Teisingai:</span>
                            <span>0</span>
                        </div>
                        <div>
                            <span style={{ marginRight: "5px" }}>Neteisingai:</span>
                            <span>0</span>
                        </div>
                    </div>
                    <div>
                        <span style={{ marginRight: "5px" }}>Klausimai:</span>
                        <span>0</span>
                    </div>
                </div>
            </div>
            <div>
                test2
            </div>
            <div>
                test3
            </div>
        </div>
    )
}

export default UserQuizzes;