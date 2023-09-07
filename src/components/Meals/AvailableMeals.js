import { useState, useEffect } from "react"
import classes from "./AvailableMeals.module.css"
import Card from "../UI/Card"
import MealItem from "./MealItem/MealItem"
import useHttp from "../../hooks/use-http"

const AvailableMeals = () => {

  const [meals, setMeals] = useState([]);
  const { isLoading, error, sendRequest: fetchMeals } = useHttp();

  useEffect(() => {

    const transformMeals = ((responseData) => {
      const loadedMeals = [];
      //transform from firebase objects to objects to suit our frontend
      for (const key in responseData) {
        loadedMeals.push({
          id: key,
          name: responseData[key].name,
          description: responseData[key].desc,
          price: responseData[key].price
        });
      }
      setMeals(loadedMeals);
    })

    fetchMeals({ url: 'https://react-simple-http-f2e32-default-rtdb.asia-southeast1.firebasedatabase.app/meals.json' }, transformMeals);

  }, [fetchMeals]);

  if (isLoading) {
    return <section className={classes.MealsLoading}>
      <p>Loading...</p>
    </section>
  }

  if (error) {
    return <section className={classes.MealsError}>
      <p>{error}</p>
    </section>
  }

  const mealsList = meals.map(meal =>
    <MealItem
      id={meal.id}
      key={meal.id}
      name={meal.name}
      description={meal.description}
      price={meal.price}
    />);

  return (
    <section className={classes.meals}>
      <Card>
        <ul>
          {mealsList}
        </ul>
      </Card>
    </section>
  );
};

export default AvailableMeals;