import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { backEndpoint } from '../envs';

const Statistics = () => {

    const accountTypeFromRedux = useSelector((state) => state.auth.userType);
    const uidFromRedux = useSelector((state) => state.auth.uid);
    const [userSignupData, setUserSignupData] = useState(null);

    useEffect(() => {
        if (accountTypeFromRedux || uidFromRedux) {
            console.log('Account type:', accountTypeFromRedux);
            console.log('UID:', uidFromRedux);
        }
    }, [accountTypeFromRedux, uidFromRedux]);


    useEffect(()=>{
        if (uidFromRedux) {
            try {
                // Fetch the user's ID token
                fetch(backEndpoint.getUser + uidFromRedux, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                .then((response) => response.json())
                .then((data) => {
                    console.log('User data:', data);
                    setUserSignupData(data);
                })
            } catch (error) {
                console.error('Error fetching ID token:', error);
            }

        }
    },[uidFromRedux])

    return (
        <div>
            <h1>Statistics</h1>
            <p>Account type: {accountTypeFromRedux === 0 ? "Kūrėjo statisitka" : "Sprendėjo statistika"}</p>
            <p>Welcome to the Statistics page!</p>


            {userSignupData && <>
                <p>name: {userSignupData.name}</p>
                <p>surname: {userSignupData.surname}</p>
                <p>email: {userSignupData.email}</p>
                <p>quizCount: {userSignupData.quizCount}</p>
                <p>createdDate: {userSignupData.createdDate.split("T")[0]}</p>
                <p>userID: {userSignupData.userID}</p>

            </>}
        </div>
    );
};

export default Statistics;