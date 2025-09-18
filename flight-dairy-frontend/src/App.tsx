import { useEffect, useState, useId } from "react";
import type { DiaryFlight, ParseErrorResponse, NewDiaryEntry } from "./types";
import { getFlightsDiary, addFlightEntry } from "./diaryService";
import { isAxiosError } from "axios";

const Diary = ({ diary }: { diary: DiaryFlight }) => {
  return (
    <div>
      <h3>{diary.date}</h3>
      <p>visibility {diary.visibility}</p>
      <p>weather {diary.weather}</p>
    </div>
  );
};

const Notification = ({
  notification,
}: {
  notification: { message: string; enabled: boolean };
}) => {
  const style = {
    display: notification.enabled ? "" : "none",
    color: "red",
  };
  return <p style={style}>{notification.message}</p>;
};

function App() {
  const [diaries, setDiaries] = useState<DiaryFlight[]>([]);
  const [notification, setNotification] = useState<{
    message: string;
    enabled: boolean;
  }>({ message: "", enabled: false });
  const entryData: NewDiaryEntry = {
    date: new Date().toISOString().slice(0, 10),
    weather: "",
    visibility: "",
    comment: "",
  };
  const [newEntry, setNewEntry] = useState<NewDiaryEntry>(entryData);
  const visibilityIds = {
    great: useId(),
    good: useId(),
    ok: useId(),
    poor: useId(),
  };
  const weatherIds = {
    sunny: useId(),
    rainy: useId(),
    cloudy: useId(),
    stormy: useId(),
    windy: useId(),
  };
  const commentId = useId();

  useEffect(() => {
    getFlightsDiary().then((res) => setDiaries(res));
  }, []);

  const handleVisibility = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewEntry({ ...newEntry, visibility: event.target.value });
  };

  const handleWeather = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewEntry({ ...newEntry, weather: event.target.value });
  };
  const handleNewEntry = (event: React.SyntheticEvent) => {
    event.preventDefault();
    addFlightEntry(newEntry)
      .then((res) => {
        setDiaries(diaries.concat(res));
        setNewEntry(entryData);
      })
      .catch((error: unknown) => {
        if (
          isAxiosError(error) &&
          "response" in error &&
          typeof error.response === "object"
        ) {
          const ParseResponse = error.response.data as ParseErrorResponse;
          const fields = ParseResponse.error.fieldErrors;
          let fieldsString = "Ensure the following fields are corrects: ";
          for (const key in fields) {
            fieldsString += `${key} `;
          }
          setNotification({ message: fieldsString, enabled: true });
          setTimeout(() => {
            setNotification({ message: "", enabled: false });
          }, 3000);
        } else {
          setNotification({ message: "an error has occured ", enabled: true });
          setTimeout(() => {
            setNotification({ message: "", enabled: false });
          }, 3000);
        }
      });
  };

  return (
    <>
      <Notification notification={notification} />
      <h1>Flights diary</h1>
      <h2>Add new flight entry</h2>
      <form>
        date:
        <input
          type="date"
          value={newEntry.date}
          onChange={(event) => {
            setNewEntry({ ...newEntry, date: event.target.value });
          }}
        />
        <div>
          visibility:
          <label htmlFor={visibilityIds.great}>Great</label>
          <input
            type="radio"
            name="visibility"
            value="great"
            id={visibilityIds.great}
            onChange={handleVisibility}
          />
          <label htmlFor={visibilityIds.good}>Good</label>
          <input
            type="radio"
            name="visibility"
            value="good"
            id={visibilityIds.good}
            onChange={handleVisibility}
          />
          <label htmlFor={visibilityIds.ok}>Ok</label>
          <input
            type="radio"
            name="visibility"
            value="ok"
            id={visibilityIds.ok}
            onChange={handleVisibility}
          />
          <label htmlFor={visibilityIds.poor}>Poor</label>
          <input
            type="radio"
            name="visibility"
            value="poor"
            id={visibilityIds.poor}
            onChange={handleVisibility}
          />
        </div>
        <div>
          Weather:
          <label htmlFor={weatherIds.cloudy}>Cloudy</label>
          <input
            type="radio"
            name="weather"
            value="cloudy"
            id={weatherIds.cloudy}
            onChange={handleWeather}
          />
          <label htmlFor={weatherIds.rainy}>Rainy</label>
          <input
            type="radio"
            name="weather"
            value="rainy"
            id={weatherIds.rainy}
            onChange={handleWeather}
          />
          <label htmlFor={weatherIds.stormy}>Stormy</label>
          <input
            type="radio"
            name="weather"
            value="stormy"
            id={weatherIds.stormy}
            onChange={handleWeather}
          />
          <label htmlFor={weatherIds.sunny}>Sunny</label>
          <input
            type="radio"
            name="weather"
            value="sunny"
            id={weatherIds.sunny}
            onChange={handleWeather}
          />
        </div>
        <label htmlFor={commentId}>Comment : </label>
        <textarea
          id={commentId}
          onChange={(event) => {
            setNewEntry({ ...newEntry, comment: event.target.value });
          }}
        ></textarea>
        <button onClick={handleNewEntry}>Add</button>
      </form>
      {diaries.map((diary) => (
        <Diary diary={diary} key={diary.id} />
      ))}
    </>
  );
}

export default App;
