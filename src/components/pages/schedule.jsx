import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import axios from "axios";

import DaySchedule from "../days/daySchedule";

const Schedule = () => {
  const navigate = useNavigate();
  const logout = () => {
    sessionStorage.removeItem("token");
    navigate("/");
  };

  const goToTraining = () => {
    navigate("/training");
  };

  const methods = useForm();

  const [days, setDays] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [data, setData] = useState("");

  useEffect(() => {
    const getAllData = async () => {
      try {
        const exResponse = await axios.get(
          // "https://fitness-app-abh-backend-c16e39b8eaec.herokuapp.com/exercises"
          "http://localhost:5000/exercises"
        );
        setExercises(exResponse.data);

        const daysResponse = await axios.get(
          // "https://fitness-app-abh-backend-c16e39b8eaec.herokuapp.com/days"
          "http://localhost:5000/days"
        );
        setDays(daysResponse.data);
      } catch (error) {
        console.error("Error retrieving the data from the API: ", error);
      }
    };

    getAllData();
  }, []);

  const onSubmit = async (formData) => {
    setData(JSON.stringify(formData, null, 2));

    const username = sessionStorage.getItem("username");
    const trainingData = days.map((day) => ({
      day,
      user: username,
      exercise1: formData[`exercise1_${day}`],
      exercise2: formData[`exercise2_${day}`],
      exercise3: formData[`exercise3_${day}`],
    }));

    try {
      await Promise.all(
        trainingData.map(async (data) => {
          await axios.post(
            // "https://fitness-app-abh-backend-c16e39b8eaec.herokuapp.com/training",
            "http://localhost:5000/training",
            data
          );
        })
      );
      goToTraining();
    } catch (error) {
      console.error("Error posting request", error);
    }
  };

  return (
    <div>
      <FormProvider {...methods}>
        <h1>Pick your routine</h1>

        <form onSubmit={methods.handleSubmit(onSubmit)}>
          {days.map((day, index) => (
            <DaySchedule key={index} day={day} exercises={exercises} />
          ))}

          <input type="submit" value="Set training" />
        </form>
      </FormProvider>

      <button className="logout-button" onClick={logout}>
        Logout
      </button>
    </div>
  );
};

export default Schedule;
