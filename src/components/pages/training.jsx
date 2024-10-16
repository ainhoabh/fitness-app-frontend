import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPersonRunning, faSpinner } from "@fortawesome/free-solid-svg-icons";

const TrainingData = () => {
  const [trainingData, setTrainingData] = useState([]);
  const [loading, setLoading] = useState([]);
  const [error, setError] = useState([]);
  const navigate = useNavigate();

  const logout = () => {
    sessionStorage.removeItem("token");
    navigate("/");
  };

  const editTraining = (data) => {
    navigate("/edit", {
      state: { trainingData: data },
    });
  };

  const goToCreateTraining = () => {
    navigate("/schedule");
  };

  const deleteTraining = async () => {
    try {
      const username = sessionStorage.getItem("username");
      const response = await axios.delete(
        // `https://fitness-app-abh-backend-c16e39b8eaec.herokuapp.com/user/${username}/training_delete`
        `http://localhost:5000/user/${username}/training_delete`
      );
      window.location.reload();
    } catch (err) {
      setError(err);
      console.error(err);
    }
  };

  const updateTrainingData = async () => {
    try {
      const username = sessionStorage.getItem("username");
      const response = await axios.get(
        `http://localhost:5000/user/${username}/training`
      );
      console.log("Updated training data: ", response.data);
      setTrainingData(response.data);
    } catch (err) {
      console.error("Error fetching training data:", err);
    }
  };

  useEffect(() => {
    const fetchTrainingData = async () => {
      try {
        const username = sessionStorage.getItem("username");
        const response = await axios.get(
          // `https://fitness-app-abh-backend-c16e39b8eaec.herokuapp.com/user/${username}/training`
          `http://localhost:5000/user/${username}/training`
        );
        console.log("training data: ", response.data);
        setTrainingData(response.data);
      } catch (err) {
        setError(err);
        console.error("Error fetching training data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrainingData();
  }, []);

  const dayOrder = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const sortedTrainingData = [...trainingData].sort((a, b) => {
    return (
      dayOrder.indexOf(a.training_day_name) -
      dayOrder.indexOf(b.training_day_name)
    );
  });

  if (loading)
    return (
      <div>
        Loading <FontAwesomeIcon icon={faSpinner} spin />
      </div>
    );

  return (
    <div className="training-wrapper">
      <h1>Scheduled training</h1>
      {sortedTrainingData.length > 0 ? (
        <div className="weekly-training-wrapper">
          <ul className="fa-ul">
            {sortedTrainingData.map((data, index) => (
              <li key={index}>
                <div className="day-name-wrapper">
                  <h3>
                    <FontAwesomeIcon
                      icon={faPersonRunning}
                      className="icon-running"
                    />
                    {data.training_day_name}
                  </h3>
                </div>
                <div className="exercises-wrapper">
                  <div className="exercise">{data.training_exercise1}</div>
                  <div className="exercise">{data.training_exercise2}</div>
                  <div className="exercise">{data.training_exercise3}</div>
                </div>
              </li>
            ))}
          </ul>
          <div className="button-wrapper">
            <button onClick={() => editTraining(trainingData)}>
              Edit training
            </button>

            <button onClick={() => deleteTraining()}>Delete training</button>
          </div>
        </div>
      ) : (
        <div>
          <p>You don't have any training data available.</p>
          <button onClick={goToCreateTraining}>Create training</button>
        </div>
      )}
      <button className="logout-button" onClick={logout}>
        Logout
      </button>
    </div>
  );
};

export default TrainingData;
