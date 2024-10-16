import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import axios from "axios";

import DaySchedule from "../days/daySchedule";

const EditTraining = () => {
  const location = useLocation();
  const { trainingData: initialTrainingData, onUpdate } = location.state || {};

  const methods = useForm();
  const { reset } = methods;

  const navigate = useNavigate();
  const logout = () => {
    sessionStorage.removeItem("token");
    navigate("/");
  };

  const goToTraining = () => {
    navigate("/training");
  };

  const [days, setDays] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [data, setData] = useState("");

  useEffect(() => {
    const getAllData = async () => {
      try {
        const exResponse = await axios.get(
          "https://fitness-app-abh-backend-c16e39b8eaec.herokuapp.com/exercises"
        );
        setExercises(exResponse.data);

        const daysResponse = await axios.get(
          "https://fitness-app-abh-backend-c16e39b8eaec.herokuapp.com/days"
        );
        setDays(daysResponse.data);

        if (initialTrainingData) {
          const formattedData = {};
          initialTrainingData.forEach((training) => {
            const {
              training_day_name: day,
              training_exercise1,
              training_exercise2,
              training_exercise3,
            } = training;

            formattedData[`exercise1_${day}`] = training_exercise1;
            formattedData[`exercise2_${day}`] = training_exercise2;
            formattedData[`exercise3_${day}`] = training_exercise3;
          });

          methods.reset(formattedData);
        }
      } catch (error) {
        console.error("Error retrieving the data from the API: ", error);
      }
    };

    getAllData();
  }, [initialTrainingData, reset]);

  const onSubmit = async (formData) => {
    setData(JSON.stringify(formData, null, 2));
    const username = sessionStorage.getItem("username");

    const trainingData = days.map((day) => {
      return {
        day,
        user: username,
        exercise1: formData[`exercise1_${day}`],
        exercise2: formData[`exercise2_${day}`],
        exercise3: formData[`exercise3_${day}`],
      };
    });

    try {
      await Promise.all(
        trainingData.map(async (data) => {
          await axios.put(
            `https://fitness-app-abh-backend-c16e39b8eaec.herokuapp.com/user/${username}/training`,
            data,
            { headers: { "Content-Type": "application/json" } }
          );
          if (onUpdate) {
            onUpdate(updatedTrainingData);
          }
          goToTraining();
        })
      );
    } catch (error) {
      console.error("Error updating training", error);
    }
  };

  return (
    <div>
      <FormProvider {...methods}>
        <h1>Edit routine</h1>

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

export default EditTraining;
