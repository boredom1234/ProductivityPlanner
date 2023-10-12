import React, { useEffect, useState } from "react";

function Clock() {
  const [clockState, setClockState] = useState(new Date());
  const [showDate, setShowDate] = useState(true);
  const [emoji, setEmoji] = useState("");
  const [timeDescription, setTimeDescription] = useState("");
  const [day, setDay] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      const currentDate = new Date();
      setClockState(currentDate);
      setShowDate(!showDate);
      const [newEmoji, newTimeDescription] = getEmojiAndTimeDescription(currentDate);
      setEmoji(newEmoji);
      setTimeDescription(newTimeDescription);
      setDay(getDayOfWeek(currentDate));
    }, 4000);

    return () => {
      clearInterval(interval);
    };
  }, [showDate]);

  const getEmojiAndTimeDescription = (date) => {
    const hour = date.getHours();
    let emoji, timeDescription;

    if (hour >= 4 && hour < 6) {
      emoji = "🌅"; // Sunrise emoji
      timeDescription = "Sunrise";
    } else if (hour >= 6 && hour < 17) {
      emoji = "☀️"; // Sun emoji
      timeDescription = "Daytime";
    } else if (hour >= 17 && hour < 18) {
      emoji = "🌇"; // Sunset emoji
      timeDescription = "Sunset";
    } else {
      emoji = "🌙"; // Night emoji
      timeDescription = "Night-time";
    }

    return [emoji, timeDescription];
  };

  const getDayOfWeek = (date) => {
    return new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(date);
  };

  const timeOptions = {
    hour: "2-digit",
    minute: "2-digit",
  };

  // Add a style object to make the text bold
  const boldText = {
    fontWeight: "bold",
  };

  return (
    <div style={{ color: "white" }}>
      {showDate
        ? <span style={boldText}>{`${day}, ${clockState.toLocaleDateString()} 📆`}</span>
        : <span style={boldText}>{`${clockState.toLocaleTimeString([], timeOptions)} ${emoji} (${timeDescription})`}</span>}
    </div>
  );
}

export default Clock;
